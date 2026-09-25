// Abstracts for the reading pages, keyed by slug, one string per paragraph.
//
// They live here and NOT in each paper's own module for the same reason as
// tables.ts, charts.ts and survey.ts: those modules are generated from the
// PDFs, so anything hand-written in them is dropped by the next regeneration.
//
// A paper without an entry here simply renders its full text on arrival, the
// way every page did before this existed — the gate is opt-in, not a default.
// The capstone poster (`cs-capstone`) has none: it is a single board whose
// whole point is that you take it in at once, and it carries no abstract of
// its own to quote.
export const paperAbstracts: Record<string, string[]> = {
  // The thesis's own abstract, as submitted. Verbatim — the curly quotes and
  // the en dashes are the document's.
  thesis: [
    'The U.S.-China trade war (2018-2020) represented a significant shift toward protectionism, driven by “winners” rhetoric through tariffs and fixing “unfair” foreign trade policies. While the Trump administration argued these policies would protect domestic industries and that foreign exporters would bear the costs, empirical evidence suggests a different outcome. Studies indicate a “complete pass-through” of tariff costs to U.S. importers and consumers, resulting in a $1.4 billion monthly deadweight loss to U.S. welfare (Amiti et al., 2019). Despite these high economic costs, public support for trade policy remained largely influenced by partisan affiliation, media framing, and an inability to link the benefits of trade (like lower prices) to actual policies. This thesis investigates the divergence between the actual economic outcomes (such as trade diversion and wealth redistribution away from the rural communities that the policies aim to protect) and the public’s perception of those outcomes. By identifying why this gap exists, this research seeks to provide policymakers with strategies and insight to better communicate the realities of trade policy and design frameworks that align perceived benefits with actual economic results.',
  ],

  // NOT from the PDF — the capstone was submitted without an abstract, so this
  // one was written for the reading page from the paper's own argument and
  // findings. Every figure and attribution in it is drawn from the text below
  // it on the page; if the paper is ever revised, this is hand-maintained and
  // will not follow.
  'basic-income': [
    'Universal basic income (UBI) — a recurring, unconditional cash transfer paid to an entire population rather than to a targeted subgroup — is a durable fixture of policy debate, but its feasibility depends far less on the idea itself than on where it is implemented, how large the transfer is, and how it is financed. This paper assesses that question through five recent studies spanning developing and middle-income economies (South Africa, Indonesia, Peru) and developed ones (the United States, Finland, New Zealand).',
    'The evidence from lower-income settings is discouraging. A permanent basic income grant in South Africa contracts growth through higher borrowing costs, higher taxes, and the crowding out of public and private investment, with value-added tax the least damaging of the available funding instruments (Hollander et al., 2024). And where most workers earn too little to pay income tax, neither universality nor targeting dominates: targeting produces large exclusion errors, while a universal grant cannot be taxed back from the households that did not need it (Hanna and Olken, 2018).',
    'In developed economies the binding constraint is scale and financing rather than administrative capacity. A small, expenditure-neutral UBI funded by a consumption tax raises U.S. output and lowers pre-tax inequality, while a large one lowers both output and employment (Luduvice, 2024); Finland’s experiment raised recipients’ income but barely moved employment (Verho et al., 2022); and replacing New Zealand’s public pension with UBI leaves present-biased households with substantial saving regret in old age (Suzuki, 2024).',
    'Taken together, the evidence does not support replacing an existing safety net with a large UBI. It points instead toward a medium-sized transfer, financed through consumption rather than income taxation, that complements targeted programs rather than displacing them.',
  ],
}
