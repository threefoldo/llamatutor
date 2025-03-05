'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the type for a portfolio investment
interface PortfolioInvestment {
  id: string;
  name: string;
  ticker: string;
  target: number;
  current: number;
  value: number;
  drift: number;
  selected: boolean;
  trade: number;
}

// Mock data for actual implementation
const portfolioInvestments: PortfolioInvestment[] = [
  { id: 'VOO', name: 'Vanguard S&P 500 ETF', ticker: 'VOO', target: 30, current: 37.5, value: 375000, drift: 7.5, selected: false, trade: 0 },
  { id: 'IWM', name: 'iShares Russell 2000 ETF', ticker: 'IWM', target: 15, current: 18.3, value: 183000, drift: 3.3, selected: false, trade: 0 },
  { id: 'EFA', name: 'iShares MSCI EAFE ETF', ticker: 'EFA', target: 15, current: 13.4, value: 134000, drift: -1.6, selected: false, trade: 0 },
  { id: 'BND', name: 'Vanguard Total Bond Market ETF', ticker: 'BND', target: 20, current: 13.2, value: 132000, drift: -6.8, selected: false, trade: 0 },
  { id: 'TIP', name: 'iShares TIPS Bond ETF', ticker: 'TIP', target: 5, current: 3.4, value: 34000, drift: -1.6, selected: false, trade: 0 },
  { id: 'AAPL', name: 'Apple Inc.', ticker: 'AAPL', target: 3, current: 4.8, value: 48000, drift: 1.8, selected: false, trade: 0 },
  { id: 'MSFT', name: 'Microsoft Corp.', ticker: 'MSFT', target: 3, current: 4.1, value: 41000, drift: 1.1, selected: false, trade: 0 },
  { id: 'GOOGL', name: 'Alphabet Inc.', ticker: 'GOOGL', target: 3, current: 2.5, value: 25000, drift: -0.5, selected: false, trade: 0 },
  { id: 'JPM', name: 'JPMorgan Chase & Co.', ticker: 'JPM', target: 3, current: 1.9, value: 19000, drift: -1.1, selected: false, trade: 0 },
  { id: 'CASH', name: 'Cash', ticker: '-', target: 3, current: 0.9, value: 9000, drift: -2.1, selected: false, trade: 0 },
];

