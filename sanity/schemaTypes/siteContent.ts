import { defineArrayMember, defineField, defineType } from "sanity";

export const siteContentSchema = defineType({
  name: "siteContent",
  title: "Site Content",
  type: "document",
  initialValue: {
    internalName: "Main Site Content",
  },
  preview: {
    select: {
      title: "internalName",
      updatedAt: "_updatedAt",
    },
    prepare({ title, updatedAt }) {
      return {
        title: title || "Site Content",
        subtitle: updatedAt ? `Last updated ${new Date(updatedAt).toLocaleString()}` : "Not yet published",
      };
    },
  },
  groups: [
    { name: "home", title: "Home", default: true },
    { name: "about", title: "About" },
    { name: "projects", title: "Projects" },
    { name: "contact", title: "Contact" },
    { name: "changes", title: "Change Log" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "internalName",
      title: "Document Label",
      type: "string",
      description: "This appears as the document title in the Studio list.",
      validation: (Rule) => Rule.required(),
      group: "settings",
    }),
    defineField({
      name: "home",
      title: "Home Page",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "eyebrow", title: "Hero Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Hero Title", type: "string" }),
        defineField({
          name: "paragraphs",
          title: "Hero Paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "actions",
          title: "Hero Buttons",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "Link", type: "string" }),
                defineField({
                  name: "variant",
                  title: "Variant",
                  type: "string",
                  options: {
                    list: [
                      { title: "Primary", value: "primary" },
                      { title: "Outline", value: "outline" },
                    ],
                  },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "featuredDesign",
          title: "Featured Design",
          type: "object",
          fields: [
            defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({
              name: "image",
              title: "Main Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Alt Text", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({
          name: "tiles",
          title: "Showcase Tiles",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "tag", title: "Tag", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "string" }),
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({ name: "alt", title: "Alt Text", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "about",
      title: "About Page",
      type: "object",
      group: "about",
      fields: [
        defineField({ name: "pageTitle", title: "Page Title", type: "string" }),
        defineField({
          name: "sidebarImage",
          title: "Sidebar Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
        defineField({ name: "sidebarName", title: "Sidebar Name", type: "string" }),
        defineField({ name: "sidebarSubtitle", title: "Sidebar Subtitle", type: "string" }),
        defineField({
          name: "licenseNumbers",
          title: "License Numbers",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "specializations",
          title: "Specializations",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({ name: "profileHeading", title: "Profile Heading", type: "string" }),
        defineField({
          name: "profileParagraphs",
          title: "Profile Paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "profilePills",
          title: "Profile Pills",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "keyLicenses",
          title: "Key Licenses",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "meta", title: "Meta", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({
          name: "memberships",
          title: "Memberships",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "meta", title: "Meta", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({
          name: "award",
          title: "Award Block",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Award Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Alt Text", type: "string" }),
              ],
            }),
            defineField({ name: "text", title: "Award Text", type: "string" }),
          ],
        }),
        defineField({ name: "architectureTitle", title: "Architecture Title", type: "string" }),
        defineField({
          name: "principles",
          title: "Design Principles",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({ name: "servicesTitle", title: "Services Title", type: "string" }),
        defineField({
          name: "services",
          title: "Service Blocks",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({
                  name: "paragraphs",
                  title: "Paragraphs",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "projects",
      title: "Projects Page",
      type: "object",
      group: "projects",
      fields: [
        defineField({ name: "showcaseEyebrow", title: "Showcase Eyebrow", type: "string" }),
        defineField({ name: "showcaseTitle", title: "Showcase Title", type: "string" }),
        defineField({ name: "showcaseNote", title: "Showcase Note", type: "string" }),
        defineField({
          name: "carouselSlides",
          title: "Carousel Slides",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "tag", title: "Tag", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({ name: "alt", title: "Alt Text", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        }),
        defineField({ name: "portfolioTitle", title: "Portfolio Title", type: "string" }),
        defineField({
          name: "filterLabels",
          title: "Filter Labels",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "statusGuideCards",
          title: "Status Guide Cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "tag", title: "Tag", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "string" }),
              ],
            }),
          ],
        }),
        defineField({ name: "disclosure", title: "Portfolio Disclosure", type: "string" }),
        defineField({
          name: "spotlight",
          title: "Featured Project Spotlight",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "type", title: "Type", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({
              name: "points",
              title: "Points",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "image",
              title: "Spotlight Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Alt Text", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact Page",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "title", title: "Page Title", type: "string" }),
        defineField({ name: "formTitle", title: "Form Title", type: "string" }),
        defineField({ name: "formIntro", title: "Form Intro", type: "string" }),
        defineField({ name: "officeHeading", title: "Office Heading", type: "string" }),
        defineField({ name: "officeMapUrl", title: "Office Map URL", type: "string" }),
        defineField({ name: "officeMapLinkUrl", title: "Office Map Link URL", type: "string" }),
        defineField({ name: "officeMapLink", title: "Office Map Link Text", type: "string" }),
        defineField({ name: "contactHeading", title: "Contact Heading", type: "string" }),
        defineField({ name: "contactName", title: "Contact Name", type: "string" }),
        defineField({ name: "contactRoles", title: "Contact Roles", type: "string" }),
        defineField({
          name: "addressLines",
          title: "Address Lines",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
      ],
    }),
    defineField({
      name: "changeLog",
      title: "Past Changes",
      type: "array",
      description: "Add updates in chronological order from oldest to latest.",
      group: "changes",
      validation: (Rule) =>
        Rule.custom((entries) => {
          if (!Array.isArray(entries)) {
            return true;
          }

          const items = entries as Array<{ changedOn?: string }>;

          for (let index = 1; index < items.length; index += 1) {
            const previous = items[index - 1]?.changedOn;
            const current = items[index]?.changedOn;

            if (previous && current && previous > current) {
              return "Please order Past Changes from oldest to latest.";
            }
          }

          return true;
        }),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "changedOn",
              title: "Date",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "section",
              title: "Section",
              type: "string",
              options: {
                list: [
                  { title: "Home", value: "home" },
                  { title: "About", value: "about" },
                  { title: "Projects", value: "projects" },
                  { title: "Contact", value: "contact" },
                  { title: "Global", value: "global" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Change Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "summary",
              title: "Summary",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              section: "section",
              changedOn: "changedOn",
            },
            prepare({ title, section, changedOn }) {
              const dateLabel = changedOn ? new Date(changedOn).toLocaleDateString() : "No date";
              const sectionLabel = section ? String(section).toUpperCase() : "GENERAL";
              return {
                title: title || "Untitled change",
                subtitle: `${dateLabel} • ${sectionLabel}`,
              };
            },
          },
        }),
      ],
    }),
  ],
});
