"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AutoLayout from "@/components/AutoLayout";

interface LoanOffer {
  id: string;
  vehicle: string;
  price: number;
  apr: number;
  term: number;
  downPayment: number;
  image: string;
  additionalFees: {
    docFee: number;
    taxRate: number;
    titleFee: number;
    registrationFee: number;
  };
}

export default function TotalInterestComparison() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [userCalculations, setUserCalculations] = useState<{
    [key: string]: {
      monthlyPayment: number | string;
      totalInterest: number | string;
    };
  }>({});
  // Store correct values internally, but never show to students
  const [calculatedValues, setCalculatedValues] = useState<{
    [key: string]: {
      loanAmount: number;
      monthlyPayment: number;
      totalInterest: number;
    };
  }>({});
  const [showFormulaReference, setShowFormulaReference] = useState(false);

  // Mock API call - would be replaced with actual API integration
  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      try {
        // This would be replaced with actual API fetch
        const mockLoanOffers: LoanOffer[] = [
          {
            id: "offer1",
            vehicle: "BMW 3 Series 2024",
            price: 43000,
            apr: 4.9,
            term: 60, // 5 years in months
            downPayment: 5000,
            image: "/imgs/bmw_3_series.jpg",
            additionalFees: {
              docFee: 499,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 365,
            },
          },
          {
            id: "offer2",
            vehicle: "BMW 3 Series 2024",
            price: 43000,
            apr: 3.5,
            term: 72, // 6 years in months
            downPayment: 5000,
            image: "/imgs/bmw_3_series.jpg",
            additionalFees: {
              docFee: 499,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 365,
            },
          },
          {
            id: "offer3",
            vehicle: "Honda Civic 2024",
            price: 25000,
            apr: 2.9,
            term: 48, // 4 years in months
            downPayment: 3000,
            image: "/imgs/honda_civic.jpg",
            additionalFees: {
              docFee: 399,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 325,
            },
          },
          {
            id: "offer4",
            vehicle: "Honda Civic 2024",
            price: 25000,
            apr: 1.9,
            term: 60, // 5 years in months
            downPayment: 3000,
            image: "/imgs/honda_civic.jpg",
            additionalFees: {
              docFee: 399,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 325,
            },
          },
          {
            id: "offer5",
            vehicle: "Tesla Model 3 2024",
            price: 47000,
            apr: 3.25,
            term: 60, // 5 years in months
            downPayment: 7000,
            image: "/imgs/tesla_model3.jpg",
            additionalFees: {
              docFee: 599,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 425,
            },
          },
          {
            id: "offer6",
            vehicle: "Tesla Model 3 2024",
            price: 47000,
            apr: 2.75,
            term: 72, // 6 years in months
            downPayment: 7000,
            image: "/imgs/tesla_model3.jpg",
            additionalFees: {
              docFee: 599,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 425,
            },
          },
        ];

        setLoanOffers(mockLoanOffers);
        
        // Initialize user calculations state
        const initialCalculations: {[key: string]: any} = {};
        mockLoanOffers.forEach(offer => {
          initialCalculations[offer.id] = { 
            monthlyPayment: '', 
            totalInterest: '' 
          };
        });
        
        setUserCalculations(initialCalculations);
        
        // Calculate correct values for validation
        const newCalculatedValues: {[key: string]: any} = {};
        mockLoanOffers.forEach(offer => {
          const loanAmount = calculateLoanAmount(offer);
          const monthlyPayment = calculateMonthlyPayment(offer);
          const totalInterest = calculateTotalInterest(offer);
          
          newCalculatedValues[offer.id] = {
            loanAmount,
            monthlyPayment,
            totalInterest
          };
        });
        
        setCalculatedValues(newCalculatedValues);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load loan offers. Please try again later.");
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateLoanAmount = (offer: LoanOffer) => {
    if (!offer) return 0;
    
    const salesTax = offer.price * (offer.additionalFees.taxRate / 100);
    const totalFees = offer.additionalFees.docFee + 
                    salesTax + 
                    offer.additionalFees.titleFee + 
                    offer.additionalFees.registrationFee;
    
    return offer.price + totalFees - offer.downPayment;
  };

  const calculateMonthlyPayment = (offer: LoanOffer) => {
    if (!offer) return 0;
    
    const principal = calculateLoanAmount(offer);
    const monthlyRate = offer.apr / 100 / 12;
    const termMonths = offer.term;
    
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    return payment;
  };

  const calculateTotalInterest = (offer: LoanOffer) => {
    if (!offer) return 0;
    
    const monthlyPayment = calculateMonthlyPayment(offer);
    const totalPayments = monthlyPayment * offer.term;
    const principal = calculateLoanAmount(offer);
    
    return totalPayments - principal;
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffers(prev => {
      if (prev.includes(offerId)) {
        return prev.filter(id => id !== offerId);
      } else if (prev.length < 2) {
        return [...prev, offerId];
      }
      return prev;
    });
  };

  const checkCalculationAccuracy = (offerId: string, type: 'monthlyPayment' | 'totalInterest') => {
    if (userCalculations[offerId][type] === '' || !calculatedValues[offerId]) return null;
    
    const userValue = typeof userCalculations[offerId][type] === 'string' 
      ? parseFloat(userCalculations[offerId][type] as string) 
      : userCalculations[offerId][type] as number;
    const calculatedValue = calculatedValues[offerId][type];
    const difference = Math.abs(userValue - calculatedValue);
    const percentDifference = (difference / calculatedValue) * 100;
    
    return percentDifference < 2; // Allow for some rounding differences
  };

  const toggleFormulaReference = () => {
    setShowFormulaReference(!showFormulaReference);
  };

  const validateAllCalculations = () => {
    // Check if all selected offers have calculations
    let allValid = true;
    let anyAttempted = false;
    
    selectedOffers.forEach(offerId => {
      if (userCalculations[offerId].monthlyPayment !== '' && 
          userCalculations[offerId].totalInterest !== '') {
        anyAttempted = true;
        const monthlyPaymentCorrect = checkCalculationAccuracy(offerId, 'monthlyPayment');
        const totalInterestCorrect = checkCalculationAccuracy(offerId, 'totalInterest');
        
        if (!monthlyPaymentCorrect || !totalInterestCorrect) {
          allValid = false;
        }
      } else {
        allValid = false;
      }
    });
    
    // If not all calculations are attempted, show formula reference
    if (!anyAttempted || !allValid) {
      setShowFormulaReference(true);
    }
    
    return allValid && anyAttempted;
  };

  // Initial system message for the assistant
  const initialMessages = [
    {
      role: "system",
      content: `You are an auto finance assistant helping a client understand the total interest paid on different loan options. Your goal is to guide them through comparing the total interest cost between different loan offers. Be educational, explain the calculations, and guide them step by step.
      
      Guide them on how to calculate total interest using the formula:
      Total Interest = (Monthly Payment × Number of Payments) - Principal Amount

      Explain that even though a longer-term loan might have a lower monthly payment, it often results in more total interest paid over the life of the loan.
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand how to calculate and compare the total interest you'd pay for different loan options on the BMW 3 Series. Let's work through this together!",
    },
  ];

  // Scenario text
  const scenarioText = `
You are a financial advisor working with a client who is considering financing a new BMW 3 Series. They've received two different loan offers from different lenders and want to understand which one will result in the lowest total interest cost over the life of the loan.

The first offer is a 5-year (60-month) loan with a 4.9% APR. The second offer is a 6-year (72-month) loan with a 3.5% APR. Both loans are for the same vehicle with the same purchase price and down payment.

Your task is to:
1. Calculate the monthly payment for each loan offer
2. Calculate the total interest paid over the life of each loan
3. Compare the total interest costs to determine which loan would cost less in interest
4. Explain to your client why the loan with the lower monthly payment might actually cost more in total interest over time

For each loan offer, you'll need to:
- Calculate the loan amount (price + fees - down payment)
- Calculate the monthly payment using the loan formula
- Determine the total interest by finding the difference between total payments and the loan amount

This exercise will help you understand how loan terms and interest rates affect the total cost of financing.
`;

  const OfferSelectionSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Available Loan Offers</h2>
      <p className="mb-6 text-gray-700">
        Select two offers to compare their total interest costs. We have loan offers for different vehicles and terms.
      </p>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading loan offers...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          {error}
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-blue-600">{selectedOffers.length} of 2 offers selected</p>
            {selectedOffers.length === 2 && (
              <p className="text-sm text-green-600">Ready to compare! View calculations below.</p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {loanOffers.map((offer) => (
              <div 
                key={offer.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOffers.includes(offer.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : selectedOffers.length >= 2
                      ? 'border-gray-200 opacity-60'
                      : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleSelectOffer(offer.id)}
              >
                <div className="flex flex-col h-full">
                  <div className="relative w-full h-28 overflow-hidden rounded-md mb-3">
                    <Image
                      src={offer.image}
                      alt={offer.vehicle}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {selectedOffers.includes(offer.id) && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {selectedOffers.indexOf(offer.id) + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{offer.vehicle}</h3>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                      <p className="text-gray-600">Price:</p>
                      <p className="font-medium">{formatCurrency(offer.price)}</p>
                      
                      <p className="text-gray-600">APR:</p>
                      <p className="font-medium text-blue-700">{offer.apr}%</p>
                      
                      <p className="text-gray-600">Term:</p>
                      <p className="font-medium">{offer.term} months</p>
                      
                      <p className="text-gray-600">Down Payment:</p>
                      <p className="font-medium">{formatCurrency(offer.downPayment)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <details className="text-sm">
                      <summary className="font-medium cursor-pointer">Additional Fees</summary>
                      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                        <p className="text-gray-600">Documentation Fee:</p>
                        <p>{formatCurrency(offer.additionalFees.docFee)}</p>
                        
                        <p className="text-gray-600">Sales Tax:</p>
                        <p>{offer.additionalFees.taxRate}%</p>
                        
                        <p className="text-gray-600">Title Fee:</p>
                        <p>{formatCurrency(offer.additionalFees.titleFee)}</p>
                        
                        <p className="text-gray-600">Registration Fee:</p>
                        <p>{formatCurrency(offer.additionalFees.registrationFee)}</p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const CalculationSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Total Interest Comparison</h2>
        <button
          onClick={toggleFormulaReference}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {showFormulaReference ? 'Hide Formulas' : 'Show Formulas'}
        </button>
      </div>
      
      {showFormulaReference && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 animate-fadeIn">
          <h3 className="font-bold mb-2">Formula Reference</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Step 1: Calculate the loan amount</p>
              <p className="text-gray-700">Loan Amount = Vehicle Price + Fees + Tax - Down Payment</p>
              <p className="text-gray-600 text-xs mt-1">Where:</p>
              <ul className="list-disc pl-5 text-gray-600 text-xs">
                <li>Fees = Documentation Fee + Title Fee + Registration Fee</li>
                <li>Tax = Vehicle Price × Tax Rate</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium">Step 2: Calculate monthly payment</p>
              <p className="text-gray-700">Monthly Payment = (P × r × (1 + r)^n) ÷ ((1 + r)^n - 1)</p>
              <p className="text-gray-600 text-xs mt-1">Where:</p>
              <ul className="list-disc pl-5 text-gray-600 text-xs">
                <li>P = Loan Amount</li>
                <li>r = Monthly Interest Rate (Annual Rate ÷ 12)</li>
                <li>n = Loan Term in Months</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium">Step 3: Calculate total interest</p>
              <p className="text-gray-700">Total Interest = (Monthly Payment × Term in Months) - Loan Amount</p>
            </div>
          </div>
        </div>
      )}
      
      {selectedOffers.length === 2 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {selectedOffers.map((offerId, index) => {
            const offer = loanOffers.find(o => o.id === offerId);
            if (!offer) return null;
            
            return (
              <div key={offerId} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Offer {index + 1}: {offer.term / 12} Years at {offer.apr}%</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Loan Information</h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <p>Vehicle Price:</p>
                      <p className="text-right font-medium">{formatCurrency(offer.price)}</p>
                      <p>Down Payment:</p>
                      <p className="text-right font-medium">{formatCurrency(offer.downPayment)}</p>
                      <p>Term:</p>
                      <p className="text-right font-medium">{offer.term} months</p>
                      <p>APR:</p>
                      <p className="text-right font-medium">{offer.apr}%</p>
                      <p>Loan Amount:</p>
                      <p className="text-right font-medium">{formatCurrency(calculatedValues[offerId]?.loanAmount || 0)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Step 1: Monthly Payment
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full ${
                          checkCalculationAccuracy(offerId, 'monthlyPayment') === false ? 'border-red-500' : 
                          checkCalculationAccuracy(offerId, 'monthlyPayment') === true ? 'border-green-500' : ''
                        }`}
                        placeholder="Enter monthly payment"
                        value={userCalculations[offerId]?.monthlyPayment}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers and decimal point
                          if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                            setUserCalculations({
                              ...userCalculations,
                              [offerId]: {
                                ...userCalculations[offerId],
                                monthlyPayment: value === '' ? '' : parseFloat(value)
                              }
                            });
                          }
                        }}
                      />
                      {checkCalculationAccuracy(offerId, 'monthlyPayment') !== null && (
                        <div className="ml-3">
                          {checkCalculationAccuracy(offerId, 'monthlyPayment') ? (
                            <span className="text-green-500 text-sm">✓ Correct</span>
                          ) : (
                            <span className="text-red-500 text-sm">Try again</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Step 2: Total Interest Paid
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full ${
                          checkCalculationAccuracy(offerId, 'totalInterest') === false ? 'border-red-500' : 
                          checkCalculationAccuracy(offerId, 'totalInterest') === true ? 'border-green-500' : ''
                        }`}
                        placeholder="Enter total interest"
                        value={userCalculations[offerId]?.totalInterest}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers and decimal point
                          if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                            setUserCalculations({
                              ...userCalculations,
                              [offerId]: {
                                ...userCalculations[offerId],
                                totalInterest: value === '' ? '' : parseFloat(value)
                              }
                            });
                          }
                        }}
                      />
                      {checkCalculationAccuracy(offerId, 'totalInterest') !== null && (
                        <div className="ml-3">
                          {checkCalculationAccuracy(offerId, 'totalInterest') ? (
                            <span className="text-green-500 text-sm">✓ Correct</span>
                          ) : (
                            <span className="text-red-500 text-sm">Try again</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {userCalculations[offerId].monthlyPayment !== '' && userCalculations[offerId].totalInterest !== '' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-2">Principal vs. Interest Breakdown (Based on Your Calculations)</h4>
                      {/* Use student-entered values for the breakdown, not precalculated ones */}
                      {(() => {
                        // Safely parse user values
                        const totalInterest = parseFloat(String(userCalculations[offerId].totalInterest));
                        
                        // Calculate total payments based on user's monthly payment
                        const monthlyPayment = parseFloat(String(userCalculations[offerId].monthlyPayment));
                        const totalPayments = monthlyPayment * offer.term;
                        
                        // Derive principal from user's inputs (total payments - interest)
                        const userLoanAmount = totalPayments - totalInterest;
                        
                        // Calculate percentages for visualization
                        const totalAmount = userLoanAmount + totalInterest;
                        const principalPercent = (userLoanAmount / totalAmount) * 100;
                        const interestPercent = (totalInterest / totalAmount) * 100;
                        
                        return (
                          <>
                            <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ 
                                width: `${principalPercent}%` 
                              }}>
                                <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                                  Principal<br/>{formatCurrency(userLoanAmount)}
                                </div>
                              </div>
                              <div className="absolute top-0 right-0 h-full bg-orange-500" style={{ 
                                width: `${interestPercent}%` 
                              }}>
                                <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                                  Interest<br/>{formatCurrency(totalInterest)}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <div>Principal: {formatCurrency(userLoanAmount)}</div>
                              <div>Interest: {formatCurrency(totalInterest)}</div>
                              <div>Total: {formatCurrency(totalAmount)}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              <p>Monthly Payment: {formatCurrency(monthlyPayment)} × {offer.term} months = {formatCurrency(totalPayments)}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Please select two loan offers to compare their total interest costs.
        </div>
      )}
      
      {/* Removed explicit check button since validation happens automatically */}
    </div>
  );

  return (
    <AutoLayout
      title="Total Interest Comparison"
      description="Compare two loan offers and understand how different loan terms affect the total interest paid over the life of the loan."
      scenario={scenarioText}
      initialMessages={initialMessages}
      topic="Auto Financing - Total Interest"
    >
      <div className="space-y-6">
        <OfferSelectionSection />
        
        {selectedOffers.length > 0 && (
          <CalculationSection />
        )}
      </div>
    </AutoLayout>
  );
}