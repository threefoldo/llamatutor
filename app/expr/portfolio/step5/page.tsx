'use client';

import React, { useState } from 'react';

interface Asset {
  ticker: string;
  companyName: string;
  sector: string;
  riskLevel: string;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  volatility: string;
  dividendYield: number;
  description: string;
}

interface Transaction {
  date: string;
  asset: string;
  type: 'Buy' | 'Sell';
  quantity: number;
  price: number;
}

const assets: Asset[] = [
  {
    ticker: 'TECH',
    companyName: 'TechCo Innovations',
    sector: 'Technology',
    riskLevel: 'High',
    oneYearReturn: 25,
    threeYearReturn: 18,
    fiveYearReturn: 22,
    volatility: 'High',
    dividendYield: 0.5,
    description: 'A fast-growing technology company specializing in cloud computing and AI. High potential for growth, but also high volatility.',
  },
  {
    ticker: 'HLTH',
    companyName: 'HealthWell Pharmaceuticals',
    sector: 'Healthcare',
    riskLevel: 'Medium',
    oneYearReturn: 8,
    threeYearReturn: 10,
    fiveYearReturn: 12,
    volatility: 'Medium',
    dividendYield: 2.0,
    description: 'A stable pharmaceutical company with a strong pipeline of new drugs. Moderate growth and relatively consistent performance.',
  },
  {
    ticker: 'ENGY',
    companyName: 'EnerGreen Renewables',
    sector: 'Energy',
    riskLevel: 'Medium-High',
    oneYearReturn: 15,
    threeYearReturn: 12,
    fiveYearReturn: 8,
    volatility: 'Medium-High',
    dividendYield: 1.5,
    description: 'A renewable energy company focusing on solar and wind power. Growth potential tied to government regulations and adoption of green energy.',
  },
  {
    ticker: 'FINA',
    companyName: 'FinSecure Banking Corp',
    sector: 'Financials',
    riskLevel: 'Medium',
    oneYearReturn: 5,
    threeYearReturn: 7,
    fiveYearReturn: 9,
    volatility: 'Medium',
    dividendYield: 3.5,
    description: 'A large, established bank offering a range of financial services. Generally stable, but sensitive to interest rate changes.',
  },
  {
    ticker: 'CONS',
    companyName: 'ConGoods Consumer Staples',
    sector: 'Consumer Staples',
    riskLevel: 'Low',
    oneYearReturn: 3,
    threeYearReturn: 5,
    fiveYearReturn: 6,
    volatility: 'Low',
    dividendYield: 4.0,
    description: 'A manufacturer of essential consumer goods (food, household products). Consistent demand, but limited growth potential.',
  },
  {
    ticker: 'INDU',
    companyName: 'InduMach Manufacturing',
    sector: 'Industrials',
    riskLevel: 'Medium',
    oneYearReturn: 7,
    threeYearReturn: 9,
    fiveYearReturn: 11,
    volatility: 'Medium',
    dividendYield: 2.8,
    description: 'A manufacturer of heavy machinery and industrial equipment. Performance tied to economic cycles and infrastructure spending.',
  },
  {
    ticker: 'REAL',
    companyName: 'RealEstate Invest',
    sector: 'Real Estate',
    riskLevel: 'Medium',
    oneYearReturn: 4,
    threeYearReturn: 5,
    fiveYearReturn: 8,
    volatility: 'Low-Medium',
    dividendYield: 5.0,
    description: 'Real estate investment trust that focus on income generation.',
  },
  {
    ticker: 'UTIL',
    companyName: 'UtilPower Corporation',
    sector: 'Utilities',
    riskLevel: 'Low',
    oneYearReturn: 2,
    threeYearReturn: 4,
    fiveYearReturn: 5,
    volatility: 'Low',
    dividendYield: 4.5,
    description: 'A regulated utility company providing electricity and gas. Stable, but low growth potential.',
  },
];

