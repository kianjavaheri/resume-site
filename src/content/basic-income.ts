import type { Paper } from './papers'

// Generated from public/pdfs/basic-income/basic-income.pdf. Paragraph breaks follow the
// PDF's own first-line indents, and the figures are cropped from the pages
// where they sit. See CLAUDE.md, "Paper pages".
export const basicIncome: Paper = {
  "slug": "basic-income",
  "eyebrow": "Economics Capstone",
  "title": "Universal Basic Income vs. Targeted Welfare: A Macroeconomic Assessment",
  "meta": [
    {
      "label": "Course",
      "value": "ECN 475"
    },
    {
      "label": "Instructor",
      "value": "Professor Claudiney Pereira"
    },
    {
      "label": "Date",
      "value": "18 November 2025"
    },
    {
      "label": "Length",
      "value": "24 pages"
    }
  ],
  "actions": [
    {
      "label": "View PDF",
      "pdfSrc": "/pdfs/basic-income/basic-income.pdf"
    }
  ],
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "blocks": [
        {
          "type": "p",
          "text": "At its core, basic income (BI) or universal basic income (UBI), as used almost interchangeably in this paper, is a simple but potentially strong policy option to address poverty and inequality. In UBI, the state regularly gives people money with no conditions attached. The term ‘universal’ means the transfer goes to everyone within a population instead of a targeted subgroup, ‘basic’ means the amount is meant to provide a minimum floor of security and not a full living wage, and ‘income’ means that this is a recurring cash transfer to individuals instead of an in-kind benefit. For decades, this idea has floated around in policy debates and ebbs and flows in times of crisis or change."
        },
        {
          "type": "p",
          "text": "This paper looks at five recent journal articles to study how basic income performs in practice and in policy models, with a particular focus on feasibility. The following compares evidence from developed economies, the United States, Finland, and New Zealand, with that from developing and middle-income economies, Indonesia, Peru, and South Africa. The paper starts by looking at the developing countries and addresses how different designs and tax instruments affect macroeconomic outcomes. It then pivots to comparing targeted to universal benefits. It concludes by looking at how UBI plays out in more developed countries by addressing aggregate outcomes, changes in taxes, and even how UBI affects welfare."
        }
      ]
    },
    {
      "id": "hollander-et-al",
      "title": "Hollander et al. (2024) – South Africa",
      "blocks": [
        {
          "type": "p",
          "text": "In Hollander et al. (2024), the authors study how different basic-income-grant (BIG) designs would work out macroeconomically in South Africa, given its high unemployment rate, inequality, and limited fiscal power. The authors aim to see what happens to growth, employment, debt, and the tax composition when the government expands cash transfers to working adults, and which funding choices (VAT, personal or corporate income taxes, or debt) minimize the economic costs. The main motivation is the country’s high poverty and unemployment, with already elevated public debt. These conditions make large, permanent transfers an attractive idea, but they do pose fiscal risks. The authors hypothesize that cash grants do help poor households spend more, but if the grant is too large or universal, it tends to slow the overall economy and strain the budget unless you also impose reforms that boost growth. Additionally, smaller, targeted grants are seen to be more affordable, despite also creating noticeable tax increases."
        },
        {
          "type": "p",
          "text": "Using real data (growth, prices, jobs, taxes, government spending, debt, and borrowing costs), the authors established a dynamic stochastic general equilibrium (DSGE) model. In this model, there are two kinds of households: poor households (“non-Ricardian”) who spend whatever they get (including grants), and rich households that save and plan (“Ricardian”). In short, the model aims to simulate the South African economy. The model is dynamic (multi-period), stochastic (includes uncertainty), and general equilibrium (captures supply and demand in key markets). This model lets the researchers test different ways to pay for the grant (the “tax mix”) and different ways to spend the overall budget (the “spending composition”). It then compares their effects on the economy. The types of taxes include VAT (value-added tax on goods), PIT (personal income tax), and CIT (corporate income tax). As for the spending composition, a government can spend its money on consumption (daily operations, salaries, services), investment (like infrastructure), and transfers, which are the cash grants like the BIG."
        },
        {
          "type": "p",
          "text": "The researchers test three scenarios. Scenario 1 allows for tax and debt financing. It assumes the National Treasury will fund the BIG. Scenario 2 uses only taxes to fund the BIG. It uses the optimal mix of VAT, PIT, and CIT to fund the transfers. Lastly, scenario 3 uses government investment as well as tax funding. In short, the model captures key economic variables in order to “stress-test” cash grants. If a government chooses to increase cash transfers, the model helps to find the least damaging way to finance and structure them."
        },
        {
          "type": "p",
          "text": "The results of the simulation show that the BIG would decrease economic growth through three main channels: an increase in borrowing costs, an increase in taxes, and crowding out of private and public non-transfer spending. It would have a positive impact on economic growth through one main channel: an increase in consumption by poor households."
        },
        {
          "type": "p",
          "text": "The result of scenario 1 (National Treasury funding) shows that the model estimates that converting SRD 350 (South Africa’s Social Relief of Distress grant at R350 per person per month [R is a South African rand]) to a permanent BIG would require increased public debt and increases in VAT, PIT, and CIT. The consumption of poor households would rise; however, the model predicts that there would be job losses, largely attributed to the crowding-out effects."
        },
        {
          "type": "p",
          "text": "Also, introducing a grant at the food poverty line (R585 per person) would lead to higher debt. VAT and PIT would increase, and debt would also rise. Like the prospective SRD 350 to BIG conversion, there would also be job losses (around 200,000 [South Africa’s population is 64 million]). The contractionary effects typically follow the flow of higher debt, leading to higher borrowing costs and lower long-run GDP growth. Government expenditure is also directly crowded out by the BIG since they have to pay for those transfers instead of spending the money elsewhere. There is also crowding out in the private sector from the higher taxes, since people will spend less."
        },
        {
          "type": "p",
          "text": "In scenario 2 (only taxes to fund the BIG), debt is also seen to rise marginally because of the slowed economic growth. The researchers note that funding the BIG from VAT alone would need an increase of 7%. Combinations of VAT and PIT would also require substantial tax increases. This increased tax would lead to economic contraction, even though there would be some job creation from the higher transfers."
        },
        {
          "type": "p",
          "text": "In scenario 3 (government investment and taxes), the assumption was that the increased GDP would help pay for the transfers. In this scenario, VAT would still need to rise to fund the transfers. This scenario also leads to job gains (like scenario 2), but they don’t come from the transfers; they come from the changes needed to increase the economic output."
        },
        {
          "type": "p",
          "text": "Overall, there are a few main takeaways from the paper. When you give cash to the poorer households, they spend more, so their living standards go up. However, big grants strain the economy since to pay for a large grant, the government must raise taxes a lot or borrow a lot. Higher taxes mean families and firms will spend/invest less, which crowds out private investment. So the question becomes, which taxes hurt less? If you have to balance the budget, using VAT (sales tax) tends to be the less damaging option as opposed to increasing personal or corporate income taxes. Despite this, the VAT increase needed for a universal grant (UBI) would still need to be large. Another limitation on South Africa specifically is that it cannot just borrow more money since it already pays a risk premium. Borrowing more would create more debt and higher interest rates, which would crowd out private investment."
        },
        {
          "type": "p",
          "text": "Despite basic income grants helping poorer households, no matter what way you put it, this study demonstrates that imposing a basic income creates welfare loss through higher taxes, debt, and consequently, private and public crowding-out on investment. So in short, large-scale cash transfers would be too costly for a country like South Africa since the increased taxes would be too harmful to the economy to justify the help to the poorer households."
        }
      ]
    },
    {
      "id": "hanna-and-olken",
      "title": "Hanna and Olken (2018) – Indonesia & Peru",
      "blocks": [
        {
          "type": "p",
          "text": "The next article covered was Hanna and Olken (2018), which focuses on the policy choice in low and middle-income countries of transferring cash to everyone (Universal Basic Income [UBI]) or targeting transfers to the poor. They claim that since most workers in developing countries do not make a high enough income to even pay income tax, targeting problems like inclusion errors (giving transfers to people who are not poor) and exclusion errors (failing to give a transfer to those who are poor and need the money) arise. At first glance, UBI seems like it would fall to the inclusion error; however, having richer individuals finance the grants (thus offsetting the UBI they receive) could still result in redistribution to the poor. In this study, the authors use nationally representative microdata from Indonesia and Peru, which are countries with pre-existing large, targeted cash programs that help simulate how targeting compares to a UBI approach under the same budget."
        },
        {
          "type": "p",
          "text": "When it comes to targeted transfers, the largest issue in most poor countries is that the government does not observe any information about income for most people. In Indonesia and Peru, Jensen (2016) reports that 87.5% and 79% of the country’s employed populations, respectively, have incomes below the tax exclusion thresholds. This is due to the large ‘informal sector’ which includes casual labor, undocumented firms, and small farms. In a country with a large number of people outside the tax net (a poor, small country), there are two more issues. The first is that the net transfer could be the same for most of the population (all of those below the tax-exempt cutoff), which might not be optimal in helping the poor people who need the money. The second issue is that only a small proportion of households will be funding the policy, which could hold back the overall amount of funds available to contribute to financing UBI."
        },
        {
          "type": "p",
          "text": "If governments in developing countries have no information on their population’s income, how can they target transfers to poor households? The answer is simple: they estimate it. In the paper, the authors explain that governments use what is called a proxy-means test, which is a way to find who is most likely to be poor based on periodic quasi-censuses of the population. These censuses are usually done by going door-to-door and asking about easily observable assets (rather than income, since people tend to lie about income). The government can then use these assets to predict income. The government will compare this to other datasets of self-reported income to verify. Note that the self-reported datasets are lower stakes (research purposes rather than for targeting), so there is less incentive for households to lie. From this point, the government can set a threshold for those who qualify for benefits. This works fairly well, but since this is an approximation, there will still be inclusion and exclusion errors."
        },
        {
          "type": "p",
          "text": "The authors provide background by comparing targeted programs to UBI (Indonesia and Peru). Both Indonesia and Peru have several targeted transfer programs, and Indonesia even has a few unconditional transfer programs. However, for the sake of simplicity, the authors chose just one program from each country. For Indonesia, they chose the Bantuan Langsung Tunai (BLT) program, which was a temporary, unconditional cash transfer to poor households. For Peru, they chose the Juntos program, which is a conditional cash transfer to mothers aimed at subsidizing child health and educational outcomes. Both of these programs targeted about a third of the population."
        },
        {
          "type": "p",
          "text": "The authors get data from the National Socioeconomic Survey (SUSENAS) and the Peruvian National Household Survey (ENAHO) for the years 2010 and 2011. For each country, they randomly divide the samples into a training and a test set. In the training set, they regress monthly household consumption per capita on the proxy-means test formula variables. Then they predict monthly consumption per capita for each household in the test sets using the parameters derived from the training regressions."
        },
        {
          "type": "p",
          "text": "Results from the monthly consumption per-capita regressions gave a graph of predicted log per-capita monthly consumption against actual log per-capita monthly consumption, as seen in Figures 1 and 2. The graph was split into four quadrants: quadrant 1 shows the inclusion error (households who received the transfer that should not have), quadrant 2 shows correct exclusion (people who correctly did not receive the transfer), quadrant 3 shows correct inclusion (people who correctly received the transfer), and quadrant 4 shows the exclusion error (people who did not receive the transfer that should have). For Indonesia, they found an inclusion error of 7.4% and an exclusion error of 58.2% as seen in Figure 1. For Peru, they found an inclusion error of 6.4% and an exclusion error of 52.4% as seen in Figure 2. Despite the high exclusion error, the authors believe that with a fixed budget, concentrating payments raises the benefit size for those it did reach (quadrant 3), which dominates the loss from leaving out some of the poor (quadrant 4). Comparatively, UBI on this graph would look like a smaller quadrant 3 (less poor households targeted) and a larger quadrant 1 (more people receiving transfers that do not need it)."
        },
        {
          "type": "p",
          "text": "Moving beyond this, the researchers discuss another issue with targeted transfers in that a substantial proportion of households that are eligible do not enroll in the program. UBI may reduce this problem because the government can simply send the checks to everyone automatically. There are still issues with this since the government would need everyone’s information and ensure there are no duplicates, which is hard to get since most developing countries do not have these lists. Despite this, UBI is certainly an easier policy to enact and would likely result in a higher take-up rate of the benefits since people automatically receive money."
        },
        {
          "type": "p",
          "text": "Overall, this study provides a few main takeaways when comparing UBI to targeted transfers in these developing countries. The most important takeaway is that there are tradeoffs between using UBI as opposed to a targeted transfer, and neither policy option is strictly better than the other. The pros of UBI are that there is zero exclusion, so no one is missed, and also it is much easier to implement. The tradeoff is that in developing countries, it is hard to tax back the households that should not have received the transfer, causing an inefficiency in the program. Another tradeoff is that UBI will require a higher consumption tax, which the poor will have to pay. On the other hand, the pros of a targeted transfer are that poorer households receive a larger amount and demonstrate higher welfare than UBI. The policy is also more efficient for the government budget, especially when taxes are not flexible. However, a large tradeoff is that it’s hard to implement targeted transfers in developing countries since income is not observed for a majority of the population. Proxy-means testing helps reduce this problem, but still provides a sizable exclusion error. It may not matter, though, since targeting poorer households dominates the welfare loss from missing some of the poorer households. Overall, this paper provides a clearer view of the tradeoffs of UBI compared to a targeted transfer policy choice."
        }
      ]
    },
    {
      "id": "luduvice",
      "title": "Luduvice (2024) – United States",
      "blocks": [
        {
          "type": "p",
          "text": "Taken together, the last two studies clearly demonstrate how difficult it is for low and middle-income countries to implement basic income as policy. In contrast, the evidence from higher-income economies highlights a different set of constraints and tradeoffs. Starting with Luduvice (2024), the article studies what happens to macroeconomic outcomes, inequality, and welfare in the U.S. when it replaces existing income-security with a universal basic income (UBI) and funds it with a consumption tax. The author proposes two counterfactuals (to the means-tested income security). The first is UBI with neutral expenditure, meaning constant government spending. In other words, the result shows what happens when the researcher changes who receives transfers and how, not how much is spent in total. The second counterfactual shows a large UBI with an increase in the total amount of transfers. The author states the similarity to Andrew Yang’s proposed policy, which would allot a $1000 universal transfer financed through VAT."
        },
        {
          "type": "p",
          "text": "The model used is a heterogeneous-agent overlapping-generations general-equilibrium model calibrated to U.S. data/institutions, including important asset and earnings tests (eligibility for benefits based on assets and earnings). Price, taxes, transfers, and behavior help determine macroeconomic aggregates (GDP, employment, capital, consumption, inequality). Households differ by age, ability, productivity shock (random events that cause a decrease in productivity), human capital stock (accumulated skills and education), and assets. Households are also allowed to differ in terms of having children (up to 3) or not (assumes households do not decide the number of children to have). The model has a single produced good, which is technology, and is given by a Cobb-Douglas production function with constant returns to scale. All agents are given a single unit of time and are forced to retire at a given age. The government runs a welfare system that is designed to mimic the U.S. economy. It has public spending, payments of debt, and also collects household taxes. The income security system (IS–this is what UBI is being compared to), which consists of the Earned Income Tax Credit (EITC), Supplemental Nutrition Assistance Program (SNAP), and Supplemental Security Income (SSI), is only available when people retire."
        },
        {
          "type": "p",
          "text": "Furthermore, the model assumes that people start at age 20, retire at 65, and die at 100. The average hours dedicated to work, conditional on employment, are a third of the household’s time. The capital to output ratio is also calibrated to be 2.9, as for Kindermann and Krueger (2022), meaning agents produce $2.90 of capital for every $1.00 of yearly output. The capital share of the economy is set to be 35%, which is the average for the US between 1960 to 2007. The real interest rate is 4% and the labor share is always 65%. In other words, 35% is paid to capital (owners of machines, buildings, etc.) as income/profit, and 65% is paid to workers as wages. The Gini coefficient for the economy is set to 0.010. The fraction of pure government public spending is set to be 20% and it follows the debt-to-GDP ratio to 63%. In short, all of these parameters match the U.S. numbers to calibrate the model to the U.S. economy."
        },
        {
          "type": "p",
          "text": "The results are broken down by the two counterfactuals discussed earlier. Note that the scenarios are denoted as ‘UBI’ and ‘UBI AY’ (UBI Andrew Yang) respectively, and are compared to the already in place system denoted as ‘Means-Tested’. For the first counterfactual, the results show an overall increase in all the main aggregate variables (Y-GDP, K-capital, L-labor, C-consumption, H-average hours worked, ER-employment rate) as seen in the ‘UBI’ column in Figure 3. The capital-to-labor ratio increases since the capital grows more than the income. This reflects an increase in precautionary savings due to the contraction of the IS system for poorer households and the lack of a penalty for saving. Furthermore, labor supply, hours worked, and employment rate all increased, with the employment rate rising significantly. This is likely due to poorer households receiving a smaller level of transfers on average."
        },
        {
          "type": "p",
          "text": "The labor supply and savings increase mean more people are working and are working a bit more, which allows them to save more. As a result, there is less earnings inequality and less wealth inequality in general. Since in this scenario the money that the government transfers is kept constant, but GDP is growing, it requires an increase in the consumption tax of 1.5%. This tax increase makes consumption a little bit more expensive for households, so they save more, which means consumption will grow more slowly relative to GDP. Additionally, the capital-to-labor ratio decreases, wages moderately increase, and the interest rate decreases. This creates a welfare gain, which is, in short, derived from the decrease in inequality."
        },
        {
          "type": "p",
          "text": "For the second counterfactual, the general result is that the economy slows drastically and then recovers. It shows that average hours worked go down, and the employment rate as a whole goes down, meaning people are choosing not to work, likely because UBI raises the value of not working. Furthermore, the capital-to-output ratio decreases because output drops faster than capital. As the author expected, the increase in taxation to meet the goal level of transfers has increased to 23.6% (as opposed to 4.3% for means-tested and 5.8% for scenario 1). The high taxes and lower labor supply decrease economic growth; however, scenario 2 still shows robust welfare gains. The welfare losses from the increase in taxes and lower output are compensated by the increase in leisure, disposable income, and insurance through the transfer."
        },
        {
          "type": "p",
          "text": "Additionally, human capital rises relative to GDP, which the author claims stems from a ‘selection effect’: low-productivity workers are automatically sorted into a zero labor supply box since they can afford to just not work. Meanwhile, high-productivity workers stay in the workforce throughout their whole life. As a result, the earnings Gini increases above the means-tested value, indicating that there is more earnings inequality."
        },
        {
          "type": "p",
          "text": "Overall, there are a few main takeaways. The size of the transfer and how they are financed matter the most. A small, expenditure-neutral UBI (replacing current means-tested programs with UBI and funding them with a consumption tax) gives larger economic output, less pre-tax inequality, and a positive welfare gain. On the other hand, the large UBI funded by a larger consumption tax increase lowers economic output and employment (although welfare is still positive). For the expenditure-neutral approach, removing means tests raises work incentives for poorer households, whereas for the large UBI, more households can afford not to work. The neutral UBI shows better efficiency and equality than the large UBI, despite households at the very bottom losing some targeted support. On the other hand, the large UBI wins on insurance and welfare, despite lowering economic output."
        },
        {
          "type": "p",
          "text": "So, what does this mean for the U.S.? Should they impose UBI? This paper suggests that a small UBI could potentially be helpful as it can lead to greater economic efficiency and equality. The only caveat is that households at the very bottom would need some targeted support, so potentially increasing the consumption tax a bit more to help those at the bottom could solve the problem. Overall, Luduvice (2024) shows that UBI shouldn’t replace targeted transfers, but can be used to complement them."
        }
      ]
    },
    {
      "id": "verho-et-al",
      "title": "Verho et al. (2022) – Finland",
      "blocks": [
        {
          "type": "p",
          "text": "Moving away from the United States, Verho et al. (2022) study whether replacing Finland’s minimum unemployment benefits with an unconditional basic income (BI) of equal size improves employment. The authors aim to find if removing ‘welfare traps’ (when working more does not make an individual better off) raises employment for long-term benefit receivers. Within Finland, these unemployment benefits disappear once an individual finds work, which could potentially lower their welfare even though they are employed. Despite this, the benefits are conditional upon an individual engaging with Active Labor Market Programs (ALMPs, which are services to help people find work)."
        },
        {
          "type": "p",
          "text": "This study began in January 2016, and randomly selected a handful of recipients of minimum unemployment benefits. These recipients received €560 a month regardless of earnings or job-seeking status. Note that this study focuses on basic income allotted to the population that is unemployed and not simply everyone within Finland’s population. Regardless, the study provides key findings for basic income as a policy option in the Nordic country, Finland."
        },
        {
          "type": "p",
          "text": "The target population was all 25-58-year-olds on minimum unemployment benefits in November 2016. The sample size was around 175,000. The Social Insurance Institution (SII) randomized 2,000 people into the treatment group, and participation was mandatory. The data for this study comes from the SII and the Ministry of Economic Affairs and Employment, which collected information on all official dealings with and services provided to unemployed people. They also got data for the employment contracts from the Finnish Centre for Pensions. Additional information has been collected by the Tax Administration and the Population Register Centre. From the sample, notable biases could come from the skewness toward lower education and a high medical condition rate of 16%, which is relevant as it makes them weaker employment prospects. They compared this to a control group that received no treatment and continued on the existing unemployment benefit system (no BI). The primary outcome of the regression was days of employment. On the other hand, secondary outcomes included earnings, taxable income, benefit amounts, and service use. They used OLS to explore the causal effect of basic income on these outcomes."
        },
        {
          "type": "p",
          "text": "Results of the control group showed an increase in employment from 8% to 18% with the results of the treatment group showing similar results. In short, the first year (2016 to 2017) showed basically no differing effect (statistically insignificant). However, in year 2 (2017 to 2018), there was a small positive effect for the treatment group that was statistically significant (~2% above the control group). Despite this, the authors mention that this could be due to harsher conditions introduced to the control group, which means that this difference cannot be solely attributed to the basic income experiment."
        },
        {
          "type": "p",
          "text": "The authors also looked at the take-up rate of the benefits. The control group shows a steady decrease from 87% to 50% whereas the treatment group's rates drop quickly during the first few months, smooth out in the middle of the timeline, and then start to increase towards the last few months. In the end, the treatment group’s rate was 15-17% lower than the control group's. This result shows that around two-thirds of the treatment group are still on the unemployment benefits (in addition to the new BI), which is actually a positive outcome as it shows that people can rely less on conditional unemployment benefits."
        },
        {
          "type": "p",
          "text": "As for the result of the OLS regression, the primary outcome (days employed) shows no significant change in the first year of the experiment. However, a statistically significant effect appears in the second year with an estimated increase of 6.6 days from UBI, which corresponds to an increase of 8.6% of employment compared to the control group. This aligns with the previous results in the treatment group showing higher employment than the control."
        },
        {
          "type": "p",
          "text": "Secondary outcome results (earnings, taxable income, benefit amounts, service use) are also interpreted within this study. To start, earnings show an insignificant change in the first year, similar to the results of the primary outcomes. After this initial year, earnings show an increase of about 4.4%. However, this is still not statistically significant, so the authors cannot make the claim that BI raised earnings. Furthermore, there is also no significant change in the earnings distribution for the experiment. As for taxable income, in the first year, the total income in the BI group was €1,362 higher on average. This makes sense as the BI increases the group’s overall income. Additionally, the second year income gap grows to €1,873. This also makes sense as people are now working on top of receiving that BI increase. There was also a significant decrease in sickness benefits for the BI group; however, the author claims that these benefits pay about the same level as the unemployment benefits, so there is less of an incentive for the group to apply."
        },
        {
          "type": "p",
          "text": "Lastly, the authors look at the results of employment services. The concern was that if people no longer needed to cooperate with the job center to keep their money, would they just give up on reemployment services? The authors find that the answer is no. The BI group still spent about 100 days in ALMPs in 2017 and 80 days in 2018. In the first year (2017), this was only 11% less than the control group. Be wary, though, that this could be attributed to the BI recipients receiving similar help from other providers and not just the official employment service. The authors also bring up sanctions, which are penalties the administration can impose if one refuses ALMP participation (does not apply to BI). The results show that sanctions are only 23% lower in 2017 and 5% lower in 2018 for the BI group. The authors claim that if people really did not like ALMPs and BI made them comfortable enough to skip them, they would see a larger drop than 7% in employment plans and 23% in sanctions. Since the differences are not large, they claim that people are mostly willing to cooperate with the ALMPs even when their BI does not depend on it."
        },
        {
          "type": "p",
          "text": "Overall, this study aimed to see what happens when these welfare traps caused by conditional benefits are removed (by introducing BI). The authors tested the days of employment and secondary outcomes like earnings, income, and ALMP participation. In short, employment very slightly increased, earnings remained the same, and income increased. Another important outcome was that people continued to engage with reemployment services even when they did not have to due to the BI. So in short, from BI, people barely worked more, did not earn more, and did not stop engaging with reemployment services. However, it did raise people’s overall income, along with other benefits like simplicity in the system (money just goes to everybody instead of certain individuals)."
        }
      ]
    },
    {
      "id": "suzuki",
      "title": "Suzuki (2024) – New Zealand",
      "blocks": [
        {
          "type": "p",
          "text": "Lastly, an article focusing on UBI in a developed, but aging society helps us understand the comprehensive effects of saving regret and time inconsistency. In Suzuki (2024), the author aims to study whether New Zealand should replace its public pension system with UBI. This would extend the benefits of the system to everyone and not just the elderly, and consequently would require higher taxes to finance it. The author notes that the tax changes affect how households choose between consuming in the short-run compared to saving for the future. These decisions may later be regretted as a result of ‘time-inconsistent preferences’ (people’s preferences change as they age). This creates what the author calls ‘saving regret’, where people look back and feel like they saved too little when they were younger and wish they had acted differently. The overall goal of the study is to evaluate different UBI designs compared to the current system, and take these behavioral biases into account instead of assuming standard rational agents."
        },
        {
          "type": "p",
          "text": "The author builds an overlapping-generations (OLG) model where many generations of households are alive at once, and each household decides how much to consume and save over its life. Time-inconsistent preferences are built into the model, in that younger households intend to save a certain amount and then, when they look back later in life, they realize they potentially should have saved more. The model also compares policies like the status quo (New Zealand’s public pension system), UBI financed by higher income tax, and UBI financed by higher consumption tax. The author studies which policy households prefer at different ages, how their preferences change over their life, and how the results change when the population growth rate falls (an aging society)."
        },
        {
          "type": "p",
          "text": "The author calibrates the model for New Zealand. The unemployment rate for the model was set to 5.39%, which was the New Zealand average from 1995 to 2020. The growth rate was set to 1.11%, which was the average during 2000 to 2020, according to the United Nations. The author also uses quasi-hyperbolic discounting for the households. Normally, economic models assume exponential discounting where today has a certain expected utility and the next period has a weight of β, and then the next two days are β2, and so on. For quasi-hyperbolic discounting, you have the utility for the next days calculated by b0β2 , where b0 (0 ≤ b0 ≤ 1) is present bias (cuts the utility of the future). This essentially models how people tend to value the present more than the future because it is not right now. The author chooses b0 = 0.9 since it's strong enough to create saving regret but not so extreme that people act too irresponsibly. Households are also unaware that they have present-biased preferences since this is more realistic, as Augenblick & Rabin (2019) state that people underestimate their self-control problems."
        },
        {
          "type": "p",
          "text": "When UBI is paid for by raising the income tax, the model shows that people are generally better off sticking with the current public pension system. Higher income taxes directly reduce the reward from working and from saving out of labor income, so present-biased households end up saving even less than they should. When they look back later in life, they experience more saving regret under this version of UBI than under the existing pension, and overall lifetime welfare is lower."
        },
        {
          "type": "p",
          "text": "When UBI is funded by a higher consumption tax, the results are more mixed. In the model, many households prefer this UBI system when they are younger, because they like getting an unconditional transfer spread over their whole life rather than only in old age. However, because they are present-biased, they still do not save enough. As they age and see the consequences of their low savings, they tend to change their minds and start to prefer the original pension system, which provides a guarantee in old age. In other words, a lot of the support for a UBI financed through a consumption tax turns into regret in old age."
        },
        {
          "type": "p",
          "text": "The author also lowers the population growth rate in the model to potentially simulate an aging society with fewer workers. In this case, it becomes harder to finance any transfer system with a sizable sum, and the tradeoff between flexibility when young (choosing your work hours and having a guaranteed income) and security when old (pension) becomes stronger. The model shows that saving regret becomes even more important. The gap between what people think they want when they are young and what their older selves would have preferred gets larger."
        },
        {
          "type": "p",
          "text": "Overall, the main message of the results of the study is that a UBI funded by income tax is worse than the current pension system, and even a UBI funded by consumption tax can generate sizable regret later in life for the present-biased households. Once time inconsistency and saving regret are factored in, the model shows the potential drawbacks to replacing New Zealand’s public pension with UBI, especially in an aging society."
        }
      ]
    },
    {
      "id": "conclusion",
      "title": "Conclusion",
      "blocks": [
        {
          "type": "p",
          "text": "Taken together, these studies demonstrate that UBI is neither a catch-all solution nor an obviously bad idea, but rather a policy whose consequences depend heavily on where it is implemented, how large the transfer is, and how it is financed. In lower and middle-income countries, limited fiscal power, lack of observable information, and a low tax base make large universal grants extremely costly: either taxes and debt must rise to levels that slow growth and crowd out public and private investment, or the grant must be so small that it does little to reduce poverty. Targeted programs in those environments create harmful exclusion errors, though there is limited evidence suggesting that even then, they provide higher welfare than a small UBI given to everyone. In contrast, richer countries with stronger tax systems have a more nuanced outcome. A small expenditure-neutral UBI in the United States can raise output and lower inequality, while Finland’s experiment shows that basic income can simplify the system and raise income without destroying work efforts. At the same time, a large Andrew Yang-style UBI would slow the U.S. economy even as it raises welfare through insurance and leisure. Furthermore, New Zealand’s life-cycle model shows different risks in that present-biased households may enjoy a lifetime UBI when they are young, but later regret it when they have reduced pensions."
        },
        {
          "type": "p",
          "text": "As for policy, the main tradeoffs are clear. Universality reduces administration efforts and exclusion, but creates more inclusion errors and requires higher, often unreasonable taxes. Bigger grants buy more insurance and security, but come at the cost of slower growth, and in some poor designs, lower employment. For UBI, income tax financing can weaken work and saving incentives, and consumption tax financing is less damaging, but still places a burden on the poor. Given the outcomes from the studies and the economic landscape of the United States, evidence does not support replacing the existing safety net with a large UBI. Instead, it points towards a more medium-sized UBI, financed by a reasonable consumption tax, as a complement to targeted programs that continue to protect the very poorest and to provide aged insurance (pensions, disability benefits). Furthermore, if any countries are in a position to experiment with UBI, it would be high-income states with flexible tax bases and preexisting welfare systems, and even then, the safest designs should be financed with care and aimed to complement targeted support, rather than replace it."
        }
      ]
    },
    {
      "id": "figures",
      "title": "Figures",
      "blocks": [
        {
          "type": "figure",
          "src": "/pdfs/basic-income/figure1.png",
          "width": 1248,
          "height": 974,
          "caption": "Figure 1"
        },
        {
          "type": "figure",
          "src": "/pdfs/basic-income/figure2.png",
          "width": 1138,
          "height": 972,
          "caption": "Figure 2"
        },
        {
          "type": "figure",
          "src": "/pdfs/basic-income/figure3.png",
          "width": 1316,
          "height": 980,
          "caption": "Figure 3"
        }
      ]
    }
  ],
  "references": [
    "Hollander, H., Havemann, R., & Steenkamp, D. (2024). The Macroeconomics of Establishing a Basic Income Grant in South Africa. South African Journal of Economics, 92(1), 57–68.",
    "Hanna, R., & Olken, B. A. (2018). Universal Basic Incomes versus Targeted Transfers: Anti-poverty Programs in Developing Countries. Journal of Economic Perspectives, 32(4), 201–226. https://doi.org/10.1257/jep.32.4.201",
    "Luduvice, A. V. D. (2024). The Macroeconomic Effects of Universal Basic Income Programs. Journal of Monetary Economics, 148. https://doi.org/10.1016/j.jmoneco.2024.103615",
    "Verho, J., Hamalainen, K., & Kanninen, O. (2022). Removing Welfare Traps: Employment Responses in the Finnish Basic Income Experiment. American Economic Journal: Economic Policy, 14(1), 501–522. https://doi.org/10.1257/pol.20200143",
    "Suzuki, T. (2024). Universal basic income, time inconsistency and saving regret. Journal of the Asia Pacific Economy, 29(4), 2007–2022. https://doi.org/10.1080/13547860.2023.2210902",
    "Kindermann, F., & Krueger, D. (2022). High Marginal Tax Rates on the Top 1 Percent? Lessons from a Life-Cycle Model with Idiosyncratic Income Risk. American Economic Journal: Macroeconomics 14 (2): 319–66. DOI: 10.1257/mac.20150170",
    "Augenblick, N., & Rabin, M. (2018). An Experiment on Time Preference and Misprediction in Unpleasant Tasks, The Review of Economic Studies, Volume 86, Issue 3, May 2019, Pages 941–975. https://doi.org/10.1093/restud/rdy019"
  ]
}
