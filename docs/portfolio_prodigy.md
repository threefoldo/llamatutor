# Portfolio Prodigy: Master the Market
## Enhanced Simulation Game Design

---

## Overview & Global Elements

**Game Purpose:** An interactive financial simulation where players become investment analysts, applying portfolio theory to solve real-world investment challenges while earning achievements.

**Global Interface Components:**
- **Header Bar:** Displays current level (1-4), mission title, progress bar showing completion percentage, points earned, and badges collected
- **Navigation Panel:** Visual "Mission Map" showing challenges as locations, with Quick-Access buttons for "Hint," "Calculator," "Glossary," and "Visualize"
- **Standard Three-Panel Layout:**
  - **Context Panel (25%):** Client profile with photo, investment goals, risk tolerance scale (1-10), time horizon, and special considerations
  - **Workspace Panel (50%):** Interactive calculators, asset allocation tools, data tables, and performance metrics that update in real-time
  - **Advisor Panel (25%):** AI-powered "Investment Guru" offering adaptive hints based on player actions and common mistakes

**Universal Interaction Elements:**
- **Portfolio Builder:** Drag-and-drop interface for adding specific stocks and ETFs with allocation percentages
- **Performance Calculator:** Automatically computes expected returns, volatility, Sharpe ratio, and other metrics based on inputs
- **Risk Visualizer:** Dynamic charts showing efficient frontier, risk-return scatterplots, and allocation pie charts
- **Submit Function:** "Finalize Portfolio" button that validates answers and provides feedback
- **Explanation Box:** Text area for players to justify their investment decisions (minimum 50 words required)

---

## Detailed Challenge Specifications

## Level 1: Portfolio Foundations

### Challenge 1.1: Build Your First Portfolio

**Learning Objective:**
Players will be able to construct a basic portfolio combining individual stocks and ETFs, calculate expected portfolio return and risk, and explain the benefits of diversification.

**Domain Context:**
You're a junior analyst at Capital Quest assigned to help Maria Chen, a 35-year-old software engineer with $100,000 saved for a home down payment in 3-5 years. She's moderately risk-averse (risk tolerance: 6/10) but wants her money to grow while maintaining safety. You need to recommend an appropriate mix of stock ETFs and bond ETFs/funds.

**Calculation/Task Reference:**
- Portfolio Expected Return: E(Rp) = w1 × E(R1) + w2 × E(R2) + ... + wn × E(Rn)
- Portfolio Variance: σp² = Σ Σ wi × wj × σi × σj × ρi,j
- Portfolio Standard Deviation: σp = √σp²
- Where:
  - wi = weight of asset i (must sum to 100%)
  - E(Ri) = expected return of asset i
  - σi = standard deviation of asset i
  - ρi,j = correlation coefficient between assets i and j

**Visual Design:**
- **Context Panel:**
  - Professional photo of Maria Chen in casual business attire
  - Infographic showing her financial situation:
    - Current savings: $100,000
    - Annual income: $125,000
    - Time horizon: 3-5 years
    - Risk tolerance: 6/10 (visual scale)
    - Goal: Home down payment

- **Workspace Panel:**
  - Historical 5-year data table for available investments:
    | Investment | Ticker | 5Y Avg Return | Standard Deviation | Current Allocation |
    |------------|--------|--------------|-------------------|-------------------|
    | Vanguard Total Stock Market ETF | VTI | 9.8% | 15.2% | [Adjustable] |
    | Vanguard Total Bond Market ETF | BND | 3.2% | 5.1% | [Adjustable] |
    | iShares Core S&P 500 ETF | IVV | 9.5% | 14.8% | [Adjustable] |
    | iShares 7-10 Year Treasury Bond ETF | IEF | 2.8% | 4.5% | [Adjustable] |
    | Apple Inc. | AAPL | 15.7% | 22.3% | [Adjustable] |
    | Microsoft Corporation | MSFT | 16.2% | 21.8% | [Adjustable] |
    | Johnson & Johnson | JNJ | 7.1% | 12.4% | [Adjustable] |
    | Walmart Inc. | WMT | 6.3% | 10.9% | [Adjustable] |
  - Correlation matrix showing relationships between all assets
  - Interactive allocation sliders (0-100% for each asset, must sum to 100%)
  - Real-time calculation display showing:
    - Expected portfolio return
    - Portfolio standard deviation (risk)
    - Sharpe ratio (using 1.5% risk-free rate)
  - Dynamic risk-return chart showing current portfolio position

- **Advisor Panel:**
  - Initial guidance: "Welcome to your first portfolio assignment! You'll need to balance Maria's moderate risk tolerance with her relatively short time horizon. Consider both ETFs for diversification and individual stocks for targeted exposure."
  - Hint library including:
    - "ETFs like VTI and BND provide broad market exposure, while individual stocks add specific sector exposure but higher idiosyncratic risk."
    - "For a 3-5 year time horizon, consider higher allocations to fixed income investments like BND or IEF."
    - "Look at the correlation matrix to understand how different assets move in relation to each other."

**User Flow:**
1. Player reviews Maria's profile and investment needs
2. Player examines historical data for all investment options
3. Player studies the correlation matrix to understand diversification opportunities
4. Player adjusts allocation sliders to set weights for ETFs and individual stocks
5. Real-time calculations update as allocations change
6. Player observes how different allocations affect risk and return
7. Player selects final allocation and explains rationale in the explanation box
8. System evaluates if portfolio risk is appropriate for Maria's situation
9. Player earns "Rookie Analyst" badge upon successful completion

**Solution Details:**
- Appropriate allocation range:
  - Bond ETFs (BND, IEF): 40-60% combined
  - Stock ETFs (VTI, IVV): 25-40% combined
  - Individual stocks: 10-25% combined (with no single stock >10%)
- With 50% bonds, 35% stock ETFs, 15% individual stocks:
  - Expected return: ~6.5%
  - Portfolio standard deviation: ~8.0-8.5%
  - Sharpe ratio: ~0.60-0.65
- Explanation should mention time horizon, risk tolerance, and diversification benefits of combining ETFs with select individual stocks

### Challenge 1.2: Risk-Adjusted Decisions

**Learning Objective:**
Players will calculate and interpret risk-adjusted performance metrics (Sharpe ratio, Treynor ratio) to select the most appropriate investments for a client.

**Domain Context:**
The Investment Committee at Capital Quest is evaluating six potential investments for inclusion in client portfolios. As a junior analyst, you've been tasked with analyzing their risk-adjusted performance using the most recent 5-year data. Your recommendation will influence which investments are offered to clients.

**Calculation/Task Reference:**
- Sharpe Ratio = (Ri - Rf) ÷ σi
- Treynor Ratio = (Ri - Rf) ÷ βi
- Where:
  - Ri = Average annual return of investment i
  - Rf = Risk-free rate (1.5%)
  - σi = Standard deviation of investment i
  - βi = Beta of investment i relative to the market

**Visual Design:**
- **Context Panel:**
  - Image of an investment committee meeting room
  - Brief from the Chief Investment Officer: "We need data-driven recommendations on which investments offer the best risk-adjusted performance."
  - Information about the firm's investment philosophy: "We emphasize sustainable risk-adjusted returns over short-term performance."

- **Workspace Panel:**
  - Detailed performance table:
    | Investment | Ticker | 5Y Avg Return | Standard Deviation | Beta | AUM |
    |------------|--------|--------------|-------------------|------|-----|
    | ARK Innovation ETF | ARKK | 14.2% | 32.5% | 1.8 | $8.2B |
    | Fidelity Contrafund | FCNTX | 11.3% | 16.2% | 1.1 | $98.5B |
    | Amazon.com, Inc. | AMZN | 15.7% | 25.3% | 1.4 | N/A |
    | Vanguard Dividend Appreciation ETF | VIG | 9.6% | 13.1% | 0.8 | $64.7B |
    | Procter & Gamble Co. | PG | 8.5% | 10.9% | 0.5 | N/A |
    | iShares 20+ Year Treasury Bond ETF | TLT | 3.2% | 11.5% | -0.2 | $21.3B |
  - Risk-free rate (prominently displayed): 1.5%
  - Interactive calculator with fields to compute:
    - Excess return (Ri - Rf)
    - Sharpe ratio
    - Treynor ratio
  - Radar chart comparing all investments across multiple metrics
  - "Decision Box" to select recommended investments with justification field

- **Advisor Panel:**
  - Initial guidance: "Risk-adjusted metrics help us understand performance in context of the risk taken. Different metrics may favor different investments."
  - Hint library including:
    - "Higher Sharpe ratios indicate better risk-adjusted performance using total risk."
    - "Treynor ratio focuses on systematic risk only, using beta rather than standard deviation."
    - "Consider whether high returns from investments like ARKK justify their much higher volatility."

**User Flow:**
1. Player reviews information about the six investment options
2. Player calculates excess returns for each investment
3. Player computes Sharpe ratio and Treynor ratio for each investment
4. Player analyzes and compares the results across all metrics
5. Player selects one or two investments as their recommendation
6. Player writes justification explaining why these investments offer the best risk-adjusted performance
7. System validates calculations and evaluates reasoning
8. Player earns "Risk Wrangler" achievement upon successful completion

**Solution Details:**
- Correct calculations:
  | Investment | Excess Return | Sharpe Ratio | Treynor Ratio |
  |------------|--------------|-------------|--------------|
  | ARKK | 12.7% | 0.391 | 0.071 |
  | FCNTX | 9.8% | 0.605 | 0.089 |
  | AMZN | 14.2% | 0.561 | 0.101 |
  | VIG | 8.1% | 0.618 | 0.101 |
  | PG | 7.0% | 0.642 | 0.140 |
  | TLT | 1.7% | 0.148 | -0.085 |
- Best Sharpe ratio: Procter & Gamble (0.642)
- Best Treynor ratio: Procter & Gamble (0.140)
- Acceptable answers: PG and/or VIG (with appropriate justification)
- Explanation should reference both risk metrics and discuss how P&G and VIG achieve strong risk-adjusted returns despite lower absolute returns

## Level 2: Diversification & Optimization

### Challenge 2.1: Crafting the Efficient Portfolio

**Learning Objective:**
Players will apply modern portfolio theory to construct an efficient portfolio using mean-variance optimization principles and visualize the efficient frontier.

**Domain Context:**
The Thompson family has $500,000 for a liquid investment portfolio with a 7-10 year time horizon. As their financial advisor at Global Wealth Management, you need to design an optimal portfolio that maximizes return for a given risk level using individual stocks and ETFs. The family has moderate-to-high risk tolerance (7/10) and wants a portfolio that can achieve growth while maintaining some stability.

**Calculation/Task Reference:**
- Portfolio Expected Return: E(Rp) = Σ wi × E(Ri)
- Portfolio Variance: σp² = Σ Σ wi × wj × σi × σj × ρi,j
- Sharpe Ratio Optimization: Maximize (E(Rp) - Rf) ÷ σp
- Subject to constraints:
  - Σ wi = 1 (weights sum to 100%)
  - wi ≥ 0 for all i (no short selling)
  - wBonds ≥ 0.15 (minimum 15% allocation to bond instruments)

**Visual Design:**
- **Context Panel:**
  - Photo of Thompson family (couple in 40s with two teenage children)
  - Financial profile card showing:
    - Investment amount: $500,000
    - Time horizon: 7-10 years
    - Risk tolerance: 7/10
    - Primary goal: Long-term growth with moderate stability
    - Secondary goal: College funding for children in 5-8 years

- **Workspace Panel:**
  - Investment options data table:
    | Investment | Ticker | Expected Return | Standard Deviation | Minimum | Maximum |
    |------------|--------|-----------------|-------------------|---------|---------|
    | S&P 500 ETF | SPY | 8.5% | 16.2% | 0% | 40% |
    | Nasdaq-100 ETF | QQQ | 10.2% | 19.3% | 0% | 30% |
    | MSCI EAFE ETF | EFA | 7.8% | 17.5% | 0% | 30% |
    | MSCI Emerging Markets ETF | EEM | 9.2% | 20.8% | 0% | 20% |
    | Aggregate Bond ETF | AGG | 3.5% | 5.2% | 5% | 40% |
    | Treasury Bond ETF | IEF | 3.0% | 4.8% | 0% | 30% |
    | Apple Inc. | AAPL | 12.5% | 22.8% | 0% | 10% |
    | Amazon.com, Inc. | AMZN | 14.0% | 25.3% | 0% | 10% |
    | JPMorgan Chase & Co. | JPM | 9.8% | 18.6% | 0% | 10% |
    | Procter & Gamble Co. | PG | 7.5% | 12.3% | 0% | 10% |
    | Real Estate ETF | VNQ | 7.2% | 16.5% | 0% | 15% |
  - Correlation matrix showing relationships between all investments
  - Interactive allocation sliders with constraint enforcement
  - "Calculate Covariance" button to generate covariance matrix
  - "Optimize" button to find optimal weights
  - Dynamic efficient frontier plot showing:
    - Current portfolio position
    - Efficient frontier curve
    - Optimal portfolio point (maximum Sharpe ratio)
    - Individual investment positions

- **Advisor Panel:**
  - Initial guidance: "Mean-variance optimization can find the theoretical best portfolio, but remember to consider practical constraints and not rely solely on historical data."
  - Hint library including:
    - "Look for investments with low correlations to improve diversification benefits."
    - "Consider how individual stocks can complement ETFs but watch position sizes."
    - "The tangency portfolio (highest Sharpe ratio) represents the optimal risk-return tradeoff."
    - "Bond ETFs provide stability while ETFs like QQQ and individual stocks like AMZN offer growth potential."

**User Flow:**
1. Player examines the Thompson family's profile and investment objectives
2. Player reviews investment options and correlation matrix
3. Player adjusts allocation sliders to test different combinations
4. Player uses the "Calculate Covariance" function to generate the covariance matrix
5. Player can click "Optimize" to find the mathematically optimal allocation
6. Player adjusts for practical considerations and finalizes allocation
7. Player explains rationale, addressing both optimization results and family needs
8. System validates that portfolio meets constraints and achieves reasonable efficiency
9. Player earns "Optimization Ace" badge upon successful completion

**Solution Details:**
- Mathematically optimal allocation (maximum Sharpe ratio):
  - ETFs (SPY, QQQ, EFA, EEM, AGG, IEF, VNQ): 70-80% combined
  - Individual stocks (AAPL, AMZN, JPM, PG): 20-30% combined
  - Bonds (AGG, IEF): At least 15% combined
- Sample optimal portfolio:
  - SPY: 20-25%
  - QQQ: 10-15%
  - EFA: 5-10%
  - EEM: 5-8%
  - AGG: 10-15%
  - IEF: 5-10%
  - VNQ: 5-10%
  - AAPL: 5-8%
  - AMZN: 5-8%
  - JPM: 3-5%
  - PG: 3-5%
- Expected return: ~7.5-8.2%
- Portfolio standard deviation: ~11-13%
- Sharpe ratio: ~0.50-0.55
- Explanation should address the Thompson's risk tolerance, time horizon, and the diversification benefits of combining broad market ETFs with select individual stocks

### Challenge 2.2: Mastering Rebalancing

**Learning Objective:**
Players will analyze portfolio drift, calculate rebalancing requirements, and develop a cost-effective rebalancing strategy for a nonprofit portfolio.

**Domain Context:**
You're managing a $1M portfolio for the Anderson Community Foundation, which provides grants for local education initiatives. The portfolio was established with a target allocation 12 months ago, but market movements have caused drift. The Foundation's investment policy requires annual rebalancing if any position drifts more than 5% from its target. You need to analyze the current situation and recommend specific trades to realign the portfolio while minimizing costs.

**Calculation/Task Reference:**
- Drift Calculation: Actual % - Target %
- Dollar Value to Trade: Total Portfolio Value × (Actual % - Target %)
- Trading Cost Impact: Cost per Trade + (Trade Amount × Trading Fee %)
- Total Rebalancing Cost: Sum of all trading costs
- Performance Impact: Expected improvement in risk-adjusted return - Rebalancing cost %

**Visual Design:**
- **Context Panel:**
  - Image of nonprofit foundation logo and mission statement
  - Foundation profile showing:
    - Portfolio value: $1,000,000
    - Annual withdrawal: 4% for grants
    - Investment policy statement highlights
    - Rebalancing policy: "Rebalance when any position drifts >5% from target"
    - Trading cost structure: $9.95 flat fee + 0.03% of trade value

- **Workspace Panel:**
  - Current vs. Target allocation table:
    | Investment | Ticker | Target % | Current % | Drift | Current Value | Target Value | $ Difference |
    |------------|--------|---------|----------|------|--------------|-------------|-------------|
    | Vanguard S&P 500 ETF | VOO | 30% | 37.5% | +7.5% | $375,000 | $300,000 | +$75,000 |
    | iShares Russell 2000 ETF | IWM | 15% | 18.3% | +3.3% | $183,000 | $150,000 | +$33,000 |
    | iShares MSCI EAFE ETF | EFA | 15% | 13.4% | -1.6% | $134,000 | $150,000 | -$16,000 |
    | Vanguard Total Bond Market ETF | BND | 20% | 13.2% | -6.8% | $132,000 | $200,000 | -$68,000 |
    | iShares TIPS Bond ETF | TIP | 5% | 3.4% | -1.6% | $34,000 | $50,000 | -$16,000 |
    | Apple Inc. | AAPL | 3% | 4.8% | +1.8% | $48,000 | $30,000 | +$18,000 |
    | Microsoft Corp. | MSFT | 3% | 4.1% | +1.1% | $41,000 | $30,000 | +$11,000 |
    | Alphabet Inc. | GOOGL | 3% | 2.5% | -0.5% | $25,000 | $30,000 | -$5,000 |
    | JPMorgan Chase & Co. | JPM | 3% | 1.9% | -1.1% | $19,000 | $30,000 | -$11,000 |
    | Cash | - | 3% | 0.9% | -2.1% | $9,000 | $30,000 | -$21,000 |
  - Interactive drift calculator with highlighted cells for drifts exceeding 5%
  - Rebalancing strategy selector with options:
    - Full rebalancing (all positions to target)
    - Threshold rebalancing (only positions exceeding 5% drift)
    - Tax-optimized rebalancing (factor in unrealized gains)
  - Trade entry form to input specific buy/sell amounts
  - Cost calculator showing total rebalancing costs
  - "What-if" simulator to test different rebalancing approaches

- **Advisor Panel:**
  - Initial guidance: "Portfolio drift is natural but requires attention. Consider both the mathematical need to rebalance and the practical cost implications."
  - Hint library including:
    - "Focus first on positions that exceed the 5% drift threshold in the investment policy."
    - "Consider whether all positions need rebalancing or only those exceeding policy thresholds."
    - "Remember that every trade incurs costs that reduce portfolio performance."
    - "The foundation needs liquidity for grants, which might influence your rebalancing decisions."

**User Flow:**
1. Player analyzes current vs. target allocations to identify significant drift
2. Player calculates the dollar value that needs to be traded for each position
3. Player selects a rebalancing strategy approach
4. Player inputs specific trade recommendations (which securities to buy/sell and amounts)
5. Player calculates total rebalancing costs and net benefit
6. Player explains their rebalancing strategy and justifies decisions
7. System validates that trades will bring portfolio back within policy guidelines
8. Player earns "Rebalancing Guru" title upon successful completion

**Solution Details:**
- Positions requiring rebalancing (>5% drift):
  - VOO: Sell $75,000 (7.5% drift)
  - BND: Buy $68,000 (6.8% drift)
- Threshold rebalancing costs:
  - VOO sell cost: $9.95 + ($75,000 × 0.03%) = $32.45
  - BND buy cost: $9.95 + ($68,000 × 0.03%) = $30.35
  - Total cost: $62.80 (0.0063% of portfolio)
- Full rebalancing would include additional trades for all positions
  - Total cost: ~$130-150 (0.013-0.015% of portfolio)
- Optimal answer: Threshold rebalancing focusing on VOO and BND
- Explanation should address cost-efficiency and adherence to the investment policy statement

## Level 3: Risk & Factor Analysis

### Challenge 3.1: Downside Risk Detective

**Learning Objective:**
Players will calculate and interpret downside risk measures (VaR, CVaR), conduct stress tests using historical scenarios, and recommend risk mitigation strategies.

**Domain Context:**
As a risk analyst at Meridian Investments, you're tasked with assessing the downside risk exposure of the Freeman Foundation's portfolio. The Foundation has an aggressive allocation with a mix of equity ETFs, fixed income, and individual stocks. The investment committee is concerned about potential losses during market downturns. Your job is to quantify the portfolio's risk exposure and recommend risk mitigation strategies without significantly reducing the long-term return potential.

**Calculation/Task Reference:**
- Value at Risk (VaR): The maximum loss expected over a given time period at a specified confidence level
  - Historical VaR: Percentile of historical returns distribution
  - Parametric VaR: μ + (z × σ) where z is the z-score for the confidence level
- Conditional Value at Risk (CVaR): The expected loss given that the loss exceeds VaR
  - CVaR = average of returns that exceed VaR
- Stress Testing: Simulating portfolio returns under historical crisis conditions
  - Portfolio Return in Scenario = Σ wi × Asset Return in Scenario

**Visual Design:**
- **Context Panel:**
  - Image of Freeman Foundation logo against backdrop of financial district
  - Risk profile showing:
    - Portfolio value: $75 million
    - Current allocation summary
    - Investment objective: "Long-term growth with acceptable downside risk"
    - Risk tolerance statement: "Willing to accept higher volatility for higher returns, but concerned about extreme losses"
    - Time horizon: Perpetual (endowment)

- **Workspace Panel:**
  - Current portfolio composition table:
    | Investment | Ticker | Allocation | Expected Return | Standard Deviation | Worst 1-Year Return |
    |------------|--------|-----------|-----------------|-------------------|---------------------|
    | SPDR S&P 500 ETF | SPY | 25% | 8.2% | 16.5% | -37.0% |
    | Invesco QQQ Trust | QQQ | 15% | 10.5% | 20.3% | -42.7% |
    | iShares Russell 2000 ETF | IWM | 10% | 9.5% | 22.3% | -43.1% |
    | Vanguard FTSE Developed Markets ETF | VEA | 8% | 7.8% | 18.1% | -41.4% |
    | iShares MSCI Emerging Markets ETF | EEM | 7% | 10.5% | 25.8% | -53.3% |
    | Apple Inc. | AAPL | 5% | 12.5% | 25.7% | -44.3% |
    | Amazon.com, Inc. | AMZN | 5% | 14.2% | 28.4% | -44.1% |
    | Microsoft Corp. | MSFT | 5% | 13.8% | 24.2% | -40.7% |
    | Berkshire Hathaway Inc. | BRK.B | 5% | 9.2% | 18.5% | -31.8% |
    | iShares iBoxx Inv Grade Corp Bond ETF | LQD | 10% | 4.8% | 7.3% | -13.8% |
    | Vanguard Total Bond Market ETF | BND | 5% | 3.8% | 5.5% | -5.1% |
  - VaR calculator with:
    - Method selector (Historical/Parametric)
    - Confidence level slider (90%, 95%, 99%)
    - Time horizon selector (1-day, 1-month, 1-year)
    - Results display showing VaR and CVaR
  - Stress testing module with historical scenarios:
    | Scenario | Time Period | Market Decline | Portfolio Impact |
    |----------|------------|----------------|------------------|
    | 2008 Financial Crisis | Oct-Dec 2008 | S&P 500: -38.5% | [Calculate] |
    | 2020 COVID Crash | Feb-Mar 2020 | S&P 500: -33.9% | [Calculate] |
    | 2000 Tech Bubble | Mar-Oct 2000 | NASDAQ: -39.3% | [Calculate] |
    | 1987 Black Monday | Oct 1987 | DJIA: -22.6% in 1 day | [Calculate] |
  - Risk reduction simulator with options to adjust allocations and view impact on risk metrics
  - Risk contribution analysis showing which investments contribute most to overall portfolio risk

- **Advisor Panel:**
  - Initial guidance: "Downside risk measures help us understand what could happen in worst-case scenarios, beyond what standard deviation tells us."
  - Hint library including:
    - "95% VaR tells you the loss that should only be exceeded 5% of the time."
    - "CVaR (or Expected Shortfall) gives you the average loss when things go worse than the VaR threshold."
    - "Consider the concentration risk in technology stocks (QQQ, AAPL, AMZN, MSFT) under stress scenarios."
    - "Think about adding defensive stocks or increasing bond allocations to reduce downside risk."

**User Flow:**
1. Player examines the Freeman Foundation's portfolio and risk profile
2. Player calculates VaR and CVaR at different confidence levels
3. Player runs stress tests using historical crisis scenarios
4. Player identifies which investments contribute most to tail risk
5. Player uses the risk reduction simulator to test allocation changes
6. Player recommends specific risk mitigation strategies
7. Player explains their recommendations, addressing both risk reduction and return implications
8. System validates that recommendations achieve meaningful risk reduction
9. Player earns "Downside Detective" badge upon successful completion

**Solution Details:**
- Current portfolio risk metrics:
  - 95% 1-year VaR: ~25-27% (potential loss of $18-20 million)
  - 95% 1-year CVaR: ~32-34% (potential loss of $24-26 million)
  - Stress test results:
    - 2008 Financial Crisis: ~-34% to -36% ($25-27 million loss)
    - 2020 COVID Crash: ~-26% to -28% ($19-21 million loss)
  - Main risk contributors: EEM, QQQ, AMZN, AAPL
- Effective risk mitigation options (any of these approaches is valid):
  - Reduce tech exposure by cutting QQQ to 10%, AAPL to 3%, and AMZN to 3%
  - Increase fixed income allocation by adding 5-10% to BND and LQD
  - Add defensive stocks like PG, JNJ, or utilities ETF (XLU) at 5-10%
  - Add a 5% allocation to gold ETF (GLD) for crisis hedge
- Mitigation impact:
  - Improved 95% 1-year VaR by 4-6 percentage points
  - Improved stress test outcomes by 5-8 percentage points
  - Expected return reduction limited to <0.5%
- Explanation should discuss the tradeoff between risk reduction and return potential, justifying recommended changes

### Challenge 3.2: Unmasking Performance Factors

**Learning Objective:**
Players will apply factor analysis to evaluate fund and stock performance, distinguishing between market-driven returns and manager skill or company-specific advantages through attribution analysis.

**Domain Context:**
Capital Quest is considering adding the BlackRock Strategic Global Equity Fund to their recommended list. The fund has outperformed its benchmark by 2.3% annually over the past 5 years, but the investment committee wants to understand whether this outperformance reflects genuine manager skill or simply exposure to factors that performed well during this period. You need to conduct factor analysis and attribution modeling to determine the true sources of the fund's returns.

**Calculation/Task Reference:**
- Factor Model: Ri = α + β1(F1) + β2(F2) + ... + βn(Fn) + ε
  - Where:
    - Ri = Fund return
    - α (alpha) = Manager skill component
    - βn = Sensitivity to factor n
    - Fn = Return of factor n
    - ε = Unexplained residual
- Return Attribution: Total Return = Σ (Factor Exposure × Factor Return) + Alpha
- Information Ratio: Alpha ÷ Tracking Error
- Active Share: Percentage of portfolio that differs from benchmark

**Visual Design:**
- **Context Panel:**
  - Image of fund marketing materials and prospectus
  - Fund profile showing:
    - Fund name: BlackRock Strategic Global Equity Fund
    - 5-year annualized return: 10.8%
    - Benchmark (MSCI World): 8.5%
    - Outperformance: +2.3%
    - Management fee: 0.85%
    - Investment style: "Global equity with tactical allocation"
    - Manager claim: "Superior security selection and tactical asset allocation"

- **Workspace Panel:**
  - Fund vs. Benchmark performance chart (5-year)
  - Fund top holdings:
    | Company | Ticker | Weight | 5Y Return | Benchmark Weight |
    |---------|--------|--------|-----------|-----------------|
    | Apple Inc. | AAPL | 6.2% | 15.7% | 4.1% |
    | Microsoft Corp. | MSFT | 5.8% | 16.2% | 3.7% |
    | Amazon.com, Inc. | AMZN | 4.5% | 14.0% | 2.5% |
    | NVIDIA Corp. | NVDA | 3.4% | 38.2% | 1.2% |
    | Tesla, Inc. | TSLA | 2.8% | 32.5% | 1.0% |
    | Alphabet Inc. | GOOGL | 2.6% | 12.3% | 2.2% |
    | Meta Platforms, Inc. | META | 2.2% | 9.5% | 1.1% |
    | UnitedHealth Group Inc. | UNH | 1.9% | 18.4% | 0.8% |
    | Johnson & Johnson | JNJ | 1.7% | 7.1% | 0.9% |
    | Visa Inc. | V | 1.5% | 11.2% | 0.7% |
  - Factor exposure table:
    | Factor | Description | Fund Exposure (β) | Benchmark Exposure | Active Exposure | Factor Return (5Y) |
    |--------|------------|------------------|-------------------|-----------------|-------------------|
    | Market | Overall market movement | 0.98 | 1.00 | -0.02 | 8.2% |
    | Size | Small vs. large companies | 0.35 | 0.05 | +0.30 | 3.2% |
    | Value | Value vs. growth stocks | -0.25 | 0.02 | -0.27 | -2.1% |
    | Momentum | Recent price trends | 0.40 | 0.12 | +0.28 | 4.5% |
    | Quality | Financial strength | 0.22 | 0.10 | +0.12 | 2.8% |
    | Volatility | Price fluctuation | -0.30 | -0.05 | -0.25 | -1.5% |
  - Interactive attribution calculator with:
    - Factor contribution fields
    - Alpha calculation
    - Visual breakdown of return sources
  - Skill metrics panel showing:
    - Information ratio
    - Active share
    - Hit rate (% of correct active decisions)
    - Consistency of alpha generation (year by year)
  - Fund sector/region breakdown vs. benchmark

- **Advisor Panel:**
  - Initial guidance: "Factor analysis helps us determine if outperformance comes from skill or just factor tilts that happened to work well. Look beyond headline numbers."
  - Hint library including:
    - "Examine the overweight positions in tech stocks like NVIDIA and Tesla versus the benchmark."
    - "Positive factor contribution comes from having positive exposure to factors with positive returns (or negative exposure to factors with negative returns)."
    - "Alpha represents the portion of return not explained by factor exposures - the potential indicator of skill."
    - "Consider whether the outperformance is consistent or concentrated in specific time periods."

