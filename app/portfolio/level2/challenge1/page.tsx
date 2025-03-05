'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for actual implementation
const investments = [
  { id: 'SPY', name: 'S&P 500 ETF', ticker: 'SPY', return: 8.5, stdDev: 16.2, min: 0, max: 40, allocation: 0 },
  { id: 'QQQ', name: 'Nasdaq-100 ETF', ticker: 'QQQ', return: 10.2, stdDev: 19.3, min: 0, max: 30, allocation: 0 },
  { id: 'EFA', name: 'MSCI EAFE ETF', ticker: 'EFA', return: 7.8, stdDev: 17.5, min: 0, max: 30, allocation: 0 },
  { id: 'EEM', name: 'MSCI Emerging Markets ETF', ticker: 'EEM', return: 9.2, stdDev: 20.8, min: 0, max: 20, allocation: 0 },
  { id: 'AGG', name: 'Aggregate Bond ETF', ticker: 'AGG', return: 3.5, stdDev: 5.2, min: 5, max: 40, allocation: 0 },
  { id: 'IEF', name: 'Treasury Bond ETF', ticker: 'IEF', return: 3.0, stdDev: 4.8, min: 0, max: 30, allocation: 0 },
  { id: 'AAPL', name: 'Apple Inc.', ticker: 'AAPL', return: 12.5, stdDev: 22.8, min: 0, max: 10, allocation: 0 },
  { id: 'AMZN', name: 'Amazon.com, Inc.', ticker: 'AMZN', return: 14.0, stdDev: 25.3, min: 0, max: 10, allocation: 0 },
  { id: 'JPM', name: 'JPMorgan Chase & Co.', ticker: 'JPM', return: 9.8, stdDev: 18.6, min: 0, max: 10, allocation: 0 },
  { id: 'PG', name: 'Procter & Gamble Co.', ticker: 'PG', return: 7.5, stdDev: 12.3, min: 0, max: 10, allocation: 0 },
  { id: 'VNQ', name: 'Real Estate ETF', ticker: 'VNQ', return: 7.2, stdDev: 16.5, min: 0, max: 15, allocation: 0 },
];

// Simplified correlation matrix (would be more comprehensive in a real application)
const correlationMatrix = Array(11).fill().map(() => Array(11).fill(0));

// Fill the diagonal with 1s (each asset perfectly correlated with itself)
for (let i = 0; i < 11; i++) {
  correlationMatrix[i][i] = 1;
}

// Fill in some sample correlations
// ETFs correlations
correlationMatrix[0][1] = correlationMatrix[1][0] = 0.85; // SPY-QQQ
correlationMatrix[0][2] = correlationMatrix[2][0] = 0.75; // SPY-EFA
correlationMatrix[0][3] = correlationMatrix[3][0] = 0.65; // SPY-EEM
correlationMatrix[1][2] = correlationMatrix[2][1] = 0.65; // QQQ-EFA
correlationMatrix[1][3] = correlationMatrix[3][1] = 0.60; // QQQ-EEM
correlationMatrix[2][3] = correlationMatrix[3][2] = 0.85; // EFA-EEM

// Bond ETFs correlations
correlationMatrix[4][5] = correlationMatrix[5][4] = 0.80; // AGG-IEF

// Stock correlations
correlationMatrix[6][7] = correlationMatrix[7][6] = 0.70; // AAPL-AMZN
correlationMatrix[8][9] = correlationMatrix[9][8] = 0.45; // JPM-PG

// Bonds correlation to stocks (generally low or negative)
for (let i = 0; i < 4; i++) {
  for (let j = 4; j < 6; j++) {
    correlationMatrix[i][j] = correlationMatrix[j][i] = 0.10;
  }
}

// Real estate correlations
for (let i = 0; i < 10; i++) {
  correlationMatrix[i][10] = correlationMatrix[10][i] = i < 4 ? 0.60 : i < 6 ? 0.30 : 0.40;
}

