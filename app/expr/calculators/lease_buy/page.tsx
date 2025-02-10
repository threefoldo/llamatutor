"use client";

import React, { useState } from 'react';

interface LeaseVsBuyFormState {
  carPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  leaseTerm: number;
  monthlyLeasePayment: number;
  residualValue: number;
  insuranceCosts: number;
  maintenanceCosts: number;
  fuelCosts: number;
}

const initialFormState: LeaseVsBuyFormState = {
  carPrice: 30000,
  downPayment: 5000,
  interestRate: 0.05,
  loanTerm: 60,
  leaseTerm: 36,
  monthlyLeasePayment: 400,
  residualValue: 20000,
  insuranceCosts: 1200,
  maintenanceCosts: 500,
  fuelCosts: 2000,
};

const LeaseVsBuyPage = () => {
  const [formState, setFormState] = useState<LeaseVsBuyFormState>(initialFormState);
  const [totalCostLease, setTotalCostLease] = useState<number | null>(null);
  const [totalCostBuy, setTotalCostBuy] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: parseFloat(value),
    }));
  };

  const calculateTotalCostLease = () => {
    const { leaseTerm, monthlyLeasePayment, downPayment, insuranceCosts, maintenanceCosts, fuelCosts } = formState;
    const totalLeaseCost = (monthlyLeasePayment * leaseTerm) + downPayment + insuranceCosts + maintenanceCosts + fuelCosts;
    setTotalCostLease(totalLeaseCost);
  };

  const calculateTotalCostBuy = () => {
    const { carPrice, downPayment, interestRate, loanTerm, insuranceCosts, maintenanceCosts, fuelCosts } = formState;

    const loanAmount = carPrice - downPayment;
    const monthlyInterestRate = interestRate / 12;
    const monthlyPayment =
      (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));

    const totalLoanCost = monthlyPayment * loanTerm;
    const totalBuyCost = totalLoanCost + downPayment + insuranceCosts + maintenanceCosts + fuelCosts;
    setTotalCostBuy(totalBuyCost);
  };

  const handleCalculate = () => {
    calculateTotalCostLease();
    calculateTotalCostBuy();
  };

  const Input = ({ label, name, value, unit }: { label: string; name: string; value: number; unit?: string }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {unit && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">{unit}</div>}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lease vs. Buy Comparison</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input label="Car Price" name="carPrice" value={formState.carPrice} unit="$" />
          <Input label="Down Payment" name="downPayment" value={formState.downPayment} unit="$" />
          <Input label="Interest Rate" name="interestRate" value={formState.interestRate} unit="%" />
          <Input label="Loan Term" name="loanTerm" value={formState.loanTerm} unit="months" />
          <Input label="Insurance Costs" name="insuranceCosts" value={formState.insuranceCosts} unit="$" />
          <Input label="Maintenance Costs" name="maintenanceCosts" value={formState.maintenanceCosts} unit="$" />
          <Input label="Fuel Costs" name="fuelCosts" value={formState.fuelCosts} unit="$" />
        </div>
        <div>
          <Input label="Lease Term" name="leaseTerm" value={formState.leaseTerm} unit="months" />
          <Input label="Monthly Lease Payment" name="monthlyLeasePayment" value={formState.monthlyLeasePayment} unit="$" />
          <Input label="Residual Value" name="residualValue" value={formState.residualValue} unit="$" />
          <button
            onClick={handleCalculate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Calculate
          </button>
        </div>
      </div>

      <div className="mt-8">
        {totalCostLease !== null && totalCostBuy !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Total Cost of Leasing:</h2>
              <p className="text-lg">${totalCostLease.toFixed(2)}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Total Cost of Buying:</h2>
              <p className="text-lg">${totalCostBuy.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaseVsBuyPage;