// Per-route <meta> and a sitemap, stamped into the built output.
//
// THE PROBLEM THIS SOLVES. The site is one index.html. `Paper.tsx` sets
// document.title per project, but that runs in JavaScript, and the things that
// build link previews — LinkedIn's unfurler, Slack's, iMessage's, Discord's —
// fetch the raw HTML and read <meta> only. Without this, all seven URLs unfurl
// identically with no image, and search engines see seven pages that look like
// one.
//
// WHY THIS WORKS WITHOUT SSR. Vercel resolves in a fixed order: headers,
// redirects, THEN the filesystem, then rewrites. `vercel.json` rewrites
// /(.*) to /index.html, but once dist/projects/thesis/index.html exists on
// disk the filesystem check matches first and the rewrite never fires for that
// path. A crawler gets real tags; a human gets the same file and React boots
// from it exactly as before. Every other path still falls through to the SPA.
//
// WHY IT READS THE REGISTRIES THROUGH VITE. `papers.ts` and `projects.ts` are
// TypeScript with extensionless imports, which plain Node cannot resolve.
// Vite's own `ssrLoadModule` resolves them exactly as the app does, so this
// script cannot drift from what the site renders — the same invariant
// `paper-view.ts` exists to hold for the search index.
import { createServer } from 'vite'
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const ORIGIN = 'https://kianjavaheri.com'
const DIST = 'dist'

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// The share images are committed, content-hashed files (see
// scripts/make-og-images.sh). Resolved by glob rather than by a list kept in
// step by hand — the hash changes whenever the art does, and a stale literal
// here would point at a 404.
async function ogImages() {
  const files = await readdir(join('public', 'og'))
  const map = {}
  for (const f of files) {
    const m = f.match(/^(.+?)\.[0-9a-f]{8}\.jpg$/)
    if (m) map[m[1]] = `/og/${f}`
  }
  return map
}

function head({ title, description, url, image, imageAlt, type }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="Kian Javaheri" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    // Absolute, always: a relative og:image is simply dropped by most unfurlers.
    `<meta property="og:image" content="${esc(ORIGIN + image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    // Describes the PICTURE, not the page — `works` already carries exactly
    // that string for every thumbnail, so it is reused rather than rewritten.
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(ORIGIN + image)}" />`,
  ].map((l) => '    ' + l).join('\n')
}

// The shell keeps its own <title> and description; both are replaced per route
// rather than appended, or the page would carry two of each.
function stamp(shell, meta) {
  return shell
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/, '')
    .replace('</head>', head(meta) + '\n  </head>')
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const { papers } = await server.ssrLoadModule('/src/content/papers.ts')
  const { works } = await server.ssrLoadModule('/src/content/projects.ts')
  const images = await ogImages()
  const shell = await readFile(join(DIST, 'index.html'), 'utf8')

  const routes = []

  routes.push({
    path: '/',
    file: join(DIST, 'index.html'),
    title: 'Kian Javaheri',
    description:
      'Portfolio of Kian Javaheri — a May 2026 Computer Science and Economics graduate from Barrett, The Honors College at ASU. Projects in machine learning, causal inference and backend systems.',
    image: images.home,
    imageAlt: 'Kian Javaheri outdoors, against a bright sky and high desert scrub',
    type: 'website',
  })

  for (const work of works) {
    const slug = work.to.replace('/projects/', '')
    const paper = papers[slug]
    if (!paper) throw new Error(`project "${slug}" has no page in the papers registry`)
    // The image is keyed by its FILE stem, which is not always the slug —
    // shipment-quoting vs cs-capstone, thesis-survey vs thesis.
    const stem = work.image.src.replace('/images/projects/', '').replace(/\.[0-9a-f]{8}\.webp$/, '')
    const image = images[stem]
    if (!image) throw new Error(`no og image for "${stem}" — run scripts/make-og-images.sh`)
    routes.push({
      path: work.to,
      // BOTH filename forms, deliberately. A static host resolving an
      // extensionless request tries the path itself, then `.html` appended,
      // then `/index.html` — but which of the last two it reaches first is the
      // host's business, not ours, and it is the one thing here that cannot be
      // verified without deploying. Writing both means whichever it checks
      // finds a real file before the SPA rewrite can fire. It costs ~2KB each.
      // It also makes `npm run preview` correct locally: vite's preview server
      // falls through to the SPA on the extensionless path unless the sibling
      // `.html` exists, which is exactly how this bug was caught.
      file: join(DIST, work.to.slice(1) + '.html'),
      alsoFile: join(DIST, work.to.slice(1), 'index.html'),
      // The TAB title is the paper's full title, matching what Paper.tsx sets
      // once React takes over — otherwise the tab would visibly change on
      // hydration. The SHARE title is the card's short one, because an
      // unfurler truncates around 60-90 characters and the full thesis title
      // is 100. That is the same split `navLabel` already exists for.
      title: `${paper.title} — Kian Javaheri`,
      shareTitle: `${work.navLabel ?? work.title} — Kian Javaheri`,
      description: work.blurb,
      image,
      imageAlt: work.image.alt,
      type: 'article',
    })
  }

  for (const r of routes) {
    const url = ORIGIN + r.path
    let html = stamp(shell, { ...r, url })
    if (r.shareTitle) {
      // Only the og:/twitter: titles take the short form.
      html = html
        .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(r.shareTitle)}`)
        .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(r.shareTitle)}`)
    }
    for (const f of [r.file, r.alsoFile].filter(Boolean)) {
      await mkdir(join(f, '..'), { recursive: true })
      await writeFile(f, html)
    }
    console.log(`  ${r.path.padEnd(28)} -> ${[r.file, r.alsoFile].filter(Boolean).map((f) => f.replace('dist/', '')).join('  +  ')}`)
  }

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map((r) => `  <url><loc>${esc(ORIGIN + r.path)}</loc></url>\n`).join('') +
    `</urlset>\n`
  await writeFile(join(DIST, 'sitemap.xml'), sitemap)
  console.log(`  sitemap.xml                  -> ${routes.length} urls`)
} finally {
  await server.close()
}
