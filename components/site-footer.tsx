import Image from "next/image";
import Link from "next/link";

import batangasEstatesLogo from "../assets/images/batangasestates4.jpg";
import vicmarHomesLogo from "../assets/images/vicmarhomeslogo.png";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <p>© 2026 JCCHUA & Associates. All rights reserved.</p>
        <div className="footer-actions">
          <Link className="social-link" href="/contact" aria-label="Facebook contact" title="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.2-1.5 1.6-1.5h1.7V4.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.3V14h2.7v8h3.5z"/></svg>
          </Link>
          <Link className="social-link" href="/contact" aria-label="Twitter contact" title="Twitter">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.8 7.3c.01.2.01.4.01.6 0 6.1-4.6 13.2-13.2 13.2-2.6 0-5-.8-7-2.2.4 0 .8.1 1.2.1 2.1 0 4.1-.7 5.7-1.9-2-.1-3.7-1.4-4.3-3.3.3.1.7.1 1 .1.4 0 .8-.1 1.1-.1-2.1-.4-3.7-2.3-3.7-4.5v-.1c.6.3 1.4.5 2.1.5-1.3-.8-2.1-2.2-2.1-3.7 0-.8.2-1.6.6-2.3 2.3 2.8 5.7 4.6 9.5 4.8-.1-.3-.1-.7-.1-1 0-2.4 2-4.4 4.4-4.4 1.3 0 2.4.5 3.2 1.4.9-.2 1.8-.5 2.5-1-.3.9-1 1.7-1.8 2.1.8-.1 1.6-.3 2.3-.6-.6.8-1.2 1.5-2 2.1z"/></svg>
          </Link>
          <Link className="social-link" href="/contact" aria-label="Google contact" title="Google">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1-.8 2.1-1.8 2.8v2.3h2.9c1.7-1.6 3.1-4.1 3.1-6.8zM12 22c2.5 0 4.6-.8 6.1-2.2l-2.9-2.3c-.8.5-1.8.8-3.2.8-2.5 0-4.7-1.7-5.4-4H3.6v2.4C5.1 19.6 8.3 22 12 22zM6.6 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V7.3H3.6C2.9 8.7 2.5 10.3 2.5 12s.4 3.3 1.1 4.7l3-2.4zM12 5.8c1.4 0 2.7.5 3.7 1.5l2.8-2.8C16.6 3 14.5 2 12 2 8.3 2 5.1 4.4 3.6 7.3l3 2.4c.7-2.3 2.9-3.9 5.4-3.9z"/></svg>
          </Link>
          <span className="footer-divider" aria-hidden="true">|</span>
          <a className="footer-badge" href="http://www.batangasestates.com/" target="_blank" rel="noreferrer" title="Batangas Estates">
            <Image
              className="footer-badge-logo"
              src={batangasEstatesLogo}
              alt="Batangas Estates"
              width={24}
              height={24}
            />
            <span className="footer-badge-label">Batangas Estates</span>
          </a>
          <a className="footer-badge" href="http://www.vicmarhomes.com/" target="_blank" rel="noreferrer" title="Vicmar Homes">
            <Image
              className="footer-badge-logo"
              src={vicmarHomesLogo}
              alt="Vicmar Homes"
              width={24}
              height={24}
            />
            <span className="footer-badge-label">Vicmar Homes</span>
          </a>
        </div>
        <Link className="back-to-top" href="#top">Back to top</Link>
      </div>
    </footer>
  );
}
