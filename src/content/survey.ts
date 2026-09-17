import { paperTables } from './tables'

// Every subgroup result behind the thesis's survey section, as data rather
// than as the twenty-three chart images the thesis prints.
//
// The thesis only publishes a slice of this: one to three charts per question,
// picked to make a point, out of ten questions x seven subgroups. Stacked as
// pictures they ran about 10,000px and you had to hunt for the comparison you
// wanted. Held as numbers, the whole grid is two clicks away — see
// components/SurveyExplorer.tsx.
//
// Kept here rather than in `thesis.ts` for the same reason as `tables.ts` and
// `charts.ts`: that module is generated from the PDF, so anything hand-written
// inside it is dropped by the next regeneration.
//
// TRANSCRIPTION IS VERIFIED, not typed and trusted. Two independent checks,
// both of which pass:
//   1. Every stated percentage recomputes from its own counts. 294 cells
//      (9 closed questions x 7 subgroups x their options).
//   2. 63 further cells cross-check against Tables 3 and 4, which are in
//      `tables.ts` from a different pass over the PDF: 42 headline shares
//      (Q7/Q8/Q9's correct-answer rates, Q10's awareness rate, Q11's and
//      Q15's) and 21 weighted means (Q12/Q13/Q14 across all seven subgroups,
//      mean = sum(count_i x (5 - i)) / n, the scale in Table 4's notes).
//      All 21 means match exactly; 39 of the 42 shares match.
// The 3 expected divergences are all Table 3's "Q10: Price Increase Awareness"
// (Full Sample, Male, Female), where the thesis adds its own two rounded
// percentages (42.9 + 54.8 = 97.7) instead of recomputing from counts
// (82/84 = 97.6). Its arithmetic, kept.

export interface SurveyQuestion {
  id: string
  number: number
  // The thesis's own heading for the question.
  heading: string
  // Two or three words for the question picker.
  short: string
  prompt: string
  options: string[]
  // Responses per option, in `options` order, keyed by slice id. Absent on the
  // open-ended question, which reports percentages only.
  counts?: Record<string, number[]>
  pct: Record<string, number[]>
  // Slices this question's own table labels differently from the site's.
  sliceLabels?: Record<string, string>
  note?: string
}

// The seven subgroups the thesis reports, in its own order.
export const surveySlices: { id: string; label: string }[] = [
  { id: 'full', label: 'Full Sample' },
  { id: 'econYes', label: 'Econ Yes' },
  { id: 'econNo', label: 'Econ No' },
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'age1824', label: 'Age 18-24' },
  { id: 'age25', label: 'Age 25+' },
]

// The explorer is built around these rather than around the seven slices,
// because a subgroup on its own answers nothing — the thesis's argument is
// always a contrast, "Econ Yes against Econ No". Picking the dimension puts
// both halves of it on the same chart, which is also what keeps the series
// count at two: the site's validated categorical palette has exactly two slots.
export const surveyDimensions: { id: string; label: string; slices: string[] }[] = [
  { id: 'overall', label: 'Overall', slices: ['full'] },
  { id: 'econ', label: 'Economics coursework', slices: ['econYes', 'econNo'] },
  { id: 'gender', label: 'Gender', slices: ['male', 'female'] },
  { id: 'age', label: 'Age', slices: ['age1824', 'age25'] },
]

const closed: SurveyQuestion[] = [
  {
    id: 'q7',
    number: 7,
    heading: 'Question 7 (Closed-ended)',
    short: 'Trade balance',
    prompt:
      'As far as you know, does the U.S. currently import more goods and services than it exports (a trade deficit) or export more than it imports (a trade surplus)?',
    options: [
      'Trade Deficit (Import more)',
      'Trade Surplus (Export more)',
      'Balanced Trade (Imports and exports are even)',
      'I don\'t know',
    ],
    counts: {
      full: [69, 2, 4, 9],
      econYes: [52, 2, 4, 7],
      econNo: [17, 0, 0, 2],
      male: [43, 0, 1, 3],
      female: [24, 2, 3, 6],
      age1824: [50, 2, 3, 9],
      age25: [19, 0, 1, 0],
    },
    pct: {
      full: [82.1, 2.4, 4.8, 10.7],
      econYes: [80.0, 3.1, 6.2, 10.8],
      econNo: [89.5, 0.0, 0.0, 10.5],
      male: [91.5, 0.0, 2.1, 6.4],
      female: [68.6, 5.7, 8.6, 17.1],
      age1824: [78.1, 3.1, 4.7, 14.1],
      age25: [95.0, 0.0, 5.0, 0.0],
    },
  },
  {
    id: 'q8',
    number: 8,
    heading: 'Question 8 (Closed-ended)',
    short: 'Imports from China',
    prompt:
      'Which of the following goods do you believe the United States primarily imports from China?',
    options: [
      'Commercial Aircraft',
      'Crude Oil and Natural Gas',
      'Smartphones and Laptops',
      'Softwood Lumber',
    ],
    counts: {
      full: [5, 3, 71, 3],
      econYes: [2, 1, 58, 2],
      econNo: [3, 2, 13, 1],
      male: [2, 0, 40, 3],
      female: [3, 3, 29, 0],
      age1824: [5, 2, 53, 3],
      age25: [0, 1, 18, 0],
    },
    pct: {
      full: [6.1, 3.7, 86.6, 3.7],
      econYes: [3.2, 1.6, 92.1, 3.2],
      econNo: [15.8, 10.5, 68.4, 5.3],
      male: [4.4, 0.0, 88.9, 6.7],
      female: [8.6, 8.6, 82.9, 0.0],
      age1824: [7.9, 3.2, 84.1, 4.8],
      age25: [0.0, 5.3, 94.7, 0.0],
    },
  },
  {
    id: 'q9',
    number: 9,
    heading: 'Question 9 (Closed-ended)',
    short: 'EV tariff rate',
    prompt:
      'How much of an import tax (tariff) does the U.S. currently place on Chinese-made electric vehicles?',
    options: [
      '0% (No tax)',
      '25%',
      '50%',
      '100%',
      'I don\'t know',
    ],
    counts: {
      full: [2, 25, 6, 20, 31],
      econYes: [2, 20, 6, 12, 25],
      econNo: [0, 5, 0, 8, 6],
      male: [0, 12, 4, 12, 19],
      female: [1, 13, 2, 7, 12],
      age1824: [2, 22, 4, 15, 21],
      age25: [0, 3, 2, 5, 10],
    },
    pct: {
      full: [2.4, 29.8, 7.1, 23.8, 36.9],
      econYes: [3.1, 30.8, 9.2, 18.5, 38.5],
      econNo: [0.0, 26.3, 0.0, 42.1, 31.6],
      male: [0.0, 25.5, 8.5, 25.5, 40.4],
      female: [2.9, 37.1, 5.7, 20.0, 34.3],
      age1824: [3.1, 34.4, 6.2, 23.4, 32.8],
      age25: [0.0, 15.0, 10.0, 25.0, 50.0],
    },
  },
  {
    id: 'q10',
    number: 10,
    heading: 'Question 10 (Closed-ended)',
    short: 'Everyday costs',
    prompt:
      'Based on what you have heard or experienced, how do you believe monthly costs for "everyday goods" (e.g., groceries, electronics) have changed for the average American over the past year?',
    options: [
      'Increased significantly',
      'Increased slightly',
      'Stayed about the same',
      'Decreased slightly',
      'Decreased significantly',
    ],
    counts: {
      full: [36, 46, 1, 0, 1],
      econYes: [27, 36, 1, 0, 1],
      econNo: [9, 10, 0, 0, 0],
      male: [16, 30, 0, 0, 1],
      female: [19, 15, 1, 0, 0],
      age1824: [30, 32, 1, 0, 1],
      age25: [6, 14, 0, 0, 0],
    },
    pct: {
      full: [42.9, 54.8, 1.2, 0.0, 1.2],
      econYes: [41.5, 55.4, 1.5, 0.0, 1.5],
      econNo: [47.4, 52.6, 0.0, 0.0, 0.0],
      male: [34.0, 63.8, 0.0, 0.0, 2.1],
      female: [54.3, 42.9, 2.9, 0.0, 0.0],
      age1824: [46.9, 50.0, 1.6, 0.0, 1.6],
      age25: [30.0, 70.0, 0.0, 0.0, 0.0],
    },
  },
  {
    id: 'q11',
    number: 11,
    heading: 'Question 11 (Closed-ended)',
    short: 'Tariff calculation',
    prompt:
      'Imagine a crate of apples is imported from another country. Currently, there is a 0% import tax (tariff) on these apples, and they cost $100. If the government decided to implement a 10% tariff on these imports, what do you believe the new price of that crate of apples would be for a consumer in the United States?',
    options: [
      '$90',
      '$100',
      '$110',
      '$150',
    ],
    counts: {
      full: [3, 0, 68, 4],
      econYes: [2, 0, 53, 2],
      econNo: [1, 0, 15, 2],
      male: [2, 0, 37, 2],
      female: [1, 0, 29, 2],
      age1824: [3, 0, 50, 4],
      age25: [0, 0, 18, 0],
    },
    pct: {
      full: [4.0, 0.0, 90.7, 5.3],
      econYes: [3.5, 0.0, 93.0, 3.5],
      econNo: [5.6, 0.0, 83.3, 11.1],
      male: [4.9, 0.0, 90.2, 4.9],
      female: [3.1, 0.0, 90.6, 6.2],
      age1824: [5.3, 0.0, 87.7, 7.0],
      age25: [0.0, 0.0, 100.0, 0.0],
    },
  },
  {
    id: 'q12',
    number: 12,
    heading: 'Question 12 (Closed-ended)',
    short: 'View of trade',
    prompt:
      'Generally speaking, do you believe international trade is a "good thing" or a "bad thing" for the U.S. economy?',
    options: [
      'Very good thing',
      'Somewhat good thing',
      'Neither good nor bad',
      'Somewhat bad thing',
      'Very bad thing',
    ],
    counts: {
      full: [54, 19, 2, 2, 0],
      econYes: [45, 11, 2, 1, 0],
      econNo: [9, 8, 0, 1, 0],
      male: [31, 9, 2, 1, 0],
      female: [21, 10, 0, 1, 0],
      age1824: [39, 16, 1, 2, 0],
      age25: [15, 3, 1, 0, 0],
    },
    pct: {
      full: [70.1, 24.7, 2.6, 2.6, 0.0],
      econYes: [76.3, 18.6, 3.4, 1.7, 0.0],
      econNo: [50.0, 44.4, 0.0, 5.6, 0.0],
      male: [72.1, 20.9, 4.7, 2.3, 0.0],
      female: [65.6, 31.2, 0.0, 3.1, 0.0],
      age1824: [67.2, 27.6, 1.7, 3.4, 0.0],
      age25: [78.9, 15.8, 5.3, 0.0, 0.0],
    },
  },
  {
    id: 'q13',
    number: 13,
    heading: 'Question 13 (Closed-ended)',
    short: 'View of deficits',
    prompt:
      'When the United States has a "trade deficit" (it buys more goods from other countries than it sells to them), do you believe this is generally a good thing or a bad thing for the American economy?',
    options: [
      'Very good thing',
      'Somewhat good thing',
      'Neither good nor bad',
      'Somewhat bad thing',
      'Very bad thing',
    ],
    // The thesis's table for this question names the second age slice
    // differently from the others'. Kept as printed.
    sliceLabels: { age25: 'Age Other' },
    counts: {
      full: [4, 12, 29, 27, 3],
      econYes: [4, 10, 20, 21, 2],
      econNo: [0, 2, 9, 6, 1],
      male: [4, 6, 17, 12, 2],
      female: [0, 4, 12, 15, 1],
      age1824: [2, 8, 20, 25, 2],
      age25: [2, 4, 9, 2, 1],
    },
    pct: {
      full: [5.3, 16.0, 38.7, 36.0, 4.0],
      econYes: [7.0, 17.5, 35.1, 36.8, 3.5],
      econNo: [0.0, 11.1, 50.0, 33.3, 5.6],
      male: [9.8, 14.6, 41.5, 29.3, 4.9],
      female: [0.0, 12.5, 37.5, 46.9, 3.1],
      age1824: [3.5, 14.0, 35.1, 43.9, 3.5],
      age25: [11.1, 22.2, 50.0, 11.1, 5.6],
    },
  },
  {
    id: 'q14',
    number: 14,
    heading: 'Question 14 (Closed-ended)',
    short: 'Tariff effectiveness',
    prompt:
      'How effective do you believe using tariffs (import taxes) is as a tool to protect American jobs?',
    options: [
      'Very effective',
      'Somewhat effective',
      'Neither effective nor ineffective',
      'Somewhat ineffective',
      'Not effective at all',
    ],
    // The thesis's table for this question names the second age slice
    // differently from the others'. Kept as printed.
    sliceLabels: { age25: 'Age Other' },
    counts: {
      full: [1, 17, 11, 25, 23],
      econYes: [1, 14, 9, 16, 19],
      econNo: [0, 3, 2, 9, 4],
      male: [0, 8, 7, 15, 13],
      female: [1, 8, 3, 10, 10],
      age1824: [1, 13, 10, 17, 17],
      age25: [0, 4, 1, 8, 6],
    },
    pct: {
      full: [1.3, 22.1, 14.3, 32.5, 29.9],
      econYes: [1.7, 23.7, 15.3, 27.1, 32.2],
      econNo: [0.0, 16.7, 11.1, 50.0, 22.2],
      male: [0.0, 18.6, 16.3, 34.9, 30.2],
      female: [3.1, 25.0, 9.4, 31.2, 31.2],
      age1824: [1.7, 22.4, 17.2, 29.3, 29.3],
      age25: [0.0, 21.1, 5.3, 42.1, 31.6],
    },
  },
  {
    id: 'q15',
    number: 15,
    heading: 'Question 15 (Closed-ended)',
    short: 'Who pays',
    prompt:
      'Who do you believe primarily pays for the cost of U.S. tariffs on Chinese goods?',
    options: [
      'Chinese companies/exporters',
      'The Chinese government',
      'U.S. companies/importers',
      'U.S. consumers',
      'I don\'t know',
    ],
    counts: {
      full: [4, 0, 10, 62, 1],
      econYes: [4, 0, 7, 48, 0],
      econNo: [0, 0, 3, 14, 1],
      male: [1, 0, 6, 36, 0],
      female: [3, 0, 4, 24, 1],
      age1824: [2, 0, 9, 46, 1],
      age25: [2, 0, 1, 16, 0],
    },
    pct: {
      full: [5.2, 0.0, 13.0, 80.5, 1.3],
      econYes: [6.8, 0.0, 11.9, 81.4, 0.0],
      econNo: [0.0, 0.0, 16.7, 77.8, 5.6],
      male: [2.3, 0.0, 14.0, 83.7, 0.0],
      female: [9.4, 0.0, 12.5, 75.0, 3.1],
      age1824: [3.4, 0.0, 15.5, 79.3, 1.7],
      age25: [10.5, 0.0, 5.3, 84.2, 0.0],
    },
  },
]

// Question 16's numbers are already in the repo, as Table 5 in `tables.ts`, so
// they are read from there instead of transcribed a second time — the same
// rule the Background charts follow with Tables 1 and 2. One source means the
// chart and the table printed in the same paper cannot drift apart.
//
// Its rows are in `surveySlices` order and its columns are the six themes,
// with the "(%)" suffix trimmed off for use as option labels.
const TABLE_Q16 = '/pdfs/thesis/table4.png'

function openEnded(): SurveyQuestion {
  const t = paperTables[TABLE_Q16]
  if (!t) throw new Error(`no table for ${TABLE_Q16}`)
  const pct: Record<string, number[]> = {}
  surveySlices.forEach((s, i) => {
    pct[s.id] = t.rows[i].slice(1).map((c) => parseFloat(c))
  })
  return {
    id: 'q16',
    number: 16,
    heading: 'Question 16 (Open-ended)',
    short: 'Why',
    prompt: 'Why do you feel this way, or what has influenced your opinion on trade policy?',
    options: t.columns.slice(1).map((c) => c.replace(/\s*\(%\)$/, '')),
    sliceLabels: { age25: 'Age Other' },
    pct,
    // Free-text answers, coded into themes after the fact, and one answer can
    // carry more than one. So these are shares of respondents, not shares of
    // answers, and they do not add to 100%.
    note: 'Open-ended answers coded into themes. One answer can carry several, so these do not sum to 100%.',
  }
}

export const surveyQuestions: SurveyQuestion[] = [...closed, openEnded()]
