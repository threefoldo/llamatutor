'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RiskAdjustedDecisions() {
  // Investment options with their data
  const investments = [
    { id: 'ARKK', name: 'ARK Innovation ETF', ticker: 'ARKK', return: 14.2, stdDev: 32.5, beta: 1.8, aum: '$8.2B', sharpe: 0, treynor: 0 },
    { id: 'FCNTX', name: 'Fidelity Contrafund', ticker: 'FCNTX', return: 11.3, stdDev: 16.2, beta: 1.1, aum: '$98.5B', sharpe: 0, treynor: 0 },
    { id: 'AMZN', name: 'Amazon.com, Inc.', ticker: 'AMZN', return: 15.7, stdDev: 25.3, beta: 1.4, aum: 'N/A', sharpe: 0, treynor: 0 },
    { id: 'VIG', name: 'Vanguard Dividend Appreciation ETF', ticker: 'VIG', return: 9.6, stdDev: 13.1, beta: 0.8, aum: '$64.7B', sharpe: 0, treynor: 0 },
    { id: 'PG', name: 'Procter & Gamble Co.', ticker: 'PG', return: 8.5, stdDev: 10.9, beta: 0.5, aum: 'N/A', sharpe: 0, treynor: 0 },
    { id: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', ticker: 'TLT', return: 3.2, stdDev: 11.5, beta: -0.2, aum: '$21.3B', sharpe: 0, treynor: 0 },
  ];

  const [investmentData, setInvestmentData] = useState(investments);
  const [riskFreeRate, setRiskFreeRate] = useState(1.5);
  const [selectedInvestments, setSelectedInvestments] = useState([]);
  const [justification, setJustification] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [activeHint, setActiveHint] = useState(0);
  
  const hints = [
    "Sharpe ratio measures return per unit of total risk (standard deviation).",
    "Treynor ratio measures return per unit of systematic risk (beta).",
    "Higher Sharpe and Treynor ratios indicate better risk-adjusted performance.",
    "Consider whether investments with high returns justify their higher volatility.",
    "Look for investments with consistent performance across both risk metrics."
  ];

  useEffect(() => {
    // Calculate Sharpe and Treynor ratios when component mounts
    calculateRiskAdjustedMetrics();
  }, [riskFreeRate]);

  const calculateRiskAdjustedMetrics = () => {
    const updatedData = investmentData.map(inv => {
      const excessReturn = inv.return - riskFreeRate;
      const sharpeRatio = excessReturn / inv.stdDev;
      const treynorRatio = inv.beta !== 0 ? excessReturn / inv.beta : 0;
      
      return {
        ...inv,
        excessReturn: excessReturn,
        sharpe: sharpeRatio,
        treynor: treynorRatio
      };
    });
    
    setInvestmentData(updatedData);
  };

  const handleRiskFreeRateChange = (e) => {
    const newRate = parseFloat(e.target.value) || 0;
    setRiskFreeRate(newRate);
  };

  const toggleInvestmentSelection = (id) => {
    if (selectedInvestments.includes(id)) {
      setSelectedInvestments(selectedInvestments.filter(invId => invId !== id));
    } else {
      if (selectedInvestments.length < 2) {
        setSelectedInvestments([...selectedInvestments, id]);
      } else {
        alert("Please select no more than two investments.");
      }
    }
  };

  const handleSubmit = () => {
    if (selectedInvestments.length === 0) {
      alert("Please select at least one investment.");
      return;
    }

    if (justification.length < 100) {
      alert("Please provide a more detailed justification (minimum 100 characters).");
      return;
    }

    setSubmitted(true);

    // Check if the selected investments include PG (best overall risk-adjusted performance)
    const includePG = selectedInvestments.includes('PG');
    // Check if the selected investments include VIG (second best risk-adjusted performance)
    const includeVIG = selectedInvestments.includes('VIG');
    
    if (includePG && includeVIG) {
      setFeedback("Excellent analysis! You've identified the two investments with the best risk-adjusted performance. P&G offers the highest Sharpe and Treynor ratios, demonstrating superior risk management across both total and systematic risk. VIG provides strong and consistent risk-adjusted returns as well. You've earned the 'Risk Wrangler' achievement!");
    } else if (includePG || includeVIG) {
      setFeedback("Good analysis! You've identified one of the top risk-adjusted performers. P&G and VIG both demonstrate strong risk-adjusted returns with high Sharpe and Treynor ratios. Consider how the combination of these two investments might provide even better risk-adjusted performance for clients.");
    } else if (selectedInvestments.includes('FCNTX')) {
      setFeedback("You've selected an investment with decent risk-adjusted metrics, but there are better options. While Fidelity Contrafund shows good performance, both P&G and VIG offer superior risk-adjusted returns across both Sharpe and Treynor ratios.");
    } else if (selectedInvestments.includes('ARKK') || selectedInvestments.includes('AMZN')) {
      setFeedback("You've focused on high absolute returns, but risk-adjusted performance tells a different story. While ARKK and Amazon show impressive returns, their much higher volatility significantly reduces their risk-adjusted performance compared to more stable options like P&G and VIG.");
    } else {
      setFeedback("Your analysis should focus more on risk-adjusted performance rather than other factors. The Treasury ETF (TLT) offers poor risk-adjusted returns in the current environment. Consider investments that balance return and risk more effectively.");
    }
  };

  const resetAnalysis = () => {
    setSelectedInvestments([]);
    setJustification('');
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
            <h1 className="text-2xl font-bold">Level 1: Challenge 1.2</h1>
            <h2 className="text-lg">Risk-Adjusted Decisions</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-blue-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-1/2"></div>
              </div>
              <p className="text-xs mt-1">Challenge 2 of 4 in Level 1</p>
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Committee</h3>
          
          <div className="mb-6 bg-blue-50 rounded-lg overflow-hidden">
            <div className="p-4">
              <h4 className="font-medium text-blue-800">Capital Quest</h4>
              <p className="text-sm text-gray-600">Investment Committee Task</p>
            </div>
          </div>
          
          <div className="prose prose-sm">
            <p className="text-gray-700">
              The Investment Committee at Capital Quest is evaluating six potential investments for inclusion in client portfolios. 
            </p>
            <p className="text-gray-700 mt-3">
              As a junior analyst, you've been tasked with analyzing their risk-adjusted performance using the most recent 5-year data.
            </p>
            <p className="text-gray-700 mt-3">
              Your recommendation will influence which investments are offered to clients.
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 italic">
                "We need data-driven recommendations on which investments offer the best risk-adjusted performance." 
              </p>
              <p className="text-xs text-blue-600 mt-1">- Chief Investment Officer</p>
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Investment Philosophy:</h4>
            <p className="text-sm text-gray-600">
              "We emphasize sustainable risk-adjusted returns over short-term performance."
            </p>
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">Risk-Adjusted Analysis</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Risk-Free Rate:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={riskFreeRate}
                  onChange={handleRiskFreeRateChange}
                  disabled={submitted}
                  className="w-16 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">5Y Avg Return</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Std Dev</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Beta</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Excess Return</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sharpe Ratio</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Treynor Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investmentData.map((investment) => (
                  <tr 
                    key={investment.id} 
                    className={`hover:bg-gray-50 ${selectedInvestments.includes(investment.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => !submitted && toggleInvestmentSelection(investment.id)}
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedInvestments.includes(investment.id)}
                          onChange={() => !submitted && toggleInvestmentSelection(investment.id)}
                          disabled={submitted}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                      <div className="text-xs text-gray-500">{investment.ticker}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">{investment.return.toFixed(1)}%</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">{investment.stdDev.toFixed(1)}%</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">{investment.beta.toFixed(1)}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">{(investment.return - riskFreeRate).toFixed(1)}%</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{investment.sharpe.toFixed(3)}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{investment.treynor.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Investment Recommendation</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedInvestments.map(id => {
                  const inv = investmentData.find(inv => inv.id === id);
                  return (
                    <div key={id} className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {inv.ticker}
                      {!submitted && (
                        <button 
                          className="ml-1.5 text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInvestmentSelection(id);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                })}
                {selectedInvestments.length === 0 && (
                  <div className="text-sm text-gray-500 italic">Select 1-2 investments with the best risk-adjusted performance</div>
                )}
              </div>
            
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Justify your recommendation (minimum 100 characters):
              </label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                disabled={submitted}
                placeholder="Explain why your selected investments offer the best risk-adjusted performance..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-32"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {justification.length} characters (minimum 100 required)
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={resetAnalysis}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={submitted || selectedInvestments.length === 0 || justification.length < 100}
              className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                submitted || selectedInvestments.length === 0 || justification.length < 100
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Submit Recommendation
            </button>
          </div>
        </div>

        {/* Advisor Panel (25%) */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Advisor</h3>
          
          {!submitted ? (
            <div className="prose prose-sm">
              <p className="text-gray-600">
                Risk-adjusted metrics help us understand performance in context of the risk taken. Different metrics may favor different investments.
              </p>
              <p className="text-gray-600 mt-4">
                Your task is to evaluate six potential investments using risk-adjusted performance measures like Sharpe ratio and Treynor ratio.
              </p>
              <p className="text-gray-600 mt-4">
                Select one or two investments that offer the best risk-adjusted performance and justify your recommendation.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Sharpe Ratio:</h4>
                  <p className="text-sm text-blue-700">
                    (Ri - Rf) ÷ σi<br />
                    <span className="text-xs">Measures excess return per unit of total risk (standard deviation)</span>
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Treynor Ratio:</h4>
                  <p className="text-sm text-blue-700">
                    (Ri - Rf) ÷ βi<br />
                    <span className="text-xs">Measures excess return per unit of systematic risk (beta)</span>
                  </p>
                </div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mt-2">Risk Wrangler Achievement!</h4>
                  <p className="text-sm text-gray-600 mt-1">You've mastered risk-adjusted performance analysis</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio/level2/challenge1" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      Next Level →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!submitted && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="text-sm font-semibold text-indigo-800 mb-2">Analysis Tips:</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-indigo-700">Compare both Sharpe and Treynor ratios for a complete assessment.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-indigo-700">Consider whether high absolute returns justify higher volatility.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-indigo-700">Remember the firm's emphasis on sustainable risk-adjusted returns.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}