import { groq } from "next-sanity";
import { client } from "../../sanity/lib/client";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

type ContactContent = {
  _id?: string;
  contact?: {
    title?: string;
    formTitle?: string;
    formIntro?: string;
    officeHeading?: string;
    officeMapUrl?: string;
    officeMapLinkUrl?: string;
    officeMapLink?: string;
    contactHeading?: string;
    contactName?: string;
    contactRoles?: string;
    addressLines?: string[];
    phone?: string;
    email?: string;
  };
};

const contactQuery = groq`
  coalesce(
    *[_type == "siteContent" && _id == "siteContent"][0],
    *[_type == "siteContent"] | order(_updatedAt desc)[0]
  ) {
    _id,
    contact {
      title,
      formTitle,
      formIntro,
      officeHeading,
      officeMapUrl,
      officeMapLinkUrl,
      officeMapLink,
      contactHeading,
      contactName,
      contactRoles,
      addressLines,
      phone,
      email
    }
  }
`;

const defaultContact = {
  title: "Tell us what you are building",
  formTitle: "Project Inquiry Form",
  formIntro: "Please share your project details so we can prepare an informed architectural consultation.",
  officeHeading: "Office Location",
  officeMapUrl: "https://maps.google.com/maps?q=14.5377,120.9995&z=15&output=embed",
  officeMapLinkUrl: "https://maps.google.com/?q=14.5377,120.9995",
  officeMapLink: "Open full map",
  contactHeading: "Get in touch",
  contactName: "Arch. Joseph C. Chua",
  contactRoles: "Architect ~ Realtor ~ Environmental Planner ~ Plumbing Engineer",
  addressLines: ["265A - Nemar Building, Libertad St. Pasay City, 1300. Philippines."],
  phone: "+63-917-819-4131",
  email: "josephchua.2000@gmail.com",
};

type PageProps = {
};

export default async function ContactPage() {
  const content = client ? await client.fetch<ContactContent | null>(contactQuery) : null;
  const contact = { ...defaultContact, ...(content?.contact ?? {}) };
  return (
    <>
      <SiteHeader />
      <div className="top-progress" id="topProgress" aria-hidden="true" />

      <main>
        <section className="section container reveal" id="contact">
          <div className="section-head">
            <h2>{contact.title}</h2>
          </div>
          <div className="contact-layout">
            <form id="contactForm" className="contact-form" noValidate>
              <div className="contact-form-head">
                <h3>{contact.formTitle}</h3>
                <p>{contact.formIntro}</p>
              </div>
              <div className="form-grid">
                <label>
                  Name *
                  <input type="text" name="name" autoComplete="name" placeholder="First Name and Last Name" required />
                </label>
                <label>
                  Email *
                  <input type="email" name="email" autoComplete="email" placeholder="example@gmail.com" required />
                </label>
                <label>
                  Mobile Number *
                  <input type="tel" name="mobile" autoComplete="tel" required />
                </label>
                <label>
                  Subject
                  <input type="text" name="subject" placeholder="Project consultation request" />
                </label>
                <label>
                  Project Type *
                  <select name="type" required>
                    <option value="">Select one</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </label>
                <label>
                  Service Needed *
                  <select name="service" required>
                    <option value="">Select one</option>
                    <option value="architectural-design">Architectural Design</option>
                    <option value="design-build">Design-Build</option>
                    <option value="master-planning">Master Planning</option>
                    <option value="green-architecture">Green Architecture</option>
                    <option value="consulting">Technical Consulting</option>
                  </select>
                </label>
                <label className="field-wide">
                  Province *
                  <input
                    type="text"
                    name="provinceCity"
                    list="provinceCitySuggestions"
                    autoComplete="off"
                    placeholder="Select your province"
                    required
                  />
                  <datalist id="provinceCitySuggestions"></datalist>
                </label>
                <p className="address-hint field-wide" id="addressHint">Choose a province first. The next fields unlock based on your selection.</p>
                <label>
                  Municipality / City
                  <input
                    type="text"
                    name="municipalityCity"
                    list="municipalitySuggestions"
                    autoComplete="off"
                    placeholder="Choose after province"
                    disabled
                  />
                  <datalist id="municipalitySuggestions"></datalist>
                </label>
                <label>
                  Barangay *
                  <input
                    type="text"
                    name="barangay"
                    list="barangaySuggestions"
                    autoComplete="off"
                    placeholder="Choose after municipality/city"
                    required
                    disabled
                  />
                  <datalist id="barangaySuggestions"></datalist>
                </label>
                <label>
                  Postal Code *
                  <input type="text" name="postalCode" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{4}" maxLength={4} placeholder="1300" required />
                </label>
                <label className="field-wide">
                  Additional Address Details
                  <textarea name="addressDetails" rows={3} placeholder="Street name, house number, barangay, building, landmark..." />
                </label>
                <label className="field-wide">
                  Message *
                  <textarea name="message" rows={6} required />
                </label>
              </div>
              <button className="btn btn-primary" type="submit">Send Inquiry</button>
              <p id="formMessage" className="form-message" aria-live="polite"></p>
            </form>

            <div className="contact-side">
              <aside className="contact-card map-card" aria-label="Office map location">
                <h3>{contact.officeHeading}</h3>
                <div className="contact-map-wrap">
                  <iframe
                    title="JCCHUA and Associates office map"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={contact.officeMapUrl}
                  />
                  <p className="map-link">
                    <a href={contact.officeMapLinkUrl} target="_blank" rel="noopener noreferrer">{contact.officeMapLink}</a>
                  </p>
                </div>
              </aside>

              <aside className="contact-card">
                <h3>{contact.contactHeading}</h3>
                <p className="contact-name">{contact.contactName}</p>
                <p>{contact.contactRoles}</p>
                <ul className="contact-list">
                  {(contact.addressLines || []).map((line) => <li key={line}>{line}</li>)}
                  <li>Mobile# <a href={`tel:${contact.phone?.replace(/[^+\d]/g, "")}`}>{contact.phone}</a></li>
                  <li>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></li>
                </ul>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
