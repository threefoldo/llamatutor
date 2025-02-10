"use client";

import React, { useState } from 'react';

interface AmortizationScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const LoanAmortizationPage = () => {
  const [loanAmount, setLoanAmount] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [loanTerm, setLoanTerm] = useState<number | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationScheduleItem[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);

  const calculateAmortization = () => {
    if (!loanAmount || !interestRate || !loanTerm) {
      setInputError("Please fill in all fields.");
      return;
    }

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setInputError("Loan amount, interest rate, and loan term must be positive values.");
      return;
    }

    setInputError(null);

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    let currentBalance = loanAmount;
    const schedule: AmortizationScheduleItem[] = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = currentBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      currentBalance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: currentBalance > 0 ? currentBalance : 0, // Prevent negative balance
      });
      if (currentBalance <= 0) break; //Prevent continuing if the loan is paid off.
    }

    setAmortizationSchedule(schedule);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return (value).toFixed(3) + "%";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Loan Amortization Calculator</h1>

      <div className="mb-4">
        <label htmlFor="loanAmount" className="block text-gray-700 text-sm font-bold mb-2">
          Loan Amount:
        </label>
        <input
          type="number"
          id="loanAmount"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter loan amount"
          value={loanAmount === null ? '' : loanAmount.toString()}
          onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="interestRate" className="block text-gray-700 text-sm font-bold mb-2">
          Interest Rate (%):
        </label>
        <input
          type="number"
          id="interestRate"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter interest rate"
          value={interestRate === null ? '' : interestRate.toString()}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="loanTerm" className="block text-gray-700 text-sm font-bold mb-2">
          Loan Term (Months):
        </label>
        <input
          type="number"
          id="loanTerm"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter loan term in months"
          value={loanTerm === null ? '' : loanTerm.toString()}
          onChange={(e) => setLoanTerm(parseFloat(e.target.value))}
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateAmortization}
      >
        Calculate
      </button>

      {inputError && (
        <div className="text-red-500 mt-2">{inputError}</div>
      )}

      {amortizationSchedule.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Month</th>
                <th className="py-2 px-4 border-b text-left">Payment</th>
                <th className="py-2 px-4 border-b text-left">Principal</th>
                <th className="py-2 px-4 border-b text-left">Interest</th>
                <th className="py-2 px-4 border-b text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationSchedule.map((item) => (
                <tr key={item.month}>
                  <td className="py-2 px-4 border-b">{item.month}</td>
                  <td className="py-2 px-4 border-b">{formatCurrency(item.payment)}</td>
                  <td className="py-2 px-4 border-b">{formatCurrency(item.principal)}</td>
                  <td className="py-2 px-4 border-b">{formatCurrency(item.interest)}</td>
                  <td className="py-2 px-4 border-b">{formatCurrency(item.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanAmortizationPage;
