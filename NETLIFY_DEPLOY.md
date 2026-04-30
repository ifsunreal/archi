## Netlify deployment checklist

This file lists the exact steps to deploy this Next.js + Sanity site to Netlify.

1) Repo & Netlify setup
- Push your repo to GitHub (or use existing remote).
- In Netlify: Sites → Add new site → Import from Git.

2) Netlify build settings
- Build command: `npm run build`
- Publish directory: leave empty (the Netlify Next plugin handles outputs)
- Add plugin: `@netlify/plugin-nextjs` is already configured in `netlify.toml`.
- Node: pin to Node 20 (configured via `netlify.toml` environment).

3) Required environment variables (set in Netlify Site → Site settings → Build & deploy → Environment)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (e.g. vel2g5w8)
- `NEXT_PUBLIC_SANITY_DATASET` (e.g. production)
- `SANITY_API_READ_TOKEN` (only if needed at build time; rotate if exposed)

4) Sanity / CORS
- If using Studio or authenticated requests from Netlify, add your Netlify site URL to Sanity CORS origins.

5) Local verification (recommended before deploying)
```bash
# install exact deps
npm ci

# run a production build locally
npm run build

# (optional) run the built app
npm run start
```

If `next` is not found locally, ensure `node_modules` exists and `npm ci` succeeded.

6) Security notes
- Do not commit `.env` files. Rotate any exposed Sanity tokens immediately via the Sanity project settings.

7) Troubleshooting
- If build fails on Netlify, check build logs for Node version mismatch or missing env vars.
- Common local error: `'next' is not recognized` — run `npm ci` to restore CLI binaries.

8) After deploy
- Test the public site; verify images and Sanity-driven pages load.
- If Studio is served under `/studio`, ensure you have the correct routing and CORS entries.

If you want, I can now run `npm ci` and `npm run build` locally to verify the build — reply with `run build` to continue.
