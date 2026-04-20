import Image from "next/image";
import Link from "next/link";
import { groq } from "next-sanity";
import { client } from "../../sanity/lib/client";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

type ProjectItem = {
  _id: string;
  title: string;
  category: string;
  status: string | null;
  year: number | null;
  slug: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
};

type ProjectsContent = {
  _id?: string;
  projects?: {
    showcaseEyebrow?: string;
    showcaseTitle?: string;
    showcaseNote?: string;
    carouselSlides?: Array<{
      tag?: string;
      title?: string;
      imageUrl?: string | null;
      imageAlt?: string | null;
    }>;
    portfolioTitle?: string;
    filterLabels?: string[];
    statusGuideCards?: Array<{ tag?: string; title?: string; description?: string }>;
    disclosure?: string;
    spotlight?: {
      title?: string;
      type?: string;
      description?: string;
      points?: string[];
      imageUrl?: string | null;
      imageAlt?: string | null;
    };
  };
};

const projectsContentQuery = groq`
  coalesce(
    *[_type == "siteContent" && _id == "siteContent"][0],
    *[_type == "siteContent"] | order(_updatedAt desc)[0]
  ) {
    _id,
    projects {
      showcaseEyebrow,
      showcaseTitle,
      showcaseNote,
      carouselSlides[] {
        tag,
        title,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      portfolioTitle,
      filterLabels,
      statusGuideCards[] { tag, title, description },
      disclosure,
      spotlight {
        title,
        type,
        description,
        points,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    }
  }
`;

const defaultProjectsContent = {
  showcaseEyebrow: "Design Showcase",
  showcaseTitle: "Architectural concepts and space studies",
  showcaseNote: "A curated carousel space for showcasing architectural design directions.",
  portfolioTitle: "Residential and Commercial Portfolio",
  filterLabels: ["All Projects", "Residential", "Commercial"],
  statusGuideCards: [
    {
      tag: "Concept and Rendered Works",
      title: "Design proposals and visualization studies",
      description:
        "Includes design proposals, planning studies, and rendered presentations developed to evaluate program, spatial direction, and architectural expression prior to construction.",
    },
    {
      tag: "Completed and Built Works",
      title: "Projects realized through construction",
      description:
        "Includes projects that proceeded to site implementation and were completed, representing executed architectural scope.",
    },
  ],
  disclosure:
    "Portfolio note: selected visuals may represent conceptual design studies and rendered direction work, while others document completed built projects.",
  spotlight: {
    title: "Mckinley West Residence",
    type: "Residential",
    description: "A climate-responsive residence balancing privacy, airflow, and long-term maintenance efficiency.",
    points: ["Climate-sensitive planning", "Cost-aware design decisions", "Resilient material strategy"],
    imageUrl: "/assets/images/mckinley-west-residence.jpg",
    imageAlt: "Featured project image",
  },
  carouselSlides: [
    { tag: "Concept 01", title: "Luxury residential frontage", imageUrl: "/assets/images/projects-carousel-01.jpg", imageAlt: "Modern architectural exterior" },
    { tag: "Concept 02", title: "Refined interior spatial flow", imageUrl: "/assets/images/projects-carousel-02.jpg", imageAlt: "Elegant interior architecture" },
    { tag: "Concept 03", title: "Commercial form with presence", imageUrl: "/assets/images/projects-carousel-03.jpg", imageAlt: "Commercial architectural building" },
    { tag: "Concept 04", title: "Warm material-led living spaces", imageUrl: "/assets/images/projects-carousel-04.jpg", imageAlt: "Warm architectural living space" },
  ],
};

const projectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**"))]
    | order(year desc, _createdAt desc) {
      _id,
      title,
      category,
      status,
      year,
      "slug": slug.current,
      "coverImageUrl": coverImage.asset->url,
      "coverImageAlt": coverImage.alt
    }
