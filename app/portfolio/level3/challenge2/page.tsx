'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';

export default function PerformanceFactorAnalysis() {
  // Fund data
  const fund = {
    name: "BlackRock Strategic Global Equity Fund",
    fiveYearReturn: 10.8,
    benchmark: {
      name: "MSCI World",
      return: 8.5
    },
    outperformance: 2.3,
    managementFee: 0.85,
    style: "Global equity with tactical allocation",
    managerClaim: "Superior security selection and tactical asset allocation"
  };

  // Fund top holdings
  const fundHoldings = [
    { company: 'Apple Inc.', ticker: 'AAPL', weight: 6.2, fiveYearReturn: 15.7, benchmarkWeight: 4.1 },
    { company: 'Microsoft Corp.', ticker: 'MSFT', weight: 5.8, fiveYearReturn: 16.2, benchmarkWeight: 3.7 },
    { company: 'Amazon.com, Inc.', ticker: 'AMZN', weight: 4.5, fiveYearReturn: 14.0, benchmarkWeight: 2.5 },
    { company: 'NVIDIA Corp.', ticker: 'NVDA', weight: 3.4, fiveYearReturn: 38.2, benchmarkWeight: 1.2 },
    { company: 'Tesla, Inc.', ticker: 'TSLA', weight: 2.8, fiveYearReturn: 32.5, benchmarkWeight: 1.0 },
    { company: 'Alphabet Inc.', ticker: 'GOOGL', weight: 2.6, fiveYearReturn: 12.3, benchmarkWeight: 2.2 },
    { company: 'Meta Platforms, Inc.', ticker: 'META', weight: 2.2, fiveYearReturn: 9.5, benchmarkWeight: 1.1 },
    { company: 'UnitedHealth Group Inc.', ticker: 'UNH', weight: 1.9, fiveYearReturn: 18.4, benchmarkWeight: 0.8 },
    { company: 'Johnson & Johnson', ticker: 'JNJ', weight: 1.7, fiveYearReturn: 7.1, benchmarkWeight: 0.9 },
    { company: 'Visa Inc.', ticker: 'V', weight: 1.5, fiveYearReturn: 11.2, benchmarkWeight: 0.7 }
  ];

  // Factor exposure data
  const factorData = useMemo(() => [
    { 
      factor: 'Market', 
      description: 'Overall market movement', 
      fundExposure: 0.98, 
      benchmarkExposure: 1.00, 
      activeExposure: -0.02, 
      factorReturn: 8.2 
    },
    { 
      factor: 'Size', 
      description: 'Small vs. large companies', 
      fundExposure: 0.35, 
      benchmarkExposure: 0.05, 
      activeExposure: 0.30, 
      factorReturn: 3.2 
    },
    { 
      factor: 'Value', 
      description: 'Value vs. growth stocks', 
      fundExposure: -0.25, 
      benchmarkExposure: 0.02, 
      activeExposure: -0.27, 
      factorReturn: -2.1 
    },
    { 
      factor: 'Momentum', 
      description: 'Recent price trends', 
      fundExposure: 0.40, 
      benchmarkExposure: 0.12, 
      activeExposure: 0.28, 
      factorReturn: 4.5 
    },
    { 
      factor: 'Quality', 
      description: 'Financial strength', 
      fundExposure: 0.22, 
      benchmarkExposure: 0.10, 
      activeExposure: 0.12, 
      factorReturn: 2.8 
    },
    { 
      factor: 'Volatility', 
      description: 'Price fluctuation', 
      fundExposure: -0.30, 
      benchmarkExposure: -0.05, 
      activeExposure: -0.25, 
      factorReturn: -1.5 
    }
  ], []);

  // Define factor contribution interface
  interface FactorContribution {
    factor: string;
    description: string;
    fundExposure: number;
    benchmarkExposure: number;
    activeExposure: number;
    factorReturn: number;
    contribution: number;
    benchmarkContribution: number;
    activeContribution: number;
  }

  // State variables
  const [factorContributions, setFactorContributions] = useState<FactorContribution[]>([]);
  const [skillMetrics, setSkillMetrics] = useState({
    alpha: 0,
    informationRatio: 0,
    activeShare: 72.5,
    hitRate: 58
  });
  const [factorReturn, setFactorReturn] = useState(0);
  const [benchmarkFactorReturn, setBenchmarkFactorReturn] = useState(0);
  const [excessFactorReturn, setExcessFactorReturn] = useState(0);
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
    { role: 'assistant', content: "Welcome to the Performance Factor Analysis challenge! I'm here to help you determine whether BlackRock Strategic Global Equity Fund's outperformance is due to manager skill or just factor exposures. What would you like to know about factor analysis?" }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined AI responses for the chatbot
  const aiResponses: Record<string, string> = {
    'factor model': "A factor model breaks down investment returns into components attributable to different risk factors (like market, size, value) plus alpha (unexplained return). The formula is: Return = α + β₁(Factor₁) + β₂(Factor₂) + ... + residual. This helps identify the true sources of performance.",
    'alpha': "Alpha represents the portion of return that cannot be explained by exposure to common risk factors - it's often interpreted as manager skill. Positive alpha suggests value added through security selection or timing; negative alpha suggests underperformance vs. expectations.",
    'factor exposure': "Factor exposure (or beta) measures how sensitive a fund is to a particular risk factor. For example, a size factor exposure of 0.35 means the fund has more exposure to smaller companies than the market. These exposures can drive returns when factors perform well.",
    'factor contribution': "Factor contribution is calculated by multiplying a factor's exposure (beta) by its return. For example, if a fund has a 0.35 exposure to the Size factor, which returned 3.2%, the Size factor contributed 0.35 × 3.2% = 1.12% to the fund's total return.",
    'information ratio': "The Information Ratio measures risk-adjusted excess return by dividing alpha by tracking error. It tells you how much excess return a manager generates per unit of active risk taken. Higher ratios indicate more consistent outperformance.",
    'active share': "Active Share measures how different a portfolio is from its benchmark, ranging from 0% (identical) to 100% (completely different). A high Active Share (>80%) suggests high active management, but doesn't necessarily indicate skill - you need to look at performance too.",
    'blackrock': "BlackRock Strategic Global Equity Fund has outperformed its benchmark by 2.3% annually over 5 years. Your task is to determine if this outperformance reflects genuine manager skill or just exposure to factors that performed well during this period.",
    'help': "I can help with: 1) Explaining factor analysis concepts like alpha and factor contribution, 2) Interpreting the fund's factor exposures, 3) Understanding how to calculate attribution results, or 4) Deciding whether the outperformance represents skill or just factor tilts. What would you like to know?"
  };

  // Calculate factor contributions
  const calculateFactorContributions = useCallback(() => {
    // Calculate factor contributions for fund
    const contributions = factorData.map(factor => {
      const contribution = factor.fundExposure * factor.factorReturn;
      const benchmarkContribution = factor.benchmarkExposure * factor.factorReturn;
      const activeContribution = contribution - benchmarkContribution;
      
      return {
        ...factor,
        contribution,
        benchmarkContribution,
        activeContribution
      };
    });
    
    setFactorContributions(contributions);
    
    // Calculate total factor contribution
    const totalFactorContribution = contributions.reduce(
      (sum, factor) => sum + factor.contribution, 0
    );
    
    const totalBenchmarkFactorContribution = contributions.reduce(
      (sum, factor) => sum + factor.benchmarkContribution, 0
    );
    
    const excessFactorContribution = totalFactorContribution - totalBenchmarkFactorContribution;
    
    setFactorReturn(totalFactorContribution);
    setBenchmarkFactorReturn(totalBenchmarkFactorContribution);
    setExcessFactorReturn(excessFactorContribution);
    
    // Calculate implied alpha
    const impliedAlpha = fund.outperformance - excessFactorContribution;
    
    setSkillMetrics(prevMetrics => ({
      ...prevMetrics,
      alpha: impliedAlpha
    }));
  }, [factorData, fund.outperformance]);

  // Initialize calculations
  useEffect(() => {
    calculateFactorContributions();
  }, [calculateFactorContributions]);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Submit analysis
  const handleSubmit = () => {
    if (explanation.length < 200) {
      alert("Please provide a more detailed explanation of your attribution analysis (minimum 200 characters)");
      return;
    }
    
    setSubmitted(true);
    
    // Check if the analysis correctly identifies that outperformance is due to factor exposures, not skill
    const identifiesFactorDriven = explanation.toLowerCase().includes('factor') && 
                                  (explanation.toLowerCase().includes('exposure') || explanation.toLowerCase().includes('tilt'));
    
    const identifiesNegativeAlpha = explanation.toLowerCase().includes('negative alpha') || 
                                   explanation.toLowerCase().includes('no alpha') || 
                                   explanation.toLowerCase().includes('lack of skill');
    
    const identifiesKeyFactors = explanation.toLowerCase().includes('momentum') && 
                                (explanation.toLowerCase().includes('size') || explanation.toLowerCase().includes('small'));
    
    const mentionsTechOverweight = explanation.toLowerCase().includes('tech') || 
                                  explanation.toLowerCase().includes('nvidia') || 
                                  explanation.toLowerCase().includes('tesla');
    
    if (identifiesFactorDriven && identifiesNegativeAlpha && (identifiesKeyFactors || mentionsTechOverweight)) {
      setFeedback("Excellent work! Your attribution analysis correctly identifies that the fund's outperformance is entirely attributable to factor exposures rather than manager skill. You've precisely quantified how factor tilts (particularly momentum and size) and overweight positions in high-performing tech stocks explain the excess returns, while the negative alpha suggests no value added through security selection. This distinction is crucial for making informed investment decisions. You've earned the 'Factor Finder' badge!");
    } else if (!identifiesFactorDriven) {
      setFeedback("Your analysis doesn't clearly identify that the fund's outperformance is primarily attributable to factor exposures rather than skill. Look closely at how much of the excess return can be explained by the fund's factor tilts compared to the benchmark.");
    } else if (!identifiesNegativeAlpha) {
      setFeedback("Your analysis doesn't address the implied alpha (skill component) of the fund. After accounting for factor contributions, does the manager actually demonstrate skill through security selection or timing?");
    } else if (!identifiesKeyFactors && !mentionsTechOverweight) {
      setFeedback("Your analysis should identify which specific factors or stock overweights drove the outperformance. The momentum and size factors, along with overweight positions in high-performing technology stocks, played crucial roles.");
    } else {
      setFeedback("Your attribution analysis makes some good points but could be more comprehensive. Consider how all the components of performance (factor exposures, stock selection, alpha) work together to explain the fund's outperformance relative to its benchmark.");
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
    let aiResponse = "I don't have specific information about that. Try asking about factor models, alpha, factor contribution, or type 'help' for assistance.";
    
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
      <div className="bg-purple-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 3: Challenge 3.2</h1>
            <h2 className="text-lg">Unmasking Performance Factors</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="bg-purple-500 rounded-full h-3 w-64">
                <div className="bg-white rounded-full h-3 w-2/3"></div>
              </div>
              <p className="text-xs mt-1">Challenge 2 of 2 in Level 3</p>
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">Fund Profile</h3>
          
          <div className="mb-6 bg-purple-50 rounded-lg overflow-hidden">
            <div className="p-4">
              <h4 className="font-medium text-purple-800">{fund.name}</h4>
              <p className="text-sm text-gray-600">Global Equity Fund</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">5-Year Annualized Return</h4>
              <p className="text-lg font-medium text-gray-900">{fund.fiveYearReturn}%</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Benchmark ({fund.benchmark.name})</h4>
              <p className="text-lg font-medium text-gray-900">{fund.benchmark.return}%</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Outperformance</h4>
              <p className="text-lg font-medium text-green-600">+{fund.outperformance}%</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Management Fee</h4>
              <p className="text-lg font-medium text-gray-900">{fund.managementFee}%</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Investment Style</h4>
              <p className="text-lg font-medium text-gray-900">{fund.style}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Manager Claim</h4>
              <p className="text-sm text-gray-700">&quot;{fund.managerClaim}&quot;</p>
            </div>
          </div>
        </div>

        {/* Workspace Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Fund Holdings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Top Holdings</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Fund Weight</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Benchmark</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Active Weight</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">5Y Return</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fundHoldings.map((holding) => (
                    <tr key={holding.ticker} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900">{holding.company}</div>
                        <div className="text-xs text-gray-500">{holding.ticker}</div>
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{holding.weight.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{holding.benchmarkWeight.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">
                        <span className={holding.weight > holding.benchmarkWeight ? "text-green-600" : "text-red-600"}>
                          {(holding.weight - holding.benchmarkWeight).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{holding.fiveYearReturn.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Factor Exposures */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Factor Exposures</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Fund (β)</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Benchmark</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">5Y Return</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {factorData.map((factor) => (
                    <tr key={factor.factor} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{factor.factor}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{factor.description}</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{factor.fundExposure.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">{factor.benchmarkExposure.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">
                        <span className={factor.activeExposure > 0 ? "text-green-600" : "text-red-600"}>
                          {factor.activeExposure > 0 ? "+" : ""}{factor.activeExposure.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-sm text-gray-900">
                        <span className={factor.factorReturn > 0 ? "text-green-600" : "text-red-600"}>
                          {factor.factorReturn.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Attribution Results */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Attribution</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Factor Contribution to Return</h4>
                
                <div className="space-y-3">
                  {factorContributions.map((factor) => (
                    <div key={factor.factor} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{factor.factor}</span>
                      <div className="flex items-center">
                        <div className="w-24 h-4 bg-gray-100 rounded overflow-hidden">
                          <div 
                            className={`h-full ${factor.contribution > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(Math.abs(factor.contribution) * 7, 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{factor.contribution.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Return Breakdown</h4>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Fund Total Return:</span>
                      <span className="text-sm font-medium text-gray-900">{fund.fiveYearReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Benchmark Return:</span>
                      <span className="text-sm font-medium text-gray-900">{fund.benchmark.return.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Excess Return:</span>
                      <span className="text-sm font-medium">{fund.outperformance.toFixed(2)}%</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Factor Return (Fund):</span>
                      <span className="text-sm font-medium text-gray-900">{factorReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Factor Return (Benchmark):</span>
                      <span className="text-sm font-medium text-gray-900">{benchmarkFactorReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span className="text-sm">Excess Factor Return:</span>
                      <span className="text-sm font-medium">{excessFactorReturn.toFixed(2)}%</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Implied Alpha (Skill):</span>
                      <span className={`text-sm font-medium ${skillMetrics.alpha > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {skillMetrics.alpha.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-purple-800 mb-1">Information Ratio</h4>
                <p className="text-xl font-bold text-purple-900">{(skillMetrics.alpha / 2.8).toFixed(2)}</p>
                <p className="text-xs text-purple-700">Alpha ÷ Tracking Error</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-purple-800 mb-1">Active Share</h4>
                <p className="text-xl font-bold text-purple-900">{skillMetrics.activeShare}%</p>
                <p className="text-xs text-purple-700">Deviation from benchmark</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-purple-800 mb-1">Hit Rate</h4>
                <p className="text-xl font-bold text-purple-900">{skillMetrics.hitRate}%</p>
                <p className="text-xs text-purple-700">% of correct active decisions</p>
              </div>
            </div>
          </div>
          
          {/* Analysis Submission */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Attribution Analysis</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explain your attribution findings (minimum 200 characters):
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                disabled={submitted}
                placeholder="Explain whether the fund's outperformance is attributable to factor exposures or manager skill, and provide specific evidence..."
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
                disabled={submitted || explanation.length < 200}
                className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  submitted || explanation.length < 200
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Advisor</h3>
          
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
                    placeholder="Ask about factor analysis or attribution..."
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
                  <h4 className="font-medium text-gray-800 mt-2">Factor Finder Badge Earned!</h4>
                  <p className="text-sm text-gray-600 mt-1">You&apos;ve mastered performance attribution analysis</p>
                  
                  <div className="mt-6">
                    <Link href="/portfolio/level4" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md">
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