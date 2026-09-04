# Anand Krishnan's Portfolio

A standalone Next.js portfolio with an animated public homepage and a private-by-discoverability resume studio. The project uses TypeScript, Sass, React PDF, npm, and a small set of editable content files.

## Requirements

- Node.js 22.13 or newer in the Node 22 release line
- npm 10.9 or newer

The repository includes `.nvmrc`, so the recommended setup is:

```bash
nvm install
nvm use
node --version
npm --version
```

## Install

Use the committed lockfile for a repeatable installation:

```bash
npm ci
```

The `node_modules` directory is intentionally ignored by Git. Some editors also hide ignored folders, but the directory is present after a successful install.

Use `npm install` when intentionally adding or updating a package. Commit both `package.json` and `package-lock.json` after reviewing the change.

## Run locally

Start the app at [http://localhost:4000](http://localhost:4000):

```bash
npm run dev
```

To test from a phone on the same Wi-Fi network:

```bash
npm run dev:host
```

Then open `http://<your-computer-lan-ip>:4000` on the phone. Hosting on `0.0.0.0` exposes the development server to the local network, so use this only on a network you trust.

## Edit portfolio and resume content

Content is intentionally separate from the React layout:

- `content/portfolio.config.json` controls public portfolio copy, navigation, impact metrics, company presentation, featured work, skill presentation, contact copy, and SEO content.
- `data/cv-data.json` is the default resume content used by the homepage download and the resume studio.
- `public/` contains images, brand marks, and skill icons referenced by those files. Public asset paths begin with `/`, for example `/images/profile.webp`.

After editing content or replacing an asset, run:

```bash
npm run content:check
npm run content:generate
npm run typecheck
npm run build
```

Do not edit `.next/`; it is generated from the source files on every build.

### Date and content conventions

- Use the date format documented in the content configuration so career tenure and experience ordering remain automatic.
- Keep IDs stable and unique because navigation, accessibility labels, and structured data can refer to them.
- Keep external links as complete `https://` URLs.
- Run `npm run content:check` after moving or renaming an image. It verifies content structure and referenced local assets.

## Resume studio privacy

The resume studio is available at `/resume-builder`, but it is intentionally absent from homepage calls to action and navigation. It sends `noindex`, `nofollow`, and `noarchive` instructions to search engines.

This is privacy by discoverability, not authentication: anyone who knows the URL can open the page. Resume drafts stay in that browser's local storage unless the user explicitly exports or downloads them. Do not place secrets in either content file.

The homepage's default CV download continues to use `data/cv-data.json`; template selection and resume-studio customizations do not replace that default download.

## Routes and contact delivery

The standalone app intentionally exposes only the public homepage, the unlisted resume studio, and the standard 404 page. Previous `/projects/*`, `/blogs/*`, `/login`, and `/superadmin/*` URLs permanently redirect to the relevant public homepage section.

Contact actions use the configured `mailto:` link. There is no email API, admin backend, database, or SendGrid credential to deploy or maintain.

## Quality checks

Run the complete local verification suite before merging:

```bash
npm run verify
```

The individual commands are:

- `npm run content:check` validates editable content and local asset references.
- `npm run content:generate` refreshes lightweight metadata, the social preview image, manifest, sitemap, and robots file from the content config.
- `npm run lint` runs Next.js, React, accessibility, and TypeScript ESLint rules with zero warnings allowed.
- `npm run lint:fix` applies safe automatic lint fixes.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm test` runs the lightweight unit tests.
- `npm run format` formats supported source files with Prettier.
- `npm run format:check` checks formatting without changing files.
- `npm run bundle:check` protects the initial JavaScript budgets and the deferred PDF boundary.
- `npm run smoke` boots the standalone build and checks the homepage, private-route headers, redirects, and image optimizer.
- `npm run verify` runs every quality check, creates and smoke-tests the standalone production build, and confirms generated search files are committed.

Next.js 16 does not run ESLint as part of `next build`, so use `npm run verify` as the merge gate.

## Production and standalone server

Create the optimized build:

```bash
npm run build
```

The `postbuild` step automatically copies static and public assets into Next.js's standalone output. Start it locally with:

```bash
HOSTNAME=0.0.0.0 PORT=4000 npm start
```

The same build can be deployed to a Node.js host or Vercel. Never commit `.next`, `node_modules`, or `.env.local`.

## Dependency and security maintenance

Review vulnerabilities against npm's current advisory database:

```bash
npm audit --audit-level=low
npm audit --omit=dev --audit-level=low
npm outdated
```

For routine compatible updates, work on a branch, update the intended packages, and run the full quality and build checks. For major framework, React PDF, or Sass updates, also verify the homepage on desktop and mobile and render every resume template before merging.

Avoid `npm audit fix --force`: it can silently cross major-version boundaries and break the build or PDF layout. Prefer explicit package upgrades, inspect the lockfile diff, and keep unused dependencies removed.

If a future integration needs credentials, store them in `.env.local` and document only the variable names. Variables prefixed with `NEXT_PUBLIC_` are bundled into browser code and must never contain secrets.

## Troubleshooting

If `node` or `npm` is not found, open a new terminal and run `nvm use` from the project directory. If installation state is inconsistent, restore a clean install from the lockfile with `npm ci`.

For a failed check, run the individual command listed above first; it usually gives a more focused error than the combined `npm run check` command.
