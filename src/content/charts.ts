import { paperTables } from './tables'

export interface ChartSeries {
  label: string
  // Categorical slot, 1-indexed. Assigned in fixed order, never cycled.
  slot: 1 | 2
  values: number[]
}

export interface PaperChart {
  // Row labels of the source table, used as the x scale (years here).
  x: string[]
  xLabel: string
  yLabel: string
  yTicks: number[]
  // How a value reads in the tooltip and the end label.
  format: (v: number) => string
  series: ChartSeries[]
}

// `$115.6 billion` -> 115.6, `~3.19%` -> 3.19, `-1.92%` -> -1.92.
const num = (cell: string) =>
  parseFloat(cell.replace(/[~≈$,%]/g, '').replace(/\s*(billion|million|trillion)/i, ''))

/**
 * Charts are built from the table that prints the same numbers, rather than
 * transcribed a second time from the chart images. Figures 1 and 2 plot
 * Table 1; Figures 3 and 4 plot Table 2. One source means the chart and the
 * table on the same page cannot drift apart, and the verification done against
 * the PDF for the tables covers the charts too.
 */
function column(tableKey: string, col: number): number[] {
  const t = paperTables[tableKey]
  if (!t) throw new Error(`no table for ${tableKey}`)
  return t.rows.map((r) => num(r[col]))
}

const years = (tableKey: string) => paperTables[tableKey].rows.map((r) => r[0])

const TABLE_1 = '/pdfs/thesis/table1.png'
const TABLE_2 = '/pdfs/thesis/table2.png'

const usd = (v: number) => `$${v.toFixed(1)}B`
const pct = (v: number) => `${v.toFixed(2)}%`

// The 2016 trade balance used to need an override here: the thesis's Table 1
// prints it positive while its Figure 2 plots it negative. The table itself is
// now corrected at source (see tables.ts), so the two agree and the chart can
// read the column straight.

export const paperCharts: Record<string, PaperChart> = {
  '/pdfs/thesis/figure1.png': {
    x: years(TABLE_1),
    xLabel: 'Year',
    yLabel: '$ billions',
    yTicks: [0, 200, 400, 600],
    format: usd,
    series: [
      { label: 'Exports', slot: 1, values: column(TABLE_1, 1) },
      { label: 'Imports', slot: 2, values: column(TABLE_1, 2) },
    ],
  },

  '/pdfs/thesis/figure2.png': {
    x: years(TABLE_1),
    xLabel: 'Year',
    yLabel: '% of GDP',
    yTicks: [-4, -2, 0, 2, 4],
    format: pct,
    series: [
      { label: 'Trade-to-GDP ratio', slot: 1, values: column(TABLE_1, 3) },
      { label: 'Trade Balance', slot: 2, values: column(TABLE_1, 4) },
    ],
  },

  '/pdfs/thesis/figure3.png': {
    x: years(TABLE_2),
    xLabel: 'Year',
    yLabel: '$ billions',
    yTicks: [0, 25, 50, 75, 100, 125],
    format: usd,
    series: [{ label: 'Customs Revenue', slot: 1, values: column(TABLE_2, 1) }],
  },

  '/pdfs/thesis/figure4.png': {
    x: years(TABLE_2),
    xLabel: 'Year',
    yLabel: 'CPI',
    yTicks: [200, 225, 250, 275, 300, 325],
    format: (v) => v.toFixed(1),
    series: [{ label: 'Consumer Price Index', slot: 1, values: column(TABLE_2, 2) }],
  },
}
