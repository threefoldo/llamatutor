'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export default function ESGIntegration() {
  // Current investments and ESG alternatives
  const investments = [
    { 
      current: "S&P 500 Index Fund", 
      esgAlternatives: [
        { id: 'EFIV', name: 'SPDR S&P 500 ESG ETF', ticker: 'EFIV', esgScore: 7.8, carbon: 112, return: 7.3, expense: 0.10, allocation: 0 },
        { id: 'SNPE', name: 'Xtrackers S&P 500 ESG ETF', ticker: 'SNPE', esgScore: 7.9, carbon: 105, return: 7.2, expense: 0.10, allocation: 0 }
      ]
    },
    { 
      current: "Russell 1000 Fund", 
      esgAlternatives: [
        { id: 'ESGU', name: 'iShares ESG Aware MSCI USA ETF', ticker: 'ESGU', esgScore: 7.5, carbon: 127, return: 7.4, expense: 0.15, allocation: 0 }
      ]
    },
    { 
      current: "MSCI EAFE Fund", 
      esgAlternatives: [
        { id: 'ESGD', name: 'iShares ESG Aware MSCI EAFE ETF', ticker: 'ESGD', esgScore: 7.3, carbon: 132, return: 7.9, expense: 0.20, allocation: 0 }
      ]
    },
    { 
      current: "Emerging Markets Fund", 
      esgAlternatives: [
        { id: 'ESGE', name: 'iShares ESG Aware MSCI EM ETF', ticker: 'ESGE', esgScore: 6.1, carbon: 186, return: 8.5, expense: 0.25, allocation: 0 }
      ]
    },
    { 
      current: "Aggregate Bond Fund", 
      esgAlternatives: [
        { id: 'EAGG', name: 'iShares ESG Aware US Aggregate Bond ETF', ticker: 'EAGG', esgScore: 6.8, carbon: 92, return: 3.4, expense: 0.10, allocation: 0 }
      ]
    },
    { 
      current: "Corporate Bond Fund", 
      esgAlternatives: [
        { id: 'RBND', name: 'SPDR Bloomberg SASB Corporate Bond ESG ETF', ticker: 'RBND', esgScore: 7.2, carbon: 84, return: 4.1, expense: 0.12, allocation: 0 }
      ]
    },
    { 
      current: "Technology Sector Fund", 
      esgAlternatives: [
        { id: 'QCLN', name: 'First Trust NASDAQ Clean Edge Green Energy', ticker: 'QCLN', esgScore: 8.2, carbon: 65, return: 10.2, expense: 0.58, allocation: 0 }
      ]
    },
    { 
      current: "Energy Sector Fund", 
      esgAlternatives: [
        { id: 'ICLN', name: 'iShares Global Clean Energy ETF', ticker: 'ICLN', esgScore: 8.8, carbon: 42, return: 9.8, expense: 0.42, allocation: 0 }
      ]
    },
    { 
      current: "Real Estate Fund", 
      esgAlternatives: [
        { id: 'NURE', name: 'Nuveen ESG Real Estate ETF', ticker: 'NURE', esgScore: 7.0, carbon: 93, return: 7.6, expense: 0.29, allocation: 0 }
      ]
    }
  ];

  // Individual companies with strong ESG profiles
  const esgCompanies = [
    { id: 'MSFT', company: 'Microsoft Corp.', ticker: 'MSFT', esgScore: 8.5, carbon: 12, sector: 'Technology', dividendYield: 0.8, return: 8.2, expense: 0.0, allocation: 0 },
    { id: 'NVDA', company: 'Nvidia Corp.', ticker: 'NVDA', esgScore: 7.8, carbon: 5, sector: 'Technology', dividendYield: 0.1, return: 9.8, expense: 0.0, allocation: 0 },
    { id: 'UL', company: 'Unilever PLC', ticker: 'UL', esgScore: 8.7, carbon: 48, sector: 'Consumer Staples', dividendYield: 3.5, return: 6.4, expense: 0.0, allocation: 0 },
    { id: 'VWDRY', company: 'Vestas Wind Systems', ticker: 'VWDRY', esgScore: 9.2, carbon: 2, sector: 'Industrials', dividendYield: 0.3, return: 10.5, expense: 0.0, allocation: 0 },
    { id: 'WM', company: 'Waste Management Inc.', ticker: 'WM', esgScore: 8.1, carbon: 310, sector: 'Industrials', dividendYield: 1.5, return: 7.6, expense: 0.0, allocation: 0 },
    { id: 'NEE', company: 'NextEra Energy', ticker: 'NEE', esgScore: 8.3, carbon: 175, sector: 'Utilities', dividendYield: 2.5, return: 6.9, expense: 0.0, allocation: 0 },
    { id: 'AWK', company: 'American Water Works', ticker: 'AWK', esgScore: 8.0, carbon: 145, sector: 'Utilities', dividendYield: 1.8, return: 5.8, expense: 0.0, allocation: 0 },
    { id: 'HASI', company: 'Hannon Armstrong', ticker: 'HASI', esgScore: 9.0, carbon: 3, sector: 'Financials', dividendYield: 5.8, return: 8.9, expense: 0.0, allocation: 0 }
  ];

  // Create a flat list of all investment options
  const allInvestmentOptions = [
    ...investments.flatMap(group => group.esgAlternatives),
    ...esgCompanies
  ];

  // ESG integration strategies
  const esgStrategies = [
    { id: 'negative', name: 'Negative Screening', description: 'Exclude companies with poor ESG ratings' },
    { id: 'positive', name: 'Positive Tilting', description: 'Overweight companies with strong ESG ratings' },
    { id: 'best-in-class', name: 'Best-in-Class', description: 'Select top ESG performers within each sector' },
    { id: 'thematic', name: 'Thematic Focus', description: 'Target specific E, S, or G themes' },
    { id: 'combined', name: 'Combined Approach', description: 'Blend multiple ESG integration strategies' }
  ];

  // State hooks
  const [portfolioData, setPortfolioData] = useState(allInvestmentOptions);
  const [totalAllocation, setTotalAllocation] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('combined');
  const [portfolioReturn, setPortfolioReturn] = useState(0);
  const [portfolioRisk, setPortfolioRisk] = useState(0);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [weightedExpense, setWeightedExpense] = useState(0);
  const [portfolioEsgScore, setPortfolioEsgScore] = useState(0);
  const [portfolioCarbonIntensity, setPortfolioCarbonIntensity] = useState(0);
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
    { role: 'assistant', content: "Welcome to the ESG Integration challenge! I'm here to help you redesign Westridge University's $200M endowment portfolio to incorporate sustainability principles. What would you like to know about ESG integration or investment strategies?" }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined AI responses based on keywords
  const aiResponses: Record<string, string> = {
    'esg': "ESG stands for Environmental, Social, and Governance - criteria used to evaluate a company's sustainability and ethical impact. Environmental factors include climate impact and resource use. Social factors cover employee relations and community impact. Governance addresses corporate leadership, executive pay, and shareholder rights.",
    'negative screening': "Negative screening excludes companies or sectors with poor ESG ratings or involvement in controversial activities like fossil fuels, tobacco, or weapons. It's the oldest form of ESG investing but doesn't necessarily optimize for positive impact. For Westridge University, you might consider screening out the worst carbon emitters.",
    'positive tilt': "Positive tilting overweights companies with strong ESG ratings while maintaining similar sector exposures as conventional indices. This approach helps improve portfolio ESG metrics while minimizing tracking error. Consider using this approach with core allocations like EFIV or SNPE.",
    'best-in-class': "The best-in-class approach selects top ESG performers within each sector or industry. This maintains sector diversification while maximizing ESG quality. It avoids sector biases that can occur with simple exclusions. This could work well for Westridge's core equity allocation.",
    'thematic': "Thematic ESG investing focuses on specific sustainability themes like clean energy (ICLN), water, or gender diversity. It can complement broader ESG strategies and align with specific priorities. Westridge has identified climate change as a priority, making QCLN or ICLN potential fits.",
    'carbon': "Carbon intensity measures CO2 emissions per million dollars of revenue, expressing a company's carbon efficiency. Lower is better. The portfolio's current carbon intensity is high at 165-185 tCO2e/$M. By incorporating low-carbon options like NVDA or VWDRY, you can significantly reduce this metric.",
    'metrics': "Key ESG metrics to consider include: 1) ESG scores (higher is better), 2) Carbon intensity (lower is better), 3) Exposure to specific themes aligned with the university's priorities, and 4) Active ownership practices of fund managers. Balance these with traditional financial metrics.",
    'expense': "ESG funds typically have slightly higher expense ratios than conventional funds. For example, EFIV charges 0.10% vs. 0.03% for a standard S&P 500 ETF. Consider the fee differential in your analysis, but don't let it be the sole deciding factor if ESG improvements are meaningful.",
    'westridge': "Westridge University has a $200M endowment with a 4.5% annual spending rate ($9M). Their current allocation is 65% equities, 30% fixed income, and 5% alternatives. They've identified climate change, diversity, and corporate governance as ESG priorities. They want to improve sustainability metrics while maintaining financial performance.",
    'help': "I can help with: 1) Explaining ESG integration approaches like negative screening or positive tilting, 2) Understanding ESG metrics and their importance, 3) Balancing ESG improvements with financial objectives, or 4) Discussing specific investment options. What would you like to know?"
  };

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = useCallback(() => {
    if (totalAllocation === 0) {
      setPortfolioReturn(0);
      setPortfolioRisk(0);
      setSharpeRatio(0);
      setWeightedExpense(0);
      setPortfolioEsgScore(0);
      setPortfolioCarbonIntensity(0);
      return;
    }
    
    // Calculate weights
    const weights = portfolioData.map(inv => inv.allocation / totalAllocation);
    
    // Calculate expected return
    const expReturn = weights.reduce((sum, weight, idx) => 
      sum + weight * portfolioData[idx].return, 0);
    
    // Calculate weighted expense ratio
    const expense = weights.reduce((sum, weight, idx) => 
      sum + weight * portfolioData[idx].expense, 0);
    
    // Calculate portfolio ESG score
    const esgScore = weights.reduce((sum, weight, idx) => 
      sum + weight * portfolioData[idx].esgScore, 0);
    
    // Calculate portfolio carbon intensity
    const carbonIntensity = weights.reduce((sum, weight, idx) => 
      sum + weight * portfolioData[idx].carbon, 0);
    
    // Calculate portfolio risk (simplified model)
    // In a real implementation, this would use a covariance matrix
    // Approximate risk based on allocation to different asset classes
    let risk = 0;
    
    // Equity ETFs have higher risk
    const equityEtfAllocation = weights.reduce((sum, weight, idx) => {
      const inv = portfolioData[idx];
      const isEquityEtf = ['EFIV', 'SNPE', 'ESGU', 'ESGD', 'ESGE', 'QCLN', 'ICLN', 'NURE'].includes(inv.id);
      return sum + (isEquityEtf ? weight : 0);
    }, 0);
    
    // Bond ETFs have lower risk
    const bondEtfAllocation = weights.reduce((sum, weight, idx) => {
      const inv = portfolioData[idx];
      const isBondEtf = ['EAGG', 'RBND'].includes(inv.id);
      return sum + (isBondEtf ? weight : 0);
    }, 0);
    
    // Individual stocks have varied risk based on sector
    const stockAllocation = weights.reduce((sum, weight, idx) => {
      const inv = portfolioData[idx];
      const isStock = ['MSFT', 'NVDA', 'UL', 'VWDRY', 'WM', 'NEE', 'AWK', 'HASI'].includes(inv.id);
      return sum + (isStock ? weight : 0);
    }, 0);
    
    // Approximate risk (simplistic model)
    risk = (equityEtfAllocation * 16) + (bondEtfAllocation * 5) + (stockAllocation * 18);
    
    // Calculate Sharpe ratio (using 2% risk-free rate)
    const sharpe = (expReturn - 2.0) / risk;
    
    setPortfolioReturn(expReturn);
    setPortfolioRisk(risk);
    setSharpeRatio(sharpe);
    setWeightedExpense(expense);
    setPortfolioEsgScore(esgScore);
    setPortfolioCarbonIntensity(carbonIntensity);
  }, [portfolioData, totalAllocation]);
  
  // Calculate portfolio metrics whenever allocation changes
  useEffect(() => {
    calculatePortfolioMetrics();
  }, [calculatePortfolioMetrics]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler for allocation changes
  const handleAllocationChange = (id: string, value: string) => {
    const newValue = parseInt(value) || 0;
    const updatedPortfolio = portfolioData.map(inv => 
      inv.id === id ? { ...inv, allocation: newValue } : inv
    );
    
    setPortfolioData(updatedPortfolio);
    
    // Update total allocation
    const total = updatedPortfolio.reduce((sum, inv) => sum + inv.allocation, 0);
    setTotalAllocation(total);
  };

  // Submit portfolio
  const handleSubmit = () => {
    if (totalAllocation !== 100) {
      alert("Total allocation must equal 100%");
      return;
    }
    
    if (explanation.length < 200) {
      alert("Please provide a more detailed explanation of your ESG integration strategy (minimum 200 characters)");
      return;
    }
    
    setSubmitted(true);
    
    // Analyze ESG improvements
    const originalEsgScore = 5.8; // Placeholder for original portfolio
    const originalCarbonIntensity = 175; // Placeholder for original portfolio
    
    const esgImprovement = portfolioEsgScore - originalEsgScore;
    const carbonReduction = (originalCarbonIntensity - portfolioCarbonIntensity) / originalCarbonIntensity * 100;
    
    // Analyze if we're maintaining financial objectives
    const originalReturn = 7.2; // Placeholder for original portfolio
    const returnImpact = portfolioReturn - originalReturn;
    
    // Check core ETF allocation
    const coreEtfAllocation = portfolioData.filter(inv => 
      ['EFIV', 'SNPE', 'ESGU', 'ESGD', 'ESGE', 'EAGG', 'RBND'].includes(inv.id)
    ).reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Check thematic allocation
    const thematicAllocation = portfolioData.filter(inv => 
      ['QCLN', 'ICLN', 'NURE'].includes(inv.id)
    ).reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Check individual stock allocation
    const stockAllocation = portfolioData.filter(inv => 
      ['MSFT', 'NVDA', 'UL', 'VWDRY', 'WM', 'NEE', 'AWK', 'HASI'].includes(inv.id)
    ).reduce((sum, inv) => sum + inv.allocation, 0);
    
    // Check if expense ratio is reasonable
    const reasonableExpense = weightedExpense <= 0.20;
    
    // Overall evaluation
    if (esgImprovement >= 1.5 && carbonReduction >= 40 && returnImpact >= -0.3 && reasonableExpense) {
      setFeedback("Excellent work! Your ESG integration strategy achieves significant sustainability improvements while maintaining strong financial performance. You've reduced carbon intensity by over 40% and improved the overall ESG score by 1.5+ points with minimal impact on expected returns. Your balanced approach using core ESG ETFs, thematic exposures, and select high-ESG individual companies creates a portfolio that aligns with Westridge University's sustainability priorities while supporting their 4.5% spending requirement. You've earned the 'Sustainability Strategist' badge!");
    } else if (esgImprovement < 1.0) {
      setFeedback("Your portfolio shows insufficient improvement in overall ESG score. With only a " + esgImprovement.toFixed(1) + " point increase in ESG rating, the changes may not meaningfully address Westridge University's sustainability objectives. Consider allocating more to high-ESG-score investments.");
    } else if (carbonReduction < 30) {
      setFeedback("Your portfolio doesn't achieve sufficient reduction in carbon intensity. The " + carbonReduction.toFixed(1) + "% reduction falls short of addressing climate change concerns, which is one of Westridge University's primary ESG priorities. Consider including more low-carbon options.");
    } else if (returnImpact < -0.5) {
      setFeedback("Your ESG integration strategy sacrifices too much expected return (" + returnImpact.toFixed(2) + "%). While some return impact is acceptable, Westridge University still needs to meet its 4.5% annual spending requirement. Try to balance ESG improvements with financial performance.");
    } else if (!reasonableExpense) {
      setFeedback("Your portfolio's weighted expense ratio of " + weightedExpense.toFixed(2) + "% is too high. While ESG funds typically have slightly higher fees than conventional funds, the overall expense impact should be managed carefully to avoid significant drag on returns.");
    } else if (coreEtfAllocation < 65) {
      setFeedback("Your portfolio allocates only " + coreEtfAllocation + "% to core ESG ETFs, which may not provide sufficient market exposure for this endowment portfolio. Consider building a stronger core allocation with broader market ESG ETFs like EFIV, SNPE, or ESGU.");
    } else if (thematicAllocation > 15) {
      setFeedback("Your allocation to thematic ESG investments (" + thematicAllocation + "%) is too concentrated. While these can play an important role in an ESG strategy, their higher volatility and narrower focus make them more suitable as satellite positions rather than core holdings.");
    } else if (stockAllocation > 10) {
      setFeedback("Your allocation to individual stocks (" + stockAllocation + "%) is too high for an endowment portfolio of this size. While high-ESG individual companies can enhance a portfolio, institutional investors typically limit individual stock exposure to manage concentration risk.");
    } else {
      setFeedback("Your ESG integration strategy shows promise but could be optimized further. Review your allocations to ensure you're achieving significant sustainability improvements while maintaining appropriate financial characteristics for an endowment portfolio.");
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
    let aiResponse = "I don't have specific information about that. Try asking about ESG integration approaches, specific ESG metrics, or the university's sustainability priorities. You can also type 'help' for assistance.";
    
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
            <h1 className="text-2xl font-bold">Level 4: Challenge 4.2</h1>
            <h2 className="text-lg">ESG Impact & Integration</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-indigo-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-2/3"></div>
              </div>
              <p className="text-xs mt-1">Challenge 2 of 2 in Level 4</p>
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">Westridge University Endowment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Endowment Size</h4>
                <p className="text-lg font-medium text-gray-900">$200 million</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Annual Spending Rate</h4>
                <p className="text-lg font-medium text-gray-900">4.5% ($9 million)</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Investment Horizon</h4>
                <p className="text-lg font-medium text-gray-900">Perpetual</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Current Allocation</h4>
                <p className="text-lg font-medium text-gray-900">65% equities, 30% fixed income, 5% alternatives</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Investment Objective</h4>
                <p className="text-lg font-medium text-gray-900">Long-term growth with moderate risk</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">ESG Directive</h4>
                <p className="text-sm text-gray-700">
                  &quot;Incorporate sustainability principles while maintaining financial performance&quot;
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-2">ESG Priorities:</h4>
                <ul className="text-sm space-y-1.5 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-green-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Climate change
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-green-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Diversity and inclusion
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 text-green-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Corporate governance
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Current ESG Profile</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ESG Score:</span>
                    <span className="text-sm font-medium text-gray-900">5.8/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Carbon Intensity:</span>
                    <span className="text-sm font-medium text-gray-900">175 tCO2e/$M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main workspace and chat panels */}
        <div className="lg:col-span-8 space-y-6">
          {/* ESG Strategy Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ESG Integration Strategy</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select integration approach:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {esgStrategies.map((strategy) => (
                  <div key={strategy.id} className="relative">
                    <input
                      type="radio"
                      id={strategy.id}
                      name="esg-strategy"
                      value={strategy.id}
                      checked={selectedStrategy === strategy.id}
                      onChange={() => setSelectedStrategy(strategy.id)}
                      disabled={submitted}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor={strategy.id}
                      className="flex flex-col p-3 bg-white border rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-2 peer-checked:ring-green-500 peer-checked:border-green-500"
                    >
                      <span className="text-sm font-medium text-gray-900">{strategy.name}</span>
                      <span className="text-xs text-gray-500">{strategy.description}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Portfolio Construction */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ESG Portfolio Construction</h3>
            
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-800 mb-3">ESG ETF Alternatives</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Option</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ESG Score</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Exp Return</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {investments.flatMap(group => (
                      group.esgAlternatives.map(alternative => (
                        <tr key={alternative.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-900">{alternative.name}</div>
                            <div className="text-xs text-gray-500">Replaces: {group.current}</div>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {alternative.esgScore.toFixed(1)}/10
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right text-sm text-gray-900">{alternative.carbon} tCO2e/$M</td>
                          <td className="px-3 py-2 text-right text-sm text-gray-900">{alternative.return.toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right text-sm text-gray-900">{alternative.expense.toFixed(2)}%</td>
                          <td className="px-3 py-2 text-right">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={alternative.allocation}
                              onChange={(e) => handleAllocationChange(alternative.id, e.target.value)}
                              disabled={submitted}
                              className="w-16 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-800 mb-3">Individual ESG Leaders</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ESG Score</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dividend</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {esgCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-900">{company.company}</div>
                          <div className="text-xs text-gray-500">{company.ticker}</div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-xs text-gray-700">{company.sector}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {company.esgScore.toFixed(1)}/10
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right text-sm text-gray-900">{company.carbon} tCO2e/$M</td>
                        <td className="px-3 py-2 text-right text-sm text-gray-900">{company.dividendYield.toFixed(1)}%</td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={company.allocation}
                            onChange={(e) => handleAllocationChange(company.id, e.target.value)}
                            disabled={submitted}
                            className="w-16 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
              <span className="text-base font-medium text-gray-800">Total Allocation</span>
              <span className={`text-lg font-bold ${totalAllocation !== 100 ? "text-red-600" : "text-green-600"}`}>
                {totalAllocation}%
              </span>
            </div>
          </div>
          
          {/* Portfolio Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Metrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Financial Characteristics</h4>
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-indigo-800">Expected Return</span>
                      <span className="text-lg font-bold text-indigo-900">{portfolioReturn.toFixed(2)}%</span>
                    </div>
                    <div className="mt-1 text-xs text-indigo-700 flex justify-between">
                      <span>Original Portfolio:</span>
                      <span>7.2%</span>
                    </div>
                    <div className="mt-1 text-xs text-indigo-700 flex justify-between">
                      <span>Difference:</span>
                      <span className={portfolioReturn >= 7.2 ? "text-green-600" : "text-red-600"}>
                        {(portfolioReturn - 7.2).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-indigo-800">Risk Level</span>
                      <span className="text-lg font-bold text-indigo-900">{portfolioRisk.toFixed(2)}%</span>
                    </div>
                    <div className="mt-1 text-xs text-indigo-700 flex justify-between">
                      <span>Sharpe Ratio:</span>
                      <span>{sharpeRatio.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-indigo-800">Expense Ratio</span>
                      <span className="text-lg font-bold text-indigo-900">{weightedExpense.toFixed(2)}%</span>
                    </div>
                    <div className="mt-1 text-xs text-indigo-700 flex justify-between">
                      <span>Annual Cost:</span>
                      <span>${(weightedExpense * 2000000).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">ESG Characteristics</h4>
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-800">ESG Score</span>
                      <span className="text-lg font-bold text-green-900">{portfolioEsgScore.toFixed(1)}/10</span>
                    </div>
                    <div className="mt-1 text-xs text-green-700 flex justify-between">
                      <span>Original Portfolio:</span>
                      <span>5.8/10</span>
                    </div>
                    <div className="mt-1 text-xs text-green-700 flex justify-between">
                      <span>Improvement:</span>
                      <span className="text-green-600">+{(portfolioEsgScore - 5.8).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-800">Carbon Intensity</span>
                      <span className="text-lg font-bold text-green-900">{portfolioCarbonIntensity.toFixed(0)} tCO2e/$M</span>
                    </div>
                    <div className="mt-1 text-xs text-green-700 flex justify-between">
                      <span>Original Portfolio:</span>
                      <span>175 tCO2e/$M</span>
                    </div>
                    <div className="mt-1 text-xs text-green-700 flex justify-between">
                      <span>Reduction:</span>
                      <span className="text-green-600">
                        {((175 - portfolioCarbonIntensity) / 175 * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-800">Spending Supported</span>
                      <span className="text-lg font-bold text-green-900">${(portfolioReturn * 2000000).toFixed(0)}</span>
                    </div>
                    <div className="mt-1 text-xs text-green-700 flex justify-between">
                      <span>Annual Requirement:</span>
                      <span>$9,000,000</span>
                    </div>
                    <div className="mt-1 text-xs text-green-700 flex justify-between">
                      <span>Difference:</span>
                      <span className={(portfolioReturn * 2000000) >= 9000000 ? "text-green-600" : "text-red-600"}>
                        ${((portfolioReturn * 2000000) - 9000000).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ESG Strategy Rationale */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ESG Integration Rationale</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explain your ESG integration approach (minimum 200 characters):
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                disabled={submitted}
                placeholder="Explain your ESG integration strategy, why you selected specific investments, how you balanced ESG improvements with financial objectives, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 h-32"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {explanation.length} characters (minimum 200 required)
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Reset
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={submitted || totalAllocation !== 100 || explanation.length < 200}
                className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  submitted || totalAllocation !== 100 || explanation.length < 200
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Submit Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Advisor Panel with Chatbot */}
        <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md flex flex-col h-[calc(100vh-10rem)]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ESG Investment Advisor</h3>
          
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
                    placeholder="Ask about ESG integration..."
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
                  <h4 className="font-medium text-gray-800 mt-2">Sustainability Strategist Badge Earned!</h4>
                  <p className="text-sm text-gray-600 mt-1">You&apos;ve mastered ESG integration</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
                      Complete Course →
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