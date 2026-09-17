import type { Paper } from './papers'

// Generated from public/pdfs/thesis/thesis.pdf. Headings come from the type
// size, paragraph breaks from vertical gaps, figures and tables are cropped
// from the pages, and captions are the thesis's own caption lines.
export const thesis: Paper = {
  "slug": "thesis",
  "eyebrow": "Barrett Honors Thesis",
  "title": "Public Perception on Trade versus Actual Economic Effects of Trade Policy during the U.S.–China Trade War",
  "meta": [
    {
      "label": "Degrees",
      "value": "Economics (B.S.) and Computer Science (B.S.)"
    },
    {
      "label": "Primary Advisor",
      "value": "Kartik Verma"
    },
    {
      "label": "Secondary Advisor",
      "value": "Domenico Ferraro"
    },
    {
      "label": "Length",
      "value": "30 pages"
    }
  ],
  "actions": [
    {
      "label": "View PDF",
      "pdfSrc": "/pdfs/thesis/thesis.pdf"
    },
    {
      "label": "View in ASU Library",
      "href": "https://keep.lib.asu.edu/items/203948"
    }
  ],
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "blocks": [
        {
          "type": "p",
          "text": "The U.S.–China trade war from 2018 to 2020 was a period of increasing economic conflict between the world’s two largest economies. The conflict was driven mainly by concerns over trade deficits, intellectual property, and industrial policy (subsidies, tax breaks, etc.). The Trump administration began imposing tariffs on hundreds of billions of dollars’ worth of Chinese imports, arguing that China engaged in unfair trade practices, such as forced technology transfer (must hand over technical know-how to get access to a market), and heavy state support for key industries (Chinese subsidies that create unfair competition). China responded with its own retaliatory tariffs on U.S. goods, especially agricultural products. Over these years, both countries have gone through several rounds of tariff increases and negotiations, causing uncertainty in global marketers and disrupting supply chains. The conflict eventually slowed down with the “Phase One” agreement in January 2020, which reduced some tensions but left core issues unresolved. These core issues are surfacing under Trump’s second administration, but this thesis primarily focuses on Trump’s first term."
        },
        {
          "type": "h3",
          "text": "Problem Statement"
        },
        {
          "type": "p",
          "text": "The U.S.–China trade war (2018-2020) represented a significant shift toward protectionism, driven by “winners” rhetoric through tariffs and fixing “unfair” foreign trade policies. While the Trump administration argued that tariffs would protect domestic industries and that foreign exporters would bear the costs, empirical evidence suggests a different outcome. Research shows a “complete pass-through” of tariff costs to U.S. importers and consumers, resulting in a $1.4 billion monthly deadweight loss to U.S. welfare (Amiti et al., 2019) and a redistribution of wealth away from the rural communities the policies aimed to protect."
        },
        {
          "type": "p",
          "text": "Despite these measurable economic costs, public attitude data from the same period show a complex and split reality. While large-scale surveys showed record-high general support for international trade, this sentiment remained highly conditional and often fragmented by partisan rhetoric and media influence, largely because individuals struggle to connect abstract economic benefits to specific trade policies. This thesis aims to identify the specific drivers of this “perception gap” and seeks to provide policymakers with strategies to better communicate trade"
        },
        {
          "type": "p",
          "text": "realities and design frameworks that align perceived benefits with actual economic results."
        }
      ]
    },
    {
      "id": "background",
      "title": "Background (Literature review)",
      "blocks": [
        {
          "type": "h3",
          "text": "Public Perception"
        },
        {
          "type": "p",
          "text": "Drivers of Public Perception on Trade General support for trade often comes with skepticism about “unfair” partners. Large surveys from Gallup and the Chicago Council show that, entering the trade war, Americans were more positive about trade than in almost any previous period. Gallup’s “opportunity versus threat” question finds that the group viewing foreign trade as an opportunity for economic growth rose to around 70-72% in 2017 and stayed around that level from 2019 to 2020, with fewer than a fifth of the respondents calling trade a threat. Chicago Council surveys similarly report that by 2019, roughly 87% of Americans said international trade is good for the U.S. economy, and about 83% said it is good for American companies. At the same time, support becomes more conditional when survey questions mention specific partners or instruments. The Chicago Council's work on the U.S.–China trade war finds that while most Americans favor trade with Asia in general, they are much more divided over tariff increases on Chinese goods, with Republicans generally supporting Trump’s tariff strategy and Democrats opposing it. This combination sets up the core perception gap in 2018–2020: people say they like trade, but they are also willing to back protection when it is framed as confronting an unfair trading partner."
        },
        {
          "type": "p",
          "text": "The Asymmetry of Information: Visible Costs versus Invisible Benefits A primary challenge in public trade perception is how costs and benefits are experienced. As noted, while general sentiment often appears optimistic, this support is frequently underwhelming because the actual benefits of trade–such as lower consumer prices, specialization gains, and increased productivity–are difficult for voters to attribute to any single policy (Mankiw, 2016)."
        },
        {
          "type": "p",
          "text": "In contrast, the costs of trade, specifically manufacturing job losses, are highly concentrated and visible (Mankiw, 2016). This creates a loss salience and negativity bias where the threat of a job loss carries more weight than the benefit of cheaper goods (Chatruc, 2021). Consequently, while the public may support trade abstractly, their lack of a direct connection to its benefits creates a psychological gap between the policy and its benefits that only grows as the people around them lose their jobs."
        },
        {
          "type": "p",
          "text": "Beyond Economics: Identity, Sovereignty, and Fairness Public attitudes are not driven solely by pocketbook concerns, but by broader frameworks of national identity and fairness. Vasilopoulou (2024) argues that concerns over national sovereignty and bargaining power are more predictive of trade support than direct economic ” if measures. Voters do not simply ask if policy raises GDP, they ask if their country is “winning, the rules are fair, and if their government can enforce reciprocity."
        },
        {
          "type": "p",
          "text": "The multidimensional evaluation creates several key points where a trade agreement might be economically efficient but fail with sovereignty or environmental sustainability (Nguyen et al., 2021). When trade is framed as a matter of an “unequal playing field” or a threat to national industries, support shifts towards protectionism regardless of the actual impact on consumer prices."
        },
        {
          "type": "p",
          "text": "The Resilience of Beliefs and the Limits of Fact-Based Messaging Once trade opinions are formed, they become highly resistant to change, often becoming tied to partisan identity. Bearce (2024) finds that positive messaging about trade agreements does little to shift support once prior opinions are set, as these beliefs are tied more to group identity and trust institutions than to data."
        },
        {
          "type": "p",
          "text": "Furthermore, attempts to correct misperceptions with economic facts can sometimes backfire. Alfaro et al. (2023) demonstrate that providing economic facts in favor of trade can actually reinforce protectionist views among certain groups by causing a defensive reaction tied to their partisan identity. This suggests that the “perception gap” is not merely a lack of information; rather, traditional closed-ended survey questions often overstate pro-trade sentiments by failing to account for the trade-offs and uncertainties that respondents weigh when answering in their own words (Chang et al., 2021)."
        },
        {
          "type": "h3",
          "text": "Actual Effects"
        },
        {
          "type": "p",
          "text": "An examination of bilateral trade flows shows a decrease in U.S. exports to China in 2019 and 2020, with U.S. exports falling from ~$130 billion in 2017 to ~$106 billion in 2019 and imports from ~$505 billion to ~$452 billion (Fig. 1 and Table 1). From 2020 to 2024, the economy rebounded, as noted by the increased exports and imports back to pre-trade war levels."
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure1.png",
          "width": 863,
          "height": 534,
          "caption": "Figure 1. U.S. Exports to and Imports from China from 2016 to 2024"
        },
        {
          "type": "p",
          "text": "As a share of the U.S. economy, China trade fell from 3.3% of GDP in 2017 to 2.6-2.7% in 2019-2020 (Fig. 2 and Table 1). The bilateral deficit as a share of GDP lessened, which was driven mostly by lower imports. Customs revenue largely increased from $35 billion in 2017 to ~$70 billion in 2019-2020 (Fig. 3 and Table 2). Despite this, the Consumer Price Index (CPI) didn’t spike and does not show any indication of disruption from the tariffs (Fig. 4 and Table 2). Note that this does not mean that there was no disruption, as we don’t know what the CPI could have been. If the index levels were to be lower, the tariffs potentially could have offset them, which would show as just levels following the trend."
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure2.png",
          "width": 863,
          "height": 537,
          "caption": "Figure 2. U.S. Trade-to-GDP ratio and Trade Balance from 2016 to 2024"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure3.png",
          "width": 863,
          "height": 531,
          "caption": "Figure 3. U.S. Customs Revenue from 2016 to 2024"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure4.png",
          "width": 863,
          "height": 534,
          "caption": "Figure 4. U.S. Consumer Price Index (CPI) from 2016 to 2024"
        },
        {
          "type": "p",
          "text": "Empirical studies (Russ 2019) over this period find that tariffs are fully passed through at the border, meaning U.S. importers largely pay the tariff. This reflects as higher prices for consumers; however, raising prices too high would harm sales. Real disposable income rose steadily from 2016 to 2019 and spiked in 2020, likely due to pandemic transfer. Following the conflict, income remained positive in 2021, but dropped sharply in 2022 before rebounding to stable numbers in 2024."
        },
        {
          "type": "p",
          "text": "While aggregate inflation metrics like the CPI remained relatively stable, economic analysis shows that the actual costs of the 2018-2020 trade war were substantial and were borne almost entirely by the United States. Contrary to the administration’s claim that foreign exporters would lower prices to maintain market share, Amiti et al. (2019) documented a “complete pass-through” of tariff costs, meaning that U.S. importers and consumers paid approximately 100% of the tariff duties. This resulted in a $1.4 billion monthly deadweight loss to the U.S. welfare, as higher costs were not offset by domestic producer gains. This inefficiency was exacerbated by trade diversion as observed by Flaaen et al. (2020) in the washing machine industry. In this case study, manufacturers shifted production to untargeted countries (such as Thailand or Vietnam) rather than returning to the U.S., forcing consumers to pay higher prices without the government collecting tariff revenue. Furthermore, the policy failed to aid its intended audience. Fajgelbaum et al. (2020) showed that while U.S. tariffs were designed to protect industries in Republican-leaning counties, foreign retaliatory tariffs on agriculture were so surgically targeted that these “GOP counties” ultimately suffered greater economic losses than Democratic ones. Thus, the actual effect of the policy was not a win over foreign trade practices, but a redistribution of wealth away from U.S. consumers and the rural communities the trade war was supposedly meant to protect."
        },
        {
          "type": "p",
          "text": "Note for Tables 1 and 2: More information for each variable in and its origins can be found in the ‘Data Dictionary’ in the ‘Appendix’ section below."
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/table1.png",
          "width": 1080,
          "height": 622,
          "caption": ""
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/table2.png",
          "width": 1080,
          "height": 474,
          "caption": ""
        },
        {
          "type": "p",
          "text": "2022 ~$99.9 billion 292.7 8.0% -5.6%"
        },
        {
          "type": "p",
          "text": "2023 ~$80.3 billion 304.7 4.1% 5.7%"
        },
        {
          "type": "p",
          "text": "2024 ~$77.0 billion 313.7 2.9% 2.9%"
        }
      ]
    },
    {
      "id": "data-and-methods",
      "title": "Data and Methods",
      "blocks": [
        {
          "type": "p",
          "text": "This study utilizes a primary survey designed to measure current economic literacy and specific trade policy perceptions. The survey is hosted on QuestionPro and is distributed among peers, other students, faculty, and anyone else who could complete the survey. The survey captures the current trade sentiment within this group. The survey is structured into three distinct modules: demographic background, objective economic literacy, and subjective policy opinions. While the majority of the survey uses multiple choice to ensure classified and uniform responses, the final section is a qualitative, open-ended response asking participants to describe their sentiments towards trade. The data from these responses are analyzed using Natural Language Processing (NLP) techniques to identify recurring themes."
        },
        {
          "type": "p",
          "text": "This study utilizes a multi-dimensional dataset to evaluate the gap between perceived and actual economic effects of the U.S.-China trade war. The data is primarily quantitative, sourced from official U.S. government statistical agencies and established economic databases."
        },
        {
          "type": "p",
          "text": "1. International Trade and Tariff Data Bilateral trade statistics, including U.S. exports and U.S. imports from China, are collected from the U.S. Census Bureau and the Bureau of Industry and Security (BIS). These figures represent the total value of merchandise (goods) clearing U.S. customs and are updated frequently in the U.S. International Trade in Goods and Services Report. Customs Revenue data (representing total duties collected on these imports) is collected from the Monthly Treasury Statement from the U.S. Treasury."
        },
        {
          "type": "p",
          "text": "2. Macroeconomic Indicators To assess the broader economic context of this era, this research uses several national metrics:"
        },
        {
          "type": "p",
          "text": "The Gross Domestic Product (GDP) is sourced from Trading Economics, which aggregates data from the Bureau of Economic Analysis (BEA) to calculate the Trade-to-GDP ratio and Trade Balance as a percentage of the total economy. Inflation and price indices like the Consumer Price Index (CPI) and the Inflation Rate are obtained from the Federal Reserve Bank of Minneapolis. These indices track the average change over time in prices paid by urban consumers for a representative market basket of goods. Real Disposable Income is represented through Year-over-year changes in inflation-adjusted after-tax income and is sourced from the Federal Reserve Economic Data (FRED) database maintained by the St. Louis Fed."
        },
        {
          "type": "p",
          "text": "3. Public Perception Data Data regarding public beliefs and attitudes toward trade policy are derived from longitudinal surveys conducted by Gallup and the Chicago Council on Global Affairs surveys, providing quantitative baselines on public optimism. These show historic support for trade; however, peer-reviewed literature shows that these statements are highly conditional."
        },
        {
          "type": "p",
          "text": "Visibility Bias: Mankiew (2016) and Chatruc (2021) explain that the abstract benefits of trade (lower prices) are less visible than concentrated job losses, which are more controversial."
        },
        {
          "type": "p",
          "text": "Identity and Sovereignty: Vasilopoulou (2024) and Bearce (2024) find that national identity and perceived bargaining power garner more support than direct economic effects."
        },
        {
          "type": "p",
          "text": "Partisan Framing: Research by Alfaro (2023) and Chang (2021) suggests that factual information often reinforces protectionist views when it conflicts with partisan identity."
        },
        {
          "type": "p",
          "text": "Historical Context: Autor et al. (2016) show long-standing skepticism in manufacturing industries that preceded the 2018 trade war."
        },
        {
          "type": "h3",
          "text": "Description of Survey"
        },
        {
          "type": "p",
          "text": "Section 1: Demographics (Questions 1 - 6) The first section of the survey establishes the baseline characteristics of the respondents. To maintain anonymity, no personally identifiable information was collected. This section included standard questions regarding age, gender, race/ethnicity, employment status, and highest level of education. Most importantly, it included a filter question asking if the respondent had ever taken a formal class in economics or international trade."
        },
        {
          "type": "p",
          "text": "Section 2: Base Economic Knowledge (Questions 7 - 11) This section functioned as an objective literacy test to determine the respondents’ awareness of the current economic environment and the mechanics of international trade."
        },
        {
          "type": "p",
          "text": "Q7. Respondents were asked to identify if the U.S. currently runs a trade deficit or surplus to gauge their understanding of basic bilateral flows."
        },
        {
          "type": "p",
          "text": "Q8. Respondents were given a list of goods and asked which good the U.S. primarily imports from China. This gauged the participant’s awareness of what goods are generally imported from China."
        },
        {
          "type": "p",
          "text": "Q9. Respondents were asked to identify the current tariff rate on Chinese electric vehicles. This gauged the participant’s awareness of the current tariff policy."
        },
        {
          "type": "p",
          "text": "Q10. Respondents were asked to identify the change in prices of everyday goods over the past year. This measured awareness of inflation trends. This question has a sense of subjectivity. However, the answers “Increased significantly” and “Increased slightly” are considered correct as per the Consumer Price Index (CPI). Q11. Respondents were given a hypothetical scenario and asked for the new price of a $100 crate of apples following a 10% tariff. This served as a simple question to gauge whether the participant had a basic understanding of the mathematical implementation of tariffs."
        },
        {
          "type": "p",
          "text": "Section 3: Opinions on Trade and Tariffs (Questions 12 - 16) The final section measured normative views on trade policy and the respondents’ understanding of who bears the costs of tariffs."
        },
        {
          "type": "p",
          "text": "Q12. Respondents rated whether international trade is generally a “good” or “bad” thing for the U.S. economy."
        },
        {
          "type": "p",
          "text": "Q13. This measured attitudes toward the trade deficit specifically, providing data for the weighted average scores used in Table 4."
        },
        {
          "type": "p",
          "text": "Q14. Respondents evaluated the effectiveness of tariffs as a tool for protecting domestic labor. Answers for this question are also calculated using the weighted average in Table 4."
        },
        {
          "type": "p",
          "text": "Q15. Respondents were asked who primarily pays for tariff costs. This was crucial in gauging the perception gap. Though framed as a subjective question, the answer is more or less ” objectively “U.S. consumers."
        },
        {
          "type": "p",
          "text": "Q16. The final question was an open-ended prompt that allowed respondents to explain their reasoning in their own words. These responses were analyzed through an LLM."
        },
        {
          "type": "p",
          "text": "Methods: Qualitative Classification and Demographic Stratification To analyze the open-ended responses regarding trade policy influence, I employed a Zero-Shot Text Classification methodology using the BART-Large-MNLI model. Unlike traditional keyword-based analysis, this LLM approach uses natural language inference to identify the underlying semantic intent of a specific response. This allowed for multi-label classification where a single respondent’s comment could be categorized into multiple themes if the context supported it. Each response was evaluated against six pre-defined labels: Academic/Educational background, Partisan politics, Media influence, Price sensitivity, National sovereignty, and Labor/Jobs concerns."
        },
        {
          "type": "p",
          "text": "To identify the specific drivers across different segments of the population, the data was stratified into six distinct subgroups: Gender (Male and Female), Formal Academic Training (those who have taken a formal Economics class and those who have not), and Age (18-24 and 25+). By running the classification model independently across these subsets, I was able to translate the perception gap into percentage breakdowns. This process helped ensure that the classification distributions were not just a broad overview of the sample, but a more nuanced look at how education and demographic identity can influence participant responses."
        }
      ]
    },
    {
      "id": "results",
      "title": "Results",
      "blocks": [
        {
          "type": "p",
          "text": "Statistical Methodology for Tabular Data To compare economic perceptions across stratified subgroups, the categorical responses for question 12 (Trade Approval), question 13 (Trade Attitude), and question 14 (Tariff Effectiveness) were converted into a numerical weighted average score (Mean). This was achieved by assigning a value to each response on a 5-point scale where 5 is the most positive or effective stance, 3 is the neutral or “neither” stance, and 1 is the most negative or ineffective stance. The mean was calculated by multiplying each response's frequency by its assigned value and dividing by the total number of respondents in each subgroup. This numerical conversion allows for a direct comparison of how strong each sentiment is across groups that a simple percentage breakdown might not give. For categorical-based questions (questions 10, 11, and 15), the table displays the accuracy, representing the percentage of respondents within each subgroup who identified the empirically correct answer. Lastly, for question 16, prompting an open-ended response on the participant’s feelings towards trade, the classification breakdowns are populated for each stratification. This provides a comprehensive overview of how each slice of the sample supported their opinions on trade. Altogether, these combined metrics provide both the economic sentiments of the respondents and the accuracy of technical knowledge across all demographics."
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/table3.png",
          "width": 1080,
          "height": 582,
          "caption": ""
        },
        {
          "type": "p",
          "text": "Table 4"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/table6.png",
          "width": 1080,
          "height": 488,
          "caption": ""
        },
        {
          "type": "p",
          "text": "Notes: For weighted mean scores, to compare qualitative sentiments numerically, responses were assigned values on a 5-point scale:"
        },
        {
          "type": "p",
          "text": "5 (Very Good/Very Effective) 4 (Somewhat Good/Effective) 3 (Neither Good nor Bad/Neither Effective nor Ineffective) 2 (Somewhat Bad/Ineffective) 1 (Very Bad/Not Effective at all)"
        },
        {
          "type": "p",
          "text": "The mean represents the weighted average of all responses within that subgroup."
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/table4.png",
          "width": 1080,
          "height": 510,
          "caption": ""
        },
        {
          "type": "p",
          "text": "Age 25+ 52.4% 0.0% 19.0% 66.7% 0.0% 0.0%"
        }
      ]
    },
    {
      "id": "discussion",
      "title": "Discussion",
      "blocks": [
        {
          "type": "p",
          "text": "Baseline Economic Literacy: General Awareness of Trade Before examining policy opinions, it is necessary to establish the public’s baseline awareness of trade facts. The full sample results for question 7 and question 8 suggest a high level of foundational literacy regarding U.S. trade with China. Approximately 82.1% of the total sample correctly identified that the U.S. runs a trade deficit (Fig. 4), and an overwhelming majority identified smartphones and laptops as a primary Chinese import (Fig. 5), among other less likely answers. This indicates that the “perception gap” is not caused by a total lack of awareness regarding trade flows or the types of goods being exchanged."
        },
        {
          "type": "p",
          "text": "However, a small gap appears when the questions move from general observations to specific, technical policy facts. In question 9, when asked about the current tariff rate on Chinese electric vehicles, nearly 36.9% of respondents admitted they did not know, while the remaining answers were significantly split (Fig. 6). This suggests that while the public understands the direction and content of trade, they do not know specific policies regarding trade."
        },
        {
          "type": "p",
          "text": "The Dichotomy of Trade Sentiment: General Approval versus Deficits The results for question 12 and question 13 show a contrast in how the public views trade abstractly versus specific economic indicators. In the full sample for question 12, 94.8% of respondents viewed international trade as a “good thing” (combining “Very good” and “Somewhat good”), indicating nearly universal approval of trade as a general concept (Fig. 11)."
        },
        {
          "type": "p",
          "text": "However, this optimism weakens when framed through the lens of a trade deficit (question 13). For the entire sample, the most frequent response shifted to “Neither good nor bad” (38.7%), while 40% viewed the deficit negatively (Fig. 12). This suggests that while the public supports trade abstractly, they are much more skeptical of trade imbalances. Education plays a clear role here. While 50% of the “Econ No” group remained neutral on the deficit (Fig. 14), the “Econ Yes” group was more decisive, with 24.5% viewing the deficit as a “good thing” (Fig. 13). compared to only 11.1% of the untrained group. This suggests that formal economic education may provide the tools necessary to view trade imbalances as an economic benefit rather than a purely negative outcome."
        },
        {
          "type": "p",
          "text": "Mathematical Literacy versus Economic Logic While basic mathematical literacy regarding tariffs is high across all demographics, there is a distinct gap in the ability to identify the ultimate bearer of trade costs. In question 11 (asking about a hypothetical 10% tariff on a $100 item), 93% of the “Econ Yes” group (Fig. 9) and 83% of the “Econ No” (Fig. 10) group correctly calculated the $110 price point for a tariffed import, indicating that the perception gap is not caused by a simple failure of logic. However, when asked to identify who primarily pays for these costs in question 15, the groups diverged; 81.4% of the “Econ Yes” group correctly identified “U.S. consumers” (Fig. 18) whereas the “Econ No” groups showed increased uncertainty, with only 77.8% correctly attributing the cost to U.S. consumers (Fig. 19). Though small, this suggests that while the “math” of a tariff is clear, the “incidence” or understanding of how those costs are passed through the supply chain requires"
        },
        {
          "type": "p",
          "text": "the nuanced logic typically gained through economic education."
        },
        {
          "type": "p",
          "text": "Visibility Bias as a Unifying Phenomenon The results across gender and age groups show an astounding consistency that highlights the influence of visibility bias over social identity. Regardless of demographic background, between 75% and 85% of all respondents correctly identified U.S. consumers as the primary payers of tariff costs in question 15 (Fig. 17). This uniformity suggests that “lived experience” (specifically seeing prices rise at the store) acts as a universal indicator. This is further supported by the results of question 10, which gauged respondents’ awareness of price changes for “everyday ” Across all stratified groups, awareness was nearly universal. In the “Econ Yes” and goods. “Econ No” groups, 96.9% (Fig. 7) and 100% (Fig. 8) of respondents, respectively, recognized"
        },
        {
          "type": "p",
          "text": "that prices had increased (counting both “Increased significantly\" and “Increased slightly”). This consistency supports the argument that price sensitivity, which appeared in half of all open-ended responses, is the strongest driver of how people view trade. Because the consumer experiences these price hikes directly at the point of sale, the “visibility” of the economic burden creates a point of alignment between public perception and the \"complete pass-through\" documented by Amiti et al. (2019). Ultimately, the immediate impact of a policy on a person’s finances is the most effective way to bridge the gap between abstract economic data, such as a $1.4 billion deadweight loss, and public opinion. Regardless of background, the visible costs of goods serve as a baseline for economic knowledge that goes beyond formal training in economics or demographic differences."
        },
        {
          "type": "p",
          "text": "Open-ended Justification By classifying the open-ended justifications in question 16, the study identified for the full sample, Personal Price Sensitivity (53.2%) and Academic or Educational Background (31.9%) are the most dominant drivers of trade perception. This indicates that a majority of respondents derive their opinions not from abstract geopolitical theories, but from the immediate, visible impact of trade policy on their personal finances and their prior formal or general education."
        },
        {
          "type": "p",
          "text": "The near-complete absence of Partisan Politics (2.1%) and National Sovereignty (1.1%) as identified drivers is notable. While political rhetoric commonly frames the U.S.–China trade war through the lens of national identity or partisan loyalty, the respondents in this study viewed trade primarily as an economic consideration. Furthermore, the low classification of Labor and Job concerns (2.1%) suggests that the “protectionist” promise of saving domestic manufacturing matters significantly less to the public than the “visibility” of rising consumer costs. These results reinforce the visibility bias that Mankiw (2016) and Chatruc (2021) previously cited. This suggests that for survey participants, lived experience is the primary bridge between macroeconomic policy and public opinion."
        },
        {
          "type": "h3",
          "text": "Bar Graph Breakdowns"
        },
        {
          "type": "h3",
          "text": "Question 7 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "'As far as you know, does the U.S. currently import more goods and services than it exports (a"
        },
        {
          "type": "p",
          "text": "trade deficit) or export more than it imports (a trade surplus)?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure5.png",
          "width": 940,
          "height": 429,
          "caption": "Figure 4. Full sample results for question 7"
        },
        {
          "type": "h3",
          "text": "Question 8 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘Which of the following goods do you believe the United States primarily imports from China?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure6.png",
          "width": 940,
          "height": 451,
          "caption": "Figure 5. Full sample results for question 8"
        },
        {
          "type": "h3",
          "text": "Question 9 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘How much of an import tax (tariff) does the U.S. currently place on Chinese-made electric"
        },
        {
          "type": "p",
          "text": "vehicles?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure7.png",
          "width": 940,
          "height": 466,
          "caption": "Figure 6. Full sample results for question 9"
        },
        {
          "type": "h3",
          "text": "Question 10 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘Based on what you have heard or experienced, how do you believe monthly costs for “everyday"
        },
        {
          "type": "p",
          "text": "goods” (e.g., groceries, electronics) have changed for the average American over the past year?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure8.png",
          "width": 940,
          "height": 450,
          "caption": ""
        },
        {
          "type": "p",
          "text": "“Econ Yes” group results for question 10 Figure 7."
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure9.png",
          "width": 940,
          "height": 451,
          "caption": "Figure 8."
        },
        {
          "type": "p",
          "text": "“Econ No” group results for question 10"
        },
        {
          "type": "h3",
          "text": "Question 11 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘Imagine a crate of apples is imported from another country. Currently, there is a 0% import tax"
        },
        {
          "type": "p",
          "text": "(tariff) on these apples, and they cost $100. If the government decided to implement a 10% tariff on these imports, what do you believe the new price of that crate of apples would be for a consumer in the United States?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure10.png",
          "width": 940,
          "height": 477,
          "caption": "Figure 9."
        },
        {
          "type": "p",
          "text": "“Econ Yes” group results for question 11"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure11.png",
          "width": 940,
          "height": 478,
          "caption": "Figure 10."
        },
        {
          "type": "p",
          "text": "“Econ No” group results for question 11"
        },
        {
          "type": "h3",
          "text": "Question 12 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘Generally speaking, do you believe international trade is a \"good thing\" or a \"bad thing\" for the"
        },
        {
          "type": "p",
          "text": "U.S. economy?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure12.png",
          "width": 940,
          "height": 451,
          "caption": "Figure 11. Full sample group results for question 12"
        },
        {
          "type": "h3",
          "text": "Question 13 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘When the United States has a \"trade deficit\" (it buys more goods from other countries than it"
        },
        {
          "type": "p",
          "text": "sells to them), do you believe this is generally a good thing or a bad thing for the American economy?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure13.png",
          "width": 940,
          "height": 451,
          "caption": "Figure 12. Full sample group results for question 13"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure14.png",
          "width": 940,
          "height": 447,
          "caption": "Figure 13."
        },
        {
          "type": "p",
          "text": "“Econ Yes” group results for question 13"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure15.png",
          "width": 940,
          "height": 459,
          "caption": "Figure 14."
        },
        {
          "type": "p",
          "text": "“Econ No” results group for question 13"
        },
        {
          "type": "h3",
          "text": "Question 14 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘How effective do you believe using tariffs (import taxes) is as a tool to protect American jobs?"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure16.png",
          "width": 940,
          "height": 447,
          "caption": "Figure 15."
        },
        {
          "type": "p",
          "text": "“Econ Yes” group results for question 14"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure17.png",
          "width": 940,
          "height": 456,
          "caption": "Figure 16."
        },
        {
          "type": "p",
          "text": "“Econ No” group results for question 14"
        },
        {
          "type": "h3",
          "text": "Question 15 (Closed-ended)"
        },
        {
          "type": "p",
          "text": "‘Who do you believe primarily pays for the cost of U.S. tariffs on Chinese goods?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure18.png",
          "width": 940,
          "height": 447,
          "caption": "Figure 17. Full sample group results for question 15"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure19.png",
          "width": 940,
          "height": 447,
          "caption": "Figure 18."
        },
        {
          "type": "p",
          "text": "“Econ Yes” group results for question 15"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure20.png",
          "width": 940,
          "height": 447,
          "caption": "Figure 19."
        },
        {
          "type": "p",
          "text": "“Econ No” group results for question 15"
        },
        {
          "type": "h3",
          "text": "Question 16 (Open-ended)"
        },
        {
          "type": "p",
          "text": "‘Why do you feel this way, or what has influenced your opinion on trade policy?’"
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure21.png",
          "width": 940,
          "height": 474,
          "caption": ""
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure22.png",
          "width": 940,
          "height": 474,
          "caption": ""
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure23.png",
          "width": 940,
          "height": 474,
          "caption": ""
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure24.png",
          "width": 940,
          "height": 474,
          "caption": ""
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure25.png",
          "width": 940,
          "height": 474,
          "caption": ""
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure26.png",
          "width": 940,
          "height": 474,
          "caption": ""
        },
        {
          "type": "figure",
          "src": "/pdfs/thesis/figure27.png",
          "width": 940,
          "height": 472,
          "caption": ""
        }
      ]
    },
    {
      "id": "conclusion",
      "title": "Conclusion",
      "blocks": [
        {
          "type": "p",
          "text": "This thesis investigated the significant divergence between the actual economic outcomes of the U.S.-China trade war (2018-2020) and the public’s perception of those results. While the administration argued that tariffs would protect domestic industries and that foreign exporters would bear the costs, empirical evidence showed a “complete pass-through” of these costs to U.S. importers and consumers. This resulted in a $1.4 billion monthly deadweight loss to U.S. welfare and redistribution of wealth away from the rural communities the policies aimed to protect. Data from this study’s primary survey reveals that while basic literacy regarding tariffs is high across all demographics, a “perception gap” exists in the ability to identify the ultimate bearer of trade costs. The survey brings to light a few key findings:"
        },
        {
          "type": "p",
          "text": "Firstly, the survey highlights the impact of economic education. Survey data indicate that formal economic training correlates with more decisive policy stances. Respondents in the “Econ Yes” group demonstrated a more positive outlook on international trade in question 13 compared to the “Econ No” group, who largely defaulted to a natural stance, suggesting that education moves respondents away from uncertainty."
        },
        {
          "type": "p",
          "text": "Secondly, the survey shows the difference between the respondents’ literacy and incidence skills. While most respondents across all demographics correctly calculated a tariff’s impact on price in question 11, those without an economics background showed greater uncertainty in ” or who actually bears the cost, in question 15. This suggests that the identifying the “incidence, perception gap is based on a lack of structural understanding regarding how costs pass through supply chains."
        },
        {
          "type": "p",
          "text": "Next, the survey highlights visibility bias and price awareness. Nearly universal recognition of rising costs in question 10 and generally the correct identification of U.S. consumers in Q15 highlight the power of direct experience. The prevalence of “price sensitivity” in qualitative responses suggests that the immediate, visible impact on personal finances is likely the largest factor aligning public perception with actual economic effects."
        },
        {
          "type": "p",
          "text": "Lastly, the qualitative justifications provided in question 16 reveal the personal perceptions of trade. The thematic classification of open-ended responses identifies personal price sensitivity (53.2%) and academic background (31.9%) as the primary drivers of public opinion. Concerns regarding partisan politics (2.1%) and national sovereignty (1.1%) remain marginal. This suggests that public sentiment is driven by a combination of formal learning and direct financial impact."
        },
        {
          "type": "p",
          "text": "In summary, the “perception” gap is likely driven by visibility bias, where immediate price increases carry more psychological weight than abstract benefits. To design more effective trade frameworks, policymakers must better communicate these complex realities and align perceived benefits with actual economic results."
        }
      ]
    },
    {
      "id": "references",
      "title": "References",
      "blocks": [
        {
          "type": "h3",
          "text": "Public Perception"
        },
        {
          "type": "p",
          "text": "Mankiw, N. G. (2016, July 29). Why Voters Don’t Buy It When Economists Say Global Trade Is Good. The New York Times. https://www.nytimes.com/2016/07/31/upshot/why-voters-dont-buy-it-when-economists-sa y-global-trade-is-good.html Vasilopoulou, S., Talving, L., & Keith, D. (2024). Public attitudes towards international trade and free trade agreements in the United Kingdom. The British Journal of Politics and International Relations, 27(3), 908–928. https://doi.org/10.1177/13691481241284363"
        },
        {
          "type": "p",
          "text": "Bearce, D. H., & Park, S. (2024). Mass Attitudes about International Trade Agreements: Positive Messages and the Trans-Pacific Partnership. International Studies Quarterly, 68(3). https://academic.oup.com/isq/article/68/3/sqae110/7732364?login=true"
        },
        {
          "type": "p",
          "text": "Quynh Nguyen, Robert A. Huber, Thomas Bernauer; Environmental Impacts and Public Opinion About International Trade: Experimental Evidence from Six OECD Countries. Global Environmental Politics 2021; 21 (3): 49–76. doi: https://doi.org/10.1162/glep_a_00607"
        },
        {
          "type": "p",
          "text": "Chatruc, M. R., Stein, E., & Vlaicu, R. (n.d.). How issue framing shapes trade attitudes: Evidence from a multi-country survey experiment. Journal of International Economics, 129, 103428. https://doi.org/10.1016/j.jinteco.2021.103428"
        },
        {
          "type": "p",
          "text": "Chor, L. a. M. C. D. (2023). Can Evidence-Based information shift preferences towards trade policy? NBER. https://doi.org/10.3386/w31240"
        },
        {
          "type": "p",
          "text": "Public opinion on U.S. trade policy: Time to ask better questions. (n.d.). Institute for New Economic Thinking. https://www.ineteconomics.org/perspectives/blog/public-opinion-on-u-s-trade-policy-time- to-ask-better-questions"
        },
        {
          "type": "p",
          "text": "Autor, D., Dorn, D., & Hanson, G. (2016). The China Shock: Learning from Labor Market Adjustment to Large Changes in Trade. In National Bureau of Economic Research. https://doi.org/10.3386/w21906"
        },
        {
          "type": "p",
          "text": "Jin, Y., Dorius, S., & Xie, Y. (2022). Americans’ Attitudes toward the US–China Trade War. Journal of Contemporary China, 31(133), 17-37. https://doi.org/10.1080/10670564.2021.1926089"
        },
        {
          "type": "p",
          "text": "Fajgelbaum, P., & Khandelwal, A. (2021). The economic impacts of the US-China trade war. National Bureau of Economic Research. https://doi.org/10.3386/w29315 Weinman, J., & Weinman, J. (2019, May 14). The costs of tariffs in the U.S.-China trade war | Econofact. Econofact | Key Facts and Incisive Analysis to the National Debate on Economic and Social Policies. https://econofact.org/the-costs-of-tariffs-in-the-u-s-china-trade-war"
        },
        {
          "type": "p",
          "text": "\"The Impact of the 2018 Tariffs Amiti, Mary, Stephen J. Redding, and David E. Weinstein. 2019. on Prices \" Journal of Economic Perspectives 33 (4): 187–210. and Welfare. DOI: 10.1257/jep.33.4.187 https://www.aeaweb.org/articles?id=10.1257%2Fjep.33.4.187"
        },
        {
          "type": "p",
          "text": "Flaaen, A., Hortaçsu, A., & Tintelnot, F. (2020). The production relocation and price effects of US trade policy: the case of washing machines. American Economic Review, 110(7), 2103–2127. https://doi.org/10.1257/aer.20190611"
        },
        {
          "type": "p",
          "text": "Fajgelbaum, P., Goldberg, P., Kennedy, P., & Khandelwal, A. (2019). The return to protectionism. National Bureau of Economic Research. https://doi.org/10.3386/w25638"
        },
        {
          "type": "p",
          "text": "Baker, S. R., Bloom, N., & Davis, S. J. (2016). Measuring economic policy uncertainty*. The Quarterly Journal of Economics, 131(4), 1593–1636. https://doi.org/10.1093/qje/qjw024"
        },
        {
          "type": "h3",
          "text": "Numerical Data"
        },
        {
          "type": "p",
          "text": "Homepage | Bureau of Industry and Security. (n.d.). https://www.bis.doc.gov/index.php/country-papers/2735-2020-statistical-analysis-of-u-s-tr ade-with-china/file"
        },
        {
          "type": "p",
          "text": "TRADING ECONOMICS. (n.d.). United States GDP. https://tradingeconomics.com/united-states/gdp"
        },
        {
          "type": "p",
          "text": "Reports, Statements & Publications | Bureau of the Fiscal Service. (2026, April 9). https://fiscal.treasury.gov/files/reports-statements/combined-statement/cs2016/receipt.pd f"
        },
        {
          "type": "p",
          "text": "Consumer Price Index, 1913- | Federal Reserve Bank of Minneapolis. (n.d.). https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-p rice-index-1913-"
        },
        {
          "type": "p",
          "text": "Disposable income and spending growth | FRED Blog. (n.d.). https://fredblog.stlouisfed.org/2025/07/disposable-income-and-spending-growth/"
        },
        {
          "type": "p",
          "text": "Bown, C. P. (2025, November 14). US-China Trade War Tariffs: An Up-to-Date Chart. Peterson Institute for International Economics. https://www.piie.com/research/piie-charts/2019/us-china-trade-war-tariffs-date-chart"
        },
        {
          "type": "p",
          "text": "Helm, B. (2019). Record Number of Americans Say International Trade Is Good for the US Economy. Globalaffairs.org. https://globalaffairs.org/research/public-opinion-survey/record-number-americans-say-int ernational-trade-good-us-economy"
        }
      ]
    },
    {
      "id": "appendix",
      "title": "Appendix",
      "blocks": [
        {
          "type": "figure",
          "src": "/pdfs/thesis/table5.png",
          "width": 1080,
          "height": 970,
          "caption": ""
        }
      ]
    }
  ]
}
