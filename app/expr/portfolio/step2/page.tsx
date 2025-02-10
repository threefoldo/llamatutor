'use client';

import React, { useState } from 'react';

interface Asset {
  Ticker: string;
  'Company Name': string;
  Sector: string;
  'Risk Level': string;
  '1-Year Return': string;
  '3-Year Return': string;
  '5-Year Return': string;
  Volatility: string;
  'Dividend Yield': string;
  Description: string;
}

const assetsData: Asset[] = [
  {
    Ticker: 'TECH',
    'Company Name': 'TechCo Innovations',
    Sector: 'Technology',
    'Risk Level': 'High',
    '1-Year Return': '25%',
    '3-Year Return': '18%',
    '5-Year Return': '22%',
    Volatility: 'High',
    'Dividend Yield': '0.5%',
    Description: 'A fast-growing technology company specializing in cloud computing and AI. High potential for growth, but also high volatility.',
  },
  {
    Ticker: 'HLTH',
    'Company Name': 'HealthWell Pharmaceuticals',
    Sector: 'Healthcare',
    'Risk Level': 'Medium',
    '1-Year Return': '8%',
    '3-Year Return': '10%',
    '5-Year Return': '12%',
    Volatility: 'Medium',
    'Dividend Yield': '2.0%',
    Description: 'A stable pharmaceutical company with a strong pipeline of new drugs. Moderate growth and relatively consistent performance.',
  },
  {
    Ticker: 'ENGY',
    'Company Name': 'EnerGreen Renewables',
    Sector: 'Energy',
    'Risk Level': 'Medium-High',
    '1-Year Return': '15%',
    '3-Year Return': '12%',
    '5-Year Return': '8%',
    Volatility: 'Medium-High',
    'Dividend Yield': '1.5%',
    Description: 'A renewable energy company focusing on solar and wind power. Growth potential tied to government regulations and adoption of green energy.',
  },
  {
    Ticker: 'FINA',
    'Company Name': 'FinSecure Banking Corp',
    Sector: 'Financials',
    'Risk Level': 'Medium',
    '1-Year Return': '5%',
    '3-Year Return': '7%',
    '5-Year Return': '9%',
    Volatility: 'Medium',
    'Dividend Yield': '3.5%',
    Description: 'A large, established bank offering a range of financial services. Generally stable, but sensitive to interest rate changes.',
  },
  {
    Ticker: 'CONS',
    'Company Name': 'ConGoods Consumer Staples',
    Sector: 'Consumer Staples',
    'Risk Level': 'Low',
    '1-Year Return': '3%',
    '3-Year Return': '5%',
    '5-Year Return': '6%',
    Volatility: 'Low',
    'Dividend Yield': '4.0%',
    Description: 'A manufacturer of essential consumer goods (food, household products). Consistent demand, but limited growth potential.',
  },
  {
    Ticker: 'INDU',
    'Company Name': 'InduMach Manufacturing',
    Sector: 'Industrials',
    'Risk Level': 'Medium',
    '1-Year Return': '7%',
    '3-Year Return': '9%',
    '5-Year Return': '11%',
    Volatility: 'Medium',
    'Dividend Yield': '2.8%',
    Description: 'A manufacturer of heavy machinery and industrial equipment. Performance tied to economic cycles and infrastructure spending.',
  },
    {
    Ticker: 'REAL',
    'Company Name': 'RealEstate Invest',
    Sector: 'Real Estate',
    'Risk Level': 'Medium',
    '1-Year Return': '4%',
    '3-Year Return': '5%',
    '5-Year Return': '8%',
    Volatility: 'Low-Medium',
    'Dividend Yield': '5.0%',
    Description: 'Real estate investment trust that focus on income generation.',
  },
    {
    Ticker: 'UTIL',
    'Company Name': 'UtilPower Corporation',
    Sector: 'Utilities',
    'Risk Level': 'Low',
    '1-Year Return': '2%',
    '3-Year Return': '4%',
    '5-Year Return': '5%',
    Volatility: 'Low',
    'Dividend Yield': '4.5%',
    Description: 'A regulated utility company providing electricity and gas. Stable, but low growth potential.',
  },
];

interface BuySellFormProps {
  ticker: string;
  onBuy: (ticker: string, quantity: number) => void;
}

const BuySellForm: React.FC<BuySellFormProps> = ({ ticker, onBuy }) => {
  const [quantity, setQuantity] = useState<number | string>(''); // Allow string for easier input handling

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic validation to ensure only numbers are entered
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
        setQuantity(value);
    }
  };

  const handleBuyClick = () => {
    if (quantity === '') return; // Don't allow empty values
    const numQuantity = Number(quantity); // Convert to a number

    if (isNaN(numQuantity) || numQuantity <= 0) {
      alert("Please enter a valid positive number of shares."); // Example validation error
      return;
    }

    onBuy(ticker, numQuantity);
    setQuantity(''); // Reset the input after buying
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        placeholder="Shares"
        className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm"
      />
      <button
        onClick={handleBuyClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Buy
      </button>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
  quantity: number;
  onConfirm: (ticker: string, quantity: number) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  ticker,
  quantity,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-md p-6 shadow-xl">
        <p className="mb-4">
          Are you sure you want to buy {quantity} shares of {ticker}?
        </p>
        <div className="buttons space-x-4">
          <button
            onClick={() => {
              onConfirm(ticker, quantity);
              onClose();
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AssetTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  const openModal = (ticker: string, quantity: number) => {
    setSelectedTicker(ticker);
    setSelectedQuantity(quantity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBuy = (ticker: string, quantity: number) => {
    // Placeholder: Open confirmation modal with the ticker and quantity
    openModal(ticker, quantity);
  };

  const confirmBuy = (ticker: string, quantity: number) => {
    // Placeholder: Implement the actual buy logic here
    console.log(`Buying ${quantity} shares of ${ticker}`);
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticker
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sector
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              1-Year Return
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              3-Year Return
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              5-Year Return
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Volatility
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dividend Yield
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buy
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assetsData.map((asset) => (
            <tr key={asset.Ticker} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset.Ticker}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset['Company Name']}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset.Sector}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset['Risk Level']}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset['1-Year Return']}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset['3-Year Return']}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset['5-Year Return']}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset.Volatility}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset['Dividend Yield']}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {asset.Description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <BuySellForm ticker={asset.Ticker} onBuy={handleBuy} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        ticker={selectedTicker}
        quantity={selectedQuantity}
        onConfirm={confirmBuy}
      />
    </div>
  );
};

const AssetSelectionScreen: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Asset Selection</h1>
      <AssetTable />
    </div>
  );
};

export default AssetSelectionScreen;