`;

function getStatusLabel(status: string | null) {
  if (!status) return "Published";
  return status;
}

type PageProps = {
};

export default async function ProjectsPage() {
  const [projectsContent, projects] = client
    ? await Promise.all([
      client.fetch<ProjectsContent | null>(projectsContentQuery),
      client.fetch<ProjectItem[]>(projectsQuery),
    ])
    : [null, [] as ProjectItem[]];
  const content = { ...defaultProjectsContent, ...(projectsContent?.projects ?? {}) };
  const slides = content.carouselSlides?.length ? content.carouselSlides : defaultProjectsContent.carouselSlides;
  const statusGuideCards = content.statusGuideCards?.length ? content.statusGuideCards : defaultProjectsContent.statusGuideCards;
  const spotlight = content.spotlight || defaultProjectsContent.spotlight;
  const filterLabels = content.filterLabels?.length ? content.filterLabels : defaultProjectsContent.filterLabels;
  return (
    <>
      <SiteHeader />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="section container reveal" id="showcase">
          <div className="section-head projects-head">
            <div>
              <p className="eyebrow">{content.showcaseEyebrow}</p>
              <h2>{content.showcaseTitle}</h2>
            </div>
            <p className="section-note">{content.showcaseNote}</p>
          </div>
          <div className="carousel-shell" aria-label="Architectural showcase carousel">
            <div className="carousel-thumbs-wrap">
              <div className="carousel-thumbs" id="carouselThumbs" aria-label="Showcase thumbnails">
                {slides.map((slide, index) => (
                  <button className={`carousel-thumb ${index === 0 ? "active" : ""}`} type="button" data-index={index} aria-label={`Go to showcase slide ${index + 1}`} key={`${slide.title}-${index}`}>
                    <img src={slide.imageUrl || "/assets/images/lgv.avif"} alt={slide.imageAlt || slide.title || "Showcase slide"} />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{slide.tag || slide.title}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="carousel-panel">
              <div className="carousel" aria-label="Architectural showcase carousel">
                <button className="carousel-btn" id="carouselPrev" type="button" aria-label="Previous showcase slide">&#8249;</button>
                <div className="carousel-viewport">
                  <div className="carousel-track" id="carouselTrack">
                    {slides.map((slide, index) => (
                      <article className="carousel-slide" key={`${slide.title}-${index}`}>
                        <button className="carousel-zoom-btn" type="button" aria-label="View image fullscreen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg></button>
                        <img src={slide.imageUrl || "/assets/images/lgv.avif"} alt={slide.imageAlt || slide.title || "Showcase slide"} />
                        <div className="carousel-caption">
                          <p className="tag">{slide.tag || `Concept ${index + 1}`}</p>
                          <h3>{slide.title}</h3>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
                <button className="carousel-btn" id="carouselNext" type="button" aria-label="Next showcase slide">&#8250;</button>
              </div>
              <div id="carouselDots" className="carousel-dots" aria-label="Showcase carousel pages" />
            </div>
          </div>
        </section>

        <section className="section container reveal" id="projects">
          <div className="section-head">
            <h2>{content.portfolioTitle}</h2>
            <div className="project-filter-tabs">
              <button className="filter-tab active" data-filter="all" aria-pressed="true">{filterLabels[0]}</button>
              <button className="filter-tab" data-filter="residential" aria-pressed="false">{filterLabels[1]}</button>
              <button className="filter-tab" data-filter="commercial" aria-pressed="false">{filterLabels[2]}</button>
            </div>
          </div>

          <div className="project-status-guide" aria-label="Project category explanation">
            {statusGuideCards.map((card) => (
              <article className="status-guide-card" key={card.title}>
                <p className="tag">{card.tag}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
          <p className="section-note project-disclosure">
            {content.disclosure}
          </p>

          <article className="project-spotlight" aria-live="polite">
            <Image id="spotlightImage" src={spotlight.imageUrl || projects[0]?.coverImageUrl || "/assets/images/mckinley-west-residence.jpg"} alt={spotlight.imageAlt || "Featured project image"} width={1200} height={800} />
            <div className="project-spotlight-copy">
              <p className="tag">Featured Project</p>
              <h3 id="spotlightTitle">{spotlight.title || projects[0]?.title || "Mckinley West Residence"}</h3>
              <p id="spotlightType" className="spotlight-type">{spotlight.type || projects[0]?.category || "Residential"}</p>
              <p id="spotlightDescription" className="spotlight-description">{spotlight.description}</p>
              <div className="spotlight-points">
                {(spotlight.points || []).map((point) => <span key={point}>{point}</span>)}
              </div>
            </div>
          </article>

          <div className="project-grid">
            {projects.map((project) => (
              <Link
                className="project-card"
                data-type={project.category.toLowerCase()}
                data-stage={project.status === "Completed" || project.status === "Sold" ? "accomplished" : "rendered"}
                key={project._id}
                href={project.slug ? `/projects/${project.slug}` : "/projects"}
                aria-label={`Open ${project.title}`}
              >
                {project.coverImageUrl ? (
                  <Image src={project.coverImageUrl} alt={project.coverImageAlt || project.title} width={960} height={640} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "16 / 10", background: "rgba(255,255,255,0.06)" }} />
                )}
                <div>
                  <p className="tag">{project.category}</p>
                  <p className={`status-pill ${project.status === "Completed" || project.status === "Sold" ? "status-pill-accomplished" : "status-pill-rendered"}`}>
                    {getStatusLabel(project.status)}
                  </p>
                  <h3>{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div id="carouselLightbox" className="carousel-lightbox" aria-hidden="true">
            <button className="carousel-lightbox-close" type="button" aria-label="Close full image view">&times;</button>
            <button className="carousel-lightbox-prev" type="button" aria-label="Previous image">&#10094;</button>
            <div className="carousel-lightbox-media">
              <img id="carouselLightboxImage" alt="" />
              <p id="carouselLightboxCaption" className="carousel-lightbox-caption" />
            </div>
            <button className="carousel-lightbox-next" type="button" aria-label="Next image">&#10095;</button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
