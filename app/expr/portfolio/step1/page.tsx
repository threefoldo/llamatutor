'use client';

import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface NewsItem {
    id: number;
    content: string;
    assetImpacts: { [ticker: string]: number }; // Ticker: Percentage change (+/-)
}

interface AssetState {
    price: number;
}

interface PortfolioState {
    cashBalance: number;
    holdings: { [ticker: string]: number }; // Ticker: Number of shares
}

interface PerformanceMetricsState {
    totalReturn: number;
    riskRewardScore: 'High' | 'Medium' | 'Low';
    diversificationScore: 'High' | 'Medium' | 'Low';
}

// PortfolioSummary Component: Displays portfolio value, cash balance, and time elapsed
const PortfolioSummary = ({ portfolioValue, cashBalance, timeElapsed }: { portfolioValue: number; cashBalance: number; timeElapsed: number }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Portfolio Summary</h2>
            <p className="text-gray-600">Starting Capital: $10,000</p>
            <p className="text-gray-600">Portfolio Value: ${portfolioValue.toFixed(2)}</p>
            <p className="text-gray-600">Cash Balance: ${cashBalance.toFixed(2)}</p>
            <p className="text-gray-600">Time Elapsed: Week {timeElapsed}</p>
        </div>
    );
};

// PerformanceChart Component: Placeholder for a chart visualizing portfolio performance over time
const PerformanceChart = () => {
    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Performance Chart</h2>
            {/* Placeholder chart image/component */}
            <p className="text-gray-600">[Placeholder Chart Image/Component]</p>
        </div>
    );
};

// NewsFeed Component: Displays news items.
const NewsFeed = ({ newsItem, onNext, onPrev }: { newsItem: NewsItem; onNext: () => void; onPrev: () => void }) => {
    return (
        <div className="bg-blue-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">News Feed</h2>
            {/* News Item Text */}
            <p className="text-gray-700">{newsItem.content}</p>
            <div className="flex justify-between mt-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onPrev} disabled={!onPrev}>Prev</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onNext} disabled={!onNext}>Next</button>
            </div>
        </div>
    );
};

// TotalReturnDisplay Component: Displays Total Return
const TotalReturnDisplay = ({ totalReturn }: { totalReturn: number }) => {
    return (
        <div className="text-center">
            <h3 className="text-md font-semibold text-gray-700">Total Return</h3>
            <p className="text-gray-600">{totalReturn.toFixed(2)}%</p>
        </div>
    );
};

// RiskRewardScore Component: Displays Risk/Reward Score
const RiskRewardScore = ({ riskRewardScore }: { riskRewardScore: PerformanceMetricsState['riskRewardScore'] }) => {
    return (
        <div className="text-center">
            <h3 className="text-md font-semibold text-gray-700">Risk/Reward Score</h3>
            <p className="text-gray-600">{riskRewardScore}</p>
        </div>
    );
};

// DiversificationScore Component: Displays Diversification Score
const DiversificationScore = ({ diversificationScore }: { diversificationScore: PerformanceMetricsState['diversificationScore'] }) => {
    return (
        <div className="text-center">
            <h3 className="text-md font-semibold text-gray-700">Diversification</h3>
            <p className="text-gray-600">{diversificationScore}</p>
        </div>
    );
};

// PerformanceMetrics Component: Displays Total Return, Risk/Reward Score, and Diversification Score
const PerformanceMetrics = ({ performanceMetrics }: { performanceMetrics: PerformanceMetricsState }) => {
    return (
        <div className="flex justify-around bg-green-100 p-4 rounded-md shadow-md">
            <TotalReturnDisplay totalReturn={performanceMetrics.totalReturn} />
            <RiskRewardScore riskRewardScore={performanceMetrics.riskRewardScore} />
            <DiversificationScore diversificationScore={performanceMetrics.diversificationScore} />
        </div>
    );
};

// NavigationLinks Component: Provides links to Asset Selection, Portfolio, Journal, and Transaction History pages
const NavigationLinks = () => {
    return (
        <div className="flex justify-around mt-4">
            <a href="/asset-selection" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Asset Selection</a>
            <a href="/portfolio" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Portfolio</a>
            <a href="/journal" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Journal</a>
            <a href="/transaction-history" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">History</a>
        </div>
    );
};

