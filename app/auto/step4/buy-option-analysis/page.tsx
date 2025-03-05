"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface VehicleInfo {
  name: string;
  msrp: number;
  initialDepreciation: number; // First year percentage
  annualDepreciation: number;  // Subsequent years percentage
  image: string;
}

interface ExpenseItem {
  label: string;
  monthly: number;
  annual: number;
  description: string;
}

const BuyOptionAnalysis: React.FC = () => {
  // Vehicle options
  const vehicles: VehicleInfo[] = [
    {
      name: "Tesla Model 3",
      msrp: 40990,
      initialDepreciation: 0.20,  // 20% in first year
      annualDepreciation: 0.10,   // 10% per year after
      image: "/imgs/tesla_model3.jpg"
    },
    {
      name: "BMW 3 Series",
      msrp: 43300,
      initialDepreciation: 0.25,  // 25% in first year
      annualDepreciation: 0.15,   // 15% per year after
      image: "/imgs/bmw_3_series.jpg"
    },
    {
      name: "Honda Civic",
      msrp: 22550,
      initialDepreciation: 0.15,  // 15% in first year
      annualDepreciation: 0.08,   // 8% per year after
      image: "/imgs/honda_civic.jpg"
    }
  ];

  // State variables
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleInfo>(vehicles[0]);
  const [purchasePrice, setPurchasePrice] = useState<number>(vehicles[0].msrp);
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [ownershipPeriod, setOwnershipPeriod] = useState<number>(5);
  const [userResaleValue, setUserResaleValue] = useState<number | null>(null);
  const [showUserInput, setShowUserInput] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'value' | 'cost'>('value');
  
  // Derived values
  const loanAmount = purchasePrice - downPayment;
  
  // Calculate monthly payment
  const getMonthlyPayment = (): number => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return payment;
  };
  
  // Calculate total interest
  const getTotalInterest = (): number => {
    const monthlyPayment = getMonthlyPayment();
    return (monthlyPayment * loanTerm) - loanAmount;
  };
  
  // Calculate ownership expenses
  const getExpenses = (): ExpenseItem[] => {
    return [
      {
        label: "Insurance",
        monthly: selectedVehicle.msrp * 0.0008, // Rough estimate
        annual: selectedVehicle.msrp * 0.0008 * 12,
        description: "Comprehensive and collision coverage"
      },
      {
        label: "Maintenance",
        monthly: selectedVehicle.msrp * 0.0005,
        annual: selectedVehicle.msrp * 0.0005 * 12,
        description: "Regular maintenance including oil changes, tire rotations, etc."
      },
      {
        label: "Registration & Taxes",
        monthly: selectedVehicle.msrp * 0.0004,
        annual: selectedVehicle.msrp * 0.0004 * 12,
        description: "Annual vehicle registration fees and property taxes"
      },
      {
        label: "Fuel/Charging",
        monthly: selectedVehicle.name.includes("Tesla") ? 60 : 120, // Estimate EV vs gas
        annual: selectedVehicle.name.includes("Tesla") ? 60 * 12 : 120 * 12,
        description: selectedVehicle.name.includes("Tesla") ? "Estimated electricity costs" : "Estimated gasoline costs"
      }
    ];
  };
  
  // Calculate resale value over time
  const getResaleValue = (years: number): number => {
    if (years === 0) return purchasePrice;
    
    let value = purchasePrice;
    
    // Apply initial depreciation for first year
    value = value * (1 - selectedVehicle.initialDepreciation);
    
    // Apply annual depreciation for subsequent years
    for (let year = 1; year < years; year++) {
      value = value * (1 - selectedVehicle.annualDepreciation);
    }
    
    return value;
  };
  
  // Calculate total cost of ownership
  const getTotalCostOfOwnership = (): number => {
    // Initial costs
    const initialCosts = downPayment;
    
    // Loan costs
    const loanCosts = getMonthlyPayment() * loanTerm;
    
    // Ownership expenses over the period
    const expenses = getExpenses();
    const totalExpenses = expenses.reduce((acc, expense) => acc + (expense.annual * ownershipPeriod), 0);
    
    // Resale value (subtract because it's money you get back)
    const resaleValue = userResaleValue !== null ? userResaleValue : getResaleValue(ownershipPeriod);
    
    // Total cost = what you pay - what you get back
    return initialCosts + loanCosts + totalExpenses - resaleValue;
  };
  
  // When vehicle selection changes, update the purchase price
  useEffect(() => {
    setPurchasePrice(selectedVehicle.msrp);
    setUserResaleValue(null);
  }, [selectedVehicle]);
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  // Generate data for depreciation chart
  const getDepreciationChartData = () => {
    const labels = Array.from({ length: 10 }, (_, i) => i);
    const values = labels.map(year => getResaleValue(year));
    
    return {
      labels,
      datasets: [
        {
          label: 'Vehicle Value',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        },
        // Add user's estimated resale value if provided
        ...(userResaleValue !== null ? [{
          label: 'Your Estimate',
          data: Array(10).fill(null).map((_, i) => i === ownershipPeriod ? userResaleValue : null),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          pointRadius: 6,
          pointHoverRadius: 8,
        }] : [])
      ],
    };
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Buy Option Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {vehicles.map((vehicle, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 ${selectedVehicle.name === vehicle.name ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <img 
              src={vehicle.image} 
              alt={vehicle.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{vehicle.name}</h3>
              <p className="text-gray-700">MSRP: {formatCurrency(vehicle.msrp)}</p>
              <p className="text-sm text-gray-600">
                Depreciation: {(vehicle.initialDepreciation * 100).toFixed(0)}% initial, 
                {(vehicle.annualDepreciation * 100).toFixed(0)}% annual
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 40000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 5000"
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
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Loan Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">Loan Amount</p>
                <p className="text-lg font-bold">{formatCurrency(loanAmount)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">Monthly Payment</p>
                <p className="text-lg font-bold">{formatCurrency(getMonthlyPayment())}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">Total Interest</p>
                <p className="text-lg font-bold">{formatCurrency(getTotalInterest())}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">Total Payments</p>
                <p className="text-lg font-bold">{formatCurrency(getMonthlyPayment() * loanTerm)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Depreciation & Resale Value</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Period (years)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={ownershipPeriod}
              onChange={(e) => setOwnershipPeriod(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(year => (
                <span key={year} className={year === ownershipPeriod ? 'font-bold text-blue-600' : ''}>{year}</span>
              ))}
            </div>
          </div>
          
          <div className="h-64 mb-6">
            <Line 
              data={getDepreciationChartData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: 'Value',
                    },
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Years',
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
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">Estimated Resale Value after {ownershipPeriod} {ownershipPeriod === 1 ? 'year' : 'years'}</h3>
              <button
                onClick={() => setShowUserInput(!showUserInput)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showUserInput ? 'Use calculator estimate' : 'Enter your own estimate'}
              </button>
            </div>
            
            {showUserInput ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={userResaleValue === null ? getResaleValue(ownershipPeriod) : userResaleValue}
                  onChange={(e) => setUserResaleValue(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your estimate"
                />
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-lg font-bold">{formatCurrency(getResaleValue(ownershipPeriod))}</div>
                <div className="text-sm text-gray-600">
                  ({((1 - getResaleValue(ownershipPeriod) / purchasePrice) * 100).toFixed(0)}% depreciation from purchase price)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Total Cost of Ownership</h2>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'cost' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('cost')}
            >
              Cost Breakdown
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'value' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('value')}
            >
              Net Cost Analysis
            </button>
          </div>
        </div>
        
        {viewMode === 'cost' && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left">Expense Category</th>
                    <th className="py-3 px-4 text-right">Monthly</th>
                    <th className="py-3 px-4 text-right">Annual</th>
                    <th className="py-3 px-4 text-right">Total ({ownershipPeriod} {ownershipPeriod === 1 ? 'year' : 'years'})</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {getExpenses().map((expense, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4">{expense.label}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(expense.monthly)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(expense.annual)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(expense.annual * ownershipPeriod)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{expense.description}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="py-3 px-4 font-medium">Total Ownership Expenses</td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(getExpenses().reduce((sum, expense) => sum + expense.monthly, 0))}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(getExpenses().reduce((sum, expense) => sum + expense.annual, 0))}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(getExpenses().reduce((sum, expense) => sum + (expense.annual * ownershipPeriod), 0))}
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {viewMode === 'value' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-md font-medium mb-2">Initial Costs</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Down Payment</span>
                    <span className="font-medium">{formatCurrency(downPayment)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-md font-medium mb-2">Ongoing Costs</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Loan Payments</span>
                    <span className="font-medium">{formatCurrency(getMonthlyPayment() * loanTerm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance & Operating</span>
                    <span className="font-medium">
                      {formatCurrency(getExpenses().reduce((sum, expense) => sum + (expense.annual * ownershipPeriod), 0))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-md font-medium mb-2">Recovery Value</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Resale Value</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(userResaleValue !== null ? userResaleValue : getResaleValue(ownershipPeriod))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depreciation</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(purchasePrice - (userResaleValue !== null ? userResaleValue : getResaleValue(ownershipPeriod)))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-bold mb-3">Net Cost of Ownership ({ownershipPeriod} {ownershipPeriod === 1 ? 'year' : 'years'})</h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="text-sm mb-2 md:mb-0">
                  <span className="font-medium">Formula: </span>
                  <span>Down Payment + Loan Payments + Expenses - Resale Value</span>
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(getTotalCostOfOwnership())}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <span className="font-medium">Monthly average: </span>
                <span>
                  {formatCurrency(getTotalCostOfOwnership() / (ownershipPeriod * 12))}/month
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Buying vs. Leasing Considerations</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>When you buy a vehicle, you build equity over time as you pay down the loan.</li>
          <li>The longer you own a vehicle after paying off the loan, the more value you extract from your purchase.</li>
          <li>Maintenance costs typically increase as vehicles age, particularly after the warranty period expires.</li>
          <li>Different vehicles depreciate at different rates - luxury vehicles often depreciate faster than economy models.</li>
          <li>Total cost of ownership includes not just the purchase price but also interest, insurance, maintenance, fuel, and depreciation.</li>
          <li>When comparing to leasing, remember that buying gives you an asset at the end, while leasing includes the convenience of regularly upgrading to a new vehicle.</li>
        </ul>
      </div>
    </div>
  );
};

export default BuyOptionAnalysis;