**User Flow:**
1. Player examines the fund's historical performance and manager claims
2. Player reviews the fund's holdings compared to benchmark
3. Player analyzes factor exposures compared to benchmark
4. Player calculates the contribution of each factor to overall performance
5. Player determines the portion of return attributable to factor exposures vs. alpha
6. Player analyzes skill metrics to assess consistency and intentionality
7. Player reaches a conclusion about the source of outperformance
8. Player writes a detailed attribution analysis explaining their findings
9. System validates calculations and evaluates reasoning
10. Player earns "Factor Finder" achievement upon successful completion

**Solution Details:**
- Factor contribution calculation:
  - Market: 0.98 × 8.2% = 8.04% (vs. benchmark: 1.00 × 8.2% = 8.20%)
  - Size: 0.35 × 3.2% = 1.12% (vs. benchmark: 0.05 × 3.2% = 0.16%)
  - Value: -0.25 × -2.1% = 0.53% (vs. benchmark: 0.02 × -2.1% = -0.04%)
  - Momentum: 0.40 × 4.5% = 1.80% (vs. benchmark: 0.12 × 4.5% = 0.54%)
  - Quality: 0.22 × 2.8% = 0.62% (vs. benchmark: 0.10 × 2.8% = 0.28%)
  - Volatility: -0.30 × -1.5% = 0.45% (vs. benchmark: -0.05 × -1.5% = 0.08%)
- Total factor contribution: 12.56% (vs. benchmark: 9.22%)
- Excess factor contribution: 3.34%
- Reported outperformance: 2.30%
- Implied alpha: -1.04% (negative skill contribution)
- Stock selection analysis:
  - Overweights in AAPL, MSFT, AMZN, NVDA, and TSLA contributed significantly to returns
  - Growth and technology sector tilts explain most of the outperformance
- Conclusion: The fund's outperformance is entirely attributable to factor exposures (particularly momentum and anti-value) and overweight positions in high-performing tech stocks, not manager skill
- Explanation should identify which factors drove performance and discuss the negative alpha implication

## Level 4: Advanced Strategies

### Challenge 4.1: Alternative Investments Unleashed

**Learning Objective:**
Players will evaluate alternative investments, analyze their unique risk-return profiles, assess fee structures, and determine appropriate allocations within a diversified portfolio.

**Domain Context:**
The Westman Family Office ($25M investable assets) is considering adding alternative investments to their traditional portfolio of stocks and bonds. They're interested in alternative-focused ETFs, REITs, and closed-end funds to potentially enhance returns and reduce overall volatility. As their investment advisor, you need to analyze these alternatives, explain their characteristics, and recommend an appropriate allocation that balances performance potential with liquidity needs, fee impact, and risk considerations.

**Calculation/Task Reference:**
- Net-of-Fee Return: Gross Return - Expense Ratio
- Liquidity-Adjusted Return: Net Return × Liquidity Discount Factor
  - Where Liquidity Discount = f(trading volume, bid-ask spread)
- Correlation Benefit: Reduction in portfolio volatility due to low correlations
- Incorporating Alternatives: Portfolio Return & Risk with New Asset Mix:
  - E(Rp-new) = Σ wi-new × E(Ri)
  - σp-new = √(Σ Σ wi-new × wj-new × σi × σj × ρi,j)

**Visual Design:**
- **Context Panel:**
  - Image of ultra-high-net-worth family with family office conference room
  - Family office profile showing:
    - Total assets: $25 million
    - Current allocation: 45% US equities, 20% international equities, 35% fixed income
    - Time horizon: Multi-generational
    - Annual liquidity needs: $500,000 (2%)
    - Risk tolerance: Moderate-high (7/10)
    - Investment objectives: "Long-term capital preservation and growth with inflation protection"

- **Workspace Panel:**
  - Current vs. Alternative investments comparison table:
    | Investment | Ticker | Expected Return | Standard Deviation | Expense Ratio | Liquidity | Market Cap/AUM |
    |------------|--------|-----------------|-------------------|---------------|-----------|----------------|
    | Vanguard S&P 500 ETF | VOO | 7.5% | 16.0% | 0.03% | High | $327B |
    | iShares MSCI EAFE ETF | EFA | 8.2% | 18.5% | 0.07% | High | $53B |
    | Vanguard Total Bond ETF | BND | 3.5% | 5.0% | 0.03% | High | $95B |
    | Invesco Global Listed Private Equity ETF | PSP | 11.8% | 25.5% | 1.44% | Medium | $213M |
    | IQ Hedge Multi-Strategy Tracker ETF | QAI | 4.5% | 7.2% | 0.79% | Medium | $748M |
    | ProShares Merger ETF | MRGR | 5.3% | 5.8% | 0.75% | Medium | $54M |
    | Vanguard Real Estate ETF | VNQ | 8.0% | 18.5% | 0.12% | High | $63B |
    | iShares Gold Trust | IAU | 4.2% | 15.2% | 0.25% | High | $28B |
    | Nuveen Preferred & Income Securities Fund | JPS | 9.2% | 14.3% | 1.02% | Medium | $1.8B |
    | Cohen & Steers Infrastructure Fund | UTF | 9.5% | 16.7% | 1.92% | Medium | $2.7B |
    | BlackRock Health Sciences Term Trust | BMEZ | 10.8% | 22.4% | 1.35% | Medium | $1.9B |
  - Correlation matrix including all investments (highlighting low correlations of alternatives)
  - Fee impact calculator showing gross vs. net returns
  - Liquidity analysis tool showing portfolio liquidity profile under different allocations
  - Interactive portfolio builder with:
    - Allocation sliders for all investment options
    - Real-time calculations of expected return, risk, Sharpe ratio
    - Fee impact visualization
    - Liquidity profile chart
  - Efficient frontier visualization with and without alternatives

- **Advisor Panel:**
  - Initial guidance: "Alternative investments can offer diversification benefits and return potential, but come with higher fees, complexity, and sometimes lower liquidity."
  - Hint library including:
    - "Consider how alternative ETFs differ from traditional ETFs in terms of underlying holdings and strategies."
    - "Look at the correlation matrix to identify investments that provide true diversification."
    - "Watch expense ratios carefully - they can significantly impact long-term returns."
    - "Remember the family's annual liquidity needs when building your portfolio."

