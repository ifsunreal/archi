"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery View" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function scrollToTopOnActiveHome(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (pathname === "/" && href === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header className="site-header" id="top">
      <div className="container nav-wrap island">
        <Link
          className="brand"
          href="/"
          aria-label="JCCHUA and Associates home"
          onClick={(event) => scrollToTopOnActiveHome(event, "/")}
        >
          <span className="brand-mark">JC</span>
          <span className="brand-text">JCCHUA & Associates</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={pathname === item.href ? "active" : ""}
              href={item.href}
              onClick={(event) => scrollToTopOnActiveHome(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          id="menuToggle"
          className="menu-toggle"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobileMenu"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          type="button"
        >
          Menu
        </button>
      </div>

      <nav
        id="mobileMenu"
        className={isMobileMenuOpen ? "mobile-nav open" : "mobile-nav"}
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={pathname === item.href ? "active" : ""}
            href={item.href}
            onClick={(event) => {
              scrollToTopOnActiveHome(event, item.href);
              setIsMobileMenuOpen(false);
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
