"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, isFirebaseConfigured, storage } from "../../lib/firebase/client";
import { defaultSiteContent } from "../../lib/content-defaults";
import type { SiteContent } from "../../lib/content-types";
import { EditorForm } from "./EditorForm";
import { IconUser, IconKey, IconLogin, IconLogout, IconUpload, IconCopy, IconSave, IconSeed, IconReload, IconFormat, IconImage, IconFolder, IconBraces, IconShield, IconCheck, IconAlert, IconInfo } from "./icons";

const CONTENT_DOC = "main";
const CONTENT_COLLECTION = "siteContent";

export const dynamic = "force-dynamic";

type ToastTone = "success" | "error" | "info";

type ToastMessage = {
  message: string;
  tone: ToastTone;
};

type ModalState = {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "danger" | "info";
  onConfirm: () => void;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contentText, setContentText] = useState("");
  const [contentData, setContentData] = useState<any>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [uploadPath, setUploadPath] = useState("site-content");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadTargetCallback, setUploadTargetCallback] = useState<((url: string) => void) | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!auth || !db) return;
    return onAuthStateChanged(auth, async (current) => {
      setUser(current);
      if (!current || !db) {
        setIsAdmin(false);
        return;
      }

      const adminSnap = await getDoc(doc(db, "admins", current.uid));
      setIsAdmin(adminSnap.exists());
    });
  }, []);

  const canEdit = Boolean(user && isAdmin);

  useEffect(() => {
    if (!canEdit) return;
    void loadContent();
  }, [canEdit]);

  async function loadContent() {
    if (!db) return;
    setIsBusy(true);
    setJsonError(null);
    try {
      const snap = await getDoc(doc(db, CONTENT_COLLECTION, CONTENT_DOC));
      const data = snap.exists() ? (snap.data() as SiteContent) : defaultSiteContent;
      setContentText(JSON.stringify(data, null, 2));
      setContentData(data);
    } catch (error) {
      showToast("Failed to load content.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!auth) return;
    setIsBusy(true);
    setJsonError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      showToast("Welcome back.", "success");
    } catch (error) {
      showToast("Login failed. Check your credentials.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleLogout() {
    if (!auth) return;
    await signOut(auth);
    showToast("Signed out.", "info");
  }

  function openModal(next: ModalState) {
    setModal(next);
  }

  function closeModal() {
    setModal(null);
  }

  function showToast(message: string, tone: ToastTone) {
    setToast({ message, tone });
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  useEffect(() => () => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
  }, []);

  async function handleSave() {
    if (!db) return;
    setIsBusy(true);
    setJsonError(null);
    try {
      await setDoc(doc(db, CONTENT_COLLECTION, CONTENT_DOC), contentData, { merge: false });
      setContentText(JSON.stringify(contentData, null, 2));
      showToast("Content saved.", "success");
    } catch (error) {
      setJsonError("Save failed.");
      showToast("Save failed.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSeedDefaults() {
    if (!db) return;
    setIsBusy(true);
    setJsonError(null);
    try {
      await setDoc(doc(db, CONTENT_COLLECTION, CONTENT_DOC), defaultSiteContent, { merge: false });
      setContentText(JSON.stringify(defaultSiteContent, null, 2));
      setContentData(defaultSiteContent);
      showToast("Defaults seeded.", "success");
    } catch (error) {
      showToast("Seeding failed.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!storage) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setIsBusy(true);
    setJsonError(null);
    try {
      const safeName = file.name.replace(/\s+/g, "-");
      const fullPath = `${uploadPath}/${Date.now()}-${safeName}`;
      const fileRef = ref(storage, fullPath);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setUploadUrl(url);
      if (uploadTargetCallback) {
        uploadTargetCallback(url);
        setUploadTargetCallback(null);
      }
      showToast("Upload complete.", "success");
    } catch (error) {
      showToast("Upload failed.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  function handleUploadRequest(path: string, callback: (url: string) => void) {
    setUploadTargetCallback(() => callback);
    // Programmatically click the file input
    document.getElementById("hidden-file-input")?.click();
  }

  async function handleCopyUploadUrl() {
    if (!uploadUrl) return;
    try {
      await navigator.clipboard.writeText(uploadUrl);
      showToast("Copied URL to clipboard.", "success");
    } catch (error) {
      showToast("Copy failed. Select and copy manually.", "error");
    }
  }

  function confirmSeedDefaults() {
    openModal({
      title: "Reset to defaults",
      message: "This will overwrite current content with the starter content. Continue?",
      confirmLabel: "Seed defaults",
      tone: "danger",
      onConfirm: () => {
        closeModal();
        void handleSeedDefaults();
      },
    });
  }

  function confirmLogout() {
    openModal({
      title: "Sign out",
      message: "You will be signed out of the admin dashboard.",
      confirmLabel: "Sign out",
      tone: "info",
      onConfirm: () => {
        closeModal();
        void handleLogout();
      },
    });
  }

  const authMessage = useMemo(() => {
    if (!isFirebaseConfigured) {
      return "Firebase env vars are missing. Add them to .env and restart the dev server.";
    }
    if (!user) {
      return "Sign in with your admin account.";
    }
    if (!isAdmin) {
      return "You are signed in but not an admin. Add your UID to admins/{uid} in Firestore.";
    }
    return "";
  }, [user, isAdmin]);

  return (
    <main className="admin-page container">
      <header className="admin-hero">
        <div>
          <div className="admin-brand">
            <span className="admin-brand-mark">JC</span>
            <div>
              <p className="admin-brand-title">JCCHUA Admin</p>
              <p className="admin-brand-subtitle">Portfolio control room</p>
            </div>
          </div>
          <h1>Admin Dashboard</h1>
          <p className="admin-lede">Update content, upload media, and keep the portfolio current.</p>
        </div>
        <div className="admin-hero-actions">
          {user ? (
            <button className="btn btn-outline" type="button" onClick={confirmLogout}>
              <IconLogout />
              Sign Out
            </button>
          ) : null}
        </div>
      </header>

      <section className="admin-card admin-auth-card">
        <div className="admin-card-head">
          <div>
            <p className="admin-chip">Access</p>
            <h2>Secure Login</h2>
            <p className="admin-note">{authMessage || "Use your admin email and password."}</p>
          </div>
          <div className="admin-icon-wrap">
            <IconShield />
          </div>
        </div>

        {!user ? (
          <form className="admin-form" onSubmit={handleLogin}>
            <label className="admin-field">
              Email
              <div className="admin-input">
                <span className="admin-input-icon"><IconUser /></span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
            </label>
            <label className="admin-field">
              Password
              <div className="admin-input">
                <span className="admin-input-icon"><IconKey /></span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
            </label>
            <button className="btn btn-primary" type="submit" disabled={isBusy}>
              <IconLogin />
              Sign In
            </button>
          </form>
        ) : (
          <div className="admin-actions">
            <p className="admin-note">Signed in as {user.email || user.uid}</p>
            <div className="admin-inline-actions">
              <button className="btn btn-outline" type="button" onClick={confirmLogout}>
                <IconLogout />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </section>

      {canEdit ? (
        <section className="admin-cms-section">
          <input 
            type="file" 
            id="hidden-file-input" 
            style={{ display: "none" }} 
            onChange={handleUpload} 
            accept="image/*" 
          />
          <div className="admin-card">
            <div className="admin-card-head" style={{ marginBottom: "-1rem" }}>
              <div>
                <p className="admin-chip">CMS Editor</p>
                <h2>Site Content</h2>
                <p className="admin-note">Edit pages and upload images.</p>
              </div>
              <div className="admin-actions" style={{ flexDirection: "row", display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-outline" type="button" onClick={loadContent} disabled={isBusy}>
                  <IconReload /> Reload
                </button>
                <button className="btn btn-outline" type="button" onClick={confirmSeedDefaults} disabled={isBusy}>
                  <IconSeed /> Seed Defaults
                </button>
                <button className="btn btn-primary" type="button" onClick={handleSave} disabled={isBusy}>
                  <IconSave /> Save Changes
                </button>
              </div>
            </div>
            {contentData ? (
              <EditorForm 
                data={contentData} 
                onChange={setContentData} 
                onUploadRequest={handleUploadRequest} 
              />
            ) : (
              <p>Loading editor...</p>
            )}
            {jsonError ? <p className="admin-error">{jsonError}</p> : null}
          </div>
        </section>
      ) : null}

      {toast ? (
        <div className={`admin-toast admin-toast-${toast.tone}`} role="status" aria-live="polite">
          <span className="admin-toast-icon">
            {toast.tone === "success" ? <IconCheck /> : null}
            {toast.tone === "error" ? <IconAlert /> : null}
            {toast.tone === "info" ? <IconInfo /> : null}
          </span>
          <span>{toast.message}</span>
        </div>
      ) : null}

      {modal ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <div className="admin-modal-head">
              <span className={`admin-modal-icon ${modal.tone === "danger" ? "danger" : "info"}`}>
                {modal.tone === "danger" ? <IconAlert /> : <IconInfo />}
              </span>
              <div>
                <h3>{modal.title}</h3>
                <p>{modal.message}</p>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button className="btn btn-outline" type="button" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" type="button" onClick={modal.onConfirm}>{modal.confirmLabel}</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