**User Flow:**
1. Player examines the Westman family's investment profile and objectives
2. Player analyzes the characteristics of each alternative investment
3. Player reviews correlation data to identify diversification benefits
4. Player uses the fee impact calculator to determine net-of-fee returns
5. Player tests different allocation scenarios using the portfolio builder
6. Player evaluates how alternatives affect both risk-adjusted returns and liquidity
7. Player recommends a specific allocation including alternatives
8. Player explains their recommendation, addressing return potential, diversification benefits, fee impact, and liquidity considerations
9. System validates that portfolio meets the family's needs
10. Player earns "Alternative Alchemist" badge upon successful completion

**Solution Details:**
- Appropriate allocation range:
  - Traditional ETFs (VOO, EFA, BND): 65-75% combined
  - Alternative ETFs (PSP, QAI, MRGR): 10-15% combined
  - Real Assets (VNQ, IAU): 5-10% combined
  - Closed-End Funds (JPS, UTF, BMEZ): 5-10% combined
- Sample optimal portfolio:
  - VOO: 30-35%
  - EFA: 15-20%
  - BND: 20-25%
  - PSP: 3-5%
  - QAI: 3-5%
  - MRGR: 2-4%
  - VNQ: 3-5%
  - IAU: 2-4%
  - JPS: 2-3%
  - UTF: 2-3%
  - BMEZ: 1-3%
- Portfolio metrics with 25% alternatives:
  - Expected return (gross): ~7.3-7.7%
  - Expected return (net of fees): ~6.9-7.3%
  - Portfolio standard deviation: ~10.5-12.5% (reduced from original ~12-14%)
  - Sharpe ratio: ~0.48-0.52 (improved from ~0.42-0.46)
  - Liquid portion: ~85-90% (sufficient for annual withdrawals)
- Explanation should address the tradeoff between improved risk-adjusted returns and increased expenses, while emphasizing the diversification benefits

### Challenge 4.2: ESG Impact & Integration

**Learning Objective:**
Players will evaluate ESG metrics, analyze their impact on portfolio characteristics, and implement ESG integration strategies while maintaining financial performance objectives.

**Domain Context:**
Westridge University's $200M endowment board has voted to incorporate ESG (Environmental, Social, Governance) principles into their investment policy. As their investment consultant, you've been tasked with redesigning their portfolio to improve sustainability metrics without compromising the endowment's 4.5% annual spending requirement. The board wants to understand the financial implications of different ESG integration approaches and see concrete improvements in measurable sustainability metrics.

**Calculation/Task Reference:**
- ESG Score Calculation: Weighted average of E, S, and G component scores
  - Portfolio ESG Score = Σ wi × ESG-Scorei
- Carbon Intensity: CO2 equivalent emissions per $M revenue
  - Portfolio Carbon Intensity = Σ wi × Carbon-Intensityi
- ESG Integration Methods:
  - Negative screening: Exclude worst performers
  - Positive screening: Overweight best performers
  - Best-in-class: Select top ESG performers within each sector
  - Thematic: Focus on specific E, S, or G themes
  - Impact: Target measurable sustainability outcomes
- Performance Differential: Return or risk difference between ESG and conventional portfolios

**Visual Design:**
- **Context Panel:**
  - Image of Westridge University campus and endowment board meeting
  - Endowment profile showing:
    - Size: $200 million
    - Annual spending rate: 4.5% ($9 million)
    - Current allocation: 65% equities, 30% fixed income, 5% alternatives
    - Investment objective: "Long-term growth with moderate risk"
    - New ESG directive: "Incorporate sustainability principles while maintaining financial performance"
    - Specific ESG priorities: Climate change, diversity, and corporate governance

- **Workspace Panel:**
  - Current portfolio vs. ESG alternatives:
    | Current Investment | ESG Alternative | Ticker | ESG Score | Carbon Intensity | Expected Return | Expense Ratio |
    |-------------------|-----------------|--------|-----------|------------------|----------------|---------------|
    | S&P 500 Index Fund | SPDR S&P 500 ESG ETF | EFIV | 7.8/10 | 112 tCO2e/$M | 7.3% | 0.10% |
    | S&P 500 Index Fund | Xtrackers S&P 500 ESG ETF | SNPE | 7.9/10 | 105 tCO2e/$M | 7.2% | 0.10% |
    | Russell 1000 Fund | iShares ESG Aware MSCI USA ETF | ESGU | 7.5/10 | 127 tCO2e/$M | 7.4% | 0.15% |
    | MSCI EAFE Fund | iShares ESG Aware MSCI EAFE ETF | ESGD | 7.3/10 | 132 tCO2e/$M | 7.9% | 0.20% |
    | Emerging Markets Fund | iShares ESG Aware MSCI EM ETF | ESGE | 6.1/10 | 186 tCO2e/$M | 8.5% | 0.25% |
    | Aggregate Bond Fund | iShares ESG Aware US Aggregate Bond ETF | EAGG | 6.8/10 | 92 tCO2e/$M | 3.4% | 0.10% |
    | Corporate Bond Fund | SPDR Bloomberg SASB Corporate Bond ESG ETF | RBND | 7.2/10 | 84 tCO2e/$M | 4.1% | 0.12% |
    | Technology Sector Fund | First Trust NASDAQ Clean Edge Green Energy | QCLN | 8.2/10 | 65 tCO2e/$M | 10.2% | 0.58% |
    | Energy Sector Fund | iShares Global Clean Energy ETF | ICLN | 8.8/10 | 42 tCO2e/$M | 9.8% | 0.42% |
    | Real Estate Fund | Nuveen ESG Real Estate ETF | NURE | 7.0/10 | 93 tCO2e/$M | 7.6% | 0.29% |
  - Individual companies with strong ESG profiles:
    | Company | Ticker | ESG Score | Carbon Intensity | Sector | Dividend Yield |
    |---------|--------|-----------|------------------|--------|----------------|
    | Microsoft Corp. | MSFT | 8.5/10 | 12 tCO2e/$M | Technology | 0.8% |
    | Nvidia Corp. | NVDA | 7.8/10 | 5 tCO2e/$M | Technology | 0.1% |
    | Unilever PLC | UL | 8.7/10 | 48 tCO2e/$M | Consumer Staples | 3.5% |
    | Vestas Wind Systems | VWDRY | 9.2/10 | 2 tCO2e/$M | Industrials | 0.3% |
    | Waste Management Inc. | WM | 8.1/10 | 310 tCO2e/$M | Industrials | 1.5% |
    | NextEra Energy | NEE | 8.3/10 | 175 tCO2e/$M | Utilities | 2.5% |
    | American Water Works | AWK | 8.0/10 | 145 tCO2e/$M | Utilities | 1.8% |
    | Hannon Armstrong | HASI | 9.0/10 | 3 tCO2e/$M | Financials | 5.8% |
  - ESG integration strategy selector with options:
    - Negative screening (exclude bottom 10% ESG scores)
    - Positive tilting (overweight high ESG scores)
    - Best-in-class selection
    - Thematic focus (climate, diversity, or governance)
    - Combined approach
  - Interactive portfolio builder showing:
    - Investment selection table with financial and ESG metrics
    - Real-time calculation of portfolio characteristics
    - Side-by-side comparison with original portfolio
    - ESG improvement visualization
  - Cost analysis showing any fee differential for ESG investments