export default function MasteringRebalancing() {
  const [portfolioData, setPortfolioData] = useState(portfolioInvestments);
  const [rebalancingStrategy, setRebalancingStrategy] = useState('threshold');
  const [totalCost, setTotalCost] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const totalPortfolioValue = 1000000;
  
  // Cost parameters
  const flatFee = 9.95;
  const tradingFeePercentage = 0.0003; // 0.03%
  
  // Chatbot state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your Investment Guru AI. I can help you develop a cost-effective rebalancing strategy for the Anderson Community Foundation's portfolio. What would you like to know about portfolio drift or rebalancing approaches?" }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined AI responses based on keywords
  const aiResponses = {
    'drift': "Portfolio drift occurs when market movements cause your actual allocation to move away from your target allocation. For example, if stocks perform well, their percentage in the portfolio increases, potentially exceeding your target allocation and increasing overall risk exposure.",
    'threshold': "Threshold rebalancing focuses only on investments that have drifted beyond a specific threshold (in this case, 5%). This approach balances transaction costs with portfolio alignment. The Foundation's investment policy requires rebalancing when positions drift more than 5% from targets.",
    'full': "Full rebalancing returns all positions to their exact target allocations. While this provides perfect alignment with the investment policy, it typically incurs higher transaction costs by trading positions with smaller drifts that may not significantly impact the portfolio's risk-return profile.",
    'cost': "The Foundation incurs two types of trading costs: (1) A flat fee of $9.95 per trade, and (2) A variable fee of 0.03% of the trade amount. These costs reduce portfolio returns, so it's important to balance the benefits of rebalancing against the cost of implementation.",
    'help': "I can assist with: 1) Explaining portfolio drift concepts 2) Discussing different rebalancing strategies 3) Providing insights on cost-effective implementation 4) Explaining the Foundation's rebalancing policy. What would you like to know?",
    'foundation': "The Anderson Community Foundation provides grants for local education initiatives and has a $1M portfolio. Their investment policy requires annual rebalancing if any position drifts more than 5% from its target. They have a 4% annual withdrawal rate for grants, so maintaining liquidity while controlling costs is important.",
    'policy': "The Foundation's investment policy states: 'Rebalance when any position drifts more than 5% from target.' This threshold approach helps control transaction costs while maintaining the desired risk profile. VOO and BND are currently beyond this threshold."
  };

  useEffect(() => {
    // Calculate total rebalancing cost when trade amounts change
    calculateTotalCost();
  }, [portfolioData]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const calculateTotalCost = () => {
    // Count trades with non-zero amounts
    const tradesCount = portfolioData.filter(inv => Math.abs(inv.trade) > 0).length;
    
    // Calculate flat fee component
    const totalFlatFee = tradesCount * flatFee;
    
    // Calculate percentage fee component
    const totalPercentageFee = portfolioData.reduce((sum, inv) => 
      sum + (Math.abs(inv.trade) * tradingFeePercentage), 0);
    
    setTotalCost(totalFlatFee + totalPercentageFee);
  };

  const handleTradeChange = (id: string, value: string | number) => {
    const tradeValue = parseInt(value.toString()) || 0;
    
    const updatedPortfolio = portfolioData.map(inv => 
      inv.id === id ? { ...inv, trade: tradeValue } : inv
    );
    
    setPortfolioData(updatedPortfolio);
  };

  const toggleSelection = (id: string) => {
    const updatedPortfolio = portfolioData.map(inv => 
      inv.id === id ? { ...inv, selected: !inv.selected } : inv
    );
    
    setPortfolioData(updatedPortfolio);
  };

  const applyThresholdRebalancing = () => {
    // Only rebalance positions that have drifted more than 5%
    const updatedPortfolio = portfolioData.map(inv => {
      if (Math.abs(inv.drift) > 5) {
        // Calculate the dollar amount to trade
        const tradeAmount = -Math.round(inv.drift * totalPortfolioValue / 100);
        return { ...inv, trade: tradeAmount, selected: true };
      }
      return { ...inv, trade: 0, selected: false };
    });
    
    setPortfolioData(updatedPortfolio);
    
    // Add a message from the AI about threshold rebalancing
    setMessages([...messages, {
      role: 'assistant',
      content: "I've applied threshold rebalancing to focus on positions that drifted more than 5% from their targets. This approach addresses VOO (+7.5% drift) and BND (-6.8% drift) while minimizing trading costs. The total rebalancing cost is approximately $62.80, which is only 0.0063% of the portfolio value."
    }]);
  };

  const applyFullRebalancing = () => {
    // Rebalance all positions to their target allocations
    const updatedPortfolio = portfolioData.map(inv => {
      // Calculate the dollar amount to trade
      const tradeAmount = Math.round((inv.target - inv.current) * totalPortfolioValue / 100);
      return { ...inv, trade: tradeAmount, selected: tradeAmount !== 0 };
    });
    
    setPortfolioData(updatedPortfolio);
    
    // Add a message from the AI about full rebalancing
    setMessages([...messages, {
      role: 'assistant',
      content: "I've applied full rebalancing to return all positions to their exact target allocations. While this provides perfect alignment with the investment policy, it incurs higher costs by trading positions with smaller drifts. The total rebalancing cost is approximately $140, which is 0.014% of the portfolio value."
    }]);
  };

  const clearTrades = () => {
    const updatedPortfolio = portfolioData.map(inv => ({
      ...inv, 
      trade: 0,
      selected: false
    }));
    
    setPortfolioData(updatedPortfolio);
  };

  const handleSubmit = () => {
    // Check if any trades have been specified
    const hasTrades = portfolioData.some(inv => Math.abs(inv.trade) > 0);
    
    if (!hasTrades) {
      alert("Please specify at least one trade for rebalancing");
      return;
    }

    if (explanation.length < 150) {
      alert("Please provide a more detailed explanation (minimum 150 characters)");
      return;
    }

    setSubmitted(true);
    
    // Get positions that require rebalancing based on 5% threshold
    const requiresRebalancing = portfolioData.filter(inv => Math.abs(inv.drift) > 5);
    
    // Check if all positions that need rebalancing are addressed
    const addressedPositions = requiresRebalancing.filter(inv => 
      portfolioData.find(item => item.id === inv.id && Math.abs(item.trade) > 0)
    );
    
    // Count the number of unnecessary trades (positions with < 5% drift that are traded)
    const unnecessaryTrades = portfolioData.filter(inv => 
      Math.abs(inv.drift) <= 5 && Math.abs(inv.trade) > 0
    ).length;
    
    // Check if the rebalancing strategy is cost-effective
    if (addressedPositions.length === requiresRebalancing.length && 
        (unnecessaryTrades === 0 || rebalancingStrategy === 'full') && 
        totalCost < 150) {
      
      if (rebalancingStrategy === 'threshold' && unnecessaryTrades === 0) {
        setFeedback("Excellent work! Your threshold rebalancing strategy efficiently addresses the positions that exceed the 5% drift threshold (VOO and BND) while minimizing trading costs. By focusing only on the positions that require rebalancing per the investment policy, you've maintained the desired risk profile while preserving the foundation's assets for their educational mission. You've earned the 'Rebalancing Guru' title!");
      } else if (rebalancingStrategy === 'full' && totalCost < 150) {
        setFeedback("Good work! Your full rebalancing strategy returns all positions to their target allocations, providing precise alignment with the investment policy. While this approach incurs slightly higher costs than threshold rebalancing, you've kept the total cost reasonable. This comprehensive approach ensures the portfolio's risk profile is exactly as intended, supporting the foundation's long-term educational mission.");
      } else {
        setFeedback("Your rebalancing strategy effectively addresses the most significant drift in the portfolio. However, consider whether all the trades you've specified are necessary, as some positions have minimal drift that may not significantly impact the portfolio's risk profile. Remember that each trade incurs costs that reduce returns available for the foundation's grants.");
      }
    } else if (addressedPositions.length < requiresRebalancing.length) {
      setFeedback("Your rebalancing strategy doesn't address all positions that exceed the 5% drift threshold. According to the investment policy, both VOO (+7.5% drift) and BND (-6.8% drift) require rebalancing. Failing to address these significant drifts could impact the portfolio's risk profile and long-term performance.");
    } else if (unnecessaryTrades > 2 && rebalancingStrategy === 'threshold') {
      setFeedback("Your strategy includes several trades for positions with less than 5% drift. While thorough, this approach increases costs without significantly improving the portfolio's alignment with targets. Consider focusing on positions that exceed the policy's 5% threshold to optimize the cost-benefit tradeoff.");
    } else if (totalCost > 200) {
      setFeedback("Your rebalancing plan incurs relatively high costs that may be excessive for a $1M portfolio. Remember that trading costs directly reduce returns available for the foundation's educational grants. Consider whether all proposed trades are necessary to maintain the desired risk profile.");
    } else {
      setFeedback("Your rebalancing approach is reasonable but could be optimized further. Focus on addressing positions with significant drift (>5%) while minimizing transaction costs. Remember that the goal is to maintain the portfolio's risk characteristics while maximizing resources available for the foundation's mission.");
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const updatedMessages = [...messages, { role: 'user', content: currentMessage }];
    setMessages(updatedMessages);
    
    // Generate AI response based on keywords in user message
    const userMessageLower = currentMessage.toLowerCase();
    let aiResponse = "I'm not sure I understand. Try asking about portfolio drift, rebalancing strategies, trading costs, or the foundation's investment policy. You can also type 'help' for assistance.";
    
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
      <div className="bg-green-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 2: Challenge 2.2</h1>
            <h2 className="text-lg">Mastering Rebalancing</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-green-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-1/2"></div>
              </div>
              <p className="text-xs mt-1">Challenge 2 of 4 in Level 2</p>
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">Foundation Profile</h3>
          
          <div className="mb-6 bg-green-50 rounded-lg overflow-hidden">
            <div className="p-4">
              <h4 className="font-medium text-green-800">Anderson Community Foundation</h4>
              <p className="text-sm text-gray-600">Supporting Local Education Initiatives</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Portfolio Value</h4>
              <p className="text-lg font-medium text-gray-900">$1,000,000</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Annual Withdrawal</h4>
              <p className="text-lg font-medium text-gray-900">4% ($40,000)</p>
              <p className="text-xs text-gray-500">For education grants</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Trading Cost Structure</h4>
              <p className="text-lg font-medium text-gray-900">$9.95 flat fee + 0.03% of trade value</p>
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Rebalancing Policy:</h4>
            <p className="text-sm text-gray-700 italic">
              &quot;Rebalance when any position drifts more than 5% from target.&quot;
            </p>
          </div>
        </div>

        {/* Workspace Panel (50%) */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Rebalancing Workspace</h3>
          
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rebalancing Strategy</label>
                <select
                  value={rebalancingStrategy}
                  onChange={(e) => setRebalancingStrategy(e.target.value)}
                  disabled={submitted}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="threshold">Threshold Rebalancing ({'>'}5% drift)</option>
                  <option value="full">Full Rebalancing (all positions)</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={rebalancingStrategy === 'threshold' ? applyThresholdRebalancing : applyFullRebalancing}
                  disabled={submitted}
                  className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    submitted ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Calculate Trades
                </button>
                
                <button
                  onClick={clearTrades}
                  disabled={submitted}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    submitted ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target %</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current %</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Drift</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trade Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.map((investment) => (
                  <tr 
                    key={investment.id} 
                    className={`${
                      investment.selected ? 'bg-green-50' : 'hover:bg-gray-50'
                    } ${Math.abs(investment.drift) > 5 ? 'bg-yellow-50' : ''}`}
                    onClick={() => !submitted && toggleSelection(investment.id)}
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={investment.selected}
                        onChange={() => !submitted && toggleSelection(investment.id)}
                        disabled={submitted}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                      <div className="text-xs text-gray-500">{investment.ticker}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">{investment.target.toFixed(1)}%</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">{investment.current.toFixed(1)}%</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <span className={
                        Math.abs(investment.drift) > 5
                          ? 'text-red-600'
                          : Math.abs(investment.drift) > 2
                            ? 'text-yellow-600'
                            : 'text-green-600'
                      }>
                        {investment.drift > 0 ? '+' : ''}{investment.drift.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-900">${investment.value.toLocaleString()}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="1000"
                        value={investment.trade}
                        onChange={(e) => handleTradeChange(investment.id, e.target.value)}
                        disabled={submitted || !investment.selected}
                        className={`w-24 px-2 py-1 text-right border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${
                          !investment.selected 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'border-gray-300'
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-1">Rebalancing Cost</h4>
              <p className="text-xl font-bold text-green-900">${totalCost.toFixed(2)}</p>
              <p className="text-xs text-green-700">({(totalCost / totalPortfolioValue * 100).toFixed(4)}% of portfolio)</p>
              <div className="mt-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Flat Fee:</span>
                  <span>${(portfolioData.filter(inv => Math.abs(inv.trade) > 0).length * flatFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Variable Fee:</span>
                  <span>${(portfolioData.reduce((sum, inv) => sum + (Math.abs(inv.trade) * tradingFeePercentage), 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-1">Trade Summary</h4>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Positions Traded:</span>
                  <span>{portfolioData.filter(inv => Math.abs(inv.trade) > 0).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Buy Trades:</span>
                  <span>{portfolioData.filter(inv => inv.trade > 0).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sell Trades:</span>
                  <span>{portfolioData.filter(inv => inv.trade < 0).length}</span>
                </div>
                <div className="flex justify-between text-sm font-medium mt-1">
                  <span>Total Trade Value:</span>
                  <span>${portfolioData.reduce((sum, inv) => sum + Math.abs(inv.trade), 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explain your rebalancing strategy (minimum 150 characters):
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={submitted}
              placeholder="Explain your rebalancing approach, why you selected specific trades, and how your strategy balances policy compliance with cost considerations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 h-32"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {explanation.length} characters (minimum 150 required)
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={clearTrades}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={submitted || !portfolioData.some(inv => Math.abs(inv.trade) > 0)}
              className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                submitted || !portfolioData.some(inv => Math.abs(inv.trade) > 0)
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Submit Rebalancing Plan
            </button>
          </div>
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
                    placeholder="Ask about rebalancing or portfolio drift..."
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mt-2">Rebalancing Guru Title Earned!</h4>
                  <p className="text-sm text-gray-600 mt-1">You&apos;ve mastered cost-effective portfolio rebalancing</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio/level3/challenge1" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
                      Next Level →
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