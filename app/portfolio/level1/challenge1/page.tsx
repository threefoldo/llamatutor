'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Investment {
  id: string;
  name: string;
  ticker: string;
  return: number;
  stdDev: number;
  allocation: number;
}

export default function BuildFirstPortfolio() {
  // Investment options with their data
  const investments: Investment[] = [
    { id: 'VTI', name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', return: 9.8, stdDev: 15.2, allocation: 0 },
    { id: 'BND', name: 'Vanguard Total Bond Market ETF', ticker: 'BND', return: 3.2, stdDev: 5.1, allocation: 0 },
    { id: 'IVV', name: 'iShares Core S&P 500 ETF', ticker: 'IVV', return: 9.5, stdDev: 14.8, allocation: 0 },
    { id: 'IEF', name: 'iShares 7-10 Year Treasury Bond ETF', ticker: 'IEF', return: 2.8, stdDev: 4.5, allocation: 0 },
    { id: 'AAPL', name: 'Apple Inc.', ticker: 'AAPL', return: 15.7, stdDev: 22.3, allocation: 0 },
    { id: 'MSFT', name: 'Microsoft Corporation', ticker: 'MSFT', return: 16.2, stdDev: 21.8, allocation: 0 },
    { id: 'JNJ', name: 'Johnson & Johnson', ticker: 'JNJ', return: 7.1, stdDev: 12.4, allocation: 0 },
    { id: 'WMT', name: 'Walmart Inc.', ticker: 'WMT', return: 6.3, stdDev: 10.9, allocation: 0 },
  ];

  // Simplified correlation matrix (would be more comprehensive in a real application)
  const correlationMatrix = [
    [1.00, 0.02, 0.95, 0.05, 0.72, 0.70, 0.45, 0.40], // VTI
    [0.02, 1.00, 0.05, 0.85, 0.01, 0.00, 0.25, 0.20], // BND
    [0.95, 0.05, 1.00, 0.10, 0.75, 0.72, 0.52, 0.45], // IVV
    [0.05, 0.85, 0.10, 1.00, 0.05, 0.05, 0.30, 0.25], // IEF
    [0.72, 0.01, 0.75, 0.05, 1.00, 0.65, 0.35, 0.30], // AAPL
    [0.70, 0.00, 0.72, 0.05, 0.65, 1.00, 0.30, 0.25], // MSFT
    [0.45, 0.25, 0.52, 0.30, 0.35, 0.30, 1.00, 0.42], // JNJ
    [0.40, 0.20, 0.45, 0.25, 0.30, 0.25, 0.42, 1.00], // WMT
  ];

  const [portfolioData, setPortfolioData] = useState(investments);
  const [totalAllocation, setTotalAllocation] = useState(0);
  const [portfolioReturn, setPortfolioReturn] = useState(0);
  const [portfolioRisk, setPortfolioRisk] = useState(0);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [activeHint, setActiveHint] = useState(0);
  const riskFreeRate = 1.5;

  const hints = [
    "Consider Maria's moderate risk tolerance (6/10) and her relatively short time horizon (3-5 years).",
    "For a 3-5 year time horizon, you might want to include more bonds to reduce volatility.",
    "ETFs like VTI and BND provide broad market exposure, while individual stocks add specific sector exposure but higher risk.",
    "Check the correlation matrix to see which assets move differently from each other.",
    "For a well-diversified portfolio, consider allocating 40-60% to bond ETFs."
  ];

  useEffect(() => {
    calculatePortfolioMetrics();
  }, [portfolioData]);

  const handleAllocationChange = (id: string, value: string | number) => {
    const newValue = parseInt(value.toString()) || 0;
    const updatedPortfolio = portfolioData.map(inv => 
      inv.id === id ? { ...inv, allocation: newValue } : inv
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

  const handleSubmit = () => {
    if (totalAllocation !== 100) {
      alert("Total allocation must equal 100%");
      return;
    }

    if (explanation.length < 50) {
      alert("Please provide a more detailed explanation (minimum 50 characters)");
      return;
    }

    setSubmitted(true);

    // Calculate bond allocation
    const bondAllocation = portfolioData.filter(inv => inv.id === 'BND' || inv.id === 'IEF')
      .reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Calculate stock ETF allocation
    const stockETFAllocation = portfolioData.filter(inv => inv.id === 'VTI' || inv.id === 'IVV')
      .reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Calculate individual stock allocation
    const individualStockAllocation = portfolioData.filter(inv => 
      !['VTI', 'BND', 'IVV', 'IEF'].includes(inv.id))
      .reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Check if any individual stock exceeds 10%
    const highStockAllocation = portfolioData.some(inv => 
      !['VTI', 'BND', 'IVV', 'IEF'].includes(inv.id) && inv.allocation > 10);

    // Evaluate the portfolio
    if (bondAllocation >= 40 && bondAllocation <= 60 &&
        stockETFAllocation >= 25 && stockETFAllocation <= 40 &&
        individualStockAllocation >= 10 && individualStockAllocation <= 25 &&
        !highStockAllocation) {
      setFeedback("Excellent work! Your portfolio is well-balanced for Maria's needs. The bond allocation provides stability for her 3-5 year time horizon, while the mix of ETFs and individual stocks offers growth potential with reasonable risk. You've earned the 'Rookie Analyst' badge!");
    } else if (bondAllocation < 40) {
      setFeedback("Your portfolio might be too aggressive for Maria's 3-5 year time horizon. Consider increasing the bond allocation to provide more stability.");
    } else if (individualStockAllocation > 25) {
      setFeedback("Your individual stock allocation is high for Maria's risk tolerance. Consider reducing individual stocks and increasing broad-market ETFs.");
    } else if (highStockAllocation) {
      setFeedback("You have one or more individual stocks with allocations exceeding 10%. This creates concentration risk. Consider diversifying more.");
    } else {
      setFeedback("Your portfolio is reasonably aligned with Maria's needs, but could be optimized further. Review the balance between bonds, ETFs, and individual stocks.");
    }
  };

  const resetPortfolio = () => {
    setPortfolioData(investments.map(inv => ({ ...inv, allocation: 0 })));
    setExplanation('');
    setSubmitted(false);
    setFeedback('');
  };

  const nextHint = () => {
    setActiveHint((activeHint + 1) % hints.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 1: Challenge 1.1</h1>
            <h2 className="text-lg">Build Your First Portfolio</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-blue-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-1/4"></div>
              </div>
              <p className="text-xs mt-1">Challenge 1 of 4 in Level 1</p>
            </div>
            <button 
              onClick={() => setShowHint(!showHint)} 
              className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-sm font-medium"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <Link href="/portfolio" className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-sm font-medium">
              Mission Map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Context Panel (25%) */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Client Profile</h3>
          
          <div className="mb-6 bg-blue-50 rounded-lg overflow-hidden">
            <div className="p-4">
              <h4 className="font-medium text-blue-800">Maria Chen</h4>
              <p className="text-sm text-gray-600">Software Engineer, Age 35</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Current Savings</h4>
              <p className="text-lg font-medium text-gray-900">$100,000</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Annual Income</h4>
              <p className="text-lg font-medium text-gray-900">$125,000</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Time Horizon</h4>
              <p className="text-lg font-medium text-gray-900">3-5 years</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Investment Goal</h4>
              <p className="text-lg font-medium text-gray-900">Home down payment</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Risk Tolerance (1-10)</h4>
              <div className="flex items-center mt-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" style={{ width: '60%' }}></div>
                </div>
                <span className="ml-2 font-medium">6/10</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Moderately risk-averse</p>
            </div>
          </div>

          {showHint && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Investment Guru Hint:</h4>
              <p className="text-sm text-amber-700">{hints[activeHint]}</p>
              <button 
                onClick={nextHint}
                className="mt-2 text-xs text-amber-600 hover:text-amber-800"
              >
                Next hint →
              </button>
            </div>
          )}
        </div>

        {/* Workspace Panel (50%) */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Workspace</h3>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">5Y Avg Return</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Std Deviation</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{investment.name}</div>
                      <div className="text-xs text-gray-500">{investment.ticker}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{investment.return.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{investment.stdDev.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={investment.allocation}
                        onChange={(e) => handleAllocationChange(investment.id, e.target.value)}
                        disabled={submitted}
                        className="w-16 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900">Total Allocation</td>
                  <td className="px-4 py-3 text-right font-bold text-sm">
                    <span className={totalAllocation !== 100 ? "text-red-600" : "text-green-600"}>
                      {totalAllocation}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Expected Return</h4>
              <p className="text-2xl font-bold text-blue-900">{portfolioReturn.toFixed(2)}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Portfolio Risk</h4>
              <p className="text-2xl font-bold text-blue-900">{portfolioRisk.toFixed(2)}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Sharpe Ratio</h4>
              <p className="text-2xl font-bold text-blue-900">{sharpeRatio.toFixed(2)}</p>
              <p className="text-xs text-blue-700">(Risk-free rate: {riskFreeRate}%)</p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explain your investment rationale (minimum 50 words):
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={submitted}
              placeholder="Explain why you chose this allocation based on Maria's profile..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-32"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {explanation.length} characters (minimum 50 required)
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={resetPortfolio}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={submitted || totalAllocation !== 100}
              className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                submitted || totalAllocation !== 100 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Finalize Portfolio
            </button>
          </div>
        </div>

        {/* Advisor Panel (25%) */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Advisor</h3>
          
          {!submitted ? (
            <div className="prose prose-sm">
              <p className="text-gray-600">
                Welcome to your first portfolio assignment! You'll need to balance Maria's moderate risk tolerance with her relatively short time horizon.
              </p>
              <p className="text-gray-600 mt-4">
                Your goal is to design a portfolio that can grow her $100,000 savings while maintaining a reasonable level of risk appropriate for her 3-5 year home purchase timeline.
              </p>
              <p className="text-gray-600 mt-4">
                Use the allocation sliders to set percentage weights for each investment. Make sure your total allocation equals 100%.
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800">Completion Requirements:</h4>
                <ul className="text-sm text-blue-700 list-disc list-inside mt-2 space-y-1">
                  <li>Set allocations that total exactly 100%</li>
                  <li>Write investment rationale (minimum 50 characters)</li>
                  <li>Balance risk and return appropriate for Maria's profile</li>
                </ul>
              </div>
            </div>
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
                  <h4 className="font-medium text-gray-800 mt-2">Rookie Analyst Badge Earned!</h4>
                  <p className="text-sm text-gray-600 mt-1">You've created your first balanced portfolio</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio/level1/challenge2" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
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