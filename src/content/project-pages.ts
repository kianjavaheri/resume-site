import type { Paper } from './papers'

// Hand-written project pages, for the work that has no source document to
// convert. They use the same `Paper` shape as the three generated papers, so
// `/projects/:slug` renders them with no special-casing — the reading page does
// not care where a Paper came from.
//
// They started as STUBS: each one carried the blurb that used to sit on the
// project card, moved here when the cards stopped showing descriptions and
// started linking to a page instead. They were meant to grow, and all three
// now have — see "The Material Boxes page" in CLAUDE.md for the one that went
// first and set the pattern the other two followed.
//
// Each of them dropped its card blurb as it grew, for the reason Material
// Boxes documents: the resume-voice sentence and the page's own opening said
// the same thing a few hundred pixels apart. The blurb survives on the card,
// which is the one place it belongs.
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
    { label: 'Model', value: 'LightGBM over a linear market trend' },
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
          text: 'A gradient-boosted model that prices studios and one-bedrooms in Santa Cruz and Monterey counties to 12.9% typical error, against 15.2% for a neighbourhood-median lookup. It runs entirely in the browser, with no backend.',
        },
        {
          type: 'p',
          text: 'Type an address or tap a pin on the map, and the app returns a monthly rent estimate for a studio or one-bedroom, an 80% range around it, and a breakdown of which inputs moved the number. The estimate is deliberately two numbers rather than one:',
        },
        {
          type: 'deflist',
          items: [
            {
              term: 'Typical',
              detail: 'What a typical unit of that size costs on the chosen date, read off a fitted trend line.',
            },
            {
              term: 'Versus typical',
              detail: 'How far this particular unit sits above or below that, which is what the trees predict.',
            },
          ],
        },
        {
          type: 'p',
          text: 'Time explains only 7.4% of the variation in rent here, so the second number is the part the model is actually doing. The interface never collapses the two into a single figure.',
        },
        {
          type: 'p',
          text: 'A date slider runs from 2020 to two years ahead and re-prices the same unit against the market on the chosen date. That is not a forecast: where the market sits on a future date comes from a fitted trend line, not from evidence.',
        },
      ],
    },
    {
      id: 'data',
      title: 'The data',
      blocks: [
        {
          type: 'p',
          text: 'Listings come from the RentCast API, which aggregates MLS and syndicated feeds. The raw pull is cached write-once, then filtered to the modelling slice, which runs from Feb 2020 to Sep 2026.',
        },
        {
          // The baseline row carries no feature count, and the cell is left
          // EMPTY rather than set to an em dash: isQuantityColumn drops blank
          // cells but not a dash, so a dash here would drag the whole column
          // ragged left while the two beside it stayed right-aligned.
          type: 'table',
          table: {
            title: 'The modelling slice',
            columns: ['Stage', 'Count'],
            rows: [
              ['Raw listing events', '11,283'],
              ['Studios and one-bedrooms, the two target counties', '3,038'],
              ['Distinct properties', '2,665'],
              ['Street blocks on the map', '1,455'],
            ],
          },
        },
        {
          type: 'p',
          text: 'The data is longitudinal, not a snapshot: the same unit reappears as it is re-listed, which is what makes the leakage traps below real.',
        },
        {
          type: 'p',
          text: 'Cleaning had to undo several source problems. Duplicate and churned re-listings are collapsed to one event each. squareFootage carried building-footprint values in places — 13,032 sqft on a one-bedroom — so it is capped by bedroom count. yearBuilt is 85% missing in this slice and lotSize 92%, so both are unusable. RentCast’s city is the mailing city and unreliable, so location comes from Census place polygons instead.',
        },
        {
          type: 'p',
          text: 'One constraint shapes what is published: the licence covers derivative works but not republishing the records. The model and aggregates derived from it are fine; addresses paired with rents are not. The block data the browser downloads is therefore coarsened — coordinates rounded to three decimal places, street numbers stripped.',
        },
      ],
    },
    {
      id: 'how-it-works',
      title: 'How it works',
      blocks: [
        { type: 'p', text: 'Two decisions carry most of the design.' },
        {
          type: 'p',
          text: 'Trees cannot extrapolate. Every test date lies past the end of the training range, and a gradient-boosted tree can only ever return a value it saw during training. So the model is a trend plus trees on the residual: a linear regression on months-since-2020 carries the date, and the trees learn only the deviation from it. Feeding the date to the trees as the sole time signal would silently flatline on any future date.',
        },
        {
          type: 'p',
          text: 'The split has two leakage traps, and they pull against each other. Splitting on a date (1 January 2026) is the honest test, since predicting the future from the past is the actual task. But the same building recurs across years, so a date split alone leaks: the model would memorise a complex from its 2024 listings and be scored on its 2026 ones. The fix is to group on rounded coordinates — latitude and longitude fingerprint a building more reliably than any id — and drop from train any building that also appears in test. That removed 228 buildings and brought the overlap to zero.',
        },
        {
          type: 'p',
          text: 'The 24 features are bedroom and bathroom counts, size, property type, geographic distances computed in EPSG:3310 (to the coastline, UCSC, CSUMB, Highway 17, the nearest town centre and Santa Cruz downtown), Census place and county, and tract-level demographics with Zillow ZORI rent indices. Three candidates are deliberately excluded: price_per_sqft and rent_vs_zip_zori are computed from price, and daysOnMarket is downstream of it.',
        },
        {
          type: 'p',
          text: 'The geographic reference points are hand-coded and validated against Census polygons by 33 automated checks, because a wrong coordinate corrupts a feature silently rather than loudly.',
        },
      ],
    },
    {
      id: 'accuracy',
      title: 'Accuracy',
      blocks: [
        {
          type: 'p',
          text: 'Trained on 1,765 listings from Feb 2020 to Dec 2025, tested on 783 from Jan to Sep 2026 — the following year, never a random sample.',
        },
        {
          type: 'table',
          table: {
            columns: ['Model', 'Features', 'MAPE', 'MAE'],
            rows: [
              ['Median by place × bedrooms (baseline)', '', '15.2%', '$367'],
              ['Ridge, all features', '24', '13.8%', '$311'],
              ['LightGBM, date as a feature', '24', '12.4%', '$292'],
              ['LightGBM + trend (analysis model)', '24', '12.6%', '$295'],
              ['LightGBM + trend (deployed in browser)', '18', '12.9%', '$297'],
            ],
          },
        },
        {
          type: 'p',
          text: 'Two rows deserve a note. The ridge benchmark matters because it establishes that the trees earned their place rather than being reached for first. And the plain LightGBM scores marginally better than the shipped model on this test window — but it has no mechanism for pricing a date beyond its training range, so the trend version is the one that ships.',
        },
        {
          type: 'p',
          text: 'The headline number hides a real spread. Error runs about 9% in Monterey and Salinas, where the data is thick, and 17% in unincorporated areas where it is thin. Any single figure quoted for this model should be read as the middle of a 9–17% range.',
        },
        {
          type: 'p',
          text: 'The ranges shown in the app are conformal prediction intervals, calibrated on 355 held-out listings rather than assumed: k = 0.211 in log space, or roughly a factor of 1.24 either way. Measured coverage is 81.2% against an 80% target, at a median width of $970. The deployed 18-feature model measures 79.6%.',
        },
      ],
    },
    {
      id: 'limits',
      title: 'What it cannot see',
      blocks: [
        {
          type: 'p',
          text: 'The app ships this list in its own interface, because a rent estimate without its limits invites more confidence than it has earned.',
        },
        {
          type: 'list',
          items: [
            'No amenities. The source carries no listing description, so views, renovations, furnishing, utilities, parking and laundry are all invisible. Two units identical on every field available here ranged from $1,600 to $6,500 in Pacific Grove.',
            'Extremes get pulled to the middle. Expensive units are under-predicted by roughly $500 in the top fifth, cheap ones over-predicted. The estimate is most trustworthy between $1,850 and $2,700.',
            'Accuracy varies by area, from about 9% error in Monterey and Salinas to 17% in unincorporated areas with less data.',
            'ADUs and cottages are under-represented. The feed draws on MLS and syndicated listings, which miss much of the informal studio and one-bedroom market in this region.',
            'Asking rent, not contract rent. Long-tenured below-market tenancies never appear in the data at all.',
            'Some coordinates are wrong at the source. The upstream geocoder misplaces a small number of addresses — 116 and 200 West Cliff Drive sit about half a mile inland in the data when both are on the water. Where a pin looks misplaced, the distance-to-ocean feature is wrong, and the estimate with it.',
            'It does not forecast the market. It prices a unit against the prevailing market. Where that market sits on a future date comes from a fitted trend line of +4.3% per year, not from evidence.',
          ],
        },
        {
          type: 'p',
          text: 'The first item is the main cause of the regression to the mean in the second: without descriptions, nothing distinguishes a renovated ocean-view studio from a dark one on the same block.',
        },
      ],
    },
    {
      id: 'browser',
      title: 'Running it in the browser',
      blocks: [
        {
          type: 'p',
          text: 'The app has no backend. The trained LightGBM trees are exported to JSON, and the tree evaluator, the feature assembly and the geographic maths are ported to JavaScript, so inference happens on the visitor’s machine.',
        },
        {
          type: 'p',
          text: 'Porting a model is only credible if the port is exact, so two harnesses check it on every change:',
        },
        {
          // The worst difference is 4.5e-13 dollars. Written out rather than in
          // scientific notation: the superscripts would be the first codepoints
          // on the site outside the font audit's range (see CLAUDE.md,
          // "Typography"), and the run of zeros makes the point better anyway.
          type: 'deflist',
          items: [
            {
              term: 'npm run verify',
              detail: 'Scores 300 listings through both implementations. The JavaScript is bit-identical to Python on all 300, at a worst difference of $0.00000000000045.',
            },
            {
              term: 'verify_features.mjs',
              detail: 'Rebuilds the feature row in the browser and compares it to the Python one, end to end, at $0.00 worst difference.',
            },
          ],
        },
        {
          type: 'p',
          text: 'The browser runs an 18-feature model at 12.9% error rather than the 24-feature one at 12.6%. The six omitted features are Census-tract and ZIP-level market averages that would need roughly 2 MB of extra polygon data to compute exactly in-browser, and they are worth 0.3 percentage points. Every feature that remains is computed exactly as it was during training.',
        },
        {
          type: 'table',
          table: {
            columns: ['Layer', 'Tools'],
            rows: [
              ['Model', 'LightGBM, scikit-learn'],
              ['Data', 'pandas, NumPy, Parquet'],
              ['Geospatial', 'GeoPandas, Shapely, proj4 (EPSG:3310)'],
              ['Web', 'React, Vite, Leaflet'],
              ['Hosting', 'Vercel, fully static'],
            ],
          },
        },
        {
          type: 'p',
          text: 'The map, the estimate panel and the controls are responsive down to 320px, and the published bundle carries only coarsened block data.',
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
