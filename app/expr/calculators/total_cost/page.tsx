// app/total-cost-calculator/page.tsx
"use client";

import React, { useState } from 'react';

interface TotalCostCalculatorProps {
  // No props needed for this client-side page, but added for future flexibility
}

const TotalCostCalculator: React.FC<TotalCostCalculatorProps> = () => {
  const [carPrice, setCarPrice] = useState<number | undefined>(undefined);
  const [downPayment, setDownPayment] = useState<number | undefined>(undefined);
  const [interestRate, setInterestRate] = useState<number | undefined>(undefined);
  const [loanTerm, setLoanTerm] = useState<number | undefined>(undefined); // in months
  const [insuranceCosts, setInsuranceCosts] = useState<number | undefined>(undefined); // annual
  const [maintenanceCosts, setMaintenanceCosts] = useState<number | undefined>(undefined); // annual
  const [fuelCosts, setFuelCosts] = useState<number | undefined>(undefined); // annual
  const [depreciationRate, setDepreciationRate] = useState<number | undefined>(undefined); // annual
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);


  const calculateTotalCost = () => {
    // Input validation
    if (
      carPrice === undefined ||
      downPayment === undefined ||
      interestRate === undefined ||
      loanTerm === undefined ||
      insuranceCosts === undefined ||
      maintenanceCosts === undefined ||
      fuelCosts === undefined ||
      depreciationRate === undefined
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (
      carPrice < 0 ||
      downPayment < 0 ||
      interestRate < 0 ||
      loanTerm < 0 ||
      insuranceCosts < 0 ||
      maintenanceCosts < 0 ||
      fuelCosts < 0 ||
      depreciationRate < 0
    ) {
      setError('Please enter non-negative values.');
      return;
    }

    if (interestRate > 1) {
      setError("Interest rate must be between 0 and 1 (e.g., 0.05 for 5%).");
      return;
    }

    setError(null); // Clear previous errors

    const loanAmount = carPrice - downPayment;
    const monthlyInterestRate = interestRate / 12;

    // Monthly payment calculation (standard formula)
    let monthlyPayment = 0;
    if (monthlyInterestRate > 0) {  //Avoid division by zero
        monthlyPayment =
          (loanAmount * monthlyInterestRate) /
          (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));
    } else {
        monthlyPayment = loanAmount / loanTerm;
    }


    const numberOfYears = loanTerm / 12;
    const totalInsuranceCosts = insuranceCosts * numberOfYears;
    const totalMaintenanceCosts = maintenanceCosts * numberOfYears;
    const totalFuelCosts = fuelCosts * numberOfYears;
    const totalLoanPayments = monthlyPayment * loanTerm;
    const depreciation = carPrice * (1 - Math.pow(1 - depreciationRate, numberOfYears)); // Total depreciation over the loan term

    const calculatedTotalCost = totalLoanPayments + totalInsuranceCosts + totalMaintenanceCosts + totalFuelCosts + downPayment - depreciation ; // Subtract depreciation from total cost to see the true cost of ownership
    setTotalCost(calculatedTotalCost);
  };


  const InputField = ({ label, id, type, value, onChange }: { label: string, id: string, type: string, value: number | undefined, onChange: (newValue: number | undefined) => void }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-5"
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value === undefined ? '' : value.toString()}
          onChange={(e) => {
            const parsedValue = e.target.value === '' ? undefined : parseFloat(e.target.value);
            onChange(parsedValue);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Total Cost of Car Ownership Calculator</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Car Price"
          id="carPrice"
          type="number"
          value={carPrice}
          onChange={setCarPrice}
        />
        <InputField
          label="Down Payment"
          id="downPayment"
          type="number"
          value={downPayment}
          onChange={setDownPayment}
        />
        <InputField
          label="Interest Rate (e.g., 0.05)"
          id="interestRate"
          type="number"
          value={interestRate}
          onChange={setInterestRate}
        />
        <InputField
          label="Loan Term (months)"
          id="loanTerm"
          type="number"
          value={loanTerm}
          onChange={setLoanTerm}
        />
        <InputField
          label="Annual Insurance Costs"
          id="insuranceCosts"
          type="number"
          value={insuranceCosts}
          onChange={setInsuranceCosts}
        />
        <InputField
          label="Annual Maintenance Costs"
          id="maintenanceCosts"
          type="number"
          value={maintenanceCosts}
          onChange={setMaintenanceCosts}
        />
        <InputField
          label="Annual Fuel Costs"
          id="fuelCosts"
          type="number"
          value={fuelCosts}
          onChange={setFuelCosts}
        />
        <InputField
          label="Annual Depreciation Rate (e.g., 0.10)"
          id="depreciationRate"
          type="number"
          value={depreciationRate}
          onChange={setDepreciationRate}
        />
      </div>

      <button
        onClick={calculateTotalCost}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Calculate Total Cost
      </button>

      {totalCost !== null && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Total Cost of Ownership:</h2>
          <p className="text-xl">${totalCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default TotalCostCalculator;
