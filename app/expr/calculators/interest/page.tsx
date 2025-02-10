"use client";

import React, { useState } from 'react';

interface InterestCalculatorProps {
    // Add any props that the component might receive from its parent. Currently none.
}

const InterestCalculator: React.FC<InterestCalculatorProps> = () => {
    const [loanAmount, setLoanAmount] = useState<number | null>(null);
    const [interestRate, setInterestRate] = useState<number | null>(null);
    const [loanTerm, setLoanTerm] = useState<number | null>(null);
    const [totalInterest, setTotalInterest] = useState<number | null>(null);

    const handleLoanAmountChange = (value: string) => {
        const parsedValue = parseFloat(value);
        setLoanAmount(isNaN(parsedValue) ? null : parsedValue);
    };

    const handleInterestRateChange = (value: string) => {
        const parsedValue = parseFloat(value);
        setInterestRate(isNaN(parsedValue) ? null : parsedValue);
    };

    const handleLoanTermChange = (value: string) => {
        const parsedValue = parseFloat(value);
        setLoanTerm(isNaN(parsedValue) ? null : parsedValue);
    };

    const calculateInterest = () => {
        if (loanAmount === null || interestRate === null || loanTerm === null) {
            alert("Please enter valid values for all fields.");
            return;
        }

        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm; // Assuming loanTerm is in months
        const monthlyPayment =
            (loanAmount * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

        const totalInterestPaid = (monthlyPayment * numberOfPayments) - loanAmount;

        setTotalInterest(totalInterestPaid);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Calculate Total Interest</h1>

            <div className="mb-4">
                <label htmlFor="loanAmount" className="block text-gray-700 text-sm font-bold mb-2">
                    Loan Amount:
                </label>
                <input
                    type="number"
                    id="loanAmount"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter loan amount"
                    onChange={(e) => handleLoanAmountChange(e.target.value)}
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
                    onChange={(e) => handleInterestRateChange(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="loanTerm" className="block text-gray-700 text-sm font-bold mb-2">
                    Loan Term (months):
                </label>
                <input
                    type="number"
                    id="loanTerm"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter loan term in months"
                    onChange={(e) => handleLoanTermChange(e.target.value)}
                />
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={calculateInterest}
            >
                Calculate
            </button>

            {totalInterest !== null && (
                <div className="mt-4">
                    <p className="text-lg font-bold">
                        Total Interest Paid: ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default InterestCalculator;