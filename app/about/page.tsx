import Image from "next/image";
import { groq } from "next-sanity";
import { client } from "../../sanity/lib/client";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

type AboutContent = {
  _id?: string;
  about?: {
    pageTitle?: string;
    sidebarImageUrl?: string | null;
    sidebarImageAlt?: string | null;
    sidebarName?: string;
    sidebarSubtitle?: string;
    licenseNumbers?: string[];
    specializations?: string[];
    profileHeading?: string;
    profileParagraphs?: string[];
    profilePills?: string[];
    keyLicenses?: Array<{ title?: string; meta?: string }>;
    memberships?: Array<{ title?: string; meta?: string }>;
    award?: {
      imageUrl?: string | null;
      imageAlt?: string | null;
      text?: string;
    };
    architectureTitle?: string;
    principles?: string[];
    servicesTitle?: string;
    services?: Array<{ title?: string; paragraphs?: string[] }>;
  };
};

const aboutQuery = groq`
  coalesce(
    *[_type == "siteContent" && _id == "siteContent"][0],
    *[_type == "siteContent"] | order(_updatedAt desc)[0]
  ) {
    _id,
    about {
      pageTitle,
      "sidebarImageUrl": sidebarImage.asset->url,
      "sidebarImageAlt": sidebarImage.alt,
      sidebarName,
      sidebarSubtitle,
      licenseNumbers,
      specializations,
      profileHeading,
      profileParagraphs,
      profilePills,
      keyLicenses[] { title, meta },
      memberships[] { title, meta },
      award {
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        text
      },
      architectureTitle,
      principles,
      servicesTitle,
      services[] { title, paragraphs }
    }
  }
`;

const defaultAbout = {
  pageTitle: "Arch. Joseph C. Chua, LRA, PAREB-QCRB",
  sidebarImageUrl: "/assets/images/joseph-chua-portrait.jpg",
  sidebarImageAlt: "Arch. Joseph C. Chua",
  sidebarName: "Arch. Joseph C. Chua",
  sidebarSubtitle: "Architect / Realtor\nEnvironmental Planner",
  licenseNumbers: [
    "Architect PRC # 012331",
    "REB Lic # 007256",
    "EnP Lic 2957",
    "Plumbing Engr PRC # 02197"
  ],
  specializations: ["Green Architecture", "Fire Safety", "Design Consultancy", "Project Management"],
  profileHeading: "Arch. Joseph C. Chua",
  profileParagraphs: ["University of the Philippines, College of Architecture / Batch '94, Cum Laude / Phi Kappa Phi Honor Society"],
  profilePills: ["Architect", "Plumbing Engineer", "Real Estate Broker", "Environmental Planner", "Fire Safety Practitioner", "Pollution Control Officer"],
  keyLicenses: [
    { title: "Registered Architect", meta: "Since 1995" },
    { title: "Master Plumber & Plumbing Engineer", meta: "Since 1996" },
    { title: "Licensed Real Estate Broker", meta: "Since 1997" },
    { title: "Environmental Planner & Fire Safety Practitioner", meta: "" },
  ],
  memberships: [
    { title: "NAMPAP", meta: "National Master Plumbers Assoc. of the Phils." },
    { title: "PAREB", meta: "Phil. Association of Real Estate Boards" },
    { title: "QCRB", meta: "Quezon City Real Estate Board" },
    { title: "Phi Kappa Phi Honor Society", meta: "" },
  ],
  awardText:
    "Arch. Joseph C. Chua received the award for Aventi Townhomes during the 2013 Philippines Property Awards Night. Aventi Townhomes was also recognized by the South East Asia Property Awards 2013, held in Singapore — honoring excellence in property development across the region.",
  awardImageUrl: "/assets/images/award.avif",
  awardImageAlt: "Arch. Joseph C. Chua receiving an award for Aventi Townhomes",
  architectureTitle: "Site-specific design for resilience and long-term value",
  principles: [
    "Each project is a unique project. We design each space, wall, window, toilet, stairs, and roof to suit the natural flow of wind, sun and rain in each site.  We consider earthquake movements and ease of maintenance of each building.  We also consider social interactions of each family member in a residential project.",
    "We always encourage flexibility in designing spaces, as buildings should be able to grow, as the users grow.  We believe Architecture can help both the users and the building structure, live a fruitful life thru the values of in depth architectural planning and foresight.",
    "Proper architectural design also helps reduce our maintenance costs for the buildings, as well as help us reduce our environmental costs.  A good architecture design is sustainable and resilient over the passage of time.",
  ],
  servicesTitle: "Architectural Consultancy Services",
  services: [
    {
      title: "Architectural Design Services",
      paragraphs: [
        "We offer schematic design, design development, conceptual design development, and detailing for building projects.  We accept designs for residential, commercial, warehouse complex, factories, and resort projects.  We provide construction drawings and building permit drawings.",
        "Our designs are climate sensitive, which means we always design using the climate and our environment as one of our tools and design elements.  This provides a great cost savings for the owners over the lifetime of the building.",
      ],
    },
    {
      title: "Design - Build Services",
      paragraphs: [
        "We offer design build services for clients who want the same designer to undergo the construction process.  We offer lump sum contracts as well as cost plus contracts.  We charge separately for the design component of the Design-Build services.  We do not do Free Designs, as all our design work is done meticulously, and these are all client specific, site specific and budget specific.",
        "We design climate sensitive designs, giving due considerations to local climate, energy consumption and water consumption for all our projects, givine a lifetime of savings for our clients.",
      ],
    },
    {
      title: "Physical Planning and Master Plan development",
      paragraphs: [
        "We provide services in large scale masterplanning services and physical planning for mid sized projects.  We can provide conceptual design proposals for each project to make it unique and sellable to the target market.",
        "Our masterplans are also climate and cost sensitive to benefit the client, users and the general public.",
      ],
    },
    {
      title: "GREEN ARCHITECTURE & GREEN PLUMBING ENGINEERING",
      paragraphs: [
        "We offer Green Architecture and Green Plumbing Engineering Services to some specific projects.  While we do integrate Green Architecture in all our design projects, some clients can specifically request for extra Green Architecture features.  Most of our applications for green architecture, uses passive design features.  We can design buildings to use active green design features if requested, such as use of solar panels, recirculating rain water cooling system, and more.",
      ],
    },
  ],
};

type PageProps = {
};

export default async function AboutPage() {
  const content = client ? await client.fetch<AboutContent | null>(aboutQuery) : null;
  const about = { ...defaultAbout, ...(content?.about ?? {}) };

  return (
    <>
      <SiteHeader />
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

      <SiteFooter />
    </>
  );
}
