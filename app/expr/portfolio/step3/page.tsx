'use client';

import React, { useState } from 'react';

// Define the structure for an asset
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
  currentPrice: number; // Add current price
  shares: number;       // Add number of owned shares
}

interface SellOrder {
    asset: Asset;
    shares: number;
}

const initialAssets: Asset[] = [
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
        currentPrice: 150.00,
        shares: 10
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
        currentPrice: 80.00,
        shares: 5
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
        currentPrice: 60.00,
        shares: 12
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
        currentPrice: 110.00,
        shares: 8
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
        currentPrice: 45.00,
        shares: 20
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
        currentPrice: 90.00,
        shares: 7
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
        currentPrice: 70.00,
        shares: 15
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
        currentPrice: 55.00,
        shares: 25
    }
];

// Define the props for the PortfolioView component
interface PortfolioViewProps {
    initialCashBalance: number;
    onPortfolioUpdate: (assets: Asset[], cashBalance: number) => void;
}

// Main PortfolioView component
const PortfolioView: React.FC<PortfolioViewProps> = ({initialCashBalance, onPortfolioUpdate}) => {
  // State for managing portfolio data
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [cashBalance, setCashBalance] = useState<number>(initialCashBalance);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [sellOrder, setSellOrder] = useState<SellOrder | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

  // Function to open the confirmation modal
    const handleSellClick = (asset: Asset, shares: number) => {
        setSellOrder({ asset, shares });
        setConfirmationModalOpen(true);
    };

  // Function to close the confirmation modal
    const handleCancelSell = () => {
        setConfirmationModalOpen(false);
        setSellOrder(null);
    };

    const handleConfirmSell = () => {
        if (!sellOrder) return;

        const { asset, shares } = sellOrder;

        if (shares <= 0 || shares > asset.shares) {
            setAlertMessage('Invalid number of shares.');
            setAlertType('error');
            setTimeout(() => {
                setAlertMessage(null);
                setAlertType(null);
            }, 3000);
            setConfirmationModalOpen(false);
            setSellOrder(null);
            return;
        }

        const saleValue = asset.currentPrice * shares;

        //Update cash balance
        setCashBalance((prevCashBalance) => prevCashBalance + saleValue);

        //Update assets
        setAssets((prevAssets) => {
            return prevAssets.map((a) => {
                if (a.ticker === asset.ticker) {
                    return { ...a, shares: a.shares - shares };
                }
                return a;
            }).filter((a) => a.shares > 0);  //Remove the asset if all shares are sold
        });

        setConfirmationModalOpen(false);
        setSellOrder(null);

        //Show success message
        setAlertMessage(`Successfully sold ${shares} shares of ${asset.companyName}.`);
        setAlertType('success');
        setTimeout(() => {
            setAlertMessage(null);
            setAlertType(null);
        }, 3000);

        //Update Portfolio View
        onPortfolioUpdate(assets, cashBalance);
    };

    const calculatePortfolioPercentage = (asset: Asset): number => {
        const totalPortfolioValue = assets.reduce((acc, a) => acc + (a.currentPrice * a.shares), 0) + cashBalance;
        return (asset.currentPrice * asset.shares) / totalPortfolioValue * 100;
    };

    // Render the component
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Portfolio View</h1>

            {alertMessage && (
                <div className={`p-2 rounded ${alertType === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'} mb-4`}>
                    {alertMessage}
                </div>
            )}

            {/* Asset List Table */}
            <div className="overflow-x-auto shadow-md rounded-md">
                <table className="w-full table-auto border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">Asset</th>
                            <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">Shares</th>
                            <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">Price</th>
                            <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">Value</th>
                            <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">%</th>
                            <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">Sell</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.ticker} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2">{asset.companyName} ({asset.ticker})</td>
                                <td className="border border-gray-200 px-4 py-2">{asset.shares}</td>
                                <td className="border border-gray-200 px-4 py-2">${asset.currentPrice.toFixed(2)}</td>
                                <td className="border border-gray-200 px-4 py-2">${(asset.currentPrice * asset.shares).toFixed(0)}</td>
                                <td className="border border-gray-200 px-4 py-2">{calculatePortfolioPercentage(asset).toFixed(2)}%</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    <BuySellForm asset={asset} onSellClick={handleSellClick} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {confirmationModalOpen && sellOrder && (
                <ConfirmationModal
                    asset={sellOrder.asset}
                    shares={sellOrder.shares}
                    onConfirm={handleConfirmSell}
                    onCancel={handleCancelSell}
                />
            )}
        </div>
    );
};

// BuySellForm component for each asset
interface BuySellFormProps {
  asset: Asset;
  onSellClick: (asset: Asset, shares: number) => void;
}

const BuySellForm: React.FC<BuySellFormProps> = ({ asset, onSellClick }) => {
  const [sharesToSell, setSharesToSell] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = parseInt(sharesToSell);
    if (!isNaN(shares) && shares > 0) {
      onSellClick(asset, shares);
      setSharesToSell(''); // Clear the input after initiating the sell
    } else {
      alert('Please enter a valid number of shares.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="number"
        placeholder="Shares to Sell"
        value={sharesToSell}
        onChange={(e) => setSharesToSell(e.target.value)}
        className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Sell
      </button>
    </form>
  );
};

// ConfirmationModal component
interface ConfirmationModalProps {
  asset: Asset;
  shares: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ asset, shares, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative p-5 border w-96 shadow-lg rounded bg-white">
        <h3 className="text-lg font-semibold mb-4">Confirm Sell Order</h3>
        <p>Are you sure you want to sell {shares} shares of {asset.companyName} ({asset.ticker})?</p>
        <p>Estimated Value: ${(asset.currentPrice * shares).toFixed(0)}</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onConfirm}
          >
            Confirm Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PortfolioPage() {
    const handlePortfolioUpdate = (assets: Asset[], cashBalance: number) => {
        // Handle portfolio updates
    };

    return (
        <PortfolioView 
            initialCashBalance={10000} 
            onPortfolioUpdate={handlePortfolioUpdate}
        />
    );
}