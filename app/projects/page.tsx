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

type SpotlightPanel = {
  title?: string;
  type?: string;
  description?: string;
  moreDetailsUrl?: string;
  points?: string[];
  imageUrl?: string | null;
  imageAlt?: string | null;
};

type ProjectsContent = {
  _id?: string;
  projects?: {
    portfolioTitle?: string;
    filterLabels?: string[];
    spotlight?: {
    } & SpotlightPanel;
    spotlightTwo?: SpotlightPanel;
    spotlightThree?: SpotlightPanel;
    spotlightFour?: SpotlightPanel;
    additionalSpotlights?: SpotlightPanel[];
  };
};

const projectsContentQuery = groq`
  coalesce(
    *[_type == "siteContent" && _id == "siteContent"][0],
    *[_type == "siteContent"] | order(_updatedAt desc)[0]
  ) {
    _id,
    projects {
      portfolioTitle,
      filterLabels,
      spotlight {
        title,
        type,
        description,
        moreDetailsUrl,
        points,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      spotlightTwo {
        title,
        type,
        description,
        moreDetailsUrl,
        points,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      spotlightThree {
        title,
        type,
        description,
        moreDetailsUrl,
        points,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      spotlightFour {
        title,
        type,
        description,
        moreDetailsUrl,
        points,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      additionalSpotlights[] {
        title,
        type,
        description,
        moreDetailsUrl,
        points,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    }
  }
`;

