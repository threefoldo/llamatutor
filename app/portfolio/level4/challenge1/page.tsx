'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';

export default function AlternativeInvestments() {
  // Investment options with their data
  const investments = [
    { id: 'VOO', name: 'Vanguard S&P 500 ETF', ticker: 'VOO', category: 'Core Equity', return: 7.5, stdDev: 16.0, expense: 0.03, liquidity: 'High', aum: 327, allocation: 0, max: 40 },
    { id: 'EFA', name: 'iShares MSCI EAFE ETF', ticker: 'EFA', category: 'International Equity', return: 8.2, stdDev: 18.5, expense: 0.07, liquidity: 'High', aum: 53, allocation: 0, max: 30 },
    { id: 'BND', name: 'Vanguard Total Bond ETF', ticker: 'BND', category: 'Core Fixed Income', return: 3.5, stdDev: 5.0, expense: 0.03, liquidity: 'High', aum: 95, allocation: 0, max: 30 },
    { id: 'PSP', name: 'Invesco Global Listed Private Equity ETF', ticker: 'PSP', category: 'Alternative', return: 11.8, stdDev: 25.5, expense: 1.44, liquidity: 'Medium', aum: 0.213, allocation: 0, max: 10 },
    { id: 'QAI', name: 'IQ Hedge Multi-Strategy Tracker ETF', ticker: 'QAI', category: 'Alternative', return: 4.5, stdDev: 7.2, expense: 0.79, liquidity: 'Medium', aum: 0.748, allocation: 0, max: 15 },
    { id: 'MRGR', name: 'ProShares Merger ETF', ticker: 'MRGR', category: 'Alternative', return: 5.3, stdDev: 5.8, expense: 0.75, liquidity: 'Medium', aum: 0.054, allocation: 0, max: 10 },
    { id: 'VNQ', name: 'Vanguard Real Estate ETF', ticker: 'VNQ', category: 'Real Assets', return: 8.0, stdDev: 18.5, expense: 0.12, liquidity: 'High', aum: 63, allocation: 0, max: 15 },
    { id: 'IAU', name: 'iShares Gold Trust', ticker: 'IAU', category: 'Real Assets', return: 4.2, stdDev: 15.2, expense: 0.25, liquidity: 'High', aum: 28, allocation: 0, max: 10 },
    { id: 'JPS', name: 'Nuveen Preferred & Income Securities Fund', ticker: 'JPS', category: 'Alternative', return: 9.2, stdDev: 14.3, expense: 1.02, liquidity: 'Medium', aum: 1.8, allocation: 0, max: 10 },
    { id: 'UTF', name: 'Cohen & Steers Infrastructure Fund', ticker: 'UTF', category: 'Alternative', return: 9.5, stdDev: 16.7, expense: 1.92, liquidity: 'Medium', aum: 2.7, allocation: 0, max: 10 },
    { id: 'BMEZ', name: 'BlackRock Health Sciences Term Trust', ticker: 'BMEZ', category: 'Alternative', return: 10.8, stdDev: 22.4, expense: 1.35, liquidity: 'Medium', aum: 1.9, allocation: 0, max: 10 }
  ];

  // Simplified correlation matrix (would be more comprehensive in a real application)
  const correlationMatrix: number[][] = Array.from({ length: investments.length }, () => 
    Array.from({ length: investments.length }, () => 0)
  );

  // Fill the diagonal with 1s (each asset perfectly correlated with itself)
  for (let i = 0; i < investments.length; i++) {
    correlationMatrix[i][i] = 1;
  }

  // Fill in some sample correlations - traditional assets correlations
  correlationMatrix[0][1] = correlationMatrix[1][0] = 0.85; // VOO-EFA
  correlationMatrix[0][2] = correlationMatrix[2][0] = 0.10; // VOO-BND
  correlationMatrix[1][2] = correlationMatrix[2][1] = 0.15; // EFA-BND

  // Alternative assets have lower correlations with traditional assets
  for (let i = 3; i < investments.length; i++) {
    correlationMatrix[0][i] = correlationMatrix[i][0] = Math.random() * 0.4 + 0.2; // VOO correlations
    correlationMatrix[1][i] = correlationMatrix[i][1] = Math.random() * 0.4 + 0.2; // EFA correlations
    correlationMatrix[2][i] = correlationMatrix[i][2] = Math.random() * 0.3 + 0.1; // BND correlations
  }

  // Alternative assets correlations with each other (more varied)
  for (let i = 3; i < investments.length; i++) {
    for (let j = i + 1; j < investments.length; j++) {
      const corr = Math.random() * 0.4 + 0.3;
      correlationMatrix[i][j] = correlationMatrix[j][i] = corr;
    }
  }

  // State hooks
  const [portfolioData, setPortfolioData] = useState(investments);
  const [totalAllocation, setTotalAllocation] = useState(0);
  const [portfolioReturn, setPortfolioReturn] = useState(0);
  const [portfolioRisk, setPortfolioRisk] = useState(0);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [netReturn, setNetReturn] = useState(0);
  const [weightedExpense, setWeightedExpense] = useState(0);
  const [liquidityProfile, setLiquidityProfile] = useState({ high: 0, medium: 0, low: 0 });
  const [alternativeAllocation, setAlternativeAllocation] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Define message interface
  interface ChatMessage {
    role: 'assistant' | 'user';
    content: string;
  }

  // For the chatbot
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to the Alternative Investments challenge! I'm here to help you evaluate and allocate alternative investments for the Westman Family Office. What would you like to know about alternative investments, their characteristics, or portfolio construction?" }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined AI responses based on keywords
  const aiResponses: Record<string, string> = {
    'alternative': "Alternative investments are assets that fall outside of conventional investment categories like stocks, bonds, and cash. They include private equity, hedge funds, real estate, commodities, and other specialized strategies. They typically offer different risk-return profiles and lower correlations with traditional markets.",
    'liquidity': "Liquidity refers to how quickly an investment can be sold without affecting its price. Traditional ETFs like VOO and BND offer high liquidity, while alternative investments often have medium to low liquidity. The Westman Family Office needs to maintain at least 85% of the portfolio in investments rated 'Medium' liquidity or better.",
    'correlation': "Correlation measures how investments move in relation to each other. Lower correlations between assets provide diversification benefits. Alternative investments often have lower correlations with traditional stocks and bonds, which can help reduce overall portfolio volatility.",
    'expense': "Expense ratios represent the annual cost of owning an investment. Alternative investments typically have higher expense ratios than traditional ETFs. For example, VOO has an expense ratio of 0.03%, while PSP's is 1.44%. These higher fees can significantly impact long-term returns.",
    'private equity': "The PSP ETF provides exposure to listed private equity companies, offering a way to access private equity returns with better liquidity than direct investments. It has high return potential (11.8%) but also high volatility (25.5%) and a significant expense ratio (1.44%).",
    'hedge fund': "The QAI ETF tracks hedge fund strategies, aiming to provide returns similar to hedge funds with better liquidity and lower minimum investments. It offers moderate returns (4.5%) with lower volatility (7.2%), making it a potential volatility reducer in a portfolio.",
    'closed-end': "Closed-end funds like JPS, UTF, and BMEZ trade on exchanges but have a fixed number of shares. They can trade at premiums or discounts to their net asset value and often use leverage to enhance returns. They typically offer higher yields but come with higher expenses.",
    'real assets': "Real assets like real estate (VNQ) and gold (IAU) provide inflation protection and diversification benefits. They often perform differently than financial assets during market stress, helping to reduce overall portfolio volatility.",
    'westman': "The Westman Family Office has $25M in investable assets with moderate-high risk tolerance. Their annual liquidity needs are $500,000 (2% of assets), and they want long-term capital preservation and growth with inflation protection. An allocation of 25-35% to alternatives could be appropriate.",
    'help': "I can help with: 1) Explaining characteristics of different alternative investments, 2) Discussing potential benefits and drawbacks of including alternatives, 3) Providing insights on portfolio construction with alternatives, 4) Explaining the impact of fees and liquidity constraints. What would you like to know?"
  };

  // Handler for allocation changes
  const handleAllocationChange = (id: string, value: string) => {
    const investment = portfolioData.find(inv => inv.id === id);
    if (!investment) return;
    
    const newValue = Math.min(parseInt(value) || 0, investment.max);
    const updatedPortfolio = portfolioData.map(inv => 
      inv.id === id ? { ...inv, allocation: newValue } : inv
    );
    
    setPortfolioData(updatedPortfolio);
    
    // Update total allocation
    const total = updatedPortfolio.reduce((sum, inv) => sum + inv.allocation, 0);
    setTotalAllocation(total);
  };

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = useCallback(() => {
    if (totalAllocation === 0) {
      setPortfolioReturn(0);
      setPortfolioRisk(0);
      setSharpeRatio(0);
      setNetReturn(0);
      setWeightedExpense(0);
      setLiquidityProfile({ high: 0, medium: 0, low: 0 });
      setAlternativeAllocation(0);
      return;
    }
    
    // Calculate weights
    const weights = portfolioData.map(inv => inv.allocation / totalAllocation);
    
    // Calculate expected return
    const grossReturn = weights.reduce((sum, weight, idx) => 
      sum + weight * portfolioData[idx].return, 0);
    
    // Calculate weighted expense ratio
    const expense = weights.reduce((sum, weight, idx) => 
      sum + weight * portfolioData[idx].expense, 0);
    
    // Calculate net return
    const net = grossReturn - expense;
    
    // Calculate portfolio variance using correlation matrix
    let variance = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        const correlation = correlationMatrix[i][j];
        const covariance = correlation * portfolioData[i].stdDev * portfolioData[j].stdDev / 100;
        variance += weights[i] * weights[j] * covariance;
      }
    }
    
    // Calculate portfolio risk (standard deviation)
    const risk = Math.sqrt(variance);
    
    // Calculate Sharpe ratio (using 2% risk-free rate)
    const sharpe = (net - 2.0) / risk;
    
    // Calculate liquidity profile
    const highLiquidity = weights.reduce((sum, weight, idx) => 
      sum + (portfolioData[idx].liquidity === 'High' ? weight : 0), 0) * 100;
    
    const mediumLiquidity = weights.reduce((sum, weight, idx) => 
      sum + (portfolioData[idx].liquidity === 'Medium' ? weight : 0), 0) * 100;
    
    const lowLiquidity = weights.reduce((sum, weight, idx) => 
      sum + (portfolioData[idx].liquidity === 'Low' ? weight : 0), 0) * 100;
    
    // Calculate alternative allocation
    const altAllocation = weights.reduce((sum, weight, idx) => 
      sum + (portfolioData[idx].category === 'Alternative' || portfolioData[idx].category === 'Real Assets' ? weight : 0), 0) * 100;
    
    setPortfolioReturn(grossReturn);
    setNetReturn(net);
    setPortfolioRisk(risk);
    setSharpeRatio(sharpe);
    setWeightedExpense(expense);
    setLiquidityProfile({ 
      high: highLiquidity, 
      medium: mediumLiquidity, 
      low: lowLiquidity 
    });
    setAlternativeAllocation(altAllocation);
  }, [correlationMatrix, portfolioData, totalAllocation]);

  // Calculate portfolio metrics whenever allocation changes
  useEffect(() => {
    calculatePortfolioMetrics();
  }, [calculatePortfolioMetrics]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Submit portfolio
  const handleSubmit = () => {
    if (totalAllocation !== 100) {
      alert("Total allocation must equal 100%");
      return;
    }
    
    if (explanation.length < 200) {
      alert("Please provide a more detailed explanation (minimum 200 characters)");
      return;
    }
    
    setSubmitted(true);
    
    // Analyze portfolio composition
    const traditionalAllocation = 100 - alternativeAllocation;
    const sufficientLiquidity = liquidityProfile.high + liquidityProfile.medium >= 85;
    
    // Check if allocation to alternatives is appropriate
    const appropriateAlternativeAllocation = alternativeAllocation >= 20 && alternativeAllocation <= 35;
    
    // Check if expense ratio is reasonable
    const reasonableExpense = weightedExpense <= 0.40;
    
    // Check improvement in risk-adjusted return
    // Hypothetical traditional 60/40 portfolio metrics
    const traditional6040Return = 0.6 * 7.5 + 0.4 * 3.5; // 60% VOO, 40% BND
    const traditional6040Expense = 0.6 * 0.03 + 0.4 * 0.03; // Expense ratios
    const traditional6040NetReturn = traditional6040Return - traditional6040Expense;
    const traditional6040Sharpe = (traditional6040NetReturn - 2.0) / 10.0; // Approximate risk of 10%
    
    const improvedSharpe = sharpeRatio > traditional6040Sharpe;
    
    // Overall evaluation
    if (appropriateAlternativeAllocation && sufficientLiquidity && reasonableExpense && improvedSharpe) {
      setFeedback("Excellent work! Your portfolio strikes an optimal balance between traditional and alternative investments. The 20-35% allocation to alternatives enhances diversification and improves risk-adjusted returns without excessive fees or liquidity constraints. You've effectively utilized different types of alternatives to address the Westman Family's needs for inflation protection, income, and long-term growth. You've earned the 'Alternative Alchemist' badge!");
    } else if (!appropriateAlternativeAllocation && alternativeAllocation < 20) {
      setFeedback("Your allocation to alternative investments is too conservative. With only " + alternativeAllocation.toFixed(1) + "% in alternatives, you're not fully capturing the diversification benefits these assets can provide. Consider increasing exposure to alternatives while maintaining a prudent overall approach.");
    } else if (!appropriateAlternativeAllocation && alternativeAllocation > 35) {
      setFeedback("Your allocation to alternative investments is too aggressive at " + alternativeAllocation.toFixed(1) + "%. While alternatives offer diversification benefits, they also come with higher fees, complexity, and sometimes lower liquidity. A more moderate allocation would better suit the Westman Family's needs.");
    } else if (!sufficientLiquidity) {
      setFeedback("Your portfolio doesn't maintain sufficient liquidity to meet the Westman Family's annual cash needs. With only " + (liquidityProfile.high + liquidityProfile.medium).toFixed(1) + "% in high or medium liquidity investments, they may face challenges funding their $500,000 annual withdrawal.");
    } else if (!reasonableExpense) {
      setFeedback("Your portfolio's weighted expense ratio of " + weightedExpense.toFixed(2) + "% is too high. While alternative investments typically have higher fees than traditional assets, the overall impact on net returns should be carefully managed. Try to reduce the allocation to high-fee investments.");
    } else if (!improvedSharpe) {
      setFeedback("Your portfolio doesn't show sufficient improvement in risk-adjusted return compared to a traditional 60/40 portfolio. The higher fees and complexity of alternative investments aren't justified by the resulting performance. Reconsider your allocation strategy.");
    } else {
      setFeedback("Your portfolio shows promise but could be optimized further. Review your allocations to ensure you're achieving the right balance of diversification benefits, fee impact, and liquidity constraints while improving overall risk-adjusted returns.");
    }
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const newUserMessage: ChatMessage = { role: 'user', content: currentMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    // Generate AI response based on keywords in user message
    const userMessageLower = currentMessage.toLowerCase();
    let aiResponse = "I don't have specific information about that. Try asking about alternative investments, liquidity considerations, expense ratios, or specific investment types like 'private equity' or 'hedge funds'. You can also type 'help' for assistance.";
    
    // Check for keyword matches in the user's message
    for (const [keyword, response] of Object.entries(aiResponses)) {
      if (userMessageLower.includes(keyword)) {
        aiResponse = response;
        break;
      }
    }
    
    // Add AI response with a small delay to feel more natural
    setTimeout(() => {
      const newAssistantMessage: ChatMessage = { role: 'assistant', content: aiResponse };
      setMessages([...updatedMessages, newAssistantMessage]);
    }, 500);
    
    setCurrentMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 4: Challenge 4.1</h1>
            <h2 className="text-lg">Alternative Investments Unleashed</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-indigo-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-1/3"></div>
              </div>
              <p className="text-xs mt-1">Challenge 1 of 2 in Level 4</p>
            </div>
            <Link href="/portfolio/level4" className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded text-sm font-medium">
              Level Map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Context Panel */}
        <div className="lg:col-span-12 bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Client Profile: Westman Family Office</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Total Assets</h4>
                <p className="text-lg font-medium text-gray-900">$25 million</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Annual Liquidity Needs</h4>
                <p className="text-lg font-medium text-gray-900">$500,000 (2%)</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Time Horizon</h4>
                <p className="text-lg font-medium text-gray-900">Multi-generational</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Current Allocation</h4>
                <p className="text-lg font-medium text-gray-900">45% US equities, 20% international equities, 35% fixed income</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Risk Tolerance</h4>
                <div className="flex items-center mt-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" style={{ width: '70%' }}></div>
                  </div>
                  <span className="ml-2 font-medium">7/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Moderate-High</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Investment Objectives</h4>
                <p className="text-sm text-gray-700">
                  &quot;Long-term capital preservation and growth with inflation protection&quot;
                </p>
              </div>
              
              <div className="p-3 bg-indigo-50 rounded-lg">
                <h4 className="text-sm font-semibold text-indigo-800 mb-2">Key Considerations:</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Maintain sufficient liquidity for annual withdrawals
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Balance fee impact with performance potential
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Seek improved risk-adjusted returns through diversification
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main workspace and chat panels */}
        <div className="lg:col-span-8 space-y-6">
          {/* Available Investments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Construction</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Std Dev</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Liquidity</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">AUM ($B)</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Max %</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolioData.map((investment) => (
                    <tr key={investment.id} className={`hover:bg-gray-50 ${investment.category === 'Alternative' ? 'bg-indigo-50' : investment.category === 'Real Assets' ? 'bg-green-50' : ''}`}>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900">{investment.name}</div>
                        <div className="text-xs text-gray-500">{investment.ticker}</div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          investment.category === 'Alternative' ? 'bg-indigo-100 text-indigo-800' : 
                          investment.category === 'Real Assets' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {investment.category}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{investment.return.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{investment.stdDev.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{investment.expense.toFixed(2)}%</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          investment.liquidity === 'High' ? 'bg-green-100 text-green-800' : 
                          investment.liquidity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {investment.liquidity}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{investment.aum < 1 ? investment.aum.toFixed(3) : investment.aum.toFixed(1)}</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{investment.max}%</td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          max={investment.max}
                          value={investment.allocation}
                          onChange={(e) => handleAllocationChange(investment.id, e.target.value)}
                          disabled={submitted}
                          className={`w-16 px-2 py-1 text-right border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            investment.allocation > investment.max 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-indigo-500'
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={8} className="px-3 py-3 text-sm font-medium text-gray-900">Total Allocation</td>
                    <td className="px-3 py-3 text-right font-bold text-sm">
                      <span className={totalAllocation !== 100 ? "text-red-600" : "text-green-600"}>
                        {totalAllocation}%
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Portfolio Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-800 mb-1">Expected Return (Gross)</h4>
                <p className="text-2xl font-bold text-indigo-900">{portfolioReturn.toFixed(2)}%</p>
                <div className="mt-1 flex justify-between text-xs text-indigo-700">
                  <span>Net of Fees:</span>
                  <span className="font-medium">{netReturn.toFixed(2)}%</span>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-800 mb-1">Portfolio Risk</h4>
                <p className="text-2xl font-bold text-indigo-900">{portfolioRisk.toFixed(2)}%</p>
                <div className="mt-1 flex justify-between text-xs text-indigo-700">
                  <span>Sharpe Ratio:</span>
                  <span className="font-medium">{sharpeRatio.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-800 mb-1">Weighted Expense Ratio</h4>
                <p className="text-2xl font-bold text-indigo-900">{weightedExpense.toFixed(2)}%</p>
                <div className="mt-1 flex justify-between text-xs text-indigo-700">
                  <span>Annual Cost:</span>
                  <span className="font-medium">${(weightedExpense * 250000).toFixed(0)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Liquidity Profile</h4>
                <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${liquidityProfile.high}%` }}
                      title={`High Liquidity: ${liquidityProfile.high.toFixed(1)}%`}
                    ></div>
                    <div 
                      className="bg-yellow-500" 
                      style={{ width: `${liquidityProfile.medium}%` }}
                      title={`Medium Liquidity: ${liquidityProfile.medium.toFixed(1)}%`}
                    ></div>
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${liquidityProfile.low}%` }}
                      title={`Low Liquidity: ${liquidityProfile.low.toFixed(1)}%`}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>High: {liquidityProfile.high.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span>Medium: {liquidityProfile.medium.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span>Low: {liquidityProfile.low.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Asset Allocation</h4>
                <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${100 - alternativeAllocation}%` }}
                      title={`Traditional: ${(100 - alternativeAllocation).toFixed(1)}%`}
                    ></div>
                    <div 
                      className="bg-indigo-500" 
                      style={{ width: `${alternativeAllocation}%` }}
                      title={`Alternatives: ${alternativeAllocation.toFixed(1)}%`}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Traditional: {(100 - alternativeAllocation).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
                    <span>Alternatives: {alternativeAllocation.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Portfolio Rationale */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Rationale</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explain your alternative investment strategy (minimum 200 characters):
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                disabled={submitted}
                placeholder="Explain your allocation strategy, why you included specific alternative investments, how you balanced return potential with fee impact and liquidity constraints, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 h-32"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {explanation.length} characters (minimum 200 required)
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={submitted || totalAllocation !== 100 || explanation.length < 200}
                className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  submitted || totalAllocation !== 100 || explanation.length < 200
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Submit Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Advisor Panel with Chatbot */}
        <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md flex flex-col h-[calc(100vh-10rem)]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Alternative Investment Advisor</h3>
          
          {!submitted ? (
            <>
              <div className="flex-1 overflow-auto mb-4 border border-gray-200 rounded-lg">
                <div className="p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.role === 'assistant' 
                            ? 'bg-indigo-50 text-gray-800' 
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <form onSubmit={handleChatSubmit} className="mt-auto">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask about alternative investments..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div>
              <div className={`p-4 rounded-lg ${feedback.includes('Excellent') ? 'bg-green-50 border border-green-200' : 'bg-indigo-50 border border-indigo-200'}`}>
                <p className="text-gray-800">{feedback}</p>
              </div>
              
              {feedback.includes('Excellent') && (
                <div className="mt-6 text-center">
                  <div className="inline-block p-4 bg-yellow-50 rounded-full border-2 border-yellow-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mt-2">Alternative Alchemist Badge Earned!</h4>
                  <p className="text-sm text-gray-600 mt-1">You&apos;ve mastered alternative investment allocation</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio/level4/challenge2" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                      Next Challenge →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}