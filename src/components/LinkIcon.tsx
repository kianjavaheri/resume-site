import React from 'react'

// Icons for the Selected Work link buttons. Inline rather than <img> from
// public/svgs/ (how the skill tiles do it) because these sit on a
// --textcolor-filled button and have to take their colour from it.
// GitHub and CurseForge marks are simple-icons paths (CC0).
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function LinkIcon({ kind }: { kind?: string }) {
  const common = { viewBox: '0 0 24 24', width: 20, height: 20, 'aria-hidden': true as const }

  switch (kind) {
    // Reading page on this site.
    case 'paper':
      return (
        <svg {...common} {...stroke}>
          <path d="M3 5.6s1.9-1.1 4.5-1.1S12 6 12 6v13s-1.9-1.5-4.5-1.5S3 18.6 3 18.6z" />
          <path d="M21 5.6s-1.9-1.1-4.5-1.1S12 6 12 6v13s1.9-1.5 4.5-1.5 4.5 1.1 4.5 1.1z" />
        </svg>
      )
    // PDF: poster or paper file.
    case 'pdf':
      return (
        <svg {...common} {...stroke}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13.5h6M9 17h4" />
        </svg>
      )
    // Library catalogue record.
    case 'library':
      return (
        <svg {...common} {...stroke}>
          <path d="M2.8 9.2 12 4l9.2 5.2" />
          <path d="M5 10.5V19M9.7 10.5V19M14.3 10.5V19M19 10.5V19" />
          <path d="M3 21h18" />
        </svg>
      )
    case 'github':
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      )
    case 'curseforge':
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.326 9.2145S23.2261 8.4418 24 6.1882h-7.5066V4.4H0l2.0318 2.3576V9.173s5.1267-.2665 7.1098 1.2372c2.7146 2.516-3.053 5.917-3.053 5.917L5.0995 19.6c1.5465-1.4726 4.494-3.3775 9.8983-3.2857-2.0565.65-4.1245 1.6651-5.7344 3.2857h10.9248l-1.0288-3.2726s-7.918-4.6688-.8336-7.1127z" />
        </svg>
      )
    // Anything unlabelled still gets the outbound arrow.
    default:
      return (
        <svg {...common} {...stroke}>
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      )
  }
}

export default LinkIcon;
