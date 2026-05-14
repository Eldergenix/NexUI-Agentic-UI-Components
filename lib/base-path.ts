/**
 * Base path helper for GitHub Pages deployment.
 *
 * GitHub Pages serves a project repo at `https://<user>.github.io/<repo>/`,
 * so the app is mounted under a sub-path in production. Next.js automatically
 * prefixes `<Link>`, `next/image`, route metadata, and `next/font` assets with
 * `basePath` — but plain string `src` values passed to custom components are
 * NOT rewritten. Use `withBasePath()` for those.
 *
 * Locally (and on any root-domain deploy) `NEXT_PUBLIC_BASE_PATH` is empty,
 * so this is a no-op.
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public-asset path with the deployment base path. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
