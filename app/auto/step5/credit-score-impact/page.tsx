"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CreditTier {
  name: string;
  range: string;
  color: string;
  borderColor: string;
  rate: number;
}

interface LoanOffer {
  tierId: number;
  tierName: string;
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  approved: boolean;
}

const CreditScoreImpact: React.FC = () => {
  // Credit score tiers
  const creditTiers: CreditTier[] = [
    { 
      name: "Excellent", 
      range: "750-850", 
      color: "rgba(46, 184, 92, 0.5)", 
      borderColor: "rgb(46, 184, 92)",
      rate: 3.99
    },
    { 
      name: "Good", 
      range: "700-749", 
      color: "rgba(56, 161, 105, 0.5)", 
      borderColor: "rgb(56, 161, 105)",
      rate: 4.99
    },
    { 
      name: "Fair", 
      range: "650-699", 
      color: "rgba(236, 201, 75, 0.5)", 
      borderColor: "rgb(236, 201, 75)",
      rate: 6.99
    },
    { 
      name: "Poor", 
      range: "600-649", 
      color: "rgba(237, 137, 54, 0.5)", 
      borderColor: "rgb(237, 137, 54)",
      rate: 10.99
    },
    { 
      name: "Very Poor", 
      range: "300-599", 
      color: "rgba(229, 62, 62, 0.5)", 
      borderColor: "rgb(229, 62, 62)",
      rate: 15.99
    }
  ];
  
  // State variables
  const [currentCredit, setCurrentCredit] = useState<number>(680);
  const [targetCredit, setTargetCredit] = useState<number>(720);
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [loanTerm, setLoanTerm] = useState<number>(60); // months
  const [currentTier, setCurrentTier] = useState<number>(2); // "Fair" by default
  const [targetTier, setTargetTier] = useState<number>(1); // "Good" by default
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([]);
  
  // User calculations state
  const [userMonthlySavings, setUserMonthlySavings] = useState<string>('');
  const [userTotalSavings, setUserTotalSavings] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  
  // Update tier based on credit score changes
  useEffect(() => {
    // Find current tier
    for (let i = 0; i < creditTiers.length; i++) {
      const [min, max] = creditTiers[i].range.split('-').map(Number);
      if (currentCredit >= min && currentCredit <= max) {
        setCurrentTier(i);
        break;
      }
    }
    
    // Find target tier
    for (let i = 0; i < creditTiers.length; i++) {
      const [min, max] = creditTiers[i].range.split('-').map(Number);
      if (targetCredit >= min && targetCredit <= max) {
        setTargetTier(i);
        break;
      }
    }
  }, [currentCredit, targetCredit, creditTiers]);
  
  // Calculate loan offers for each tier
  useEffect(() => {
    const offers: LoanOffer[] = creditTiers.map((tier, index) => {
      const monthlyPayment = calculateMonthlyPayment(loanAmount, tier.rate, loanTerm);
      const totalInterest = (monthlyPayment * loanTerm) - loanAmount;
      
      return {
        tierId: index,
        tierName: tier.name,
        interestRate: tier.rate,
        monthlyPayment,
        totalInterest,
        approved: index >= currentTier
      };
    });
    
    setLoanOffers(offers);
    
    // Reset user calculations
    setUserMonthlySavings('');
    setUserTotalSavings('');
    setShowAnswer(false);
    setFeedbackMessage('');
  }, [loanAmount, loanTerm, currentTier, targetTier, creditTiers]);
  
  const calculateMonthlyPayment = (principal: number, rate: number, term: number): number => {
    const monthlyRate = rate / 100 / 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const getMonthlySavings = (): number => {
    // Calculate difference between current and target tier monthly payments
    if (!loanOffers[currentTier] || !loanOffers[targetTier]) return 0;
    return loanOffers[currentTier].monthlyPayment - loanOffers[targetTier].monthlyPayment;
  };
  
  const getTotalSavings = (): number => {
    // Calculate total interest difference between current and target tier
    if (!loanOffers[currentTier] || !loanOffers[targetTier]) return 0;
    return loanOffers[currentTier].totalInterest - loanOffers[targetTier].totalInterest;
  };
  
  const checkUserCalculations = () => {
    const userMonthly = parseFloat(userMonthlySavings);
    const userTotal = parseFloat(userTotalSavings);
    
    const actualMonthly = getMonthlySavings();
    const actualTotal = getTotalSavings();
    
    // Calculate error percentages
    const monthlyErrorPercentage = Math.abs((userMonthly - actualMonthly) / actualMonthly);
    const totalErrorPercentage = Math.abs((userTotal - actualTotal) / actualTotal);
    
    let feedback = '';
    
    if (isNaN(userMonthly) || isNaN(userTotal)) {
      feedback = "Please enter numerical values for both fields.";
    } else if (monthlyErrorPercentage <= 0.02 && totalErrorPercentage <= 0.02) {
      feedback = "Excellent work! Your calculations are correct. You've accurately determined the financial impact of improving your credit score.";
    } else if (monthlyErrorPercentage <= 0.05 && totalErrorPercentage <= 0.05) {
      feedback = "Close! Your calculations are nearly correct with minor rounding differences.";
    } else if (monthlyErrorPercentage > 0.05 && totalErrorPercentage <= 0.05) {
      feedback = "Your total savings calculation looks good, but check your monthly savings calculation.";
    } else if (monthlyErrorPercentage <= 0.05 && totalErrorPercentage > 0.05) {
      feedback = "Your monthly savings calculation looks good, but check your total savings calculation.";
    } else {
      feedback = "Both calculations need revision. Make sure you're comparing the correct credit tiers and using the right formula for total interest savings.";
    }
    
    setFeedbackMessage(feedback);
    setShowAnswer(true);
  };
  
  const getInterestRateComparisonData = () => {
    return {
      labels: creditTiers.map(tier => tier.name),
      datasets: [
        {
          label: 'Interest Rate (%)',
          data: creditTiers.map(tier => tier.rate),
          backgroundColor: creditTiers.map(tier => tier.color),
          borderColor: creditTiers.map(tier => tier.borderColor),
          borderWidth: 1
        }
      ]
    };
  };
  
  const getMonthlySavingsComparisonData = () => {
    return {
      labels: ['Current Credit', 'Target Credit'],
      datasets: [
        {
          label: 'Monthly Payment',
          data: [
            loanOffers[currentTier]?.monthlyPayment || 0,
            loanOffers[targetTier]?.monthlyPayment || 0
          ],
          backgroundColor: [
            creditTiers[currentTier]?.color || 'rgba(201, 203, 207, 0.5)',
            creditTiers[targetTier]?.color || 'rgba(201, 203, 207, 0.5)'
          ],
          borderColor: [
            creditTiers[currentTier]?.borderColor || 'rgb(201, 203, 207)',
            creditTiers[targetTier]?.borderColor || 'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Credit Score Impact Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Credit Score Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Credit Score: {currentCredit}
              </label>
              <input
                type="range"
                min="300"
                max="850"
                step="5"
                value={currentCredit}
                onChange={(e) => setCurrentCredit(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>300</span>
                <span>850</span>
              </div>
              <div className="mt-1 text-sm">
                Credit Tier: <span className="font-medium">{creditTiers[currentTier]?.name}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Credit Score: {targetCredit}
              </label>
              <input
                type="range"
                min="300"
                max="850"
                step="5"
                value={targetCredit}
                onChange={(e) => setTargetCredit(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>300</span>
                <span>850</span>
              </div>
              <div className="mt-1 text-sm">
                Credit Tier: <span className="font-medium">{creditTiers[targetTier]?.name}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-3">Loan Details</h3>
              
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (months)</label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Interest Rate by Credit Tier</h2>
          
          <div className="h-64 mb-6">
            <Bar 
              data={getInterestRateComparisonData()} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Interest Rate: ${context.parsed.y}%`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Interest Rate (%)'
                    }
                  }
                }
              }}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Tier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score Range
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Interest
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loanOffers.map((offer, index) => (
                  <tr 
                    key={index} 
                    className={`${index === currentTier ? 'bg-yellow-50' : (index === targetTier ? 'bg-green-50' : '')} 
                              ${!offer.approved ? 'opacity-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: creditTiers[index].borderColor }}></div>
                        <div className="text-sm font-medium text-gray-900">{offer.tierName}</div>
                        {index === currentTier && (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Current</span>
                        )}
                        {index === targetTier && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Target</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {creditTiers[index].range}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offer.interestRate.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(offer.monthlyPayment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(offer.totalInterest)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Payment Comparison</h2>
          
          <div className="h-64 mb-6">
            <Bar 
              data={getMonthlySavingsComparisonData()} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Monthly Payment: ${formatCurrency(context.parsed.y)}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Monthly Payment ($)'
                    },
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
          
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Current Rate</p>
                <p className="text-lg font-medium">{creditTiers[currentTier]?.rate.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Monthly Difference</p>
                <p className="text-lg font-medium text-green-600">
                  {showAnswer ? formatCurrency(getMonthlySavings()) : "???"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Target Rate</p>
                <p className="text-lg font-medium">{creditTiers[targetTier]?.rate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Financial Impact Calculations</h2>
          
          <p className="mb-4 text-gray-600">
            Calculate the financial impact of improving your credit score from {creditTiers[currentTier]?.name} to {creditTiers[targetTier]?.name}.
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment Savings</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="text"
                  value={userMonthlySavings}
                  onChange={(e) => setUserMonthlySavings(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Calculate the monthly payment difference"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Interest Savings</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="text"
                  value={userTotalSavings}
                  onChange={(e) => setUserTotalSavings(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Calculate the total interest savings"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={checkUserCalculations}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Check My Calculations
            </button>
          </div>
          
          {showAnswer && (
            <div className={`mt-4 p-4 rounded-md ${feedbackMessage.includes('Excellent') || feedbackMessage.includes('Close') ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
              <p className="mb-2">{feedbackMessage}</p>
              
              {(feedbackMessage.includes('Excellent') || feedbackMessage.includes('Close')) && (
                <div>
                  <p className="text-sm">Over the {loanTerm / 12} year loan term, improving your credit score would save you approximately <strong>{formatCurrency(getTotalSavings())}</strong>.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">How Credit Scores Impact Auto Financing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Factors Affecting Your Credit Score</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Payment history (35%) - Making payments on time</li>
              <li>Credit utilization (30%) - Amount of available credit being used</li>
              <li>Credit history length (15%) - How long accounts have been open</li>
              <li>Credit mix (10%) - Types of credit accounts you have</li>
              <li>New credit (10%) - Recent applications for credit</li>
            </ul>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Improving Your Credit Score</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Pay all bills on time</li>
                <li>Keep credit card balances below 30% of your credit limit</li>
                <li>Don't close old credit accounts</li>
                <li>Limit applications for new credit</li>
                <li>Regularly check your credit report for errors</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Beyond Interest Rates</h3>
            <p className="text-gray-700 mb-3">
              Your credit score affects more than just interest rates on auto loans:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Loan approval:</strong> Lower scores may result in declined applications</li>
              <li><strong>Down payment requirements:</strong> Lower scores often require larger down payments</li>
              <li><strong>Loan-to-value ratio:</strong> How much you can borrow relative to the car's value</li>
              <li><strong>Dealership incentives:</strong> Special financing offers often require excellent credit</li>
              <li><strong>Insurance premiums:</strong> Many insurers use credit scores to set rates</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
              <p className="font-medium mb-1">Financial Impact Calculation</p>
              <p>
                To calculate savings from credit improvement, subtract the better rate's payment/interest from your current rate's payment/interest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreImpact;