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
    { label: 'Data', value: 'Baby\u2019s First Years RCT (ICPSR 37871)' },
    { label: 'Sample', value: '160 mothers at the Year-1 follow-up' },
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
          text: 'Baby\u2019s First Years is a randomized controlled trial that paid 1,000 low-income U.S. mothers an unconditional monthly cash transfer from the birth of their child \u2014 $333 a month in the high-cash arm against $20 in the low-cash arm. This project is a secondary analysis of that trial, asking something the study was not built around: a year later, what had the money done to the mothers\u2019 own hourly wages?',
        },
        {
          type: 'p',
          text: 'The estimate comes from Double Machine Learning \u2014 LinearDML for a single average treatment effect, CausalForestDML for per-mother effects. Because the transfer was assigned at random, identification comes from the trial\u2019s design rather than from the model. The baseline covariates go into the nuisance models to absorb residual variance and sharpen the interval, not to buy an assumption the data cannot support.',
        },
        {
          // Six figures from the repo, padded to one ratio so the frame
          // letterboxes none of them. Labels are written for the page; the
          // figures carry their own titles, so these say what each one is FOR.
          //
          // The project card's cover art briefly opened this section as well.
          // It came out: it is a dressed-up figure 6, which is the last slide
          // here, so the page led with the same chart it ended on.
          type: 'carousel',
          figures: [
            {
              src: '/images/wage-effects/fig1-sample-funnel.209c663a.webp',
              width: 1400,
              height: 847,
              label: 'From 1,000 mothers randomized to the 160 the wage estimate rests on',
            },
            {
              src: '/images/wage-effects/fig2-response-rates.39142104.webp',
              width: 1400,
              height: 847,
              label: 'Who answered the earnings question, by arm \u2014 the non-response problem',
            },
            {
              src: '/images/wage-effects/fig3-wage-distribution.59ab104b.webp',
              width: 1400,
              height: 847,
              label: 'Hourly wages in each arm, with the response-weighted means',
            },
            {
              src: '/images/wage-effects/fig4-employment-rate.4278f5f4.webp',
              width: 1400,
              height: 847,
              label: 'The extensive-margin check: employment is flat between arms',
            },
            {
              src: '/images/wage-effects/fig5-ate-comparison.9e2acd68.webp',
              width: 1400,
              height: 847,
              label: 'Both estimators agree on the point, and both intervals cross zero',
            },
            {
              src: '/images/wage-effects/fig6-cate-distribution.dadc475c.webp',
              width: 1400,
              height: 847,
              label: 'The spread of per-mother effects behind that single average',
            },
          ],
        },
      ],
    },
    {
      id: 'design',
      title: 'Research design',
      blocks: [
        {
          type: 'p',
          text: 'The treatment is the trial\u2019s own arm assignment, randomized at baseline. The outcome is the log of each mother\u2019s hourly wage at the Year-1 follow-up, built from her prior-year earned income and her current weekly hours. Eight baseline covariates \u2014 age, race, education, relationship status, household income, adults and children in the household, and study site \u2014 enter the nuisance models; every one of them is measured before the transfers begin, so none is a post-treatment variable.',
        },
        {
          type: 'p',
          text: 'The wage sample is restricted to mothers with positive Year-1 earnings, weekly hours between 10 and 80, and an implied hourly wage between $7.25 and $250. That leaves 160 of the 1,000 randomized \u2014 66 in the high-cash arm and 94 in the low-cash arm. The first figure traces where the other 840 go, and most of the attrition is the wage floor rather than the trial.',
        },
      ],
    },
    {
      id: 'method',
      title: 'Method',
      blocks: [
        {
          type: 'p',
          text: 'Double Machine Learning partials the covariates out of the outcome and the treatment separately, through two Neyman-orthogonal nuisance models, and estimates the causal coefficient from what is left. Cross-fitting \u2014 splitting the sample between fitting the nuisance models and estimating the effect \u2014 keeps the estimate from inheriting their overfitting.',
        },
        {
          type: 'p',
          text: 'Because the treatment is a binary arm rather than a dollar amount, the treatment nuisance model is a gradient-boosted classifier predicting a propensity score, and the outcome model is a gradient-boosted regressor. Both the raw coefficient on log wage and the percentage impact it implies are reported. And because the treatment is an assignment rather than a continuous grant, there is no marginal-dollar slope to rescale to a hypothetical policy: the number is the effect of being put in the high-cash arm, full stop.',
        },
      ],
    },
    {
      id: 'results',
      title: 'Results',
      blocks: [
        {
          type: 'deflist',
          items: [
            {
              term: 'Average treatment effect (LinearDML)',
              detail: '+14.7% on hourly wage. 95% CI \u22120.5% to +32.3%.',
            },
            {
              term: 'Average of per-mother effects (CausalForestDML)',
              detail: '+14.9%. 95% CI \u22124.5% to +38.1%. Two different estimators landing a fifth of a point apart.',
            },
            {
              term: 'Spread across the 160 mothers',
              detail: 'Mean 15.0%, median 15.0%, standard deviation 5.3 points, range 3.7% to 28.3%. Every individual estimate is positive.',
            },
            {
              term: 'Effect on employment',
              detail: '\u22122.1 percentage points. 95% CI \u22128.2 to +4.0 \u2014 no sign that the cash moved anyone into or out of work.',
            },
          ],
        },
        {
          type: 'p',
          text: 'The honest reading is that the point estimate is large and the interval is not. A 14.7% wage gain would be a substantial result for an unconditional transfer, and both estimators find it independently \u2014 but with 160 mothers the confidence interval runs from roughly zero to roughly a third, and it includes zero. The per-mother spread is worth the same caution: all 160 estimates being positive is suggestive of a real effect rather than proof of one, and the spread is evidence that the effect varies, not a prediction for any individual mother.',
        },
      ],
    },
    {
      id: 'validity',
      title: 'What the estimate has to survive',
      blocks: [
        {
          type: 'p',
          text: 'Three threats sit between the trial and the number, and the work of the project is mostly in handling them rather than in fitting the model.',
        },
        {
          type: 'h3',
          text: 'The wage variable is built from two mismatched windows',
        },
        {
          type: 'p',
          text: 'Earnings are reported for the whole prior calendar year; hours are reported for the week of the interview. Those agree only for a mother who worked the same hours all year \u2014 a poor assumption for a population surveyed within a year of giving birth, many of whom spent part of that window on unpaid leave. The data shows it: the median implied wage falls from about $18 an hour among mothers working under 10 hours a week to about $5 at 40 or more, the opposite of what a simple low-hours-inflates-the-rate story would produce, and consistent with return-to-work timing understating the rate for mothers who went back later. There is no weeks-worked field in the extract to correct it directly, so the wage bounds absorb the noise rather than remove it \u2014 the $7.25 floor alone drops roughly half of otherwise-employed respondents. The filters do at least exclude employed mothers at near-identical rates in both arms, so they are not a second source of differential selection.',
        },
        {
          type: 'h3',
          text: 'Mothers did not answer at the same rate in both arms',
        },
        {
          type: 'p',
          text: 'The Year-1 earnings question is missing for 9.8% of the low-cash arm against 4.3% of the high-cash arm \u2014 a real gap, not noise. The hours question has its own separate non-response on top of that, missing for about a fifth of the mothers who did answer about earnings. Randomization cannot help here: this is a hole in the sample, upstream of anything the estimator does. The correction is inverse-probability weighting on two response models rather than one \u2014 a mother\u2019s probability of answering the earnings question, and her probability of answering earnings and hours \u2014 so each estimate is weighted for the response event that actually determines its own sample. Weighting both channels moved the average effect from +13.9% to +14.7%, and moved the interval from barely excluding zero to barely including it. That is what an honest correction looks like: it changed the answer slightly and cost precision rather than buying it.',
        },
        {
          type: 'h3',
          text: 'Restricting to employed mothers conditions on an outcome',
        },
        {
          type: 'p',
          text: 'If the cash changed who was working, a wage estimate drawn from workers only would be selected. Estimating the treatment\u2019s effect on employment directly finds nothing: about 69% in both arms, and an effect of \u22122.1 percentage points with an interval comfortably spanning zero. So there is no visible extensive-margin selection here \u2014 but the wage effect should still be read as conditional on employment, not as an effect on the whole randomized population.',
        },
      ],
    },
    {
      id: 'history',
      title: 'Why a trial, and not survey data',
      blocks: [
        {
          type: 'p',
          text: 'The project started somewhere else: the same question asked of observational CPS microdata, estimating the effect of unearned income on future wages across 80,412 people. That version produced a positive, comfortably significant coefficient \u2014 and it was wrong. CPS collects no measure of net worth, so wealthier households look like households with more unearned income, and the estimate absorbed the difference. Flexible nuisance models do not fix that. DML can only orthogonalize against the confounders it is given, and the one that mattered was never in the file.',
        },
        {
          type: 'p',
          text: 'Moving to a randomized trial fixes it at the design stage rather than in the model: random assignment makes the treatment independent of every confounder, including the unobserved ones, by construction. The cost is sample size \u2014 80,412 rows became 160 \u2014 which is the trade the wide confidence interval above represents. A precise answer to a biased question was worth less than an imprecise answer to an identified one.',
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
