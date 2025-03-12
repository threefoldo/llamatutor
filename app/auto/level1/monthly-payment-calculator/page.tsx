"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AutoLayout from "@/components/AutoLayout";
import { Message } from "@/types/chatTypes";

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

export default function MonthlyPaymentCalculator() {
  // State for loan offers
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for selected offer and calculations
  const [selectedOffer, setSelectedOffer] = useState<string>("");
  const [calculations, setCalculations] = useState<{
    loanAmount: string;
    monthlyPayment: string;
    totalInterest: string;
    totalCost: string;
  }>({
    loanAmount: "",
    monthlyPayment: "",
    totalInterest: "",
    totalCost: ""
  });
  
  // State for calculation results and tips
  const [results, setResults] = useState<{
    loanAmount: boolean | null;
    monthlyPayment: boolean | null;
    totalInterest: boolean | null;
    totalCost: boolean | null;
  }>({
    loanAmount: null,
    monthlyPayment: null,
    totalInterest: null,
    totalCost: null
  });
  
  // State for formula modal
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Initial messages for the assistant
  const initialMessages: Message[] = [
    {
      role: "system",
      content: `You are an auto finance assistant helping a client understand their loan options. Your goal is to guide them through calculating monthly payments and comparing loan offers. Be educational, explain formulas, and guide them step by step through the calculations.
      
      If the user needs to calculate a monthly payment, guide them through using the formula: Payment = P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1), where:
      - P = Principal (loan amount)
      - r = Monthly interest rate (annual rate divided by 12 and converted to decimal)
      - n = Loan term in months
      
      Explain that the loan amount should include:
      1. Vehicle price
      2. Plus documentation fee (docFee)
      3. Plus sales tax (price × taxRate%)
      4. Plus title and registration fees
      5. Minus down payment
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand your loan options and calculate the monthly payments for the vehicle you're considering. Let's work through this together!",
    },
  ];

  // Fetch loan offers from API
  useEffect(() => {
    const fetchLoanOffers = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an actual API call
        // For now, simulate an API response with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample loan data (in a real app, this would come from the API)
        const data = [
          {
            id: "offer1",
            vehicle: "Honda Civic 2024",
            price: 26500,
            apr: 3.9,
            term: 60, // 5 years in months
            downPayment: 3000,
            image: "/imgs/honda_civic.jpg",
            additionalFees: {
              docFee: 499,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 365,
            },
          },
          {
            id: "offer2",
            vehicle: "Honda Civic 2024",
            price: 26500,
            apr: 2.9,
            term: 72, // 6 years in months
            downPayment: 3000,
            image: "/imgs/honda_civic.jpg",
            additionalFees: {
              docFee: 499,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 365,
            },
          },
          {
            id: "offer3",
            vehicle: "Tesla Model 3",
            price: 42990,
            apr: 4.2,
            term: 60, // 5 years in months
            downPayment: 5000,
            image: "/imgs/tesla_model3.jpg",
            additionalFees: {
              docFee: 599,
              taxRate: 6.5, // percentage
              titleFee: 75,
              registrationFee: 400,
            },
          },
        ];
        
        setLoanOffers(data);
        setSelectedOffer(data[0].id);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch loan offers. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchLoanOffers();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffer(offerId);
    // Reset calculations and results
    setCalculations({
      loanAmount: "",
      monthlyPayment: "",
      totalInterest: "",
      totalCost: ""
    });
    setResults({
      loanAmount: null,
      monthlyPayment: null,
      totalInterest: null,
      totalCost: null
    });
  };

  const calculateLoanAmount = (offer: LoanOffer) => {
    if (!offer) return null;
    
    const salesTax = offer.price * (offer.additionalFees.taxRate / 100);
    const totalFees = offer.additionalFees.docFee + 
                    salesTax + 
                    offer.additionalFees.titleFee + 
                    offer.additionalFees.registrationFee;
    
    return offer.price + totalFees - offer.downPayment;
  };

  const calculateMonthlyPayment = (offer: LoanOffer) => {
    if (!offer) return null;
    
    const principal = calculateLoanAmount(offer) || 0;
    const monthlyRate = offer.apr / 100 / 12;
    const termMonths = offer.term;
    
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    return payment;
  };

  const calculateTotalInterest = (offer: LoanOffer) => {
    if (!offer) return null;
    const principal = calculateLoanAmount(offer) || 0;
    const monthlyPayment = calculateMonthlyPayment(offer) || 0;
    const totalPaid = monthlyPayment * offer.term;
    return totalPaid - principal;
  };

  const calculateTotalCost = (offer: LoanOffer) => {
    const monthlyPayment = calculateMonthlyPayment(offer) || 0;
    return monthlyPayment * offer.term;
  };

  const handleInputChange = (field: string, value: string) => {
    setCalculations(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset result for this field
    setResults(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const checkAllCalculations = () => {
    const selectedLoanOffer = loanOffers.find(offer => offer.id === selectedOffer);
    if (!selectedLoanOffer) return;
    
    const correctLoanAmount = calculateLoanAmount(selectedLoanOffer) || 0;
    const correctMonthlyPayment = calculateMonthlyPayment(selectedLoanOffer) || 0;
    const correctTotalInterest = calculateTotalInterest(selectedLoanOffer) || 0;
    const correctTotalCost = calculateTotalCost(selectedLoanOffer) || 0;
    
    // Check loan amount
    const loanAmountValue = parseFloat(calculations.loanAmount);
    const loanAmountDiff = isNaN(loanAmountValue) ? Infinity : Math.abs(loanAmountValue - correctLoanAmount) / correctLoanAmount * 100;
    
    // Check monthly payment
    const monthlyPaymentValue = parseFloat(calculations.monthlyPayment);
    const monthlyPaymentDiff = isNaN(monthlyPaymentValue) ? Infinity : Math.abs(monthlyPaymentValue - correctMonthlyPayment) / correctMonthlyPayment * 100;
    
    // Check total interest
    const totalInterestValue = parseFloat(calculations.totalInterest);
    const totalInterestDiff = isNaN(totalInterestValue) ? Infinity : Math.abs(totalInterestValue - correctTotalInterest) / correctTotalInterest * 100;
    
    // Check total cost
    const totalCostValue = parseFloat(calculations.totalCost);
    const totalCostDiff = isNaN(totalCostValue) ? Infinity : Math.abs(totalCostValue - correctTotalCost) / correctTotalCost * 100;
    
    // Set results with 2% margin of error
    setResults({
      loanAmount: loanAmountDiff <= 2,
      monthlyPayment: monthlyPaymentDiff <= 2,
      totalInterest: totalInterestDiff <= 2,
      totalCost: totalCostDiff <= 2
    });
    
    // If any calculation is wrong, show the formula modal
    if (loanAmountDiff > 2 || monthlyPaymentDiff > 2 || totalInterestDiff > 2 || totalCostDiff > 2) {
      setShowFormulaModal(true);
    }
  };
  
  const toggleFormulaModal = () => {
    setShowFormulaModal(!showFormulaModal);
  };
  
  // Handle clicks outside the modal to close it
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowFormulaModal(false);
    }
  };
  
  // Scenario text to display in the header (in Markdown format)
  const scenarioText = `
You're helping a client who is considering financing a new vehicle. They've received different loan offers from 
different lenders and want to understand which one will result in a lower overall cost.

### Your Tasks
1. **Calculate the total loan amount** for each offer, including all fees and taxes
2. **Calculate the monthly payment** using the PMT formula
3. **Calculate the total interest** paid over the life of the loan
4. **Calculate the total cost** of the loan (principal + interest)
5. **Determine which offer** provides the best overall value

### Key Information
- The offers are for different vehicles with different prices and terms
- You need to account for all fees, taxes, and the down payment
- The monthly payment calculation must use the standard PMT formula
  `;

  return (
    <AutoLayout 
      title="Auto Loan Monthly Payment Calculator"
      description="Practice calculating monthly payments for auto loans by analyzing loan offers and their terms."
      scenario={scenarioText}
      initialMessages={initialMessages}
      topic="Monthly Payment Calculation"
    >
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-lg text-gray-600">Loading loan offers...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Loan Offers Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select a Loan Offer to Analyze</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {loanOffers.map((offer) => {
                const salesTax = offer.price * (offer.additionalFees.taxRate / 100);
                const totalFees = offer.additionalFees.docFee + salesTax + 
                  offer.additionalFees.titleFee + offer.additionalFees.registrationFee;
                
                return (
                  <div 
                    key={offer.id}
                    className={`border rounded-lg shadow-sm cursor-pointer transition ${
                      selectedOffer === offer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectOffer(offer.id)}
                  >
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image
                        src={offer.image}
                        alt={offer.vehicle}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold mb-1">{offer.vehicle}</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                        <p className="text-gray-600">Price:</p>
                        <p className="font-medium">{formatCurrency(offer.price)}</p>
                        
                        <p className="text-gray-600">APR:</p>
                        <p className="font-medium">{offer.apr}%</p>
                        
                        <p className="text-gray-600">Term:</p>
                        <p className="font-medium">{offer.term} months</p>
                        
                        <p className="text-gray-600">Down Payment:</p>
                        <p className="font-medium">{formatCurrency(offer.downPayment)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Selected Offer Details */}
          {loanOffers.length > 0 && selectedOffer && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {(() => {
                const offer = loanOffers.find(o => o.id === selectedOffer);
                if (!offer) return null;
                
                const salesTax = offer.price * (offer.additionalFees.taxRate / 100);
                const totalFees = offer.additionalFees.docFee + salesTax + 
                  offer.additionalFees.titleFee + offer.additionalFees.registrationFee;
                const correctLoanAmount = calculateLoanAmount(offer) || 0;
                const monthlyRate = offer.apr / 100 / 12;
                const correctMonthlyPayment = calculateMonthlyPayment(offer) || 0;
                const correctTotalInterest = calculateTotalInterest(offer) || 0;
                const correctTotalCost = calculateTotalCost(offer) || 0;
                
                const allCorrect = 
                  results.loanAmount === true && 
                  results.monthlyPayment === true && 
                  results.totalInterest === true && 
                  results.totalCost === true;
                
                return (
                  <>
                    <h3 className="text-xl font-bold mb-4">{offer.vehicle} Details</h3>
                    
                    {/* Vehicle and Loan Terms */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium mb-2">Vehicle & Loan Terms</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <p className="text-gray-600">Vehicle:</p>
                          <p>{offer.vehicle}</p>
                          
                          <p className="text-gray-600">Price:</p>
                          <p>{formatCurrency(offer.price)}</p>
                          
                          <p className="text-gray-600">APR:</p>
                          <p>{offer.apr}%</p>
                          
                          <p className="text-gray-600">Term:</p>
                          <p>{offer.term} months ({Math.floor(offer.term/12)} years)</p>
                          
                          <p className="text-gray-600">Down Payment:</p>
                          <p>{formatCurrency(offer.downPayment)}</p>
                          
                          <p className="text-gray-600">Monthly Rate:</p>
                          <p>{(monthlyRate * 100).toFixed(4)}%</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Additional Fees & Taxes</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <p className="text-gray-600">Documentation Fee:</p>
                          <p>{formatCurrency(offer.additionalFees.docFee)}</p>
                          
                          <p className="text-gray-600">Title Fee:</p>
                          <p>{formatCurrency(offer.additionalFees.titleFee)}</p>
                          
                          <p className="text-gray-600">Registration Fee:</p>
                          <p>{formatCurrency(offer.additionalFees.registrationFee)}</p>
                          
                          <p className="text-gray-600">Sales Tax Rate:</p>
                          <p>{offer.additionalFees.taxRate}%</p>
                          
                          <p className="text-gray-600">Sales Tax Amount:</p>
                          <p>{formatCurrency(salesTax)}</p>
                          
                          <p className="text-gray-600 font-medium">Total Fees & Taxes:</p>
                          <p className="font-medium">{formatCurrency(totalFees)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Calculation Form */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Your Calculations</h4>
                        <button
                          onClick={toggleFormulaModal}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
                        >
                          Show Formulas & Tips
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Loan Amount:</label>
                            <input
                              type="number"
                              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${results.loanAmount === false ? 'border-red-500' : ''}`}
                              placeholder="Enter loan amount"
                              value={calculations.loanAmount}
                              onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                            />
                            {results.loanAmount === false && (
                              <p className="text-red-500 text-xs mt-1">Incorrect. Check your calculations.</p>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Monthly Payment:</label>
                            <input
                              type="number"
                              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${results.monthlyPayment === false ? 'border-red-500' : ''}`}
                              placeholder="Enter monthly payment"
                              value={calculations.monthlyPayment}
                              onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                            />
                            {results.monthlyPayment === false && (
                              <p className="text-red-500 text-xs mt-1">Incorrect. Check the PMT formula.</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Total Interest:</label>
                            <input
                              type="number"
                              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${results.totalInterest === false ? 'border-red-500' : ''}`}
                              placeholder="Enter total interest"
                              value={calculations.totalInterest}
                              onChange={(e) => handleInputChange('totalInterest', e.target.value)}
                            />
                            {results.totalInterest === false && (
                              <p className="text-red-500 text-xs mt-1">Incorrect. Remember: Total Interest = (Monthly Payment × Term) - Loan Amount</p>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Total Cost (Principal + Interest):</label>
                            <input
                              type="number"
                              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${results.totalCost === false ? 'border-red-500' : ''}`}
                              placeholder="Enter total cost"
                              value={calculations.totalCost}
                              onChange={(e) => handleInputChange('totalCost', e.target.value)}
                            />
                            {results.totalCost === false && (
                              <p className="text-red-500 text-xs mt-1">Incorrect. Remember: Total Cost = Monthly Payment × Term</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-6">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-sm"
                          onClick={checkAllCalculations}
                        >
                          Check All Calculations
                        </button>
                      </div>
                    </div>
                    
                    {/* Results Section */}
                    {allCorrect && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-green-800 font-semibold mb-3">Congratulations! All calculations are correct</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-green-800 mb-2">Loan Summary</h5>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <p className="text-gray-600">Loan Amount:</p>
                              <p className="font-medium">{formatCurrency(correctLoanAmount)}</p>
                              
                              <p className="text-gray-600">Monthly Payment:</p>
                              <p className="font-medium">{formatCurrency(correctMonthlyPayment)}</p>
                              
                              <p className="text-gray-600">Total Interest:</p>
                              <p className="font-medium">{formatCurrency(correctTotalInterest)}</p>
                              
                              <p className="text-gray-600">Total Cost:</p>
                              <p className="font-medium">{formatCurrency(correctTotalCost)}</p>
                              
                              <p className="text-gray-600">Total with Down Payment:</p>
                              <p className="font-medium">{formatCurrency(correctTotalCost + offer.downPayment)}</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-green-800 mb-2">Other Insights</h5>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <p className="text-gray-600">Interest as % of Loan:</p>
                              <p className="font-medium">{((correctTotalInterest / correctLoanAmount) * 100).toFixed(1)}%</p>
                              
                              <p className="text-gray-600">Monthly Payment as % of Price:</p>
                              <p className="font-medium">{((correctMonthlyPayment / offer.price) * 100).toFixed(2)}%</p>
                              
                              <p className="text-gray-600">Total Cost vs Vehicle Price:</p>
                              <p className="font-medium">{((correctTotalCost / offer.price) * 100).toFixed(1)}%</p>
                              
                              <p className="text-gray-600">Interest Per Year:</p>
                              <p className="font-medium">{formatCurrency(correctTotalInterest / (offer.term / 12))}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          
          {/* Formula Modal */}
          {showFormulaModal && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={handleModalClick}
            >
              <div 
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Auto Loan Calculation Formulas & Tips</h2>
                  <button 
                    onClick={() => setShowFormulaModal(false)}
                    className="text-white hover:text-gray-200 focus:outline-none text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Loan Amount Calculation</h3>
                      <div className="bg-blue-50 p-4 rounded mb-4">
                        <p className="font-medium">Formula:</p>
                        <div className="px-3 py-2 bg-white rounded border border-blue-100 my-2 font-mono text-sm">
                          Loan Amount = Vehicle Price + Total Fees - Down Payment
                        </div>
                        <p className="text-sm">Where Total Fees includes:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                          <li>Documentation Fee</li>
                          <li>Sales Tax (Vehicle Price × Tax Rate)</li>
                          <li>Title Fee</li>
                          <li>Registration Fee</li>
                        </ul>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3">Monthly Payment Calculation</h3>
                      <div className="bg-blue-50 p-4 rounded">
                        <p className="font-medium">PMT Formula:</p>
                        <div className="px-3 py-2 bg-white rounded border border-blue-100 my-2 font-mono text-sm">
                          Payment = P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)
                        </div>
                        <p className="text-sm mb-2">Where:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>P = Principal (loan amount)</li>
                          <li>r = Monthly interest rate (APR ÷ 12 ÷ 100)</li>
                          <li>n = Loan term in months</li>
                          <li>^ represents exponentiation (raising to a power)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Total Interest Calculation</h3>
                      <div className="bg-blue-50 p-4 rounded mb-4">
                        <p className="font-medium">Formula:</p>
                        <div className="px-3 py-2 bg-white rounded border border-blue-100 my-2 font-mono text-sm">
                          Total Interest = (Monthly Payment × Term) - Loan Amount
                        </div>
                        <p className="text-sm">This represents all the interest you'll pay over the life of the loan.</p>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3">Total Cost Calculation</h3>
                      <div className="bg-blue-50 p-4 rounded mb-4">
                        <p className="font-medium">Formula:</p>
                        <div className="px-3 py-2 bg-white rounded border border-blue-100 my-2 font-mono text-sm">
                          Total Cost = Monthly Payment × Term
                        </div>
                        <p className="text-sm">This represents the total amount you'll pay over the life of the loan (principal + interest).</p>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3">Calculation Tips</h3>
                      <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                          <li>When calculating the monthly rate, make sure to divide the APR by 1200 (12 months × 100 to convert from percentage to decimal)</li>
                          <li>For a 3.9% APR, the monthly rate would be 0.039 ÷ 12 = 0.00325 or 0.325%</li>
                          <li>Remember to include all fees when calculating the loan amount</li>
                          <li>The total cost with down payment = Total Cost + Down Payment</li>
                          <li>Always double-check your math to ensure accuracy</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Example Calculation */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Example Calculation</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="font-medium mb-2">For a $25,000 car with 4% APR for 60 months and $3,000 down payment:</p>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li><strong>Fees:</strong> $500 doc fee, 6% sales tax ($1,500), $75 title, $300 registration = $2,375 total fees</li>
                        <li><strong>Loan Amount:</strong> $25,000 + $2,375 - $3,000 = $24,375</li>
                        <li><strong>Monthly Rate:</strong> 4% ÷ 12 ÷ 100 = 0.0033333</li>
                        <li><strong>Monthly Payment:</strong> $24,375 × (0.0033333 × (1 + 0.0033333)^60) ÷ ((1 + 0.0033333)^60 - 1) = $449.13</li>
                        <li><strong>Total Cost:</strong> $449.13 × 60 = $26,947.80</li>
                        <li><strong>Total Interest:</strong> $26,947.80 - $24,375 = $2,572.80</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AutoLayout>
  );
}