import type { Paper } from './papers'

// Hand-written project pages, for the work that has no source document to
// convert. They use the same `Paper` shape as the three generated papers, so
// `/papers/:slug` renders them with no special-casing — the reading page does
// not care where a Paper came from.
//
// They started as STUBS: each one carried the blurb that used to sit on the
// project card, moved here when the cards stopped showing descriptions and
// started linking to a page instead. They were meant to grow, and material-
// boxes has — see "The Material Boxes page" in CLAUDE.md. The other two are
// still the blurb alone.
//
// Unlike basic-income.ts / thesis.ts / cs-capstone.ts, nothing generates these,
// so editing them by hand is the correct thing to do.

export const wageEffects: Paper = {
  slug: 'wage-effects',
  eyebrow: 'Independent Research',
  title: 'Estimating the Wage Effects of a Universal Basic Income',
  meta: [
    { label: 'Method', value: 'Double Machine Learning' },
    { label: 'Data', value: 'CPS ASEC microdata' },
    { label: 'Status', value: 'In progress' },
  ],
  actions: [
    { label: 'View GitHub', href: 'https://github.com/kianjavaheri/welfare-model' },
  ],
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      blocks: [
        {
          type: 'p',
          text: 'Applied Double Machine Learning (LinearDML and CausalForestDML) to longitudinal CPS ASEC microdata to estimate the causal effect of unconditional cash transfers on future labor income, then used the model to simulate the predicted wage impact of a $6,000/year UBI program. Used XGBoost within the DoubleML framework to control for nonlinear confounding across demographic and socioeconomic variables.',
        },
      ],
    },
  ],
}

export const rentalPrices: Paper = {
  slug: 'rental-prices',
  eyebrow: 'Personal Project',
  title: 'Santa Cruz Rental Price Model',
  meta: [
    { label: 'Coverage', value: 'Santa Cruz and Monterey counties' },
    { label: 'Model', value: 'LightGBM, with a Ridge baseline' },
    { label: 'Deployment', value: 'Static web app, scored client-side' },
  ],
  actions: [
    { label: 'View Live Site', href: 'https://rental-prices.vercel.app/' },
    { label: 'View GitHub', href: 'https://github.com/kianjavaheri/rental-prices' },
  ],
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      blocks: [
        {
          type: 'p',
          text: 'Built an end-to-end rent prediction model for studios and one-bedrooms in Santa Cruz and Monterey counties, from a RentCast data pipeline through geographic feature engineering to a gradient-boosted model with calibrated prediction intervals. Deployed it as a static web app that reruns the model client-side in JavaScript, so anyone can type an address and get a price with an honest uncertainty range.',
        },
      ],
    },
  ],
}

