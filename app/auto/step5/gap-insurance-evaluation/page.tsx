"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface VehicleModel {
  id: string;
  name: string;
  price: number;
  depreciationRate: number; // First year depreciation rate
  subsequentRate: number;   // Depreciation rate in subsequent years
  image: string;
}

const GapInsuranceEvaluation: React.FC = () => {
  // Vehicle models
  const vehicleModels: VehicleModel[] = [
    {
      id: "model1",
      name: "Sedan - Economy",
      price: 22000,
      depreciationRate: 0.25,  // 25% first year
      subsequentRate: 0.15,    // 15% subsequent years
      image: "/imgs/honda_civic.jpg"
    },
    {
      id: "model2",
      name: "SUV - Mid-Size",
      price: 35000,
      depreciationRate: 0.30,  // 30% first year
      subsequentRate: 0.18,    // 18% subsequent years
      image: "/imgs/honda_civic.jpg" // Using placeholder image
    },
    {
      id: "model3",
      name: "Luxury - Performance",
      price: 55000,
      depreciationRate: 0.40,  // 40% first year
      subsequentRate: 0.25,    // 25% subsequent years
      image: "/imgs/bmw_3_series.jpg"
    }
  ];
  
  // Insurance options
  const gapInsuranceOptions = [
    { id: "none", name: "No GAP Insurance", cost: 0, coverage: 0 },
    { id: "basic", name: "Basic GAP", cost: 400, coverage: 0.8 },
    { id: "premium", name: "Premium GAP", cost: 800, coverage: 1.0 }
  ];
  
  // State variables
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel>(vehicleModels[0]);
  const [selectedGapOption, setSelectedGapOption] = useState(gapInsuranceOptions[0]);
  const [loanAmount, setLoanAmount] = useState<number>(selectedVehicle.price * 0.9); // 10% down payment
  const [loanTerm, setLoanTerm] = useState<number>(60); // months
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [downPayment, setDownPayment] = useState<number>(selectedVehicle.price * 0.1);
  
  // Hover state for the depreciation curve
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  
  // Calculated values
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<
    {month: number; remainingBalance: number; vehicleValue: number; gap: number}[]
  >([]);
  const [maxGap, setMaxGap] = useState<{month: number; amount: number}>({month: 0, amount: 0});
  
  // User challenge states
  const [userGapEstimate, setUserGapEstimate] = useState<string>('');
  const [userGapMonth, setUserGapMonth] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  
  // Update loan amount when vehicle or down payment changes
  useEffect(() => {
    const newLoanAmount = selectedVehicle.price - downPayment;
    setLoanAmount(newLoanAmount);
  }, [selectedVehicle, downPayment]);
  
  // Calculate monthly payment and amortization schedule
  useEffect(() => {
    calculateMonthlyPayment();
    calculateAmortizationSchedule();
  }, [selectedVehicle, loanAmount, loanTerm, interestRate]);
  
  // Reset user inputs when vehicle or gap insurance changes
  useEffect(() => {
    setUserGapEstimate('');
    setUserGapMonth('');
    setShowAnswer(false);
    setFeedbackMessage('');
  }, [selectedVehicle, selectedGapOption]);
  
  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    setMonthlyPayment(payment);
  };
  
  const calculateAmortizationSchedule = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    let balance = loanAmount;
    const schedule = [];
    let currentMaxGap = { month: 0, amount: 0 };
    
    for (let month = 0; month <= loanTerm; month++) {
      // Calculate remaining loan balance
      if (month > 0) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = payment - interestPayment;
        balance = balance - principalPayment;
      }
      
      // Calculate vehicle value with depreciation
      let vehicleValue;
      if (month === 0) {
        vehicleValue = selectedVehicle.price;
      } else if (month <= 12) {
        // First year depreciation (apply monthly)
        const monthlyDepreciation = selectedVehicle.depreciationRate / 12;
        vehicleValue = selectedVehicle.price * Math.pow(1 - monthlyDepreciation, month);
      } else {
        // First year plus subsequent years
        const subsequentMonths = month - 12;
        const monthlySubsequentRate = selectedVehicle.subsequentRate / 12;
        vehicleValue = selectedVehicle.price * 
          (1 - selectedVehicle.depreciationRate) * 
          Math.pow(1 - monthlySubsequentRate, subsequentMonths);
      }
      
      // Calculate the gap between loan and value
      const gap = Math.max(0, balance - vehicleValue);
      
      // Track maximum gap
      if (gap > currentMaxGap.amount) {
        currentMaxGap = { month, amount: gap };
      }
      
      schedule.push({
        month,
        remainingBalance: balance,
        vehicleValue,
        gap
      });
    }
    
    setAmortizationSchedule(schedule);
    setMaxGap(currentMaxGap);
  };
  
  const handleVehicleSelect = (vehicle: VehicleModel) => {
    setSelectedVehicle(vehicle);
    setDownPayment(vehicle.price * 0.1); // Reset down payment to 10%
  };
  
  const handleGapOptionSelect = (option: any) => {
    setSelectedGapOption(option);
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const getDepreciationChartData = () => {
    // Extract data for the chart
    const labels = amortizationSchedule.map(item => item.month);
    const vehicleValues = amortizationSchedule.map(item => item.vehicleValue);
    const loanBalances = amortizationSchedule.map(item => item.remainingBalance);
    const gaps = amortizationSchedule.map(item => item.gap);
    
    return {
      labels,
      datasets: [
        {
          label: 'Vehicle Value',
          data: vehicleValues,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        },
        {
          label: 'Loan Balance',
          data: loanBalances,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        },
        {
          label: 'Gap',
          data: gaps,
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.5)',
          tension: 0.1,
          fill: {
            target: 'origin',
            above: 'rgba(255, 205, 86, 0.2)'
          }
        }
      ]
    };
  };
  
  const checkUserAnswers = () => {
    const userGap = parseFloat(userGapEstimate);
    const userMonth = parseInt(userGapMonth);
    
    // Define acceptable error margins
    const gapErrorMargin = maxGap.amount * 0.1; // 10% error margin
    const monthErrorMargin = 3; // 3 months error margin
    
    let feedback = '';
    
    if (isNaN(userGap) || isNaN(userMonth)) {
      feedback = "Please enter numerical values for both fields.";
    } else {
      const gapAccuracy = Math.abs(userGap - maxGap.amount);
      const monthAccuracy = Math.abs(userMonth - maxGap.month);
      
      if (gapAccuracy <= gapErrorMargin && monthAccuracy <= monthErrorMargin) {
        feedback = "Great work! Your analysis is correct. You've successfully identified when GAP insurance would be most valuable.";
      } else if (gapAccuracy <= gapErrorMargin) {
        feedback = "Your maximum gap amount is correct, but check when this gap occurs during the loan.";
      } else if (monthAccuracy <= monthErrorMargin) {
        feedback = "You've correctly identified when the maximum gap occurs, but check your calculation of the gap amount.";
      } else {
        feedback = "Both values need revision. Review how vehicle depreciation and loan amortization create a gap between value and loan balance.";
      }
    }
    
    setFeedbackMessage(feedback);
    setShowAnswer(true);
  };
  
  // Find value for specific month on chart hover
  const getValuesForMonth = (month: number) => {
    if (month === null || !amortizationSchedule[month]) return null;
    
    return {
      month,
      vehicleValue: amortizationSchedule[month].vehicleValue,
      loanBalance: amortizationSchedule[month].remainingBalance,
      gap: amortizationSchedule[month].gap
    };
  };
  
  const getGapCoverageAmount = () => {
    return maxGap.amount * selectedGapOption.coverage;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">GAP Insurance Evaluation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Selection</h2>
            <div className="space-y-4">
              {vehicleModels.map((vehicle) => (
                <div 
                  key={vehicle.id}
                  className={`border rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${
                    selectedVehicle.id === vehicle.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="h-36 bg-gray-100 relative">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{vehicle.name}</h3>
                      <span className="text-sm font-semibold">{formatCurrency(vehicle.price)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Depreciation: {(vehicle.depreciationRate * 100).toFixed(0)}% first year, {(vehicle.subsequentRate * 100).toFixed(0)}% after
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t p-6">
            <h2 className="text-xl font-semibold mb-4">Financing Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (months)</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step="0.1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="py-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Vehicle Price:</span>
                  <span>{formatCurrency(selectedVehicle.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Loan Amount:</span>
                  <span>{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Monthly Payment:</span>
                  <span>{formatCurrency(monthlyPayment)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t p-6">
            <h2 className="text-xl font-semibold mb-4">GAP Insurance Options</h2>
            <div className="space-y-3">
              {gapInsuranceOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedGapOption.id === option.id 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleGapOptionSelect(option)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {option.cost > 0 ? formatCurrency(option.cost) : 'Free'}
                    </span>
                  </div>
                  {option.id !== 'none' && (
                    <div className="mt-1 text-sm text-gray-600">
                      Coverage: {Math.round(option.coverage * 100)}% of gap
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Depreciation vs. Loan Balance</h2>
            <div className="h-72">
              <Line 
                data={getDepreciationChartData()}
                options={{
                  responsive: true,
                  interaction: {
                    mode: 'index',
                    intersect: false,
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
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Month'
                      }
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount ($)'
                      },
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value as number);
                        }
                      }
                    }
                  },
                  onHover: (event, elements) => {
                    if (elements && elements.length) {
                      const firstPoint = elements[0];
                      setHoveredMonth(firstPoint.index);
                    } else {
                      setHoveredMonth(null);
                    }
                  }
                }}
              />
            </div>
            
            {hoveredMonth !== null && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h3 className="text-md font-medium mb-2">Month {hoveredMonth} Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Value</p>
                    <p className="font-medium">{formatCurrency(getValuesForMonth(hoveredMonth)?.vehicleValue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Balance</p>
                    <p className="font-medium">{formatCurrency(getValuesForMonth(hoveredMonth)?.loanBalance || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gap Amount</p>
                    <p className="font-medium">{formatCurrency(getValuesForMonth(hoveredMonth)?.gap || 0)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your GAP Analysis</h2>
            <p className="mb-4 text-gray-700">
              Based on the depreciation curve and loan amortization, calculate the maximum gap between the vehicle value and loan balance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Gap Amount</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <input
                    type="text"
                    value={userGapEstimate}
                    onChange={(e) => setUserGapEstimate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your calculated maximum gap"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month of Maximum Gap</label>
                <input
                  type="text"
                  value={userGapMonth}
                  onChange={(e) => setUserGapMonth(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter month number"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={checkUserAnswers}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Check My Analysis
              </button>
            </div>
            
            {showAnswer && (
              <div className={`mt-4 p-4 rounded-md ${feedbackMessage.includes('Great') ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                {feedbackMessage}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Actual Maximum Gap:</p>
                      <p className="text-lg font-bold">{formatCurrency(maxGap.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Occurs at Month:</p>
                      <p className="text-lg font-bold">{maxGap.month}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">GAP Insurance Value Assessment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-3">Risk Analysis</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Maximum Potential Loss</p>
                    <p className="text-xl font-semibold">{formatCurrency(maxGap.amount)}</p>
                    <p className="text-xs text-gray-500">
                      (Occurs around month {showAnswer ? maxGap.month : '??'})
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Selected GAP Coverage</p>
                    <p className="text-xl font-semibold">
                      {selectedGapOption.id === 'none' 
                        ? 'No Coverage' 
                        : `${formatCurrency(showAnswer ? getGapCoverageAmount() : 0)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      ({selectedGapOption.coverage * 100}% of gap, costs {formatCurrency(selectedGapOption.cost)})
                    </p>
                  </div>
                  
                  <div className={selectedGapOption.id === 'none' ? 'opacity-50' : ''}>
                    <p className="text-sm text-gray-600">Uncovered Gap</p>
                    <p className="text-xl font-semibold text-red-600">
                      {selectedGapOption.id === 'none' 
                        ? formatCurrency(maxGap.amount) 
                        : formatCurrency(showAnswer ? maxGap.amount - getGapCoverageAmount() : 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-3">Value Proposition</h3>
                
                <div className={`p-3 rounded-md mb-3 ${showAnswer ? (selectedGapOption.cost < maxGap.amount ? 'bg-green-50' : 'bg-red-50') : 'bg-gray-50'}`}>
                  <p className="font-medium">
                    {showAnswer 
                      ? (selectedGapOption.cost < maxGap.amount 
                        ? `GAP insurance costs ${formatCurrency(selectedGapOption.cost)} and could cover up to ${formatCurrency(getGapCoverageAmount())}` 
                        : `GAP insurance costs ${formatCurrency(selectedGapOption.cost)} but the coverage might not justify the cost`)
                      : 'Calculate the gap to determine if GAP insurance is worth the cost'}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p>GAP insurance is generally more valuable when:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>You have a small down payment (less than 20%)</li>
                    <li>The vehicle has a high depreciation rate</li>
                    <li>You have a longer loan term (60+ months)</li>
                    <li>You drive many miles per year (accelerating depreciation)</li>
                    <li>You're "underwater" on your trade-in</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2 text-blue-800">GAP Insurance Explained</h3>
              <p className="text-sm text-blue-800 mb-2">
                Guaranteed Asset Protection (GAP) insurance covers the difference between what you owe on your vehicle and what it's worth if it's totaled or stolen.
              </p>
              <p className="text-sm text-blue-800">
                Without GAP insurance, you'd be responsible for paying the difference (the "gap") between your insurance payout (based on the car's actual cash value) and your loan balance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapInsuranceEvaluation;