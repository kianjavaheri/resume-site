import type { Block, PaperTable } from './papers'

// Tables rebuilt as real markup, replacing the cropped PNGs that stood in for
// them. Keyed by the image `src` in the generated paper module: at render time
// a figure whose src appears here draws the table instead of the picture.
//
// Keyed this way, and kept in this file rather than in `thesis.ts`, because
// that module is generated from the PDF — see CLAUDE.md, "Paper pages". The
// PNGs stay on disk and stay referenced by the generated content; only the
// rendering changes.
//
// Transcribed from `pdftotext -layout public/pdfs/thesis/thesis.pdf`, not from
// the images. Several crops cut their table off early — Table 2 after 2021,
// Table 5 before its last row — and the remainder was extracted as loose
// paragraphs that the page then printed as running text next to the picture.
// So this content was never missing, it was orphaned. Rebuilding puts it back
// in the grid it belongs to, and `absorbs` removes the orphans.

const scaleNotes: Block[] = [
  {
    type: 'p',
    text: 'Notes: For weighted mean scores, to compare qualitative sentiments numerically, responses were assigned values on a 5-point scale:',
  },
  {
    type: 'list',
    items: [
      '5 (Very Good/Very Effective)',
      '4 (Somewhat Good/Effective)',
      '3 (Neither Good nor Bad/Neither Effective nor Ineffective)',
      '2 (Somewhat Bad/Ineffective)',
      '1 (Very Bad/Not Effective at all)',
    ],
  },
  {
    type: 'p',
    text: 'The mean represents the weighted average of all responses within that subgroup.',
  },
]

