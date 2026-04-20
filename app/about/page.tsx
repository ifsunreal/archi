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
  licenseNumbers: ["Architect PRC #012331", "Plumbing Engr PRC #02197", "REB Lic #007256", "EnP Lic #2957"],
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
    "Each project is a unique project. We design each space, wall, window, toilet, stairs, and roof to suit the natural flow of wind, sun and rain in each site. We consider earthquake movements and ease of maintenance of each building. We also consider social interactions of each family member in a residential project.",
    "We always encourage flexibility in designing spaces, as buildings should be able to grow, as the users grow. We believe Architecture can help both the users and the building structure, live a fruitful life thru the values of in depth architectural planning and foresight.",
    "Proper architectural design also helps reduce our maintenance costs for the buildings, as well as help us reduce our environmental costs. A good architecture design is sustainable and resilient over the passage of time.",
  ],
  servicesTitle: "Architectural Consultancy Services",
  services: [
    {
      title: "Architectural Design",
      paragraphs: [
        "We offer schematic design, design development, conceptual design development, and detailing for building projects. We accept designs for residential, commercial, warehouse complex, factories, and resort projects. We provide construction drawings and building permit drawings.",
        "Our designs are climate sensitive, which means we always design using the climate and our environment as one of our tools and design elements. This provides great cost savings for owners over the lifetime of the building.",
      ],
    },
    {
      title: "Design-Build",
      paragraphs: [
        "We offer design-build services for clients who want the same designer to undergo the construction process. We offer lump sum contracts as well as cost-plus contracts. We charge separately for the design component of the design-build services.",
        "We do not do free designs, as all our design work is done meticulously and is client specific, site specific, and budget specific. We design climate sensitive solutions, giving due consideration to local climate, energy consumption, and water consumption for all projects, giving a lifetime of savings for our clients.",
      ],
    },
    {
      title: "Physical Planning and Master Plan Development",
      paragraphs: [
        "We provide large-scale master planning services and physical planning for mid-sized projects. We can provide conceptual design proposals for each project to make it unique and sellable to its target market.",
        "Our master plans are also climate and cost sensitive to benefit the client, users, and the general public.",
      ],
    },
    {
      title: "Green Architecture and Green Plumbing Engineering",
      paragraphs: [
        "We offer green architecture and green plumbing engineering services for specific projects. While we integrate green architecture in all our design projects, clients may also request additional green architecture features.",
        "Most of our green architecture applications use passive design features. We can also design buildings with active green design features when requested, such as solar panels, recirculating rainwater cooling systems, and more.",
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
          <div className="about-layout">
            <article className="about-panel about-sidebar">
              <div className="sidebar-image-wrap">
                <Image src={about.sidebarImageUrl || "/assets/images/joseph-chua-portrait.jpg"} alt={about.sidebarImageAlt || "Arch. Joseph C. Chua"} width={900} height={1100} />
              </div>
              <div className="about-sidebar-meta">
                <h3 className="sidebar-title">{about.sidebarName}</h3>
                <p className="sidebar-sub">
                  {(about.sidebarSubtitle || "").split("\n").map((line, index, lines) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>

                <hr className="sidebar-divider" />

                <p className="sidebar-eyebrow">LICENSE NUMBERS</p>
                <ul className="sidebar-list">
                  {(about.licenseNumbers || []).map((item) => <li key={item}>{item}</li>)}
                </ul>

                <hr className="sidebar-divider" />

                <p className="sidebar-eyebrow">SPECIALIZATIONS</p>
                <div className="db-tags db-tags-outline profile-tags">
                  {(about.specializations || []).map((item) => <span className="db-pill" key={item}>{item}</span>)}
                </div>
              </div>
            </article>

            <div className="about-dashboard">
              <article className="about-panel db-card">
                <p className="db-eyebrow">Profile</p>
                <h3>{about.profileHeading}</h3>
                {(about.profileParagraphs || []).map((paragraph) => <p className="db-sub" key={paragraph}>{paragraph}</p>)}
                <div className="db-tags db-tags-outline profile-tags">
                  {(about.profilePills || []).map((item) => <span className="db-pill" key={item}>{item}</span>)}
                </div>
              </article>

              <div className="db-split">
                <article className="about-panel db-card">
                  <p className="db-eyebrow">Key Licenses & Registrations</p>
                  <ul className="db-list db-list-green">
                    {(about.keyLicenses || []).map((item) => (
                      <li key={item.title}>
                        <span className="db-title">{item.title}</span>
                        {item.meta ? <span className="db-meta">{item.meta}</span> : null}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="about-panel db-card">
                  <p className="db-eyebrow">Professional Memberships</p>
                  <ul className="db-list db-list-green">
                    {(about.memberships || []).map((item) => (
                      <li key={item.title}>
                        <span className="db-title">{item.title}</span>
                        {item.meta ? <span className="db-meta">{item.meta}</span> : null}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <article className="about-panel db-card db-card-award" aria-label="Professional award recognition">
                <div className="db-award-image">
                  <Image src={about.award?.imageUrl || "/assets/images/award.avif"} alt={about.award?.imageAlt || "Arch. Joseph C. Chua receiving an award for Aventi Townhomes"} width={1200} height={800} />
                </div>
                <div className="db-award-content">
                  <p className="db-award-text">
                    <strong>{about.award?.text || defaultAbout.awardText}</strong>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section container reveal" id="architecture-design">
          <div className="section-head">
            <p className="eyebrow">Architecture Design</p>
            <h2>{about.architectureTitle}</h2>
          </div>
          <div className="principles-grid">
            {(about.principles || []).map((paragraph) => (
              <article className="profile-card" key={paragraph}>
                <p>{paragraph}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section container reveal" id="services">
          <div className="section-head">
            <h2>{about.servicesTitle}</h2>
          </div>
          <div className="services-grid">
            {(about.services || []).map((service) => (
              <article className="service-card" key={service.title}>
                <h3>{service.title}</h3>
                {(service.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
