"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const BalloonPaymentAnalysis: React.FC = () => {
  // Loan details
  const [loanAmount, setLoanAmount] = useState<number>(30000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(60); // months
  const [balloonPercentage, setBalloonPercentage] = useState<number>(20);
  const [balloonAmount, setBalloonAmount] = useState<number>(6000);
  
  // Balloon options
  const [balloonOptions, setBalloonOptions] = useState<{
    label: string;
    percentage: number;
    incentive: string;
  }[]>([
    { label: "Standard Loan", percentage: 0, incentive: "None" },
    { label: "Small Balloon", percentage: 10, incentive: "0.25% rate reduction" },
    { label: "Medium Balloon", percentage: 20, incentive: "0.5% rate reduction" },
    { label: "Large Balloon", percentage: 30, incentive: "0.75% rate reduction" }
  ]);
  
  // Selected balloon option index
  const [selectedOption, setSelectedOption] = useState<number>(2); // Medium balloon by default
  
  // Analysis results
  const [standardLoan, setStandardLoan] = useState<{
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
  }>({
    monthlyPayment: 0,
    totalPayments: 0,
    totalInterest: 0
  });
  
  const [balloonLoan, setBalloonLoan] = useState<{
    monthlyPayment: number;
    balloonPayment: number;
    totalPayments: number;
    totalInterest: number;
    effectiveRate: number;
  }>({
    monthlyPayment: 0,
    balloonPayment: 0,
    totalPayments: 0,
    totalInterest: 0,
    effectiveRate: 0
  });
  
  // User answer state
  const [userMonthlyPayment, setUserMonthlyPayment] = useState<string>('');
  const [userTotalInterest, setUserTotalInterest] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  
  // Calculate balloon amount whenever balloon percentage changes
  useEffect(() => {
    const balloonAmt = loanAmount * (balloonOptions[selectedOption].percentage / 100);
    setBalloonAmount(balloonAmt);
    
    // Reset user answers when options change
    setUserMonthlyPayment('');
    setUserTotalInterest('');
    setShowAnswer(false);
    setFeedbackMessage('');
  }, [selectedOption, loanAmount, balloonOptions]);
  
  // Calculate loan details whenever inputs change
  useEffect(() => {
    calculateStandardLoan();
    calculateBalloonLoan();
  }, [loanAmount, interestRate, loanTerm, balloonAmount, selectedOption]);
  
  const calculateStandardLoan = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const totalPaid = payment * loanTerm;
    const totalInterest = totalPaid - loanAmount;
    
    setStandardLoan({
      monthlyPayment: payment,
      totalPayments: totalPaid,
      totalInterest: totalInterest
    });
  };
  
  const calculateBalloonLoan = () => {
    // Apply interest rate incentive based on selected balloon option
    const rateIncentive = selectedOption === 0 ? 0 : (selectedOption === 1 ? 0.25 : (selectedOption === 2 ? 0.5 : 0.75));
    const adjustedRate = interestRate - rateIncentive;
    
    // Calculate effective loan amount (loan amount minus present value of balloon)
    const monthlyRate = adjustedRate / 100 / 12;
    const presentValueFactor = 1 / Math.pow(1 + monthlyRate, loanTerm);
    const effectiveLoanAmount = loanAmount - (balloonAmount * presentValueFactor);
    
    // Calculate monthly payment
    const payment = effectiveLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    // Calculate total payments and interest
    const regularPayments = payment * loanTerm;
    const totalPaid = regularPayments + balloonAmount;
    const totalInterest = totalPaid - loanAmount;
    
    // Calculate effective interest rate
    // This is an approximation - for exact calculation would need to use IRR
    const effectiveRate = (totalInterest / loanAmount) * (12 / loanTerm) * 100;
    
    setBalloonLoan({
      monthlyPayment: payment,
      balloonPayment: balloonAmount,
      totalPayments: totalPaid,
      totalInterest: totalInterest,
      effectiveRate: effectiveRate
    });
  };
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };
  
  const checkUserAnswers = () => {
    const userMonthly = parseFloat(userMonthlyPayment);
    const userInterest = parseFloat(userTotalInterest);
    
    // Calculate accuracy - allow for small rounding differences
    const monthlyAccuracy = Math.abs((userMonthly - balloonLoan.monthlyPayment) / balloonLoan.monthlyPayment);
    const interestAccuracy = Math.abs((userInterest - balloonLoan.totalInterest) / balloonLoan.totalInterest);
    
    let feedback = '';
    
    if (isNaN(userMonthly) || isNaN(userInterest)) {
      feedback = "Please enter numerical values for both fields.";
    } else if (monthlyAccuracy <= 0.02 && interestAccuracy <= 0.02) {
      feedback = "Great work! Your calculations are correct. You've successfully calculated the balloon loan payment structure.";
    } else if (monthlyAccuracy <= 0.05 && interestAccuracy <= 0.05) {
      feedback = "Close! Your calculations are nearly correct with minor rounding differences.";
    } else if (monthlyAccuracy > 0.05 && interestAccuracy <= 0.05) {
      feedback = "Your total interest calculation looks good, but check your monthly payment formula.";
    } else if (monthlyAccuracy <= 0.05 && interestAccuracy > 0.05) {
      feedback = "Your monthly payment calculation looks good, but check your total interest calculation.";
    } else {
      feedback = "Both calculations need revision. Remember to account for the balloon payment and rate incentive.";
    }
    
    setFeedbackMessage(feedback);
    setShowAnswer(true);
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercent = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  const getPaymentComparisonData = () => {
    return {
      labels: ['Standard Loan', 'Balloon Loan'],
      datasets: [
        {
          label: 'Monthly Payment',
          data: [standardLoan.monthlyPayment, balloonLoan.monthlyPayment],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    };
  };
  
  const getTotalCostComparisonData = () => {
    return {
      labels: ['Standard Loan', 'Balloon Loan'],
      datasets: [
        {
          label: 'Principal',
          data: [loanAmount, loanAmount],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          stack: 'Stack 0',
        },
        {
          label: 'Interest',
          data: [standardLoan.totalInterest, balloonLoan.totalInterest],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
          stack: 'Stack 0',
        }
      ]
    };
  };
  
  const getPaymentScheduleData = () => {
    const labels = Array.from({ length: loanTerm / 12 + 1 }, (_, i) => i); // years
    
    // Standard loan - same payment each period
    const standardPayments = labels.map(year => 
      year === labels.length - 1 ? 0 : standardLoan.monthlyPayment * 12
    );
    
    // Balloon loan - regular payments plus balloon at the end
    const balloonPayments = labels.map(year => {
      if (year === labels.length - 1) return 0;
      if (year === loanTerm / 12) return balloonLoan.balloonPayment;
      return balloonLoan.monthlyPayment * 12;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Standard Loan',
          data: standardPayments,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Balloon Loan',
          data: balloonPayments,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Balloon Payment Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (months)</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Balloon Payment Options</h3>
            <div className="space-y-2">
              {balloonOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedOption === index 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {option.percentage}% of loan
                    </span>
                  </div>
                  {option.incentive !== "None" && (
                    <div className="mt-1 text-sm text-green-600">
                      Incentive: {option.incentive}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Comparison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Standard Loan</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-semibold">{formatCurrency(standardLoan.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payments:</span>
                  <span className="font-semibold">{formatCurrency(standardLoan.totalPayments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold">{formatCurrency(standardLoan.totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{formatPercent(interestRate)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Balloon Loan ({balloonOptions[selectedOption].label})</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-semibold text-blue-600">{showAnswer ? formatCurrency(balloonLoan.monthlyPayment) : "???"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balloon Payment:</span>
                  <span className="font-semibold">{formatCurrency(balloonAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-blue-600">{showAnswer ? formatCurrency(balloonLoan.totalInterest) : "???"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Adjusted Rate:</span>
                  <span className="font-semibold">
                    {formatPercent(interestRate - (selectedOption === 0 ? 0 : (selectedOption === 1 ? 0.25 : (selectedOption === 2 ? 0.5 : 0.75))))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Rate:</span>
                  <span className="font-semibold">{showAnswer ? formatPercent(balloonLoan.effectiveRate) : "???"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium mb-3">Your Analysis (Balloon Loan)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calculate Monthly Payment</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <input
                    type="text"
                    value={userMonthlyPayment}
                    onChange={(e) => setUserMonthlyPayment(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your calculated monthly payment"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calculate Total Interest</label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">$</span>
                  <input
                    type="text"
                    value={userTotalInterest}
                    onChange={(e) => setUserTotalInterest(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your calculated total interest"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={checkUserAnswers}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Check My Answers
              </button>
            </div>
            
            {showAnswer && feedbackMessage && (
              <div className={`mt-4 p-4 rounded-md ${feedbackMessage.includes('Great') || feedbackMessage.includes('Close') ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                {feedbackMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Payment Comparison</h2>
          <div className="h-64">
            <Bar 
              data={getPaymentComparisonData()} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return formatCurrency(context.parsed.y);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Total Cost Comparison</h2>
          <div className="h-64">
            <Bar 
              data={getTotalCostComparisonData()} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return formatCurrency(context.parsed.y);
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Schedule Over Time</h2>
        <div className="h-64">
          <Bar 
            data={getPaymentScheduleData()} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return formatCurrency(context.parsed.y);
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Year'
                  }
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return formatCurrency(value as number);
                    }
                  }
                }
              }
            }}
          />
        </div>
        
        {selectedOption > 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-yellow-800">Important Considerations</h3>
            <ul className="list-disc pl-5 space-y-1 text-yellow-700">
              <li>Balloon payments require a large sum of money at the end of the loan term.</li>
              <li>You may need to refinance at the end of the term if you can't make the balloon payment.</li>
              <li>The effective interest rate accounts for the time value of money and all loan costs.</li>
              <li>While monthly payments are lower, total interest costs should be carefully compared.</li>
              <li>Vehicle depreciation considerations are important - will the car's value cover the balloon?</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">How to Calculate Balloon Loan Payments</h2>
        <p className="mb-4">
          To properly analyze a balloon loan, you need to calculate the following components:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Monthly Payment Calculation</h3>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
              <li>Determine the adjusted interest rate (with any incentives)</li>
              <li>Calculate the present value of the balloon payment</li>
              <li>Subtract this from the loan amount to get the effective loan amount</li>
              <li>Calculate the payment using the standard loan formula on this effective amount</li>
            </ol>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Total Interest Analysis</h3>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
              <li>Calculate the total of all monthly payments</li>
              <li>Add the balloon payment</li>
              <li>Subtract the original loan amount from this total</li>
              <li>The result is your total interest paid</li>
              <li>Calculate the effective interest rate based on this</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalloonPaymentAnalysis;