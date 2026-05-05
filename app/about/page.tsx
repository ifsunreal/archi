import Image from "next/image";
import { getSiteContent } from "../../lib/content";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const { about, global } = siteContent;

  return (
    <>
      <SiteHeader brand={global.brand} navItems={global.navItems} />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="section container reveal" id="about">
          <div className="section-head">
            <h2>{about.pageTitle}</h2>
          </div>
          <article className="about-panel about-unified">
            <header className="about-unified-head">
              <div className="about-head-avatar">
                <Image src={about.sidebarImageUrl || "/assets/images/joseph-chua-portrait.jpg"} alt={about.sidebarImageAlt || "Arch. Joseph C. Chua"} width={320} height={320} />
              </div>
              <div className="about-head-copy">
                <h3>{about.sidebarName}</h3>
                <p>
                  {(about.sidebarSubtitle || "").split("\n").map((line, index, lines) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
            </header>

            <div className="about-unified-body">
              <aside className="about-achievements">
                <section className="about-side-block">
                  <p className="sidebar-eyebrow">Licenses</p>
                  <div className="about-chip-list">
                    {(about.licenseNumbers || []).map((item) => <span className="about-chip" key={item}>{item}</span>)}
                  </div>
                </section>

                <section className="about-side-block">
                  <p className="sidebar-eyebrow">Memberships</p>
                  <p className="about-membership-line">{(about.memberships || []).map((item) => item.title).filter(Boolean).join(" · ")}</p>
                </section>

                <section className="about-side-block">
                  <p className="sidebar-eyebrow">Specializations</p>
                  <div className="about-chip-list">
                    {(about.specializations || []).map((item) => <span className="about-chip" key={item}>{item}</span>)}
                  </div>
                </section>
              </aside>

              <div className="about-main-content">
                <section>
                  <p className="db-eyebrow">Services</p>
                  <div className="service-stack">
                    {(about.services || []).map((service) => (
                      <article className="service-row" key={service.title}>
                        <h4>{service.title}</h4>
                        {(service.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="db-eyebrow">Architecture Design</p>
                  <div className="service-stack">
                    {(about.principles || []).map((paragraph) => (
                      <article className="service-row" key={paragraph}>
                        <blockquote className="design-philosophy-quote">
                          {paragraph}
                        </blockquote>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </article>
        </section>
      </main>

      <SiteFooter footer={global.footer} />
    </>
  );
}