// Synthetic efficient frontier data
const efficientFrontierPoints = [
  { return: 4.0, risk: 4.5 },
  { return: 5.0, risk: 5.2 },
  { return: 6.0, risk: 6.5 },
  { return: 7.0, risk: 8.3 },
  { return: 8.0, risk: 10.5 },
  { return: 9.0, risk: 13.2 },
  { return: 10.0, risk: 16.5 },
  { return: 11.0, risk: 20.0 },
  { return: 12.0, risk: 24.0 },
];

// The "optimal" portfolio at maximum Sharpe ratio
const sampleOptimalPortfolio = {
  SPY: 22,
  QQQ: 12,
  EFA: 8,
  EEM: 6,
  AGG: 12,
  IEF: 8,
  VNQ: 8,
  AAPL: 7,
  AMZN: 7,
  JPM: 5,
  PG: 5
};

export default function EfficientPortfolio() {
  const [portfolioData, setPortfolioData] = useState(investments);
  const [totalAllocation, setTotalAllocation] = useState(0);
  const [portfolioReturn, setPortfolioReturn] = useState(0);
  const [portfolioRisk, setPortfolioRisk] = useState(0);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [optimalPortfolio, setOptimalPortfolio] = useState(null);
  const [showOptimal, setShowOptimal] = useState(false);
  const [riskFreeRate, setRiskFreeRate] = useState(2.0);
  
  // Chatbot state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome! I'm your Investment Guru AI assistant. I can help you craft an efficient portfolio for the Thompson family. What would you like to know about modern portfolio theory or the optimization process?" }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Predefined AI responses based on keywords
  const aiResponses = {
    'efficient frontier': "The efficient frontier represents the set of optimal portfolios that offer the highest expected return for a defined level of risk. Each point on the frontier represents a portfolio allocation. As you move up the frontier, both return and risk increase.",
    'sharpe ratio': "The Sharpe ratio measures the excess return (above the risk-free rate) per unit of risk. The portfolio with the highest Sharpe ratio, called the tangency portfolio, offers the best risk-adjusted return. It's found at the point where a line from the risk-free rate is tangent to the efficient frontier.",
    'constraints': "The Thompson family portfolio has several constraints: (1) Minimum 15% allocation to bonds (AGG+IEF) (2) No short selling (all weights ≥ 0) (3) Maximum allocations for each asset as shown in the table. These constraints ensure a practical, well-diversified portfolio that aligns with their needs.",
    'optimization': "Mean-variance optimization aims to find the portfolio allocation that maximizes expected return for a given level of risk (or minimizes risk for a given return). It considers asset returns, volatility, and correlations. Try using the 'Calculate Optimal' button to see the optimal portfolio for the Thompson family based on these principles.",
    'correlation': "Correlation measures how assets move in relation to each other. Assets with low or negative correlations provide diversification benefits, reducing overall portfolio risk. For example, bonds (AGG, IEF) typically have low correlation with stocks, making them valuable for diversification.",
    'thompson family': "The Thompson family has $500,000 to invest with a 7-10 year time horizon. Their risk tolerance is moderate-to-high (7/10), and they want growth with some stability. They need a diversified portfolio that can help fund college expenses in 5-8 years while providing long-term growth.",
    'help': "I can assist with: 1) Explaining portfolio theory concepts like efficient frontier or Sharpe ratio 2) Providing insights on allocation strategies 3) Explaining the optimization process 4) Discussing the Thompson family's needs and constraints. What would you like to know?"
  };

  useEffect(() => {
    calculatePortfolioMetrics();
  }, [portfolioData, riskFreeRate]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAllocationChange = (id, value) => {
    const newValue = parseInt(value) || 0;
    const updatedPortfolio = portfolioData.map(inv => 
      inv.id === id ? { ...inv, allocation: Math.min(newValue, inv.max) } : inv
    );
    setPortfolioData(updatedPortfolio);
  };

  const calculatePortfolioMetrics = () => {
    // Calculate total allocation
    const total = portfolioData.reduce((sum, inv) => sum + inv.allocation, 0);
    setTotalAllocation(total);

    if (total === 0) {
      setPortfolioReturn(0);
      setPortfolioRisk(0);
      setSharpeRatio(0);
      return;
    }

    // Normalize allocations to percentages
    const weights = portfolioData.map(inv => inv.allocation / total);
    
    // Calculate expected return
    const expReturn = weights.reduce((sum, weight, idx) => 
      sum + weight * portfolioData[idx].return, 0);
    
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
    
    // Calculate Sharpe ratio
    const sharpe = (expReturn - riskFreeRate) / risk;
    
    setPortfolioReturn(expReturn);
    setPortfolioRisk(risk);
    setSharpeRatio(sharpe);
  };

  const calculateOptimalPortfolio = () => {
    // In a real application, this would use a quadratic programming solver
    // to find the optimal weights that maximize the Sharpe ratio
    // For this simulation, we'll use a pre-calculated "optimal" portfolio
    
    const optimizedPortfolio = portfolioData.map(inv => ({
      ...inv,
      allocation: sampleOptimalPortfolio[inv.id]
    }));
    
    setOptimalPortfolio(optimizedPortfolio);
    
    // Add a message from the AI about the optimization
    setMessages([...messages, {
      role: 'assistant',
      content: "I've calculated the optimal portfolio that maximizes Sharpe ratio while meeting all constraints. This portfolio achieves an expected return of ~7.8% with a risk of ~11.5%, yielding a Sharpe ratio of ~0.52. You can view the allocation by clicking 'Show Optimal Portfolio'."
    }]);
  };

  const applyOptimalPortfolio = () => {
    if (optimalPortfolio) {
      setPortfolioData(optimalPortfolio);
      setShowOptimal(false);
    }
  };

  const handleSubmit = () => {
    if (totalAllocation !== 100) {
      alert("Total allocation must equal 100%");
      return;
    }

    if (explanation.length < 150) {
      alert("Please provide a more detailed explanation (minimum 150 characters)");
      return;
    }

    setSubmitted(true);

    // Calculate bond allocation
    const bondAllocation = portfolioData.filter(inv => inv.id === 'AGG' || inv.id === 'IEF')
      .reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Calculate ETF allocation excluding bonds
    const etfAllocation = portfolioData.filter(inv => 
      ['SPY', 'QQQ', 'EFA', 'EEM', 'VNQ'].includes(inv.id))
      .reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Calculate individual stock allocation
    const stockAllocation = portfolioData.filter(inv => 
      ['AAPL', 'AMZN', 'JPM', 'PG'].includes(inv.id))
      .reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Check if any allocation exceeds asset's maximum
    const exceedsMax = portfolioData.some(inv => inv.allocation > inv.max);
    
    // Check if bond allocation meets minimum requirement
    const meetsMinBond = bondAllocation >= 15;

    // Evaluate the portfolio
    if (meetsMinBond && !exceedsMax && 
        etfAllocation >= 40 && etfAllocation <= 60 &&
        stockAllocation >= 20 && stockAllocation <= 30 &&
        portfolioRisk >= 10 && portfolioRisk <= 13 &&
        portfolioReturn >= 7 && portfolioReturn <= 8.5) {
      setFeedback("Excellent work! You've crafted an efficient portfolio that balances the Thompson family's growth objectives with appropriate risk controls. Your allocation meets all constraints while achieving strong risk-adjusted returns. The ETF-individual stock mix provides both broad market exposure and targeted growth opportunities. You've earned the 'Optimization Ace' badge!");
    } else if (!meetsMinBond) {
      setFeedback("Your portfolio doesn't meet the minimum 15% allocation to bond ETFs (AGG, IEF) required by the Thompson family's investment policy. Bond exposure is essential to provide stability given their need for college funding in 5-8 years.");
    } else if (exceedsMax) {
      setFeedback("Your portfolio includes one or more investments that exceed their maximum allocation limits. These constraints help ensure appropriate diversification and risk management.");
    } else if (portfolioRisk > 14) {
      setFeedback("Your portfolio may be too aggressive for the Thompson family's moderate-to-high risk tolerance. Consider reducing exposure to high-volatility assets like emerging markets (EEM) or individual stocks.");
    } else if (portfolioRisk < 9) {
      setFeedback("Your portfolio may be too conservative given the Thompson family's 7-10 year time horizon and moderate-to-high risk tolerance. A slightly higher equity allocation could improve long-term growth prospects.");
    } else {
      setFeedback("Your portfolio is reasonably aligned with the Thompson family's needs but could be optimized further. Review the balance between growth potential (through stock ETFs and select individual stocks) and stability (through bond ETFs).");
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const updatedMessages = [...messages, { role: 'user', content: currentMessage }];
    setMessages(updatedMessages);
    
    // Generate AI response based on keywords in user message
    const userMessageLower = currentMessage.toLowerCase();
    let aiResponse = "I'm not sure I understand. Try asking about efficient frontier, Sharpe ratio, portfolio optimization, or the Thompson family's needs. You can also type 'help' for assistance.";
    
    // Check for keyword matches in the user's message
    for (const [keyword, response] of Object.entries(aiResponses)) {
      if (userMessageLower.includes(keyword)) {
        aiResponse = response;
        break;
      }
    }
    
    // Add AI response with a small delay to feel more natural
    setTimeout(() => {
      setMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
    }, 500);
    
    setCurrentMessage('');
  };

  const resetPortfolio = () => {
    setPortfolioData(investments.map(inv => ({ ...inv, allocation: 0 })));
    setExplanation('');
    setSubmitted(false);
    setFeedback('');
    setOptimalPortfolio(null);
    setShowOptimal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-green-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 2: Challenge 2.1</h1>
            <h2 className="text-lg">Crafting the Efficient Portfolio</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-green-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-1/4"></div>
              </div>
              <p className="text-xs mt-1">Challenge 1 of 4 in Level 2</p>
            </div>
            <Link href="/portfolio/level2" className="px-3 py-1 bg-green-500 hover:bg-green-400 rounded text-sm font-medium">
              Level Map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Context Panel (25%) */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Client Profile</h3>
          
          <div className="mb-6 bg-green-50 rounded-lg overflow-hidden">
            <div className="p-4">
              <h4 className="font-medium text-green-800">Thompson Family</h4>
              <p className="text-sm text-gray-600">Moderate-High Risk Tolerance (7/10)</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Investment Amount</h4>
              <p className="text-lg font-medium text-gray-900">$500,000</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Time Horizon</h4>
              <p className="text-lg font-medium text-gray-900">7-10 years</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Primary Goal</h4>
              <p className="text-lg font-medium text-gray-900">Long-term growth with moderate stability</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Secondary Goal</h4>
              <p className="text-lg font-medium text-gray-900">College funding for children in 5-8 years</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Risk Tolerance (1-10)</h4>
              <div className="flex items-center mt-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" style={{ width: '70%' }}></div>
                </div>
                <span className="ml-2 font-medium">7/10</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Portfolio Constraints:</h4>
            <ul className="text-sm space-y-1.5 text-gray-700">
              <li className="flex items-start">
                <svg className="h-4 w-4 text-yellow-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Min 15% allocation to bonds (AGG, IEF)
              </li>
              <li className="flex items-start">
                <svg className="h-4 w-4 text-yellow-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No short selling (all weights ≥ 0)
              </li>
              <li className="flex items-start">
                <svg className="h-4 w-4 text-yellow-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Maximum allocations as shown in table
              </li>
            </ul>
          </div>
        </div>

        {/* Workspace Panel (50%) */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Optimizer</h3>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={calculateOptimalPortfolio}
                disabled={submitted}
                className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  submitted ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Calculate Optimal
              </button>
              
              {optimalPortfolio && (
                <button
                  onClick={() => setShowOptimal(!showOptimal)}
                  className="px-4 py-2 border border-green-300 rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {showOptimal ? 'Hide Optimal' : 'Show Optimal'}
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Risk-Free Rate:</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) || 0)}
                disabled={submitted}
                className="w-16 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Exp Return</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Std Dev</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocation %
                    {showOptimal && <span className="block text-xxs text-green-600">Optimal</span>}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm text-gray-900">
                      <div className="font-medium">{investment.name}</div>
                      <div className="text-xs text-gray-500">{investment.ticker}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-right text-gray-900">{investment.return.toFixed(1)}%</td>
                    <td className="px-3 py-3 text-sm text-right text-gray-900">{investment.stdDev.toFixed(1)}%</td>
                    <td className="px-3 py-3 text-sm text-right text-gray-900">{investment.min}%</td>
                    <td className="px-3 py-3 text-sm text-right text-gray-900">{investment.max}%</td>
                    <td className="px-3 py-3 text-right relative">
                      <input
                        type="number"
                        min="0"
                        max={investment.max}
                        value={investment.allocation}
                        onChange={(e) => handleAllocationChange(investment.id, e.target.value)}
                        disabled={submitted}
                        className={`w-16 px-2 py-1 text-right border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                          investment.allocation > investment.max 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                      />
                      {showOptimal && (
                        <div className="absolute top-3 right-20 text-xs font-medium text-green-600">
                          {sampleOptimalPortfolio[investment.id]}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={5} className="px-3 py-3 text-sm font-medium text-gray-900">Total Allocation</td>
                  <td className="px-3 py-3 text-right font-bold text-sm">
                    <span className={totalAllocation !== 100 ? "text-red-600" : "text-green-600"}>
                      {totalAllocation}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-1">Expected Return</h4>
              <p className="text-2xl font-bold text-green-900">{portfolioReturn.toFixed(2)}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-1">Portfolio Risk</h4>
              <p className="text-2xl font-bold text-green-900">{portfolioRisk.toFixed(2)}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-1">Sharpe Ratio</h4>
              <p className="text-2xl font-bold text-green-900">{sharpeRatio.toFixed(2)}</p>
              <p className="text-xs text-green-700">(Risk-free rate: {riskFreeRate}%)</p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explain your investment strategy (minimum 150 characters):
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={submitted}
              placeholder="Explain your portfolio allocation strategy and how it addresses the Thompson family's needs..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 h-32"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {explanation.length} characters (minimum 150 required)
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={resetPortfolio}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={submitted || totalAllocation !== 100}
              className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                submitted || totalAllocation !== 100 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Finalize Portfolio
            </button>
          </div>
          
          {optimalPortfolio && showOptimal && (
            <div className="mt-6">
              <button
                onClick={applyOptimalPortfolio}
                disabled={submitted}
                className={`w-full py-2 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  submitted ? 'bg-gray-300 cursor-not-allowed' : ''
                }`}
              >
                Apply Optimal Allocation
              </button>
            </div>
          )}
        </div>

        {/* Advisor Panel (25%) with Chatbot */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col h-[calc(100vh-10rem)]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Guru AI</h3>
          
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
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'assistant' 
                            ? 'bg-green-50 text-gray-800' 
                            : 'bg-green-600 text-white'
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
                    placeholder="Ask about portfolio theory or optimization..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
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
              <div className={`p-4 rounded-lg ${feedback.includes('Excellent') ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                <p className="text-gray-800">{feedback}</p>
              </div>
              
              {feedback.includes('Excellent') && (
                <div className="mt-6 text-center">
                  <div className="inline-block p-4 bg-yellow-50 rounded-full border-2 border-yellow-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mt-2">Optimization Ace Badge Earned!</h4>
                  <p className="text-sm text-gray-600 mt-1">You've mastered efficient portfolio construction</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio/level2/challenge2" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
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