- **Advisor Panel:**
  - Initial guidance: "ESG integration requires balancing sustainability goals with financial objectives. Consider both ESG-focused ETFs and individual companies with strong ESG profiles."
  - Hint library including:
    - "ESG ETFs provide broad exposure while individual stocks allow targeted impact investing."
    - "Look for investments that align with the university's specific ESG priorities."
    - "Consider whether thematic funds like clean energy ETFs fit within your overall allocation strategy."
    - "Remember that the endowment still needs to meet its 4.5% spending requirement."

**User Flow:**
1. Player examines the university endowment's profile and ESG directive
2. Player analyzes current portfolio characteristics (financial and ESG metrics)
3. Player reviews different ESG integration strategies and their implications
4. Player examines ESG ETF alternatives and individual companies with strong ESG profiles
5. Player tests different approaches using the portfolio builder
6. Player selects specific investments that improve ESG metrics
7. Player evaluates the impact on expected return, risk, and other financial characteristics
8. Player recommends a final ESG-integrated portfolio
9. Player explains their approach, addressing both ESG improvements and financial considerations
10. System validates that the portfolio meets both ESG and financial objectives
11. Player earns "Sustainability Strategist" badge upon successful completion

**Solution Details:**
- Effective ESG integration approach: Combination of ESG ETFs and individual stocks
- Sample ESG-enhanced portfolio:
  - Core ETFs: EFIV or SNPE (25%), ESGU (15%), ESGD (10%), ESGE (5%), EAGG (20%), RBND (10%)
  - Thematic ETFs: QCLN (3%), ICLN (2%), NURE (3%)
  - Individual stocks: Mix of MSFT, NVDA, UL, VWDRY, WM, NEE, AWK, HASI (7% total)
- ESG metrics improvement:
  - ESG Score: Improved to 7.5-8.0/10 (from original 5.8/10)
  - Carbon Intensity: Reduced to 95-115 tCO2e/$M (from original 165-185 tCO2e/$M)
  - Sector-specific ESG improvements across energy, technology, and utilities
- Financial characteristics:
  - Expected Return: 6.9-7.3% (vs. original 7.2%)
  - Portfolio Risk: 11.5-12.0% (vs. original 11.8%)
  - Sharpe Ratio: 0.46-0.50 (vs. original 0.48)
  - Average expense ratio: 0.15-0.20% (slightly higher than original)
- Explanation should address the specific ESG improvements achieved, the methods used to maintain financial performance, and any tradeoffs involved

---

## Technical Implementation Specifications

### AI Guidance System

For each challenge, the AI "Investment Guru" needs these specific configurations:

**Knowledge Base:**
- Financial formulas and calculations relevant to each challenge
- Common misconceptions and calculation errors
- Best practices in portfolio construction with actual investments
- Adaptive hints based on student progress

**Response Types:**
- **Initial Guidance:** Introduces the challenge concept and key considerations
- **Procedural Hints:** Step-by-step guidance on calculations without revealing answers
- **Conceptual Explanations:** Clarifies underlying portfolio theory principles
- **Error Detection:** Identifies specific mistakes in calculations or approaches
- **Performance Feedback:** Evaluates the quality and reasoning of portfolio decisions

### Scoring and Evaluation System

Each challenge should include clear evaluation criteria:

**Quantitative Assessment:**
- Calculation accuracy (e.g., correct portfolio metrics)
- Optimal or near-optimal allocation (within reasonable range)
- Proper constraint satisfaction (e.g., meeting client requirements)
- Appropriate risk-return characteristics for the context

**Qualitative Assessment:**
- Quality of reasoning and justification
- Appropriateness for client situation
- Consideration of practical constraints
- Balanced evaluation of tradeoffs

### Progressive Challenge Design

The simulation should adapt difficulty based on player performance:

**Adaptation Mechanisms:**
- Unlock additional investment options after mastering basics
- Provide more detailed hints for players struggling with concepts
- Offer advanced challenges for players who excel
- Personalize scenarios based on areas needing improvement

### Data Visualization Components

Each challenge requires specific interactive visualizations:

**Required Chart Types:**
- Risk-return scatterplots showing individual investments and portfolio
- Efficient frontier curves with optimal portfolio highlighted
- Asset allocation pie charts and treemaps
- Historical performance line graphs with benchmark comparisons
- Correlation heatmaps for all investment options
- Factor contribution bar charts
- ESG metric radar charts for comparison

---

## Integration with LLM Generation

To ensure consistent, high-quality content generation across all challenges, the LLM should:

1. Generate complete client profiles with realistic details
2. Create mathematically consistent data sets for real stocks and ETFs
3. Craft narrative elements that connect financial concepts to real-world scenarios
4. Design domain-specific documents (investment policy statements, client questionnaires)
5. Develop appropriate hints and feedback for common mistakes

For each challenge, the LLM should be prompted to generate:

```
1. Complete client/scenario context with specific details
2. Precise financial data tables with realistic values for actual investments
3. Step-by-step solution guide with expected calculations
4. 3-5 targeted hints for common misconceptions
5. Visual asset specifications for charts and diagrams
6. Assessment criteria for both quantitative and qualitative evaluation
```

This enhanced framework provides comprehensive details for each challenge, ensuring clear learning objectives, realistic scenarios with actual investments, precise calculation requirements, and appropriate guidance. The structured approach allows for consistent implementation across the entire simulation game while maintaining educational effectiveness and engagement.