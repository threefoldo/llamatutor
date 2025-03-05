'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function DownsideRiskDetective() {
  // Investment options with their data
  const investments = [
    { id: 'SPY', name: 'SPDR S&P 500 ETF', ticker: 'SPY', allocation: 25, expectedReturn: 8.2, stdDev: 16.5, worstReturn: -37.0 },
    { id: 'QQQ', name: 'Invesco QQQ Trust', ticker: 'QQQ', allocation: 15, expectedReturn: 10.5, stdDev: 20.3, worstReturn: -42.7 },
    { id: 'IWM', name: 'iShares Russell 2000 ETF', ticker: 'IWM', allocation: 10, expectedReturn: 9.5, stdDev: 22.3, worstReturn: -43.1 },
    { id: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', ticker: 'VEA', allocation: 8, expectedReturn: 7.8, stdDev: 18.1, worstReturn: -41.4 },
    { id: 'EEM', name: 'iShares MSCI Emerging Markets ETF', ticker: 'EEM', allocation: 7, expectedReturn: 10.5, stdDev: 25.8, worstReturn: -53.3 },
    { id: 'AAPL', name: 'Apple Inc.', ticker: 'AAPL', allocation: 5, expectedReturn: 12.5, stdDev: 25.7, worstReturn: -44.3 },
    { id: 'AMZN', name: 'Amazon.com, Inc.', ticker: 'AMZN', allocation: 5, expectedReturn: 14.2, stdDev: 28.4, worstReturn: -44.1 },
    { id: 'MSFT', name: 'Microsoft Corp.', ticker: 'MSFT', allocation: 5, expectedReturn: 13.8, stdDev: 24.2, worstReturn: -40.7 },
    { id: 'BRK.B', name: 'Berkshire Hathaway Inc.', ticker: 'BRK.B', allocation: 5, expectedReturn: 9.2, stdDev: 18.5, worstReturn: -31.8 },
    { id: 'LQD', name: 'iShares iBoxx Inv Grade Corp Bond ETF', ticker: 'LQD', allocation: 10, expectedReturn: 4.8, stdDev: 7.3, worstReturn: -13.8 },
    { id: 'BND', name: 'Vanguard Total Bond Market ETF', ticker: 'BND', allocation: 5, expectedReturn: 3.8, stdDev: 5.5, worstReturn: -5.1 }
  ];

  // Historical crisis scenarios
  const crisisScenarios = [
    { 
      id: 'financial-crisis', 
      name: '2008 Financial Crisis', 
      period: 'Oct-Dec 2008', 
      marketDecline: -38.5,
      assetReturns: {
        SPY: -38.5, QQQ: -41.0, IWM: -42.5, VEA: -44.0, EEM: -49.5,
        AAPL: -32.0, AMZN: -28.0, MSFT: -30.0, 'BRK.B': -25.0,
        LQD: -10.0, BND: -1.5
      }
    },
    { 
      id: 'covid-crash', 
      name: '2020 COVID Crash', 
      period: 'Feb-Mar 2020', 
      marketDecline: -33.9,
      assetReturns: {
        SPY: -33.9, QQQ: -28.0, IWM: -40.5, VEA: -33.0, EEM: -31.5,
        AAPL: -24.0, AMZN: -12.0, MSFT: -20.0, 'BRK.B': -30.0,
        LQD: -12.5, BND: -0.5
      } as Record<string, number>
    },
    { 
      id: 'tech-bubble', 
      name: '2000 Tech Bubble', 
      period: 'Mar-Oct 2000', 
      marketDecline: -27.2,
      assetReturns: {
        SPY: -27.2, QQQ: -56.0, IWM: -22.0, VEA: -24.0, EEM: -26.0,
        AAPL: -58.0, AMZN: -70.0, MSFT: -60.0, 'BRK.B': -6.0,
        LQD: 8.0, BND: 10.0
      } as Record<string, number>
    },
    { 
      id: 'black-monday', 
      name: '1987 Black Monday', 
      period: 'Oct 1987', 
      marketDecline: -22.6,
      assetReturns: {
        SPY: -22.6, QQQ: -24.0, IWM: -26.0, VEA: -24.0, EEM: -28.0,
        AAPL: -36.0, AMZN: 0, MSFT: -31.0, 'BRK.B': -18.0,
        LQD: 3.0, BND: 4.0
      } as Record<string, number>
    }
  ];

  // State hooks
  const [portfolioData, setPortfolioData] = useState(investments);
  const [totalAllocation, setTotalAllocation] = useState(100);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [timeHorizon, setTimeHorizon] = useState('1-year');
  const [methodType, setMethodType] = useState('historical');
  const [valueAtRisk, setValueAtRisk] = useState(0);
  const [conditionalVaR, setConditionalVaR] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(75000000);
  const [stressTestResults, setStressTestResults] = useState<Record<string, { percentImpact: number; dollarImpact: number }>>({});
  const [riskContributions, setRiskContributions] = useState<Array<{ id: string; name: string; allocation: number; riskContribution: number; percentOfRisk: number; }>>([]);
  const [submitted, setSubmitted] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [proposedChanges, setProposedChanges] = useState<Array<{id: string; name: string; changeType: 'increase' | 'decrease'; amount: number}>>([]);
  
  // For the chatbot
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome to the Downside Risk Detective challenge! I'm here to help you analyze and mitigate the risk profile of the Freeman Foundation's portfolio. What would you like to know about downside risk metrics or stress testing?" }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined AI responses for the chatbot
  const aiResponses = {
    'var': "Value at Risk (VaR) measures the maximum potential loss expected over a specific time period at a given confidence level. For example, a 95% 1-year VaR of $10 million means there's a 5% chance of losing $10 million or more over the next year.",
    'cvar': "Conditional Value at Risk (CVaR), also known as Expected Shortfall, measures the average loss in the worst scenarios that exceed the VaR threshold. It provides a more comprehensive view of tail risk than VaR alone.",
    'stress test': "Stress testing simulates how your portfolio would perform in historical crisis scenarios like the 2008 Financial Crisis or 2020 COVID Crash. It helps identify vulnerabilities that might not be captured by standard risk metrics.",
    'parametric': "The parametric VaR method assumes returns follow a normal distribution. It calculates VaR using the formula: μ + (z × σ), where z is the z-score for your confidence level. While simpler to calculate, it may underestimate tail risks.",
    'historical': "The historical VaR method makes no assumptions about the distribution of returns. It simply looks at your portfolio's historical performance and identifies the loss threshold at your specified confidence level. This captures actual market behavior better.",
    'risk contribution': "Risk contribution analysis identifies which investments contribute most to your portfolio's overall risk. Just because an asset has a high allocation doesn't mean it's your biggest risk contributor - correlation effects matter too.",
    'mitigation': "Effective risk mitigation strategies include: 1) Reducing exposure to high-risk assets like EEM and QQQ, 2) Increasing allocations to defensive assets like bonds, 3) Adding uncorrelated assets like gold ETFs, and 4) Implementing tactical hedges.",
    'help': "I can help with: 1) Explaining risk metrics like VaR and CVaR, 2) Interpreting stress test results, 3) Suggesting risk mitigation strategies, 4) Discussing the differences between parametric and historical VaR methods, or 5) Explaining risk contribution analysis. What would you like to know?"
  };

  // Initialize calculations
  useEffect(() => {
    calculateRiskMetrics();
    calculateStressTests();
    calculateRiskContributions();
  }, [portfolioData, confidenceLevel, timeHorizon, methodType]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler for allocation changes
  const handleAllocationChange = (id: string, value: string | number) => {
    const newValue = parseInt(value.toString()) || 0;
    const updatedPortfolio = portfolioData.map(inv => 
      inv.id === id ? { ...inv, allocation: newValue } : inv
    );
    
    setPortfolioData(updatedPortfolio);
    
    // Update total allocation
    const total = updatedPortfolio.reduce((sum, inv) => sum + inv.allocation, 0);
    setTotalAllocation(total);
  };

  // Calculate VaR and CVaR
  const calculateRiskMetrics = () => {
    if (totalAllocation === 0) {
      setValueAtRisk(0);
      setConditionalVaR(0);
      return;
    }
    
    // Portfolio expected return and risk
    const weights = portfolioData.map(inv => inv.allocation / totalAllocation);
    const portReturn = weights.reduce((sum, w, i) => sum + w * portfolioData[i].expectedReturn, 0);
    
    // Calculate portfolio standard deviation (simplified)
    let portStdDev = 0;
    for (let i = 0; i < weights.length; i++) {
      portStdDev += Math.pow(weights[i] * portfolioData[i].stdDev, 2);
    }
    portStdDev = Math.sqrt(portStdDev);
    
    // Time horizon factor
    let timeFactor = 1;
    if (timeHorizon === '1-month') timeFactor = 1/12;
    if (timeHorizon === '1-day') timeFactor = 1/252;
    
    // Adjust for time period
    const annualizedStdDev = portStdDev * Math.sqrt(timeFactor);
    
    // Parametric VaR calculation
    if (methodType === 'parametric') {
      // Z-score for confidence level
      const zScore = confidenceLevel === 95 ? 1.645 : 
                     confidenceLevel === 99 ? 2.326 : 1.96;
      
      const var_percent = -1 * (portReturn * timeFactor - zScore * annualizedStdDev);
      const cvar_percent = -1 * (portReturn * timeFactor - zScore * annualizedStdDev * 1.25);
      
      setValueAtRisk(var_percent * portfolioValue / 100);
      setConditionalVaR(cvar_percent * portfolioValue / 100);
    } else {
      // Historical VaR (simplified simulation)
      // In a real implementation, this would use actual historical return data
      const var_percent = annualizedStdDev * 1.8;  // Simplified approximation
      const cvar_percent = annualizedStdDev * 2.3;  // Simplified approximation
      
      setValueAtRisk(var_percent * portfolioValue / 100);
      setConditionalVaR(cvar_percent * portfolioValue / 100);
    }
  };

  // Calculate stress test results
  const calculateStressTests = () => {
    const results: Record<string, any> = {};
    
    crisisScenarios.forEach(scenario => {
      let portfolioImpact = 0;
      
      // Calculate weighted impact
      portfolioData.forEach(asset => {
        const weight = asset.allocation / totalAllocation;
        const assetReturn = scenario.assetReturns[asset.id] || 0;
        portfolioImpact += weight * assetReturn;
      });
      
      // Calculate dollar impact
      const dollarImpact = portfolioValue * portfolioImpact / 100;
      
      results[scenario.id] = {
        percentImpact: portfolioImpact,
        dollarImpact: dollarImpact
      };
    });
    
    setStressTestResults(results);
  };

  // Calculate risk contributions
  const calculateRiskContributions = () => {
    const weights = portfolioData.map(inv => inv.allocation / totalAllocation);
    
    // Calculate portfolio std dev (simplified)
    let portStdDev = 0;
    for (let i = 0; i < weights.length; i++) {
      portStdDev += Math.pow(weights[i] * portfolioData[i].stdDev, 2);
    }
    portStdDev = Math.sqrt(portStdDev);
    
    if (portStdDev === 0) {
      setRiskContributions([]);
      return;
    }
    
    // Calculate marginal contribution to risk (simplified)
    const contributions = portfolioData.map((asset, i) => {
      const contribution = weights[i] * asset.stdDev * asset.stdDev / portStdDev;
      const percentOfRisk = (contribution / portStdDev) * 100;
      
      return {
        id: asset.id,
        name: asset.name,
        allocation: asset.allocation,
        riskContribution: contribution,
        percentOfRisk: percentOfRisk
      };
    });
    
    // Sort by risk contribution (descending)
    contributions.sort((a, b) => b.percentOfRisk - a.percentOfRisk);
    
    setRiskContributions(contributions);
  };

  // Add a proposed change
  const addProposedChange = (assetId: string, changeType: 'increase' | 'decrease', amount: number) => {
    const asset = portfolioData.find(a => a.id === assetId);
    if (!asset) return;
    const newProposedChange = {
      id: assetId,
      name: asset.name,
      changeType: changeType,
      amount: amount
    };
    
    setProposedChanges([...proposedChanges, newProposedChange]);
  };

  // Apply proposed changes to a copy of the portfolio
  const previewChanges = () => {
    const updatedPortfolio = [...portfolioData];
    
    proposedChanges.forEach(change => {
      const assetIndex = updatedPortfolio.findIndex(a => a.id === change.id);
      if (assetIndex !== -1) {
        if (change.changeType === 'increase') {
          updatedPortfolio[assetIndex].allocation += change.amount;
        } else {
          updatedPortfolio[assetIndex].allocation = Math.max(0, updatedPortfolio[assetIndex].allocation - change.amount);
        }
      }
    });
    
    setPortfolioData(updatedPortfolio);
    setProposedChanges([]);
  };

  // Reset proposed changes
  const resetProposedChanges = () => {
    setProposedChanges([]);
  };

  // Submit portfolio analysis
  const handleSubmit = () => {
    if (explanation.length < 200) {
      alert("Please provide a more detailed explanation of your risk mitigation strategy (minimum 200 characters)");
      return;
    }
    
    setSubmitted(true);
    
    // Analyze if risk mitigation was effective
    const originalHighRiskAllocation = 
      investments.filter(inv => ['QQQ', 'EEM', 'AAPL', 'AMZN'].includes(inv.id))
        .reduce((sum, inv) => sum + inv.allocation, 0);
    
    const currentHighRiskAllocation = 
      portfolioData.filter(inv => ['QQQ', 'EEM', 'AAPL', 'AMZN'].includes(inv.id))
        .reduce((sum, inv) => sum + inv.allocation, 0);
    
    const originalBondAllocation = 
      investments.filter(inv => ['LQD', 'BND'].includes(inv.id))
        .reduce((sum, inv) => sum + inv.allocation, 0);
    
    const currentBondAllocation = 
      portfolioData.filter(inv => ['LQD', 'BND'].includes(inv.id))
        .reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Calculate improvement in worst crisis scenario
    const worstScenario = Object.keys(stressTestResults).reduce((a, b) => 
      stressTestResults[a].percentImpact < stressTestResults[b].percentImpact ? a : b
    );
    
    const originalWorstScenario = crisisScenarios.find(s => s.id === worstScenario);
    let originalImpact = 0;
    
    if (originalWorstScenario) {
      investments.forEach(asset => {
        const weight = asset.allocation / 100;
        const assetReturn = originalWorstScenario.assetReturns[asset.id] || 0;
        originalImpact += weight * assetReturn;
      });
    }
    
    const improvementInWorstCase = stressTestResults[worstScenario].percentImpact - originalImpact;
    
    // Calculate new portfolio expected return (simplified)
    const weights = portfolioData.map(inv => inv.allocation / totalAllocation);
    const portReturn = weights.reduce((sum, w, i) => sum + w * portfolioData[i].expectedReturn, 0);
    
    const originalWeights = investments.map(inv => inv.allocation / 100);
    const originalReturn = originalWeights.reduce((sum, w, i) => sum + w * investments[i].expectedReturn, 0);
    
    const returnReduction = originalReturn - portReturn;
    
    // Evaluate the risk mitigation strategy
    if (currentHighRiskAllocation < originalHighRiskAllocation - 5 &&
        currentBondAllocation > originalBondAllocation + 5 &&
        improvementInWorstCase > 3 &&
        returnReduction < 0.8) {
      setFeedback("Excellent work! Your risk mitigation strategy achieves a meaningful reduction in downside risk while maintaining strong return potential. You've reduced exposure to high-volatility assets, increased defensive positions, and significantly improved the portfolio's resilience in crisis scenarios. The Freeman Foundation's portfolio is now much better positioned to weather market turbulence while still meeting long-term objectives. You've earned the 'Downside Detective' badge!");
    } else if (currentHighRiskAllocation >= originalHighRiskAllocation) {
      setFeedback("Your strategy doesn't effectively reduce exposure to the highest-risk assets in the portfolio (QQQ, EEM, AAPL, AMZN). These investments are the main contributors to tail risk and should be moderated to improve downside protection.");
    } else if (currentBondAllocation <= originalBondAllocation) {
      setFeedback("Your strategy doesn't include increasing the allocation to defensive assets like bonds (LQD, BND). Adding stable, low-correlation assets is essential for improving the portfolio's resilience during market stress.");
    } else if (improvementInWorstCase <= 2) {
      setFeedback("Your changes don't significantly improve the portfolio's performance under stress scenarios. The goal is to meaningfully reduce potential losses during market crises while maintaining long-term return potential.");
    } else if (returnReduction >= 1.0) {
      setFeedback("Your risk mitigation strategy sacrifices too much return potential. While reducing risk is important, the Freeman Foundation still needs strong long-term performance to meet its objectives. Try to find a better balance.");
    } else {
      setFeedback("Your risk mitigation strategy shows some improvement but could be optimized further. Look for ways to reduce exposure to the highest risk contributors while maintaining return potential through strategic reallocation.");
    }
  };

  const handleChatSubmit = (e: any) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const updatedMessages = [...messages, { role: 'user', content: currentMessage }];
    setMessages(updatedMessages);
    
    // Generate AI response based on keywords in user message
    const userMessageLower = currentMessage.toLowerCase();
    let aiResponse = "I don't have specific information about that. Try asking about VaR, CVaR, stress testing, risk mitigation strategies, or type 'help' for assistance.";
    
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-purple-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 3: Challenge 3.1</h1>
            <h2 className="text-lg">Downside Risk Detective</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-purple-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-1/3"></div>
              </div>
              <p className="text-xs mt-1">Challenge 1 of 2 in Level 3</p>
            </div>
            <Link href="/portfolio/level3" className="px-3 py-1 bg-purple-500 hover:bg-purple-400 rounded text-sm font-medium">
              Level Map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Context Panel */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Client Profile</h3>
          
          <div className="mb-6 bg-purple-50 rounded-lg overflow-hidden">
            <div className="p-4">
              <h4 className="font-medium text-purple-800">Freeman Foundation</h4>
              <p className="text-sm text-gray-600">Aggressive Growth Endowment</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Portfolio Value</h4>
              <p className="text-lg font-medium text-gray-900">$75 million</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Investment Objective</h4>
              <p className="text-lg font-medium text-gray-900">Long-term growth with acceptable downside risk</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Time Horizon</h4>
              <p className="text-lg font-medium text-gray-900">Perpetual (endowment)</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Risk Statement</h4>
              <p className="text-sm text-gray-700">
                &quot;Willing to accept higher volatility for higher returns, but concerned about extreme losses that could impact annual grant distributions.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Current Portfolio */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current Portfolio Composition</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation %</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Exp. Return</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Std Dev</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Worst 1Y</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolioData.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-500">{asset.ticker}</div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={asset.allocation}
                          onChange={(e) => handleAllocationChange(asset.id, e.target.value)}
                          disabled={submitted}
                          className="w-16 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{asset.expectedReturn.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{asset.stdDev.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-red-600">{asset.worstReturn.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2 font-medium">Total</td>
                    <td className="px-3 py-2 text-right font-bold">
                      <span className={totalAllocation !== 100 ? "text-red-600" : "text-green-600"}>
                        {totalAllocation}%
                      </span>
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* VaR Calculator */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Value at Risk (VaR) Calculator</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  value={methodType}
                  onChange={(e) => setMethodType(e.target.value)}
                  disabled={submitted}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="historical">Historical</option>
                  <option value="parametric">Parametric</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confidence Level</label>
                <select
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                  disabled={submitted}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="95">95%</option>
                  <option value="99">99%</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon</label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  disabled={submitted}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="1-day">1 Day</option>
                  <option value="1-month">1 Month</option>
                  <option value="1-year">1 Year</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-1">Value at Risk ({confidenceLevel}%)</h4>
                <p className="text-2xl font-bold text-purple-900">${(valueAtRisk / 1000000).toFixed(2)} million</p>
                <p className="text-xs text-purple-700">
                  Maximum loss at {confidenceLevel}% confidence over {timeHorizon} period
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-1">Conditional VaR (CVaR)</h4>
                <p className="text-2xl font-bold text-purple-900">${(conditionalVaR / 1000000).toFixed(2)} million</p>
                <p className="text-xs text-purple-700">
                  Average loss in worst {100-confidenceLevel}% of scenarios
                </p>
              </div>
            </div>
          </div>
          
          {/* Stress Testing */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Crisis Scenario Stress Tests</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crisisScenarios.map((scenario) => (
                <div key={scenario.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800">{scenario.name}</h4>
                    <p className="text-xs text-gray-500">{scenario.period} · S&P 500: {scenario.marketDecline}%</p>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">Portfolio Impact:</span>
                      <span className="font-medium text-red-600">
                        {stressTestResults[scenario.id] ? stressTestResults[scenario.id].percentImpact.toFixed(1) + '%' : 'Calculating...'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Dollar Loss:</span>
                      <span className="font-medium text-red-600">
                        {stressTestResults[scenario.id] ? '$' + (Math.abs(stressTestResults[scenario.id].dollarImpact) / 1000000).toFixed(1) + 'M' : '...'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Risk Contributors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Contribution Analysis</h3>
            
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation %</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Risk</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {riskContributions.slice(0, 5).map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{asset.name}</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{asset.allocation}%</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{asset.percentOfRisk.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-gray-500 italic">
              * Top 5 risk contributors shown. These investments contribute disproportionately to overall portfolio risk.
            </p>
          </div>
          
          {/* Risk Mitigation Strategy */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Mitigation Recommendation</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explain your risk mitigation strategy (minimum 200 characters):
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                disabled={submitted}
                placeholder="Explain your recommended changes to reduce downside risk while maintaining reasonable return potential..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 h-32"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {explanation.length} characters (minimum 200 required)
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Reset
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={submitted || totalAllocation !== 100 || explanation.length < 200}
                className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  submitted || totalAllocation !== 100 || explanation.length < 200
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Submit Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Advisor Panel with Chatbot */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md flex flex-col h-[calc(100vh-10rem)]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Advisor</h3>
          
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
                            ? 'bg-purple-50 text-gray-800' 
                            : 'bg-purple-600 text-white'
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
                    placeholder="Ask about risk metrics or strategies..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700"
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
              <div className={`p-4 rounded-lg ${feedback.includes('Excellent') ? 'bg-green-50 border border-green-200' : 'bg-purple-50 border border-purple-200'}`}>
                <p className="text-gray-800">{feedback}</p>
              </div>
              
              {feedback.includes('Excellent') && (
                <div className="mt-6 text-center">
                  <div className="inline-block p-4 bg-yellow-50 rounded-full border-2 border-yellow-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mt-2">Downside Detective Badge Earned!</h4>
                  <p className="text-sm text-gray-600 mt-1">You&apos;ve mastered risk analysis and mitigation</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio/level3/challenge2" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md">
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