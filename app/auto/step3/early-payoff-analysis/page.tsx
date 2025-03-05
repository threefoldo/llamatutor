"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

const EarlyPayoffAnalysis: React.FC = () => {
  // State for loan details
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [lumpSumPayment, setLumpSumPayment] = useState<number>(0);
  const [lumpSumMonth, setLumpSumMonth] = useState<number>(12);
  
  // State for calculations
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [regularAmortization, setRegularAmortization] = useState<AmortizationEntry[]>([]);
  const [earlyPayoffAmortization, setEarlyPayoffAmortization] = useState<AmortizationEntry[]>([]);
  const [totalInterestRegular, setTotalInterestRegular] = useState<number>(0);
  const [totalInterestEarly, setTotalInterestEarly] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  
  // View states
  const [showAmortizationTable, setShowAmortizationTable] = useState<boolean>(false);

  // Effect for initial calculation
  useEffect(() => {
    calculateMonthlyPayment();
    calculateRegularAmortization();
  }, [loanAmount, interestRate, loanTerm]);

  // Effect for early payoff recalculation
  useEffect(() => {
    if (regularAmortization.length > 0) {
      calculateEarlyPayoffAmortization();
    }
  }, [regularAmortization, extraPayment, lumpSumPayment, lumpSumMonth]);

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    setMonthlyPayment(payment);
    return payment;
  };

  const calculateRegularAmortization = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = calculateMonthlyPayment();
    let balance = loanAmount;
    const schedule: AmortizationEntry[] = [];
    let totalInterest = 0;

    for (let month = 1; month <= loanTerm && balance > 0; month++) {
      const interestPayment = balance * monthlyRate;
      totalInterest += interestPayment;
      const principalPayment = payment - interestPayment;
      balance = balance - principalPayment;
      
      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance > 0 ? balance : 0
      });
    }

    setRegularAmortization(schedule);
    setTotalInterestRegular(totalInterest);
  };

  const calculateEarlyPayoffAmortization = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = monthlyPayment + extraPayment;
    let balance = loanAmount;
    const schedule: AmortizationEntry[] = [];
    let totalInterest = 0;

    for (let month = 1; month <= loanTerm && balance > 0; month++) {
      // Apply lump sum payment at the specified month
      if (month === lumpSumMonth) {
        balance -= lumpSumPayment;
        if (balance < 0) balance = 0;
      }

      const interestPayment = balance * monthlyRate;
      totalInterest += interestPayment;
      let principalPayment = payment - interestPayment;
      
      // Adjust final payment if needed
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      
      balance = balance - principalPayment;

      schedule.push({
        month,
        payment: principalPayment + interestPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance > 0 ? balance : 0
      });

      if (balance <= 0) break;
    }

    setEarlyPayoffAmortization(schedule);
    setTotalInterestEarly(totalInterest);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Generate chart data for regular vs early payoff
  const getChartData = () => {
    const regularMonths = regularAmortization.map(entry => entry.month);
    const earlyMonths = earlyPayoffAmortization.map(entry => entry.month);
    
    // Create data for the max of both arrays to ensure proper scaling
    const maxMonths = Math.max(regularMonths.length, earlyMonths.length);
    const labels = Array.from({ length: maxMonths }, (_, i) => i + 1);
    
    const regularBalances = labels.map(month => {
      const entry = regularAmortization.find(e => e.month === month);
      return entry ? entry.remainingBalance : 0;
    });
    
    const earlyBalances = labels.map(month => {
      const entry = earlyPayoffAmortization.find(e => e.month === month);
      return entry ? entry.remainingBalance : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Regular Payment Schedule',
          data: regularBalances,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Early Payoff Schedule',
          data: earlyBalances,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getPrincipalInterestData = (isEarly: boolean) => {
    const amortization = isEarly ? earlyPayoffAmortization : regularAmortization;
    const totalInterest = amortization.reduce((sum, entry) => sum + entry.interest, 0);
    const totalPrincipal = loanAmount;

    return {
      labels: ['Principal', 'Interest'],
      datasets: [
        {
          data: [totalPrincipal, totalInterest],
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month === selectedMonth ? null : month);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Early Payoff Analysis</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 25000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 4.5"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (months)</label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 60"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Early Payoff Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extra Monthly Payment</label>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lump Sum Payment</label>
            <input
              type="number"
              value={lumpSumPayment}
              onChange={(e) => setLumpSumPayment(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apply Lump Sum at Month</label>
            <input
              type="number"
              value={lumpSumMonth}
              onChange={(e) => setLumpSumMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 12"
              min="1"
              max={loanTerm}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Loan Payoff Timeline</h2>
          <div className="h-64">
            <Bar 
              data={getChartData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Remaining Balance',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Month',
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed.y !== null) {
                          label += formatCurrency(context.parsed.y);
                        }
                        return label;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payoff Comparison</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <h3 className="text-md font-medium mb-2">Regular Payment Schedule</h3>
              <p className="text-sm mb-1">Monthly Payment: <span className="font-semibold">{formatCurrency(monthlyPayment)}</span></p>
              <p className="text-sm mb-1">Total Payments: <span className="font-semibold">{formatCurrency(monthlyPayment * loanTerm)}</span></p>
              <p className="text-sm mb-1">Total Interest: <span className="font-semibold">{formatCurrency(totalInterestRegular)}</span></p>
              <p className="text-sm">Months to Payoff: <span className="font-semibold">{regularAmortization.length}</span></p>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="text-md font-medium mb-2">Early Payoff Schedule</h3>
              <p className="text-sm mb-1">Monthly Payment: <span className="font-semibold">{formatCurrency(monthlyPayment + extraPayment)}</span></p>
              <p className="text-sm mb-1">Total Payments: <span className="font-semibold">{formatCurrency(earlyPayoffAmortization.reduce((sum, entry) => sum + entry.payment, 0) + lumpSumPayment)}</span></p>
              <p className="text-sm mb-1">Total Interest: <span className="font-semibold">{formatCurrency(totalInterestEarly)}</span></p>
              <p className="text-sm">Months to Payoff: <span className="font-semibold">{earlyPayoffAmortization.length}</span></p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Interest Savings</h3>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-md">
                Interest Savings: <span className="font-semibold text-green-600">{formatCurrency(totalInterestRegular - totalInterestEarly)}</span>
              </p>
              <p className="text-md">
                Time Savings: <span className="font-semibold text-green-600">{regularAmortization.length - earlyPayoffAmortization.length} months</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Amortization Schedule</h2>
          <button
            onClick={() => setShowAmortizationTable(!showAmortizationTable)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            {showAmortizationTable ? 'Hide Table' : 'Show Table'}
          </button>
        </div>
        
        {showAmortizationTable && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Month</th>
                  <th className="border border-gray-300 px-4 py-2">Regular Payment</th>
                  <th className="border border-gray-300 px-4 py-2">Regular Balance</th>
                  <th className="border border-gray-300 px-4 py-2">Early Payment</th>
                  <th className="border border-gray-300 px-4 py-2">Early Balance</th>
                  <th className="border border-gray-300 px-4 py-2">Difference</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.max(regularAmortization.length, earlyPayoffAmortization.length) }, (_, i) => i).map((index) => {
                  const regularEntry = regularAmortization[index] || { month: index + 1, payment: 0, remainingBalance: 0 };
                  const earlyEntry = earlyPayoffAmortization[index] || { month: index + 1, payment: 0, remainingBalance: 0 };
                  const isLumpSumMonth = index + 1 === lumpSumMonth;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`${isLumpSumMonth ? 'bg-yellow-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')} 
                                ${selectedMonth === index + 1 ? 'bg-blue-100' : ''}`}
                      onClick={() => handleMonthClick(index + 1)}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {regularEntry.payment ? formatCurrency(regularEntry.payment) : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {regularEntry.remainingBalance !== undefined ? formatCurrency(regularEntry.remainingBalance) : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {earlyEntry.payment ? formatCurrency(earlyEntry.payment) : '-'}
                        {isLumpSumMonth && lumpSumPayment > 0 && (
                          <span className="ml-2 text-xs bg-yellow-200 px-2 py-1 rounded">
                            +{formatCurrency(lumpSumPayment)} lump sum
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {earlyEntry.remainingBalance !== undefined ? formatCurrency(earlyEntry.remainingBalance) : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {regularEntry.remainingBalance !== undefined && earlyEntry.remainingBalance !== undefined ? (
                          <span className={regularEntry.remainingBalance - earlyEntry.remainingBalance > 0 ? 'text-green-600' : ''}>
                            {formatCurrency(regularEntry.remainingBalance - earlyEntry.remainingBalance)}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {selectedMonth && (
          <div className="mt-4 p-4 border rounded-md bg-blue-50">
            <h3 className="text-lg font-medium mb-2">Month {selectedMonth} Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-md font-medium mb-1">Regular Payment</h4>
                {regularAmortization[selectedMonth - 1] && (
                  <div>
                    <p className="text-sm">Principal: {formatCurrency(regularAmortization[selectedMonth - 1].principal)}</p>
                    <p className="text-sm">Interest: {formatCurrency(regularAmortization[selectedMonth - 1].interest)}</p>
                    <p className="text-sm">Remaining Balance: {formatCurrency(regularAmortization[selectedMonth - 1].remainingBalance)}</p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-md font-medium mb-1">Early Payoff</h4>
                {earlyPayoffAmortization[selectedMonth - 1] && (
                  <div>
                    <p className="text-sm">Principal: {formatCurrency(earlyPayoffAmortization[selectedMonth - 1].principal)}</p>
                    <p className="text-sm">Interest: {formatCurrency(earlyPayoffAmortization[selectedMonth - 1].interest)}</p>
                    <p className="text-sm">Remaining Balance: {formatCurrency(earlyPayoffAmortization[selectedMonth - 1].remainingBalance)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Tips for Early Loan Payoff</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Making extra payments toward principal can significantly reduce the total interest paid.</li>
          <li>Even small additional monthly payments can lead to substantial savings over the life of a loan.</li>
          <li>A lump sum payment early in the loan term will save more interest than the same amount applied later.</li>
          <li>Before making extra payments, check if your loan has prepayment penalties.</li>
          <li>Consider the opportunity cost - could the money for extra payments earn a higher return elsewhere?</li>
        </ul>
      </div>
    </div>
  );
};

export default EarlyPayoffAnalysis;