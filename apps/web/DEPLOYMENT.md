# Deploying to Vercel

This document provides guidance on deploying the `web` application to Vercel.

## Environment Variables

The following environment variables must be configured in your Vercel project settings for the application to function correctly. Values can be found in your service dashboards (e.g., Supabase project settings).

### Core Configuration
| Variable Name                 | Description                                                                 | Example Value                       | Type      |
|-------------------------------|-----------------------------------------------------------------------------|-------------------------------------|-----------|
| `PUBLIC_SUPABASE_URL`         | The URL of your Supabase project.                                           | `https://<your-project-ref>.supabase.co` | Public    |
| `PUBLIC_SUPABASE_ANON_KEY`    | The anonymous public key for your Supabase project.                         | `eyJh...`                           | Public    |
| `SUPABASE_SERVICE_ROLE_KEY`   | The service role key for server-side Supabase operations (admin privileges).| `eyJh...`                           | Secret    |
| `JWT_SECRET`                  | A secret key for signing and verifying JWTs.                                | `your-very-strong-jwt-secret`       | Secret    |
| `NODE_ENV`                    | The runtime environment. Vercel sets this to `production` automatically.    | `production`                        | Automatic |

### Database (Verify if used directly, otherwise Supabase handles it)
| Variable Name                 | Description                                                                 | Example Value                       | Type      |
|-------------------------------|-----------------------------------------------------------------------------|-------------------------------------|-----------|
| `DATABASE_URL`                | Full connection string for your primary database (often your Supabase DB).    | `postgresql://user:pass@host:port/db` | Secret    |

### Optional Features
This application supports various optional features (AI, Knowledge Graph, File Storage, etc.) configured via environment variables as listed in `.env.example`. If you enable these features, ensure the corresponding variables are also set in Vercel:
- ArangoDB (e.g., `ARANGODB_URL`, `ARANGODB_DATABASE`, etc.)
- MinIO (e.g., `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, etc.)
- AI/LLM (e.g., `OPENAI_API_KEY`, etc.)
- And others as per `.env.example`.

**Note on Public Variables:** Variables prefixed with `PUBLIC_` (e.g., `PUBLIC_SUPABASE_URL`) are exposed to the client-side browser. Ensure these do not contain sensitive information beyond what's intended for client access. Other variables are treated as secrets and are only available server-side.

## Build Configuration in Vercel
- **Framework Preset:** Astro
- **Root Directory:** `apps/web` (ensure this is set in Vercel project settings if deploying the `web` app specifically from the monorepo root, otherwise Vercel might detect it if the project is configured to point to `apps/web` as its own root).
- **Build Command:** Vercel should automatically use `astro build` or the build script from `apps/web/package.json` (e.g., `pnpm run build` which should resolve to `astro build`).
- **Output Directory:** Vercel usually detects this automatically for Astro (`dist` for static builds, or `.vercel/output` for server/hybrid builds using an adapter). Since we've configured the Vercel adapter, it will be `.vercel/output`.

Refer to the official Vercel and Astro documentation for more details on deployment.
