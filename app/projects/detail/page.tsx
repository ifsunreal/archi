"use client";

import Image from "next/image";
import Link from "next/link";
import { groq } from "next-sanity";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { client } from "../../../sanity/lib/client";

type ProjectDetail = {
  _id: string;
  title: string;
  category: string;
  status: string | null;
  year: number | null;
  location: string | null;
  descriptionText: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  gallery: Array<{
    imageUrl: string | null;
    imageAlt: string | null;
  }>;
};

const projectDetailQuery = groq`
  *[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    category,
    status,
    year,
    location,
    "descriptionText": pt::text(description),
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    gallery[] {
      "imageUrl": asset->url,
      "imageAlt": alt
    }
  }
`;

type LoadState = "idle" | "loading" | "ready" | "error";

export default function ProjectDetailPage() {
  const [slug, setSlug] = useState("");
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get("slug") || "");
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!slug) {
      setProject(null);
      setState("idle");
      return () => {
        isMounted = false;
      };
    }

    setState("loading");
    client
      .fetch<ProjectDetail | null>(projectDetailQuery, { slug })
      .then((result) => {
        if (!isMounted) return;
        setProject(result);
        setState(result ? "ready" : "error");
      })
      .catch(() => {
        if (!isMounted) return;
        setProject(null);
        setState("error");
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const gallery = useMemo(() => (project?.gallery || []).filter((item) => item.imageUrl), [project]);

  return (
    <>
      <SiteHeader />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="section container reveal" id="project-detail">
          <div className="section-head projects-head">
            <div>
              <p className="eyebrow">Project Detail</p>
              <h2>{project?.title || "Project"}</h2>
            </div>
            <p className="section-note">
              {project?.category || ""}
              {project?.year ? ` / ${project.year}` : ""}
              {project?.status ? ` / ${project.status}` : ""}
            </p>
          </div>

          {!slug ? (
            <p className="section-note">
              Choose a project from <Link href="/projects">Projects</Link> to view details.
            </p>
          ) : null}

          {state === "loading" ? (
            <p className="section-note">Loading project details...</p>
          ) : null}

          {state === "error" ? (
            <p className="section-note">
              Project details are not available. Please return to <Link href="/projects">Projects</Link>.
            </p>
          ) : null}

          {project ? (
            <>
              <article className="project-spotlight">
                <Image
                  src={project.coverImageUrl || "/assets/images/lgv.avif"}
                  alt={project.coverImageAlt || project.title}
                  width={1400}
                  height={900}
                  priority
                />
                <div className="project-spotlight-copy">
                  <p className="tag">Overview</p>
                  <h3>{project.title}</h3>
                  <p className="spotlight-description">
                    {project.descriptionText || "Project narrative is currently being prepared in Studio."}
                  </p>
                  <div className="spotlight-points">
                    <span>{project.category}</span>
                    {project.location ? <span>{project.location}</span> : null}
                    {project.year ? <span>{project.year}</span> : null}
                  </div>
                </div>
              </article>

              {gallery.length > 0 ? (
                <div className="project-grid" style={{ marginTop: "1rem" }}>
                  {gallery.map((item, index) => (
                    <article className="project-card" key={`${project._id}-gallery-${index}`}>
                      <Image
                        src={item.imageUrl || "/assets/images/lgv.avif"}
                        alt={item.imageAlt || `${project.title} gallery ${index + 1}`}
                        width={960}
                        height={640}
                      />
                    </article>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}

          <p className="section-note" style={{ marginTop: "1.2rem" }}>
            <Link href="/projects">Back to Projects</Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
