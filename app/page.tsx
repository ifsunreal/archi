import Image from "next/image";
import { getSiteContent } from "../lib/content";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const siteContent = await getSiteContent();
  const { home, global, projectItems } = siteContent;

  const projects = projectItems || [];
  const featuredProject = projects[0];
  const heroMainImage = home.featuredDesign?.imageUrl || featuredProject?.coverImageUrl || "/assets/images/lgv.avif";
  const heroMainAlt = home.featuredDesign?.imageAlt || featuredProject?.coverImageAlt || featuredProject?.title || "Featured frontage architectural design";
  const heroMainTitle = home.featuredDesign?.title || featuredProject?.title || "Clean frontage studies";
  const heroMainCopy = home.featuredDesign?.description || (featuredProject
    ? featuredProject.descriptionText || `${featuredProject.category || ""}${featuredProject.year ? `, ${featuredProject.year}` : ""}.`
    : "Facade compositions that balance proportion, shade, and a clear architectural identity.");
  const heroParagraphs = home.paragraphs || [];
  const heroTiles = home.tiles || [];
  const heroActions = home.actions || [];
  return (
    <>
      <SiteHeader brand={global.brand} navItems={global.navItems} />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="hero section container" id="home">
          <div className="hero-copy reveal in-view">
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>{home.title}</h1>
            {heroParagraphs.map((paragraph) => (
              <p className="lead" key={paragraph}>{paragraph}</p>
            ))}
            <div className="hero-actions">
              {heroActions.map((action) => (
                <a
                  key={`${action.label}-${action.href}`}
                  className={action.variant === "primary" ? "btn btn-primary" : "btn btn-outline"}
                  href={action.href === "#projects" ? "/projects" : action.href || "#"}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          <aside className="hero-showcase reveal in-view" aria-label="Featured designs">
            <article className="hero-showcase-main">
              <div className="hero-showcase-media">
                <Image src={heroMainImage} alt={heroMainAlt} fill priority sizes="(max-width: 940px) 100vw, 46vw" className="hero-showcase-image" />
              </div>
              <div className="hero-showcase-copy">
                <p className="tag">{home.featuredDesign?.eyebrow}</p>
                <h2>{heroMainTitle}</h2>
                <p>{heroMainCopy}</p>
              </div>
            </article>
            <div className="hero-showcase-grid">
              {heroTiles.map((tile) => (
                <article className="hero-showcase-tile" key={`${tile.title}-${tile.tag}`}>
                  <div className="hero-showcase-tile-media">
                    <Image
                      src={tile.imageUrl || "/assets/images/lgv.avif"}
                      alt={tile.imageAlt || tile.title || "Showcase image"}
                      fill
                      sizes="(max-width: 940px) 100vw, 22vw"
                      className="hero-showcase-image"
                    />
                  </div>
                  <div className="hero-showcase-tile-copy">
                    <p className="tag">{tile.tag}</p>
                    <h3>{tile.title}</h3>
                    {tile.description ? <p className="hero-showcase-tile-desc">{tile.description}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter footer={global.footer} />
    </>
  );
}