// Dashboard Component: The main game dashboard
const Dashboard: React.FC = () => {
    // Mock News Data
    const initialNewsItems: NewsItem[] = [
        { id: 1, content: "TechCo announces breakthrough AI technology; stock surges!", assetImpacts: { TECH: 0.10 } }, // +10%
        { id: 2, content: "Rising interest rates put pressure on financial stocks.", assetImpacts: { FINA: -0.05 } }, // -5%
        { id: 3, content: "Global economic slowdown impacts InduMach earnings.", assetImpacts: { INDU: -0.08 } }, // -8%
        { id: 4, content: "Demand for renewable energy increases; EnerGreen outlook positive.", assetImpacts: { ENGY: 0.12 } }, // +12%
        { id: 5, content: "Consumer spending remains strong, benefiting ConGoods.", assetImpacts: { CONS: 0.04 } }, // +4%
        { id: 6, content: "New drug approval boosts HealthWell stock.", assetImpacts: { HLTH: 0.07 } }, // +7%
        { id: 7, content: "UtilPower announces a stable quaterly dividend.", assetImpacts: { UTIL: 0.02 } }, // +2%
        { id: 8, content: "RealEstate Invest announces increased earnings", assetImpacts: { REAL: 0.05 } }, // +5%
    ];

    // State variables
    const [newsItems] = useState<NewsItem[]>(initialNewsItems);
    const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
    const [assets, setAssets] = useState<{ [ticker: string]: AssetState }>({
        TECH: { price: 100 },
        HLTH: { price: 50 },
        ENGY: { price: 75 },
        FINA: { price: 40 },
        CONS: { price: 30 },
        INDU: { price: 60 },
        REAL: { price: 80 },
        UTIL: { price: 25 },
    });
    const [portfolio, setPortfolio] = useState<PortfolioState>({
        cashBalance: 10000,
        holdings: {},
    });
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetricsState>({
        totalReturn: 0,
        riskRewardScore: 'Medium',
        diversificationScore: 'Medium',
    });
    const [timeElapsed, setTimeElapsed] = useState<number>(1);

    // Event handlers
    const handleNextNews = () => {
        if (currentNewsIndex < newsItems.length - 1) {
            setCurrentNewsIndex(currentNewsIndex + 1);
        }
    };

    const handlePrevNews = () => {
        if (currentNewsIndex > 0) {
            setCurrentNewsIndex(currentNewsIndex - 1);
        }
    };

    const applyNewsEffect = (newsItem: NewsItem) => {
        setAssets((prevAssets) => {
            const updatedAssets = { ...prevAssets };
            for (const ticker in newsItem.assetImpacts) {
                if (updatedAssets[ticker]) {
                    updatedAssets[ticker] = {
                        price: updatedAssets[ticker].price * (1 + newsItem.assetImpacts[ticker]),
                    };
                }
            }
            return updatedAssets;
        });
    };

    const calculatePerformanceMetrics = () => {
        // Calculate portfolio value
        let portfolioValue = portfolio.cashBalance;
        for (const ticker in portfolio.holdings) {
            if (assets[ticker]) {
                portfolioValue += assets[ticker].price * portfolio.holdings[ticker];
            }
        }

        // Calculate total return
        const totalReturn = ((portfolioValue - 10000) / 10000) * 100;

        // Simplified Diversification Score (based on number of holdings)
        let diversificationScore: PerformanceMetricsState['diversificationScore'] = 'Low';
        const numHoldings = Object.keys(portfolio.holdings).length;
        if (numHoldings >= 5) {
            diversificationScore = 'High';
        } else if (numHoldings >= 3) {
            diversificationScore = 'Medium';
        }

        setPerformanceMetrics({
            totalReturn: totalReturn,
            riskRewardScore: 'Medium', // Placeholder
            diversificationScore: diversificationScore,
        });

        return portfolioValue;
    };

    const updateTime = () => {
        setTimeElapsed((prevTime) => prevTime + 1);
    };

    //Effect to apply news and calculate performance whenever news index or assets changes
    useEffect(() => {
        applyNewsEffect(newsItems[currentNewsIndex]);
    }, [currentNewsIndex]);

    //Effect to calculate metrics on asset changes
    const [portfolioValue, setPortfolioValue] = useState(10000);
    useEffect(() => {
        setPortfolioValue(calculatePerformanceMetrics());
    }, [assets, portfolio]);

    //Effect to update time
    useEffect(() => {
        const timer = setInterval(() => {
            updateTime();
        }, 5000); // Update every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Portfolio Pioneer</h1>
            </header>

            <main className="space-y-6">
                {/* Portfolio Summary */}
                <PortfolioSummary portfolioValue={portfolioValue} cashBalance={portfolio.cashBalance} timeElapsed={timeElapsed} />

                {/* Performance Chart */}
                <PerformanceChart />

                {/* News Feed */}
                <NewsFeed
                  newsItem={newsItems[currentNewsIndex]}
                  onNext={currentNewsIndex < newsItems.length - 1 ? handleNextNews :  () => {}}
                  onPrev={currentNewsIndex > 0 ? handlePrevNews : () => {}}
                />

                {/* Performance Metrics */}
                <PerformanceMetrics performanceMetrics={performanceMetrics} />

                {/* Navigation Links */}
                <NavigationLinks />
            </main>
        </div>
    );
};

export default Dashboard;