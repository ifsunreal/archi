import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vel2g5w8";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const isSanityConfigured = true;

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-04-18",
  useCdn: true,
});
