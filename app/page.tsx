import Image from "next/image";
import { groq } from "next-sanity";
import { client } from "../sanity/lib/client";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

type ProjectCard = {
  _id: string;
  title: string;
  category: string;
  year: number | null;
  descriptionText: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
};

type SiteContent = {
  _id?: string;
  home?: {
    eyebrow?: string;
    title?: string;
    paragraphs?: string[];
    actions?: Array<{ label?: string; href?: string; variant?: string }>;
    featuredDesign?: {
      eyebrow?: string;
      title?: string;
      description?: string;
      imageUrl?: string | null;
      imageAlt?: string | null;
    };
    tiles?: Array<{
      tag?: string;
      title?: string;
      description?: string;
      imageUrl?: string | null;
      imageAlt?: string | null;
    }>;
    portfolioTitle?: string;
    portfolioNote?: string;
  };
};

const siteContentQuery = groq`
  coalesce(
    *[_type == "siteContent" && _id == "siteContent"][0],
    *[_type == "siteContent"] | order(_updatedAt desc)[0]
  ) {
    _id,
    home {
      eyebrow,
      title,
      paragraphs,
      actions[] { label, href, variant },
      featuredDesign {
        eyebrow,
        title,
        description,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      tiles[] {
        tag,
        title,
        description,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      portfolioTitle,
      portfolioNote
    }
  }
`;

const projectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**"))]
    | order(year desc, _createdAt desc) {
      _id,
      title,
      category,
      year,
      "descriptionText": pt::text(description),
      "coverImageUrl": coverImage.asset->url,
      "coverImageAlt": coverImage.alt
    }
`;

type PageProps = {
};

export default async function HomePage() {
  const [siteContent, projects] = client
    ? await Promise.all([
      client.fetch<SiteContent | null>(siteContentQuery),
      client.fetch<ProjectCard[]>(projectsQuery),
    ])
    : [null, [] as ProjectCard[]];

  const { home } = siteContent ?? {};
  const featuredProject = projects[0];
  const heroMainImage = home?.featuredDesign?.imageUrl || featuredProject?.coverImageUrl || "/assets/images/lgv.avif";
  const heroMainAlt = home?.featuredDesign?.imageAlt || featuredProject?.coverImageAlt || featuredProject?.title || "Featured frontage architectural design";
  const heroMainTitle = home?.featuredDesign?.title || featuredProject?.title || "Clean frontage studies";
  const heroMainCopy = home?.featuredDesign?.description || (featuredProject
    ? featuredProject.descriptionText || `${featuredProject.category} project${featuredProject.year ? `, ${featuredProject.year}` : ""}.`
    : "Facade compositions that balance proportion, shade, and a clear architectural identity.");
  const heroParagraphs = home?.paragraphs?.length
    ? home.paragraphs
    : [
      "We do not only consider building use in design. We also consider carbon footprint, social effects, and impact on users and neighbors. Each design element is evaluated for energy, social, and environmental costs.",
      "We harness natural resources available on site, from the sun, wind, and rain, to the trees and rivers that surround each project.",
    ];
  const heroTiles = home?.tiles?.length
    ? home.tiles
    : [
      {
        tag: "Site View",
        title: "Aerial Planning",
        description: "Bird's-eye massing and site organization studies.",
        imageUrl: "/assets/images/aerial view.avif",
        imageAlt: "Aerial view of an architectural project",
      },
      {
        tag: "Interior View",
        title: "Living Space Studies",
        description: "Interior studies focused on light, circulation, and comfort.",
        imageUrl: "/assets/images/living area.avif",
        imageAlt: "Interior living area design",
      },
    ];
  const heroActions = home?.actions?.length
    ? home.actions
    : [
      { label: "Explore Projects", href: "/projects", variant: "primary" },
      { label: "Get in touch", href: "/contact", variant: "outline" },
    ];
  return (
    <>
      <SiteHeader />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="hero section container" id="home">
          <div className="hero-copy reveal in-view">
            <p className="eyebrow">{home?.eyebrow || "Practical. Sustainable. Human-centered."}</p>
            <h1>{home?.title || "Architecture has evolved into the design of a lifestyle."}</h1>
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
                <p className="tag">{home?.featuredDesign?.eyebrow || "Featured Design"}</p>
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

      <SiteFooter />
    </>
  );
}