const defaultProjectsContent = {
  portfolioTitle: "Residential and Commercial Portfolio",
  filterLabels: ["All Projects", "Residential", "Commercial"],
  spotlight: {
    title: "Mckinley West Residence",
    type: "Residential",
    description: "A climate-responsive residence balancing privacy, airflow, and long-term maintenance efficiency.",
    moreDetailsUrl: null,
    points: ["Climate-sensitive planning", "Cost-aware design decisions", "Resilient material strategy"],
    imageUrl: "/assets/images/mckinley-west-residence.jpg",
    imageAlt: "Featured project image",
  },
  spotlightTwo: {
    title: "Featured Architecture",
    type: "Residential",
    description: "Architectural project showcasing design excellence and innovative spatial solutions.",
    moreDetailsUrl: null,
    points: ["Design innovation", "Spatial efficiency", "Material quality"],
    imageUrl: null,
    imageAlt: "Project image",
  },
  spotlightThree: {
    title: "Contemporary Design",
    type: "Commercial",
    description: "A carefully crafted architectural response to contemporary design challenges and client aspirations.",
    moreDetailsUrl: null,
    points: ["Contemporary design", "Client focused", "Sustainable approach"],
    imageUrl: null,
    imageAlt: "Project image",
  },
  spotlightFour: {
    title: "Architectural Excellence",
    type: "Residential",
    description: "An exploration of form, function, and the seamless integration of architecture within its context.",
    moreDetailsUrl: null,
    points: ["Contextual design", "Functional beauty", "Environmental harmony"],
    imageUrl: null,
    imageAlt: "Project image",
  },
  additionalSpotlights: [
    {
      title: "Featured Architecture",
      type: "Residential",
      description: "Architectural project showcasing design excellence and innovative spatial solutions.",
      moreDetailsUrl: null,
      points: ["Design innovation", "Spatial efficiency", "Material quality"],
      imageUrl: null,
      imageAlt: "Project image",
    },
    {
      title: "Contemporary Design",
      type: "Commercial",
      description: "A carefully crafted architectural response to contemporary design challenges and client aspirations.",
      moreDetailsUrl: null,
      points: ["Contemporary design", "Client focused", "Sustainable approach"],
      imageUrl: null,
      imageAlt: "Project image",
    },
    {
      title: "Architectural Excellence",
      type: "Residential",
      description: "An exploration of form, function, and the seamless integration of architecture within its context.",
      moreDetailsUrl: null,
      points: ["Contextual design", "Functional beauty", "Environmental harmony"],
      imageUrl: null,
      imageAlt: "Project image",
    },
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
  const content = projectsContent?.projects ?? {};
  const spotlight = content.spotlight || defaultProjectsContent.spotlight;
  const filterLabels = content.filterLabels?.length ? content.filterLabels : defaultProjectsContent.filterLabels;
  const additionalPanels = [
    content.spotlightTwo,
    content.spotlightThree,
    content.spotlightFour,
    ...(content.additionalSpotlights ?? []),
  ].filter((panel): panel is SpotlightPanel => Boolean(
    panel && (
      panel.title ||
      panel.type ||
      panel.description ||
      panel.imageUrl ||
      panel.imageAlt ||
      (panel.points && panel.points.length)
    )
  ));
  return (
    <>
      <SiteHeader />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="section container reveal" id="projects">
          <div className="section-head">
            <h2>{content.portfolioTitle || defaultProjectsContent.portfolioTitle}</h2>
            <div className="project-filter-tabs" style={{ display: "none" }}>
              {filterLabels.map((label, i) => {
                const filterValue = i === 0 ? "all" : label.toLowerCase();
                return (
                  <button
                    key={filterValue}
                    className={`filter-tab ${i === 0 ? "active" : ""}`}
                    data-filter={filterValue}
                    aria-pressed={i === 0 ? "true" : "false"}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <article className="project-spotlight" aria-live="polite">
            <div className="project-spotlight-media" style={{ position: "relative", height: "100%" }}>
              <Image
                id="spotlightImage"
                src={spotlight.imageUrl || projects[0]?.coverImageUrl || "/assets/images/mckinley-west-residence.jpg"}
                alt={spotlight.imageAlt || "Featured project image"}
                fill
                sizes="(max-width: 940px) 100vw, 55vw"
                style={{ objectFit: "cover", objectPosition: "50% 50%" }}
              />
            </div>
            <div className="project-spotlight-copy">
              <h3 id="spotlightTitle">{spotlight.title || projects[0]?.title || "Mckinley West Residence"}</h3>
              <p id="spotlightType" className="spotlight-type">{spotlight.type || projects[0]?.category || "Residential"}</p>
              <p id="spotlightDescription" className="spotlight-description">{spotlight.description}</p>
              <div className="spotlight-points">
                {(spotlight.points || []).map((point) => <span key={point}>{point}</span>)}
              </div>
              {spotlight.moreDetailsUrl && (
                <a
                  className="spotlight-more-link"
                  href={spotlight.moreDetailsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More Details
                </a>
              )}
            </div>
          </article>

          {additionalPanels.map((panel, index) => {
            const fallbackProject = projects[index] || projects[0];
            const isImageRight = index % 2 === 0;
            return (
              <article className={`project-spotlight${isImageRight ? " is-image-right" : ""}`} aria-live="polite" key={`${panel.title || "panel"}-${index}`}>
                <div className="project-spotlight-media" style={{ position: "relative", height: "100%" }}>
                  <Image
                    src={panel.imageUrl || fallbackProject?.coverImageUrl || "/assets/images/mckinley-west-residence.jpg"}
                    alt={panel.imageAlt || fallbackProject?.coverImageAlt || "Project image"}
                    fill
                    sizes="(max-width: 940px) 100vw, 55vw"
                    style={{ objectFit: "cover", objectPosition: "50% 50%" }}
                  />
                </div>
                <div className="project-spotlight-copy">
                  <h3>{panel.title || fallbackProject?.title || "Featured Architecture"}</h3>
                  <p className="spotlight-type">{panel.type || fallbackProject?.category || "Residential"}</p>
                  <p className="spotlight-description">{panel.description || "Project details available on request."}</p>
                  <div className="spotlight-points">
                    {(panel.points || []).map((point) => <span key={`${point}-${index}`}>{point}</span>)}
                  </div>
                  {panel.moreDetailsUrl && (
                    <a
                      className="spotlight-more-link"
                      href={panel.moreDetailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      More Details
                    </a>
                  )}
                </div>
              </article>
            );
          })}

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
