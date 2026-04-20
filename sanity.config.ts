import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  name: "default",
  title: "Joseph Portfolio Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vel2g5w8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});