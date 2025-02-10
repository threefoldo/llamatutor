// app/dealer/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Define TypeScript interfaces
interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: string;
}

interface MarketData {
  averageCarPrice: number;
  competitorPricing: string;
}

interface Scenario {
  id: number;
  description: string;
  options: string[];
}

const MOCK_CARS: Car[] = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2020, price: 22000, condition: 'Good' },
  { id: 2, make: 'Honda', model: 'Civic', year: 2021, price: 20000, condition: 'Excellent' },
  { id: 3, make: 'Ford', model: 'F-150', year: 2018, price: 28000, condition: 'Fair' },
];

const MOCK_MARKET_DATA: MarketData = {
  averageCarPrice: 25000,
  competitorPricing: 'See nearby dealer websites',
};

const MOCK_SCENARIO: Scenario = {
  id: 1,
  description: "A customer is interested in trading in their old car. What initial offer do you make?",
  options: ["Low offer to maximize profit", "Fair market value offer", "Generous offer to close the deal quickly"],
};

const AiAssistantResponse = () => {
    alert("AI Assistant Says: I am here to help you manage your dealership finances. Please ask me how I can help!");
}

const DealerDashboard = () => {
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [marketData, setMarketData] = useState<MarketData>(MOCK_MARKET_DATA);

  useEffect(() => {
    // Simulate real-time market updates (replace with actual API calls)
    const intervalId = setInterval(() => {
      setMarketData({
        averageCarPrice: MOCK_MARKET_DATA.averageCarPrice + Math.floor(Math.random() * 1000) - 500,
        competitorPricing: 'Check competitor websites',
      });
    }, 10000);

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  const handlePriceChange = (carId: number, newPrice: number) => {
    setCars(
      cars.map((car) =>
        car.id === carId ? { ...car, price: newPrice } : car
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dealer Dashboard</h1>

      {/* Car Inventory */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Car Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="border rounded p-2">
              <p><strong>{car.make} {car.model}</strong></p>
              <p>Year: {car.year}</p>
              <p>Condition: {car.condition}</p>
              <p>Price: ${car.price}</p>
              <div className='flex space-x-2'>
                  <input
                    type="number"
                    value={car.price}
                    onChange={(e) =>
                      handlePriceChange(car.id, parseFloat(e.target.value))
                    }
                    className="w-24 border rounded p-1 text-sm"
                  />
                  <button
                    onClick={() =>
                        handlePriceChange(car.id, car.price)
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm"
                  >
                    Update Price
                  </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Car Price Adjustment (Example) */}
      {/* Market Updates */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Market Updates</h2>
        <p>Average Car Price: ${marketData.averageCarPrice}</p>
        <p>Competitor Pricing: {marketData.competitorPricing}</p>
      </div>

      {/* Calculator Links */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Calculators</h2>
        <div className="flex space-x-4">
          <Link href="/calculator/loan-amortization" className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">Loan Amortization</Link>
          <Link href="/calculator/interest" className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">Interest Calculation</Link>
          <Link href="/calculator/total-cost" className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">Total Cost of Ownership</Link>
          <Link href="/calculator/depreciation" className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">Depreciation</Link>
          <Link href="/calculator/lease-vs-buy" className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded">Lease vs. Buy</Link>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">AI Assistant</h2>
        <button className="bg-purple-500 hover:bg-purple-700 text-white py-1 px-2 rounded" onClick={AiAssistantResponse}>Ask AI Assistant</button>
      </div>

      {/* Decision-Making Scenario */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Decision Scenario</h2>
        <p>{MOCK_SCENARIO.description}</p>
        <div className="flex space-x-4">
          {MOCK_SCENARIO.options.map((option, index) => (
            <button
              key={index}
              className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded"
              onClick={() => alert(`You chose: ${option}`)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;