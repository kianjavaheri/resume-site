import React from 'react'

// Tech tag pills. Rendered below a card's clamp, so they stay visible while the
// card is collapsed — the stack reads at a glance without expanding anything.
function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null
  return (
    <ul className="tag-list" aria-label="Technologies">
      {tags.map((t) => (
        <li key={t} className="tag">{t}</li>
      ))}
    </ul>
  )
}

export default Tags;
