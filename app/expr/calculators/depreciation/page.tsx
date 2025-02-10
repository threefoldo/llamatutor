// app/depreciation-calculator/page.tsx
'use client';

import React, { useState } from 'react';

interface DepreciationCalculatorProps {
}

const DepreciationCalculator: React.FC<DepreciationCalculatorProps> = () => {
  const [carPrice, setCarPrice] = useState<number | null>(null);
  const [depreciationRate, setDepreciationRate] = useState<number | null>(null);
  const [years, setYears] = useState<number | null>(null);
  const [depreciatedValue, setDepreciatedValue] = useState<number | null>(null);

  const calculateDepreciation = () => {
    if (carPrice === null || depreciationRate === null || years === null) {
      alert('Please enter all the values');
      return;
    }

    if (carPrice < 0) {
      alert('Car price must be positive');
      return;
    }
    if (depreciationRate < 0 || depreciationRate > 1) {
      alert('Depreciation rate must be between 0 and 1');
      return;
    }
    if (years < 0) {
      alert('Years must be positive');
      return;
    }

    let currentValue = carPrice;
    for (let i = 0; i < years; i++) {
      currentValue = currentValue * (1 - depreciationRate);
    }
    setDepreciatedValue(currentValue);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Depreciation Calculator</h1>

      <div className="mb-4">
        <label htmlFor="carPrice" className="block text-gray-700 text-sm font-bold mb-2">
          Car Price:
        </label>
        <input
          type="number"
          id="carPrice"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter car price"
          value={carPrice === null ? '' : carPrice.toString()}
          onChange={(e) => setCarPrice(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="depreciationRate" className="block text-gray-700 text-sm font-bold mb-2">
          Depreciation Rate (per year):
        </label>
        <input
          type="number"
          id="depreciationRate"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter depreciation rate (e.g., 0.10 for 10%)"
          value={depreciationRate === null ? '' : depreciationRate.toString()}
          onChange={(e) => setDepreciationRate(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="years" className="block text-gray-700 text-sm font-bold mb-2">
          Number of Years:
        </label>
        <input
          type="number"
          id="years"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter number of years"
          value={years === null ? '' : years.toString()}
          onChange={(e) => setYears(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={calculateDepreciation}
      >
        Calculate Depreciation
      </button>

      {depreciatedValue !== null && (
        <div className="mt-4">
          <p className="text-lg">
            Car Value After {years} Years:
            <span className="font-bold">
              {depreciatedValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DepreciationCalculator;