export const paperTables: Record<string, PaperTable> = {
  '/pdfs/thesis/table1.png': {
    title: 'Actual Effects – Table 1',
    columns: [
      'Year',
      'U.S. Exports to China',
      'U.S. Imports from China',
      'Trade-to-GDP ratio with China (Exports + Imports as % of GDP)',
      'Trade balance with China (Exports – Imports as % of GDP)',
    ],
    rows: [
      // CORRECTED, deliberately and with Kian's sign-off: the thesis prints
      // this as `1.95%`, positive, which would mean a trade surplus with China
      // in 2016. Every other year is negative and Figure 2 plots this one
      // negative too, so the published table is missing a minus sign. This is
      // the one place the site does not reproduce the thesis verbatim — don't
      // "restore" it to match the PDF.
      ['2016', '$115.6 billion', '$481.0 billion', '~3.19%', '-1.95%'],
      ['2017', '$130.0 billion', '$505.0 billion', '~3.3%', '-1.92%'],
      ['2018', '$120.3 billion', '$538.5 billion', '~3.26%', '-2.04%'],
      ['2019', '$106.4 billion', '$451.7 billion', '~2.60%', '-1.61%'],
      ['2020', '$124.6 billion', '$435.4 billion', '~2.68%', '-1.49%'],
      ['2021', '$151.4 billion', '$504.2 billion', '~2.76%', '-1.49%'],
      ['2022', '$154.0 billion', '$536.3 billion', '~2.65%', '-1.47%'],
      ['2023', '$147.6 billion', '$427.2 billion', '~2.07%', '-1.01%'],
      ['2024', '$143.2 billion', '$438.7 billion', '~1.97%', '-1.01%'],
    ],
  },

  // The crop stopped after 2021; 2022-2024 were extracted as three loose
  // paragraphs and printed as running text under the picture.
  '/pdfs/thesis/table2.png': {
    title: 'Actual Effects – Table 2',
    columns: [
      'Year',
      'U.S. Customs Revenue',
      'Consumer Price Index (CPI)',
      'Annual % change (Rate of Inflation)',
      'Real Disposable Income YoY Change',
    ],
    rows: [
      ['2016', '~$34.8 billion', '240.0', '1.3%', '2.5%'],
      ['2017', '~$34.6 billion', '245.1', '2.1%', '2.7%'],
      ['2018', '~$41.3 billion', '251.1', '2.4%', '2.9%'],
      ['2019', '~$70.8 billion', '255.7', '1.8%', '2.8%'],
      ['2020', '~$68.6 billion', '258.8', '1.2%', '6.4%'],
      ['2021', '~$80.0 billion', '271.0', '4.7%', '3.9%'],
      ['2022', '~$99.9 billion', '292.7', '8.0%', '-5.6%'],
      ['2023', '~$80.3 billion', '304.7', '4.1%', '5.7%'],
      ['2024', '~$77.0 billion', '313.7', '2.9%', '2.9%'],
    ],
    absorbs: [
      '2022 ~$99.9 billion 292.7 8.0% -5.6%',
      '2023 ~$80.3 billion 304.7 4.1% 5.7%',
      '2024 ~$77.0 billion 313.7 2.9% 2.9%',
    ],
  },

  '/pdfs/thesis/table3.png': {
    title: 'Table 3',
    columns: [
      'Subgroup',
      'Q7: Trade Deficit Identification (%)',
      'Q8: Chinese Import Identification (%)',
      'Q9: EV Tariff Accuracy (%)',
      'Q10: Price Increase Awareness (%)',
    ],
    rows: [
      ['Full Sample', '82.1%', '86.6%', '23.8%', '97.7%'],
      ['Econ Yes', '80.0%', '92.1%', '18.5%', '96.9%'],
      ['Econ No', '89.5%', '68.4%', '42.1%', '100.0%'],
      ['Male', '91.5%', '88.9%', '25.5%', '97.8%'],
      ['Female', '68.6%', '82.9%', '20.0%', '97.2%'],
      ['Age 18-24', '78.1%', '84.1%', '23.4%', '96.9%'],
      ['Age 25+', '95.0%', '94.7%', '25.0%', '100.0%'],
    ],
  },

  // The crop cut the Notes off at the bottom edge; they were printed as
  // three stray paragraphs after the picture instead.
  '/pdfs/thesis/table6.png': {
    title: 'Table 4',
    columns: [
      'Subgroup',
      'Q11: Tariff Calculation (%)',
      'Q12: Trade Approval (Mean)',
      'Q13: Trade Attitude (Mean)',
      'Q14: Tariff Effectiveness (Mean)',
      'Q15: Correct Identification (%)',
    ],
    rows: [
      ['Full Sample', '90.7%', '4.62', '2.83', '2.32', '80.5%'],
      ['Econ Yes', '93.0%', '4.69', '2.88', '2.36', '81.4%'],
      ['Econ No', '83.3%', '4.39', '2.67', '2.22', '77.8%'],
      ['Male', '90.2%', '4.63', '2.95', '2.23', '83.7%'],
      ['Female', '90.6%', '4.59', '2.59', '2.38', '75.0%'],
      ['Age 18-24', '87.7%', '4.59', '2.70', '2.38', '79.3%'],
      ['Age 25+', '100.0%', '4.74', '3.22', '2.16', '84.2%'],
    ],
    notes: scaleNotes,
    // The title line and the whole notes block sat outside the crop and were
    // printed as running text beside it.
    absorbs: [
      'Table 4',
      'Notes: For weighted mean scores, to compare qualitative sentiments numerically, responses were assigned values on a 5-point scale:',
      '5 (Very Good/Very Effective) 4 (Somewhat Good/Effective) 3 (Neither Good nor Bad/Neither Effective nor Ineffective) 2 (Somewhat Bad/Ineffective) 1 (Very Bad/Not Effective at all)',
      'The mean represents the weighted average of all responses within that subgroup.',
    ],
  },

  // The crop stopped one row short, so "Age 25+" trailed the picture as a
  // loose line of text.
  // The en dash in "Age 18–24" is the thesis's own, and differs from the
  // hyphen it uses in Tables 3 and 4. Kept verbatim, like its typos.
  '/pdfs/thesis/table4.png': {
    title: 'Table 5 – Question 16',
    columns: [
      'Subgroup',
      'Academic/Educational (%)',
      'Partisan Politics (%)',
      'Media Influence (%)',
      'Price Sensitivity (%)',
      'National Sovereignty (%)',
      'Labor/Jobs Concerns (%)',
    ],
    rows: [
      ['Full Sample', '31.9%', '2.1%', '19.1%', '53.2%', '1.1%', '2.1%'],
      ['Econ Yes', '37.3%', '1.3%', '16.0%', '54.7%', '1.3%', '2.7%'],
      ['Econ No', '10.5%', '5.3%', '31.6%', '47.4%', '0.0%', '0.0%'],
      ['Gender Male', '32.7%', '1.9%', '17.3%', '57.7%', '1.9%', '0.0%'],
      ['Gender Female', '30.0%', '2.5%', '20.0%', '47.5%', '0.0%', '5.0%'],
      ['Age 18–24', '26.0%', '2.7%', '19.2%', '49.3%', '1.4%', '2.7%'],
      ['Age 25+', '52.4%', '0.0%', '19.0%', '66.7%', '0.0%', '0.0%'],
    ],
    absorbs: ['Age 25+ 52.4% 0.0% 19.0% 66.7% 0.0% 0.0%'],
  },

  '/pdfs/thesis/table5.png': {
    title: 'Data Dictionary',
    columns: ['Variable Name', 'Description', 'Units', 'Appears In', 'Primary Source'],
    rows: [
      ['U.S. Exports (China)', 'Total value of goods sent from the U.S. to China.', 'Billions USD', 'Table 1', 'Census Bureau/BIS'],
      ['U.S. Imports (China)', 'Total value of goods brought into the U.S. from China.', 'Billions USD', 'Table 1', 'Census Bureau/BIS'],
      ['Trade Balance', 'The difference between exports and imports (Net Exports).', '% of U.S. GDP', 'Table 1', 'Trading Economics'],
      ['Trade-to-GDP Ratio', 'Sum of exports and imports divided by total U.S. GDP.', 'Percentage (%)', 'Table 1', 'Trading Economics'],
      ['Customs Revenue', 'Total duties collected by the U.S. government on imports.', 'Billions USD', 'Table 2', 'U.S. Treasury'],
      ['CPI (Consumer Price Index)', 'A measure of the average change over time in prices paid by consumers.', 'Index Level', 'Table 2', 'Minneapolis Fed'],
      ['Inflation Rate', 'Annual percentage change in CPI.', 'Percentage (%)', 'Table 2', 'Minneapolis Fed'],
      ['Real Disposable Income', 'After-tax income adjusted for inflation.', '% YoY Change', 'Table 2', 'FRED'],
    ],
  },
}
