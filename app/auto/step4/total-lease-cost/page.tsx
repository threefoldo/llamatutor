"use client";

import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface LeaseDetail {
  label: string;
  amount: number;
  description: string;
  category: string;
}

export default function Page() {
  // Initial lease terms
  const [monthlyPayment, setMonthlyPayment] = useState<number>(399);
  const [leaseTerm, setLeaseTerm] = useState<number>(36);
  const [downPayment, setDownPayment] = useState<number>(2500);
  const [acquisitionFee, setAcquisitionFee] = useState<number>(895);
  const [documentFee, setDocumentFee] = useState<number>(150);
  const [registrationFee, setRegistrationFee] = useState<number>(300);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);
  const [dispositionFee, setDispositionFee] = useState<number>(350);
  const [mileageAllowance, setMileageAllowance] = useState<number>(12000);
  const [excessMileageFee, setExcessMileageFee] = useState<number>(0.25);
  const [estimatedExcessMiles, setEstimatedExcessMiles] = useState<number>(0);
  
  // View states
  const [activeTab, setActiveTab] = useState<'document' | 'calculation'>('document');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<number | string>('');
  const [selectedDetail, setSelectedDetail] = useState<LeaseDetail | null>(null);
  
  // Derived values
  const totalMonthlyPayments = monthlyPayment * leaseTerm;
  const totalUpfrontCosts = downPayment + acquisitionFee + documentFee + registrationFee + securityDeposit;
  const totalBackEndCosts = dispositionFee + (estimatedExcessMiles * excessMileageFee);
  const totalLeaseCost = totalMonthlyPayments + totalUpfrontCosts + totalBackEndCosts;
  
  const leaseDetails: LeaseDetail[] = [
    { 
      label: 'Monthly Payments', 
      amount: totalMonthlyPayments, 
      description: 'The sum of all monthly lease payments over the entire lease term.',
      category: 'monthly'
    },
    { 
      label: 'Down Payment', 
      amount: downPayment, 
      description: 'Initial payment made at lease signing to reduce the monthly payment amount.',
      category: 'upfront'
    },
    { 
      label: 'Acquisition Fee', 
      amount: acquisitionFee, 
      description: 'A fee charged by the leasing company to set up the lease agreement.',
      category: 'upfront'
    },
    { 
      label: 'Document Fee', 
      amount: documentFee, 
      description: 'Fee for document preparation and processing.',
      category: 'upfront'
    },
    { 
      label: 'Registration Fee', 
      amount: registrationFee, 
      description: 'Government fee for vehicle registration and license plates.',
      category: 'upfront'
    },
    { 
      label: 'Security Deposit', 
      amount: securityDeposit, 
      description: 'Refundable deposit that may be required to cover potential excess wear or damage.',
      category: 'upfront'
    },
    { 
      label: 'Disposition Fee', 
      amount: dispositionFee, 
      description: 'Fee charged at the end of the lease when returning the vehicle.',
      category: 'backend'
    },
    { 
      label: 'Excess Mileage Charges', 
      amount: estimatedExcessMiles * excessMileageFee, 
      description: `Fee for exceeding the mileage allowance (${mileageAllowance.toLocaleString()} miles per year). Current estimate based on ${estimatedExcessMiles.toLocaleString()} excess miles at $${excessMileageFee.toFixed(2)} per mile.`,
      category: 'backend'
    }
  ];
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const handleDetailClick = (detail: LeaseDetail) => {
    setSelectedDetail(detail === selectedDetail ? null : detail);
  };
  
  const checkAnswer = () => {
    const userVal = parseFloat(userAnswer as string);
    // Allow for small rounding errors (within $50)
    const isCorrect = Math.abs(userVal - totalLeaseCost) < 50;
    return isCorrect;
  };
  
  const getPieChartData = () => {
    return {
      labels: ['Monthly Payments', 'Upfront Costs', 'End of Lease Costs'],
      datasets: [
        {
          data: [totalMonthlyPayments, totalUpfrontCosts, totalBackEndCosts],
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(255, 99, 132, 0.5)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Total Lease Cost Analysis</h1>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeTab === 'document' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('document')}
          >
            Lease Document
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeTab === 'calculation' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('calculation')}
          >
            Calculation
          </button>
        </div>
      </div>
      
      {activeTab === 'document' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-4">
            <img 
              src="/imgs/tesla_model3.jpg" 
              alt="Vehicle" 
              className="mx-auto h-40 object-cover rounded" 
            />
            <h2 className="text-xl font-bold mt-2">Tesla Model 3 - Standard Range</h2>
          </div>
          
          <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">LEASE AGREEMENT SUMMARY</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold mb-2 text-gray-700">Vehicle Information</h4>
                <p className="text-sm">Make/Model: Tesla Model 3</p>
                <p className="text-sm">Year: 2023</p>
                <p className="text-sm">VIN: MN43C2ET6PL124581</p>
                <p className="text-sm">Color: Pearl White</p>
              </div>
              
              <div>
                <h4 className="font-bold mb-2 text-gray-700">Lease Term</h4>
                <p className="text-sm">
                  <span className="font-medium">Length: </span>
                  <span className="bg-yellow-100 px-1">{leaseTerm} months</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Annual Mileage Allowance: </span>
                  <span className="bg-yellow-100 px-1">{mileageAllowance.toLocaleString()} miles</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Excess Mileage Fee: </span>
                  <span className="bg-yellow-100 px-1">${excessMileageFee.toFixed(2)}/mile</span>
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold mb-2 text-gray-700">Payment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Monthly Payment: </span>
                    <span className="bg-yellow-100 px-1">{formatCurrency(monthlyPayment)}</span>/month
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Due at Signing: </span>
                    <span className="bg-yellow-100 px-1">{formatCurrency(downPayment)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Security Deposit: </span>
                    <span className="bg-yellow-100 px-1">{formatCurrency(securityDeposit)}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Acquisition Fee: </span>
                    <span className="bg-yellow-100 px-1">{formatCurrency(acquisitionFee)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Documentation Fee: </span>
                    <span className="bg-yellow-100 px-1">{formatCurrency(documentFee)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Registration Fee: </span>
                    <span className="bg-yellow-100 px-1">{formatCurrency(registrationFee)}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 text-gray-700">End of Lease</h4>
              <p className="text-sm">
                <span className="font-medium">Disposition Fee: </span>
                <span className="bg-yellow-100 px-1">{formatCurrency(dispositionFee)}</span>
              </p>
              <p className="text-sm italic mt-2">
                You will be responsible for excess wear and tear as outlined in the lease agreement.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'calculation' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Lease Cost Components</h2>
              <ul className="space-y-3">
                {leaseDetails.map((detail, index) => (
                  <li 
                    key={index} 
                    className={`p-3 border rounded-md cursor-pointer transition-colors duration-200 ${
                      selectedDetail === detail 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleDetailClick(detail)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{detail.label}</span>
                      <span>{formatCurrency(detail.amount)}</span>
                    </div>
                    {selectedDetail === detail && (
                      <div className="mt-2 text-sm text-gray-600">
                        {detail.description}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-gray-50 border-t-4 border-blue-500 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold">Total Lease Cost</h3>
                  {showAnswer ? (
                    <span className="text-lg font-bold">{formatCurrency(totalLeaseCost)}</span>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-32 px-2 py-1 border rounded"
                        placeholder="Enter total"
                      />
                      <button
                        onClick={() => setShowAnswer(true)}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Check
                      </button>
                    </div>
                  )}
                </div>
                
                {showAnswer && (
                  <div className={`p-3 rounded-md ${checkAnswer() ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className={`text-sm ${checkAnswer() ? 'text-green-800' : 'text-red-800'}`}>
                      {checkAnswer() 
                        ? 'Correct! You&apos;ve accurately calculated the total cost of the lease.' 
                        : 'That&apos;s not quite right. Check your calculations and try again.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
              <div className="h-64 mb-6">
                <Pie 
                  data={getPieChartData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            let label = context.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed !== null) {
                              label += formatCurrency(context.parsed);
                            }
                            return label;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-md font-medium mb-3">Cost Category Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Payments Total:</span>
                    <span className="text-sm font-medium">{formatCurrency(totalMonthlyPayments)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Upfront Costs Total:</span>
                    <span className="text-sm font-medium">{formatCurrency(totalUpfrontCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">End of Lease Costs Total:</span>
                    <span className="text-sm font-medium">{formatCurrency(totalBackEndCosts)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Adjust Estimated Excess Mileage</h3>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={estimatedExcessMiles}
                    onChange={(e) => setEstimatedExcessMiles(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Estimated excess miles"
                    min="0"
                  />
                  <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setShowAnswer(false)}
                  >
                    Recalculate
                  </button>
                </div>
                {estimatedExcessMiles > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Potential excess mileage charge: {formatCurrency(estimatedExcessMiles * excessMileageFee)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Lease Cost Considerations</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Monthly lease payments are typically lower than loan payments for the same vehicle.</li>
          <li>Leases include multiple fees that aren&apos;t part of a purchase transaction.</li>
          <li>Exceeding mileage limits can significantly increase the total cost of leasing.</li>
          <li>You build no equity in a leased vehicle, unlike with financing a purchase.</li>
          <li>At the end of the lease, you must return the vehicle unless you exercise a purchase option.</li>
          <li>Some fees may be negotiable - particularly the acquisition fee and sometimes the disposition fee.</li>
        </ul>
      </div>
    </div>
  );
}