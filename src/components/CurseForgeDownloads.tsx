import { useEffect, useState } from 'react'

/* THE MOD'S TOTAL DOWNLOADS, read live from CurseForge by way of shields.io.
 *
 * WHY NOT CURSEFORGE'S OWN API. It needs a key, and the key's terms forbid
 * handing it to anyone else — so shipping it in browser code is a breach, and
 * keeping it safe means a server function to hold it, plus an application to
 * CurseForge and its approval. That is a great deal of machinery for one
 * number, which is already public on the mod's own page.
 *
 * shields.io already does that lookup for every README badge on GitHub. Its
 * `curseforge/dt/:id` endpoint is public, needs no key, answers with
 * `access-control-allow-origin: *`, and is cached for 30 minutes on its side.
 * It returns an SVG rather than JSON, so the figure is read out of the SVG's
 * own `aria-label` ("downloads: 83") — the one place it is stated as text.
 *
 * THE COST OF THAT, honestly: the figure is whatever shields.io formats. Past
 * a thousand it abbreviates ("1.2k"), so this prints the string it is given
 * and never does arithmetic on it. And it is a third party in the path: if
 * shields.io is down, or changes the label, the line disappears (see below)
 * rather than showing something wrong.
 *
 * It degrades to nothing, like GitHubActivity: offline, blocked, rate-limited
 * or reworded, and the page reads as it would have without it.
 */

// Held at module scope so moving between pages doesn't refetch; a cache, not
// state, because the component remounts on every navigation to the page.
const cache = new Map<number, string>()

async function load(projectId: number): Promise<string | null> {
  const hit = cache.get(projectId)
  if (hit) return hit
  try {
    const res = await fetch(`https://img.shields.io/curseforge/dt/${projectId}`)
    if (!res.ok) return null
    const svg = await res.text()
    // `[^"]+` rather than digits, for the abbreviated form. Anything that is
    // not "downloads: <something>" is treated as a failure, not parsed harder.
    const m = /aria-label="downloads: ([^"]+)"/.exec(svg)
    if (!m) return null
    cache.set(projectId, m[1])
    return m[1]
  } catch {
    return null
  }
}

type Props = { projectId: number; href: string }

function CurseForgeDownloads({ projectId, href }: Props) {
  // undefined = loading, null = failed, string = the figure.
  const [count, setCount] = useState<string | null | undefined>(cache.get(projectId))

  useEffect(() => {
    let live = true
    if (cache.has(projectId)) return
    load(projectId).then((c) => {
      if (live) setCount(c)
    })
    return () => {
      live = false
    }
  }, [projectId])

  if (count === null) return null

  // While it loads, the line's height is held (a hidden non-breaking space in
  // the same box) so the paragraphs below don't jump when the number lands.
  return (
    <p className="paper-downloads" aria-live="polite">
      {count === undefined ? (
        <span aria-hidden="true">&nbsp;</span>
      ) : (
        <>
          <strong>{count}</strong> downloads on{' '}
          <a href={href} target="_blank" rel="noopener noreferrer">
            CurseForge
          </a>
        </>
      )}
    </p>
  )
}

export default CurseForgeDownloads