export const materialBoxes: Paper = {
  slug: 'material-boxes',
  eyebrow: 'Personal Project',
  title: 'Material Boxes',
  meta: [
    { label: 'Platform', value: 'Minecraft 26.2, Fabric' },
    { label: 'Version', value: '1.1.0' },
    { label: 'Status', value: 'In progress' },
  ],
  actions: [
    { label: 'View CurseForge', href: 'https://www.curseforge.com/minecraft/mc-mods/material-boxes' },
    { label: 'View GitHub', href: 'https://github.com/kianjavaheri/material-boxes' },
    { label: 'View Documentation', href: 'https://github.com/kianjavaheri/material-boxes/tree/main/docs' },
  ],
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      blocks: [
        // The mod's own documentation opens the page. The card blurb that used
        // to sit here said the same thing in resume voice, two paragraphs
        // above this one — Kian cut it rather than print both.
        {
          type: 'p',
          text: 'Material Boxes is a client-side Fabric mod for Minecraft 26.2 that makes gathering materials for a build easier. You load your build\u2019s material list, mark storage containers as Material Boxes, and the mod shows you what\u2019s still missing: which slots to fill, how much is stored, and what you still need to collect.',
        },
        {
          type: 'p',
          text: 'It\u2019s client-only, so it works on servers that don\u2019t have it installed.',
        },
        {
          type: 'figure',
          src: '/images/material-boxes/curseforge.002f3c6b.webp',
          width: 2000,
          height: 1269,
          caption: 'The mod\u2019s page on CurseForge',
          // Dark screenshot: no white plate, or the page draws a ring round it.
          plain: true,
          alt: 'The CurseForge listing for Material Boxes: the title and author, a gallery screenshot of a chest with red material slots, and a details panel listing the MIT license, the Fabric loader and Minecraft 26.2 and 26.3.',
        },
        {
          // Seven screenshots, all 854x480, so the frame letterboxes none of
          // them. The labels are written for the page — the screenshots have
          // no captions of their own.
          type: 'carousel',
          plain: true,
          figures: [
            {
              src: '/images/material-boxes/new-box.279e5332.webp',
              width: 854,
              height: 480,
              label: 'A new box: red slots are what the build still needs',
            },
            {
              src: '/images/material-boxes/slot-tooltip.8bae80e7.webp',
              width: 854,
              height: 480,
              label: 'Hovering a slot shows its count and the total across every box',
            },
            {
              src: '/images/material-boxes/nearly-complete.10e38921.webp',
              width: 854,
              height: 480,
              label: 'Green slots are finished, yellow is partly filled',
            },
            {
              src: '/images/material-boxes/shulker-preview.4cb8cfdb.webp',
              width: 854,
              height: 480,
              label: 'A shulker box\u2019s contents, previewed from the inventory',
            },
            {
              src: '/images/material-boxes/second-list.8c4e0a6c.webp',
              width: 854,
              height: 480,
              label: 'Three of four slots done; the red one is still short',
            },
            {
              src: '/images/material-boxes/deposit-all.e0c68389.webp',
              width: 854,
              height: 480,
              label: 'Deposit All moves everything the boxes still need, in one click',
            },
            {
              src: '/images/material-boxes/materials-list.280ec990.webp',
              width: 854,
              height: 480,
              label: 'The Materials List screen, with search, sort and Copy',
            },
          ],
        },
      ],
    },
    {
      id: 'quick-start',
      title: 'Quick start',
      blocks: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Press B, or type /materials, to open the Materials List.',
            'Paste your list into the import panel on the left \u2014 \u201c64 stone\u201d, \u201c3 stacks oak planks\u201d \u2014 or click Litematica to load a Litematica material list export. Then click Replace.',
            'Open a chest and click + Material Box. Red slots show what goes there.',
            'Fill the red slots. Shift-click items in from your inventory, or click Deposit All.',
            'Watch the missing materials HUD in the top-left corner while you gather. Press H to hide or show it.',
          ],
        },
      ],
    },
    {
      id: 'features',
      title: 'Features',
      blocks: [
        {
          type: 'deflist',
          items: [
            {
              term: 'Importing a material list',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/importing-lists.md',
              detail: 'Pasting text, Litematica exports, screenshots read by Claude, Replace vs Add, saved replacements.',
            },
            {
              term: 'Material Boxes',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/material-boxes.md',
              detail: 'Marking containers, red/yellow/green slots, hover tooltips, shift-click and Deposit All, shulker contents, breaking and moving boxes, the Boxes screen.',
            },
            {
              term: 'The Materials List screen',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/materials-list.md',
              detail: 'Progress, search and sort, replacing items, changing amounts, Copy, Clear, the import panel.',
            },
            {
              term: 'Saved lists',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/saved-lists.md',
              detail: 'Saving, loading, renaming and deleting lists, replacements, and each list\u2019s own Material Boxes.',
            },
            {
              term: 'Missing materials HUD',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/hud.md',
              detail: 'The on-screen checklist.',
            },
            {
              term: 'Shulker box preview',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/shulker-preview.md',
              detail: 'Looking inside shulker boxes in your inventory.',
            },
            {
              term: 'Settings, controls and files',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/settings-and-controls.md',
              detail: 'Key bindings, commands, the settings screen, where data is saved.',
            },
            {
              term: 'Compatibility and limitations',
              href: 'https://github.com/kianjavaheri/material-boxes/blob/main/docs/compatibility.md',
              detail: 'Requirements, tested mods, known limitations, troubleshooting.',
            },
          ],
        },
      ],
    },
  ],
}
