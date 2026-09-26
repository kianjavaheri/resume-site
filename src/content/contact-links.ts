// Kian's three public contacts, in one place because two components draw them:
// the Contact section's cards and the row of icons at the foot of About.
//
// `icon` names come from LinkIcon's set, the same one the Projects cards draw
// from. The email entry replaced a YouTube one.
export interface ContactLink {
  label: string
  href: string
  icon: string
}

export const contactLinks: ContactLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kian-javaheri-abb134227/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/kianjavaheri', icon: 'github' },
  { label: 'Email', href: 'mailto:kianjavaheri911@gmail.com', icon: 'mail' },
]

// A mail client is not a browsing context, so a mailto: link is rendered
// WITHOUT target="_blank"/rel — saying it opens a tab would mislead assistive
// tech. Both consumers branch on the href rather than carrying a flag, so a
// future mail link gets this for free.
export const isMailto = (href: string) => href.startsWith('mailto:')
