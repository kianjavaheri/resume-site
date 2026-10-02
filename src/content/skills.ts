// The skills grid's contents.
//
// Moved out of components/Proficiency.tsx for the reason the courses were: the
// grid and the command palette's search index both read this list, and two
// copies of twenty-eight skill names would drift.
//
// `src` is an SVG in public/svgs/. Skills without one fall back to the `abbr`
// monogram — drop a file in and add `src` here and it swaps over automatically.
//
// The groups are the render structure, not just ordering. A flat list ordered
// languages -> frameworks -> tools reflowed straight across those boundaries in
// the wrapping grid, so the ordering carried no signal at all.
export type Skill = { title: string; src?: string; abbr?: string; invertDark?: boolean }

// Annotated rather than inferred: without it each group's array gets its own
// narrow element type, and `s.invertDark` is an error in the groups that
// happen to have no inverted icon.
export const skillGroups: { label: string; skills: Skill[] }[] = [
  {
    label: 'Languages',
    skills: [
      { title: 'Java', src: '/svgs/java.svg' },
      { title: 'Python', src: '/svgs/python.svg' },
      { title: 'C++', src: '/svgs/cplusplus.svg' },
      { title: 'SQL', src: '/svgs/sql.svg' },
      { title: 'JavaScript', src: '/svgs/js.svg' },
      { title: 'HTML/CSS', src: '/svgs/html5.svg' },
      { title: 'R', src: '/svgs/r.svg' },
    ],
  },
  {
    // "& Libraries" because Pandas and JUnit are libraries, not frameworks.
    label: 'Frameworks & Libraries',
    skills: [
      { title: 'React', src: '/svgs/react.svg' },
      { title: 'Node.js', src: '/svgs/nodedotjs.svg' },
      { title: 'Flask', src: '/svgs/flask.svg', invertDark: true },
      { title: 'JUnit', src: '/svgs/junit5.svg' },
      { title: 'Pandas', src: '/svgs/pandas.svg' },
      { title: 'PyTorch', src: '/svgs/pytorch.svg' },
      // Took PySpark's slot. simple-icons has no LightGBM glyph either, so
      // this is the project's OWN mark, lifted out of the official wordmark
      // logo (microsoft/LightGBM, docs/logo/) -- the four colored triangles,
      // with the "LightGBM" text and its bounding rect dropped. That is why
      // its viewBox is 630x1048 rather than square: it is the mark's real
      // extent, and `object-fit: contain` letterboxes it in the tile.
      { title: 'LightGBM', src: '/svgs/lightgbm.svg' },
      { title: 'scikit-learn', src: '/svgs/scikitlearn.svg' },
      // The third non-simple-icons icon, after MATLAB and LightGBM: simple-
      // icons has no matplotlib glyph, so this is devicon's (MIT) -- the
      // project's own polar-histogram mark. Left exactly as supplied; it is
      // already square and needs no surgery, unlike LightGBM's wordmark.
      // { title: 'Matplotlib', src: '/svgs/matplotlib.svg' },
    ],
  },
  {
    label: 'Developer Tools',
    skills: [
      { title: 'Git', src: '/svgs/git.svg' },
      { title: 'GitHub', src: '/svgs/github.svg', invertDark: true },
      { title: 'Docker', src: '/svgs/docker.svg' },
      { title: 'PostgreSQL', src: '/svgs/postgresql.svg' },
      { title: 'Firebase', src: '/svgs/firebase.svg' },
      { title: 'Postman', src: '/svgs/postman.svg' },
      { title: 'Selenium', src: '/svgs/selenium.svg' },
    ],
  },
  {
    // Kept separate from Developer Tools deliberately: these are the tools
    // behind the econometrics and the thesis, and they are the clearest
    // evidence on the site that the Economics degree is a real second
    // credential. Qualtrics is a survey platform, not a dev tool.
    label: 'Data & Research',
    skills: [
      { title: 'JupyterHub', src: '/svgs/jupyter.svg' },
      // Promoted off the monogram fallback: simple-icons still has no MATLAB
      // glyph, so this one is devicon's (MIT), the only multi-color icon in
      // the set. It carries its own gradients, which is fine through <img>
      // where the ids stay scoped to the file.
      { title: 'MATLAB', src: '/svgs/matlab.svg' },
      { title: 'QGIS', src: '/svgs/qgis.svg' },
      { title: 'Stata', src: '/svgs/stata.svg' },
      { title: 'Qualtrics', src: '/svgs/qualtrics.svg' },
    ],
  },
]
