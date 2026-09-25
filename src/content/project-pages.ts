import type { Paper } from './papers'

// Hand-written project pages, for the work that has no source document to
// convert. They use the same `Paper` shape as the three generated papers, so
// `/papers/:slug` renders them with no special-casing — the reading page does
// not care where a Paper came from.
//
// These are STUBS on purpose: each one currently carries the blurb that used
// to sit on the project card, moved here when the cards stopped showing
// descriptions and started linking to a page instead. They are meant to grow.
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
  ],
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      blocks: [
        {
          type: 'p',
          text: 'Built a client-side Fabric mod for Minecraft 26.2 that tracks the materials needed for a build, and works on servers that don’t have it installed. Players import a material list by pasting text, loading a Litematica export, or dropping in a screenshot that Claude reads. Chests, barrels and shulker boxes marked as Material Boxes then count what’s already stored, color-code each slot by progress, and route shift-clicked items straight to the slots that still need them.',
        },
      ],
    },
  ],
}
