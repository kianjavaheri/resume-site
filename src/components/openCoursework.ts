// The nav's Education dropdown asks the Education section to open one of its
// coursework blocks and scroll to it. An event rather than lifted state, for
// the same reason as openPalette.ts: there is one thing to say ("open this
// one") and the two components otherwise share nothing. Kept out of
// Education.tsx so that module stays Fast Refresh-able.
export const COURSEWORK_EVENT = 'kj:coursework'

export type CourseworkId = 'cs' | 'econ'

export const openCoursework = (id: CourseworkId) =>
  window.dispatchEvent(new CustomEvent<CourseworkId>(COURSEWORK_EVENT, { detail: id }))