const PortfolioAnalysis = () => {
  // State for managing the selected phase
  const [selectedPhase, setSelectedPhase] = useState('Initial Investment');
  const [reflection1, setReflection1] = useState('');
  const [reflection2, setReflection2] = useState('');
  const [reflection3, setReflection3] = useState('');
  const [reflection4, setReflection4] = useState('');
  const [reflection5, setReflection5] = useState('');
  const [showAllAssets, setShowAllAssets] = useState(false);

  // Placeholder data for portfolio performance
  const totalReturn = 12.5;
  const sharpeRatio = 'Medium';
  const diversificationScore = 'High';
  const benchmarkReturn = 8.0;
  const bestPerformingAsset = 'TECH (25%)';
  const worstPerformingAsset = 'CONS (3%)';

  // Placeholder data for comparative asset analysis
  const topHoldings = ['TECH', 'HLTH', 'ENGY']; // Example top holdings

  const calculateBestAlternative = (asset: Asset): Asset | undefined => {
    const sameSectorAssets = assets.filter((a) => a.sector === asset.sector && a.ticker !== asset.ticker);
    if (sameSectorAssets.length === 0) return undefined;
    return sameSectorAssets.reduce((best, current) => (current.oneYearReturn > best.oneYearReturn ? current : best), sameSectorAssets[0]);
  };

  const alternativeAssets: { [key: string]: Asset | undefined } = {
    TECH: calculateBestAlternative(assets.find(a => a.ticker === 'TECH')!),
    HLTH: calculateBestAlternative(assets.find(a => a.ticker === 'HLTH')!),
    ENGY: calculateBestAlternative(assets.find(a => a.ticker === 'ENGY')!,)
  };

  // Placeholder data for transaction history
  const transactionHistory: Transaction[] = [
    { date: '2024-01-15', asset: 'TECH', type: 'Buy', quantity: 10, price: 150.00 },
    { date: '2024-02-01', asset: 'HLTH', type: 'Buy', quantity: 20, price: 50.00 },
    { date: '2024-02-15', asset: 'TECH', type: 'Sell', quantity: 5, price: 175.00 },
  ];

  const handlePhaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhase(event.target.value);
  };

  const handleReflection1Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection1(event.target.value);
  };

    const handleReflection2Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection2(event.target.value);
  };
    const handleReflection3Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection3(event.target.value);
  };
    const handleReflection4Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection4(event.target.value);
  };
    const handleReflection5Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection5(event.target.value);
  };

  const handleSaveReflection = () => {
    // In a real application, this would save the reflection to a database or API
    alert('Reflections Saved!');
  };

  const getAssetByTicker = (ticker: string): Asset | undefined => {
    return assets.find((asset) => asset.ticker === ticker);
  };

  return (
    <div className="container mx-auto py-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Portfolio Analysis & Insights</h1>

      {/* Portfolio Performance Overview Section */}
      <section className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Portfolio Performance Overview</h2>

        {/* Phase Selection */}
        <div className="mb-4">
          <label htmlFor="phase" className="block text-gray-700 text-sm font-bold mb-2">
            Select Phase:
          </label>
          <select
            id="phase"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedPhase}
            onChange={handlePhaseChange}
          >
            <option>Initial Investment</option>
            <option>Month 1 Review</option>
            <option>Month 2 Review</option>
            <option>Month 3 Review</option>
            <option>Month 4 Review</option>
            <option>Month 5 Review</option>
            <option>Month 6 Review</option>
          </select>
        </div>

        {/* Time-Series Chart Placeholder */}
        <div className="w-full h-64 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          [Time-Series Chart Placeholder]
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">Total Return:</p>
            <p>{totalReturn.toFixed(2)}%</p>
          </div>
          <div>
            <p className="font-semibold">Sharpe Ratio (Risk/Reward):</p>
            <p>{sharpeRatio}</p>
          </div>
          <div>
            <p className="font-semibold">Diversification Score:</p>
            <p>{diversificationScore}</p>
          </div>
          <div>
            <p className="font-semibold">Benchmark Return:</p>
            <p>{benchmarkReturn.toFixed(2)}%</p>
          </div>
          <div>
            <p className="font-semibold">Best Performing Asset:</p>
            <p>{bestPerformingAsset}</p>
          </div>
          <div>
            <p className="font-semibold">Worst Performing Asset:</p>
            <p>{worstPerformingAsset}</p>
          </div>
        </div>
      </section>

      {/* Comparative Asset Analysis Section */}
      <section className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Comparative Asset Analysis</h2>

        {/* Comparison Tables for Top Holdings */}
        {topHoldings.map((ticker, index) => {
          const asset = getAssetByTicker(ticker);
          const altAsset = alternativeAssets[ticker];
          if (!asset) return null;
          return (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Comparison: Your Choice ({asset.ticker}) vs. Best Alternative (Same Sector)
              </h3>
              <div className="overflow-x-auto">
              <table className="table-auto w-full min-w-[800px]">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold text-gray-700">Your Choice</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Best Alternative (Same Sector)</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Performance Difference</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Key Factors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">
                      <p className="font-semibold">{asset.ticker} - {asset.companyName}</p>
                      <p className="text-sm text-gray-500">Avg. Purchase Price: $162.50</p>
                      <p className="text-sm text-gray-500">Final Price: $175.00</p>
                      <p className="text-sm text-gray-500">Total Return: 7.7%</p>
                      <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">[Asset Chart]</div>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Buy/Sell (Placeholder)
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <p className="font-semibold">{altAsset?.ticker} - {altAsset?.companyName}</p>
                      <p className="text-sm text-gray-500">Avg. Market Price: $150.00</p>
                      <p className="text-sm text-gray-500">Final Price: $185.00</p>
                      <p className="text-sm text-gray-500">Total Return: 23.3%</p>
                      <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">[Alternative Asset Chart]</div>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Buy/Sell (Placeholder)
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <p className="text-sm text-gray-500">Difference: 15.6%</p>
                      <p className="text-sm text-gray-500">($1560)</p>
                    </td>
                    <td className="border px-4 py-2">
                      <ul className="list-disc pl-5">
                        <li className="text-sm text-gray-500">Stronger earnings growth reported.</li>
                        <li className="text-sm text-gray-500">More favorable news coverage.</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          );
        })}
        <button onClick={() => setShowAllAssets(!showAllAssets)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          {showAllAssets ? "Hide All Assets" : "Show All Assets"}
        </button>

        {showAllAssets && (
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">All Assets sorted by return</h3>
            <table className="table-auto w-full min-w-[600px]">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold text-gray-700">Asset</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Return</th>
                    <th className="px-4 py-2 font-semibold text-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {assets.sort((a, b) => b.oneYearReturn - a.oneYearReturn).map((asset, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <p className="font-semibold">{asset.ticker} - {asset.companyName}</p>
                      </td>
                      <td className="border px-4 py-2">{asset.oneYearReturn}</td>
                      <td className="border px-4 py-2">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Buy/Sell (Placeholder)
                      </button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}
      </section>

      {/* Self-Reflection Section */}
      <section className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Self-Reflection</h2>

        <div className="mb-4">
          <label htmlFor="reflection1" className="block text-gray-700 text-sm font-bold mb-2">
            Review the comparative analysis. For each of your top holdings, what factors did you consider when making your initial investment decision?
          </label>
          <textarea
            id="reflection1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            value={reflection1}
            onChange={handleReflection1Change}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="reflection2" className="block text-gray-700 text-sm font-bold mb-2">
            Looking at the &apos;Key Factors&apos; for the alternative assets, were there any factors you overlooked or underestimated?
          </label>
          <textarea
            id="reflection2"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            value={reflection2}
            onChange={handleReflection2Change}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="reflection3" className="block text-gray-700 text-sm font-bold mb-2">
            Based on this analysis, what would you do differently if you could re-run the simulation from the beginning?
          </label>
          <textarea
            id="reflection3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            value={reflection3}
            onChange={handleReflection3Change}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="reflection4" className="block text-gray-700 text-sm font-bold mb-2">
            How did your risk tolerance (as stated in your journal) align with the actual volatility of your chosen assets?
          </label>
          <textarea
            id="reflection4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            value={reflection4}
            onChange={handleReflection4Change}
          />
        </div>

                <div className="mb-4">
          <label htmlFor="reflection5" className="block text-gray-700 text-sm font-bold mb-2">
            Identify one key takeaway or lesson learned from this portfolio analysis.
          </label>
          <textarea
            id="reflection5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            value={reflection5}
            onChange={handleReflection5Change}
          />
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSaveReflection}
        >
          Save Reflection
        </button>
      </section>

      {/* Transaction History Section */}
      <section className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>

        <div className="overflow-x-auto">
        <table className="table-auto w-full min-w-[600px]">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Asset</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Type</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Quantity</th>
              <th className="px-4 py-2 font-semibold text-gray-700">Price</th>
            </tr>
          </thead>
          <tbody>
            {transactionHistory.map((transaction, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{transaction.date}</td>
                <td className="border px-4 py-2">{transaction.asset}</td>
                <td className="border px-4 py-2">{transaction.type}</td>
                <td className="border px-4 py-2">{transaction.quantity}</td>
                <td className="border px-4 py-2">${transaction.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
};

export default PortfolioAnalysis;