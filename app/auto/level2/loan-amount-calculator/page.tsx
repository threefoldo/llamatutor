"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Chat from "@/components/Chat";

interface VehiclePurchase {
  id: string;
  vehicle: string;
  msrp: number;
  salePrice: number;
  tradeInValue: number;
  downPayment: number;
  rebates: number;
  image: string;
  fees: {
    docFee: number;
    destinationFee: number;
    titleFee: number;
    registrationFee: number;
    salesTaxRate: number;
  };
}

const vehiclePurchase: VehiclePurchase = {
  id: "purchase1",
  vehicle: "Honda Civic 2024 EX",
  msrp: 27250,
  salePrice: 26500,
  tradeInValue: 8000,
  downPayment: 3000,
  rebates: 500,
  image: "/imgs/honda_civic.jpg",
  fees: {
    docFee: 499,
    destinationFee: 1095,
    titleFee: 75,
    registrationFee: 365,
    salesTaxRate: 6.5, // percentage
  },
};

export default function LoanAmountCalculator() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client understand how to calculate their loan amount when purchasing a vehicle. Your goal is to guide them through analyzing all the components that make up the final loan amount. Be educational, explain each component, and guide them step by step.
      
      Explain to the client:
      - How to calculate the actual amount financed (loan amount)
      - Which fees are typically added to the vehicle price
      - How trade-in and down payment reduce the loan amount
      - How sales tax is calculated (typically on the sale price minus trade-in in most states)
      - How rebates impact the final amount financed
      
      The loan amount calculation typically follows this formula:
      Loan Amount = (Sale Price + Fees + Sales Tax) - (Trade-in Value + Down Payment + Rebates)
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand how to calculate the actual loan amount for your Honda Civic purchase. There are several components that affect your final loan amount, including the sale price, fees, taxes, trade-in, down payment, and rebates. Let's work through this together!",
    },
  ]);
  const [promptValue, setPromptValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChat = async () => {
    if (!promptValue.trim() || isLoading) return;

    const userMessage = { role: "user", content: promptValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setPromptValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value);
          text += chunkValue;
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: text,
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [purchaseAgreementView, setPurchaseAgreementView] = useState('document'); // 'document' or 'calculation'
  
  const [userCalculations, setUserCalculations] = useState({
    subtotal: null as number | null,
    salesTax: null as number | null,
    totalPrice: null as number | null,
    totalCredits: null as number | null,
    loanAmount: null as number | null,
  });
  
  const [calculationFeedback, setCalculationFeedback] = useState({
    subtotal: null as boolean | null,
    salesTax: null as boolean | null,
    totalPrice: null as boolean | null,
    totalCredits: null as boolean | null,
    loanAmount: null as boolean | null,
  });

  // Calculate correct values
  const calculateSubtotal = () => {
    return vehiclePurchase.salePrice + 
           vehiclePurchase.fees.docFee +
           vehiclePurchase.fees.destinationFee +
           vehiclePurchase.fees.titleFee + 
           vehiclePurchase.fees.registrationFee;
  };

  const calculateSalesTax = () => {
    // In most states, sales tax is calculated on (sale price - trade-in)
    const taxableAmount = Math.max(0, vehiclePurchase.salePrice - vehiclePurchase.tradeInValue);
    return taxableAmount * (vehiclePurchase.fees.salesTaxRate / 100);
  };

  const calculateTotalPrice = () => {
    return calculateSubtotal() + calculateSalesTax();
  };

  const calculateTotalCredits = () => {
    return vehiclePurchase.tradeInValue + vehiclePurchase.downPayment + vehiclePurchase.rebates;
  };

  const calculateLoanAmount = () => {
    return calculateTotalPrice() - calculateTotalCredits();
  };

  const checkCalculation = (type: keyof typeof userCalculations) => {
    if (userCalculations[type] === null) return null;
    
    let correctValue: number;
    switch (type) {
      case 'subtotal':
        correctValue = calculateSubtotal();
        break;
      case 'salesTax':
        correctValue = calculateSalesTax();
        break;
      case 'totalPrice':
        correctValue = calculateTotalPrice();
        break;
      case 'totalCredits':
        correctValue = calculateTotalCredits();
        break;
      case 'loanAmount':
        correctValue = calculateLoanAmount();
        break;
      default:
        return null;
    }
    
    const difference = Math.abs((userCalculations[type] as number) - correctValue);
    const percentDifference = (difference / correctValue) * 100;
    
    return percentDifference < 2; // Allow for small rounding differences
  };

  const handleCalculationCheck = (type: keyof typeof userCalculations) => {
    const isCorrect = checkCalculation(type);
    setCalculationFeedback(prev => ({
      ...prev,
      [type]: isCorrect
    }));
    
    if (type === 'loanAmount' && isCorrect) {
      setPromptValue(`I calculated the final loan amount to be ${formatCurrency(userCalculations.loanAmount as number)}. Can you explain how this breaks down and why it's different from the vehicle's sale price of ${formatCurrency(vehiclePurchase.salePrice)}?`);
      handleChat();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleView = () => {
    setPurchaseAgreementView(prev => prev === 'document' ? 'calculation' : 'document');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Loan Amount Calculator</h1>
          <p className="max-w-3xl">
            Learn to calculate the actual loan amount by analyzing all components of a vehicle purchase agreement.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Scenario</h2>
            <p className="mb-6 text-gray-700">
              Your client is purchasing a new Honda Civic and has received a purchase agreement. They want to understand 
              exactly how much they'll be financing after accounting for all fees, taxes, trade-in value, down payment, 
              and manufacturer rebates. Review the purchase agreement and help them calculate the final loan amount.
            </p>

            <div className="flex justify-end mb-4">
              <button
                onClick={toggleView}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded transition-colors"
              >
                {purchaseAgreementView === 'document' ? 'Switch to Calculation Mode' : 'View Purchase Agreement'}
              </button>
            </div>

            {purchaseAgreementView === 'document' ? (
              <div className="border rounded-lg p-6 mb-6 bg-white">
                <div className="text-center border-b pb-4 mb-6">
                  <h3 className="text-xl font-bold">VEHICLE PURCHASE AGREEMENT</h3>
                  <p className="text-gray-500 text-sm">HONDA OF MILLIONMINDS</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="w-full md:w-1/3">
                    <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                      <Image
                        src={vehiclePurchase.image}
                        alt={vehiclePurchase.vehicle}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <h4 className="font-semibold text-lg">{vehiclePurchase.vehicle}</h4>
                    <p className="text-sm text-gray-600">VIN: 1HGFE2F52N1234567</p>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-2 gap-y-2 mb-6">
                      <div className="col-span-2 font-semibold border-b pb-1 mb-2">Vehicle Information</div>
                      <p className="text-gray-600">MSRP:</p>
                      <p className="text-right">{formatCurrency(vehiclePurchase.msrp)}</p>
                      
                      <p className="text-gray-600">Sale Price:</p>
                      <p className="text-right font-medium bg-yellow-100 px-2 py-1 rounded">
                        {formatCurrency(vehiclePurchase.salePrice)}
                        <span className="inline-flex ml-2 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </p>
                      
                      <div className="col-span-2 font-semibold border-b pb-1 my-2">
                        Fees & Taxes
                        <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Step 1: Add these to the price
                        </span>
                      </div>
                      
                      <p className="text-gray-600 hover:bg-blue-50 transition-colors px-1 rounded cursor-help" title="Fee for processing paperwork">Documentation Fee:</p>
                      <p className="text-right bg-blue-50 px-2 rounded">{formatCurrency(vehiclePurchase.fees.docFee)}</p>
                      
                      <p className="text-gray-600 hover:bg-blue-50 transition-colors px-1 rounded cursor-help" title="Fee for shipping the vehicle to the dealership">Destination Fee:</p>
                      <p className="text-right bg-blue-50 px-2 rounded">{formatCurrency(vehiclePurchase.fees.destinationFee)}</p>
                      
                      <p className="text-gray-600 hover:bg-blue-50 transition-colors px-1 rounded cursor-help" title="Fee for new vehicle title">Title Fee:</p>
                      <p className="text-right bg-blue-50 px-2 rounded">{formatCurrency(vehiclePurchase.fees.titleFee)}</p>
                      
                      <p className="text-gray-600 hover:bg-blue-50 transition-colors px-1 rounded cursor-help" title="Fee for vehicle registration">Registration Fee:</p>
                      <p className="text-right bg-blue-50 px-2 rounded">{formatCurrency(vehiclePurchase.fees.registrationFee)}</p>
                      
                      <p className="text-gray-600 hover:bg-blue-50 transition-colors px-1 rounded cursor-help flex items-center" title="Calculated tax based on the sale price">
                        Sales Tax ({vehiclePurchase.fees.salesTaxRate}%):
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </p>
                      <p className="text-right bg-blue-50 px-2 rounded font-medium">{formatCurrency(calculateSalesTax())}</p>
                      
                      <div className="col-span-2 font-semibold border-b pb-1 my-2">
                        Credits
                        <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Step 2: Subtract these
                        </span>
                      </div>
                      
                      <p className="text-gray-600 hover:bg-green-50 transition-colors px-1 rounded cursor-help" title="Value of your current vehicle traded in">Trade-in Value:</p>
                      <p className="text-right bg-green-50 px-2 rounded">{formatCurrency(vehiclePurchase.tradeInValue)}</p>
                      
                      <p className="text-gray-600 hover:bg-green-50 transition-colors px-1 rounded cursor-help" title="Amount paid upfront">Down Payment:</p>
                      <p className="text-right bg-green-50 px-2 rounded">{formatCurrency(vehiclePurchase.downPayment)}</p>
                      
                      <p className="text-gray-600 hover:bg-green-50 transition-colors px-1 rounded cursor-help" title="Discount provided by the manufacturer">Manufacturer Rebate:</p>
                      <p className="text-right bg-green-50 px-2 rounded">{formatCurrency(vehiclePurchase.rebates)}</p>
                      
                      <div className="col-span-2 font-semibold border-b pb-1 my-2">Totals</div>
                      
                      <p className="text-gray-600 font-medium">Amount to be Financed:</p>
                      <p className="text-right font-bold text-lg bg-yellow-100 px-3 py-1 rounded-lg">{formatCurrency(calculateLoanAmount())}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 text-sm text-gray-500 italic">
                  <p>This purchase agreement contains the final terms of your vehicle purchase. Please review all details carefully before proceeding with financing.</p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Calculate the Loan Amount</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
                  <p className="text-blue-800">
                    Using the information from the purchase agreement, calculate the final loan amount that your client will be financing. Follow the step-by-step breakdown below.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-5 bg-white shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
                      <h4 className="font-semibold text-lg">Calculate the Subtotal (Vehicle Price + Fees)</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 ml-11">
                      Add the sale price and all fees (documentation, destination, title, registration).
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="relative pl-7">
                          <div className="absolute left-0 top-0 bottom-0 border-l-2 border-dotted border-gray-300"></div>
                          <p className="text-sm bg-white p-2 rounded border border-gray-200 mb-2">Sale Price: <span className="font-medium">{formatCurrency(vehiclePurchase.salePrice)}</span></p>
                          <p className="text-sm bg-white p-2 rounded border border-gray-200 mb-2">+ Doc Fee: <span className="font-medium">{formatCurrency(vehiclePurchase.fees.docFee)}</span></p>
                          <p className="text-sm bg-white p-2 rounded border border-gray-200 mb-2">+ Destination: <span className="font-medium">{formatCurrency(vehiclePurchase.fees.destinationFee)}</span></p>
                          <p className="text-sm bg-white p-2 rounded border border-gray-200 mb-2">+ Title: <span className="font-medium">{formatCurrency(vehiclePurchase.fees.titleFee)}</span></p>
                          <p className="text-sm bg-white p-2 rounded border border-gray-200">+ Registration: <span className="font-medium">{formatCurrency(vehiclePurchase.fees.registrationFee)}</span></p>
                        </div>
                        <div className="flex flex-col justify-center">
                          <label className="text-sm font-medium text-gray-700 mb-1">Your calculation:</label>
                          <div className="flex items-center w-full">
                            <div className="relative flex-grow">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">$</span>
                              <input
                                type="number"
                                className="shadow appearance-none border rounded py-3 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                                placeholder="Enter subtotal"
                                value={userCalculations.subtotal === null ? '' : userCalculations.subtotal}
                                onChange={(e) => setUserCalculations({
                                  ...userCalculations,
                                  subtotal: e.target.value ? parseFloat(e.target.value) : null
                                })}
                              />
                            </div>
                            <button
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded"
                              onClick={() => handleCalculationCheck('subtotal')}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <div className="mx-4 text-gray-500 font-medium">Subtotal Calculation</div>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      
                      <div className="mt-2 p-3 bg-white rounded-lg">
                        <p className="text-sm text-gray-700">Formula: <span className="font-medium">Sale Price + Documentation Fee + Destination Fee + Title Fee + Registration Fee</span></p>
                      </div>
                    </div>
                    {calculationFeedback.subtotal !== null && (
                      <div className={`mt-2 p-3 rounded-lg ${calculationFeedback.subtotal ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {calculationFeedback.subtotal ? (
                              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">
                              {calculationFeedback.subtotal 
                                ? 'Correct! You\'ve calculated the subtotal correctly.' 
                                : 'That\'s not quite right. Remember to add all fees to the sale price.'}
                            </p>
                            {!calculationFeedback.subtotal && (
                              <p className="mt-1 text-sm">
                                Review each line item and make sure all values are included in your addition.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 2: Calculate the Sales Tax</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Calculate sales tax on the taxable amount (sale price minus trade-in in most states).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">Sale Price: {formatCurrency(vehiclePurchase.salePrice)}</p>
                        <p className="text-sm">- Trade-in Value: {formatCurrency(vehiclePurchase.tradeInValue)}</p>
                        <p className="text-sm">= Taxable Amount: {formatCurrency(Math.max(0, vehiclePurchase.salePrice - vehiclePurchase.tradeInValue))}</p>
                        <p className="text-sm">× Tax Rate: {vehiclePurchase.fees.salesTaxRate}%</p>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center w-full">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                            placeholder="Enter sales tax"
                            value={userCalculations.salesTax === null ? '' : userCalculations.salesTax}
                            onChange={(e) => setUserCalculations({
                              ...userCalculations,
                              salesTax: e.target.value ? parseFloat(e.target.value) : null
                            })}
                          />
                          <button
                            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                            onClick={() => handleCalculationCheck('salesTax')}
                          >
                            Check
                          </button>
                        </div>
                      </div>
                    </div>
                    {calculationFeedback.salesTax !== null && (
                      <div className={`mt-2 text-sm ${calculationFeedback.salesTax ? 'text-green-600' : 'text-red-600'}`}>
                        {calculationFeedback.salesTax 
                          ? 'Correct! You\'ve calculated the sales tax correctly.' 
                          : 'That\'s not quite right. Remember that in most states, you only pay tax on the sale price minus trade-in value.'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 3: Calculate the Total Price</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Add the subtotal and sales tax.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">Subtotal: {userCalculations.subtotal !== null && calculationFeedback.subtotal 
                          ? formatCurrency(userCalculations.subtotal) 
                          : 'Calculate in Step 1'}</p>
                        <p className="text-sm">+ Sales Tax: {userCalculations.salesTax !== null && calculationFeedback.salesTax 
                          ? formatCurrency(userCalculations.salesTax) 
                          : 'Calculate in Step 2'}</p>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center w-full">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                            placeholder="Enter total price"
                            value={userCalculations.totalPrice === null ? '' : userCalculations.totalPrice}
                            onChange={(e) => setUserCalculations({
                              ...userCalculations,
                              totalPrice: e.target.value ? parseFloat(e.target.value) : null
                            })}
                          />
                          <button
                            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                            onClick={() => handleCalculationCheck('totalPrice')}
                            disabled={!calculationFeedback.subtotal || !calculationFeedback.salesTax}
                          >
                            Check
                          </button>
                        </div>
                      </div>
                    </div>
                    {calculationFeedback.totalPrice !== null && (
                      <div className={`mt-2 text-sm ${calculationFeedback.totalPrice ? 'text-green-600' : 'text-red-600'}`}>
                        {calculationFeedback.totalPrice 
                          ? 'Correct! You\'ve calculated the total price correctly.' 
                          : 'That\'s not quite right. Add the subtotal and sales tax to get the total price.'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 4: Calculate Total Credits</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Add all credits (trade-in value, down payment, rebates).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">Trade-in Value: {formatCurrency(vehiclePurchase.tradeInValue)}</p>
                        <p className="text-sm">+ Down Payment: {formatCurrency(vehiclePurchase.downPayment)}</p>
                        <p className="text-sm">+ Rebates: {formatCurrency(vehiclePurchase.rebates)}</p>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center w-full">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                            placeholder="Enter total credits"
                            value={userCalculations.totalCredits === null ? '' : userCalculations.totalCredits}
                            onChange={(e) => setUserCalculations({
                              ...userCalculations,
                              totalCredits: e.target.value ? parseFloat(e.target.value) : null
                            })}
                          />
                          <button
                            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                            onClick={() => handleCalculationCheck('totalCredits')}
                          >
                            Check
                          </button>
                        </div>
                      </div>
                    </div>
                    {calculationFeedback.totalCredits !== null && (
                      <div className={`mt-2 text-sm ${calculationFeedback.totalCredits ? 'text-green-600' : 'text-red-600'}`}>
                        {calculationFeedback.totalCredits 
                          ? 'Correct! You\'ve calculated the total credits correctly.' 
                          : 'That\'s not quite right. Add trade-in value, down payment, and rebates.'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 5: Calculate the Final Loan Amount</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Subtract total credits from total price.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">Total Price: {userCalculations.totalPrice !== null && calculationFeedback.totalPrice 
                          ? formatCurrency(userCalculations.totalPrice) 
                          : 'Calculate in Step 3'}</p>
                        <p className="text-sm">- Total Credits: {userCalculations.totalCredits !== null && calculationFeedback.totalCredits 
                          ? formatCurrency(userCalculations.totalCredits) 
                          : 'Calculate in Step 4'}</p>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center w-full">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                            placeholder="Enter loan amount"
                            value={userCalculations.loanAmount === null ? '' : userCalculations.loanAmount}
                            onChange={(e) => setUserCalculations({
                              ...userCalculations,
                              loanAmount: e.target.value ? parseFloat(e.target.value) : null
                            })}
                          />
                          <button
                            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                            onClick={() => handleCalculationCheck('loanAmount')}
                            disabled={!calculationFeedback.totalPrice || !calculationFeedback.totalCredits}
                          >
                            Check
                          </button>
                        </div>
                      </div>
                    </div>
                    {calculationFeedback.loanAmount !== null && (
                      <div className={`mt-2 text-sm ${calculationFeedback.loanAmount ? 'text-green-600' : 'text-red-600'}`}>
                        {calculationFeedback.loanAmount 
                          ? 'Correct! You\'ve calculated the final loan amount correctly.' 
                          : 'That\'s not quite right. Subtract total credits from total price to get the loan amount.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Helpful Reference</h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Loan Amount Formula:</strong> (Vehicle Price + Fees + Sales Tax) - (Trade-in + Down Payment + Rebates)
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>
                  <strong>Vehicle Price:</strong> The negotiated price of the vehicle (not the MSRP)
                </li>
                <li>
                  <strong>Fees:</strong> Include documentation fee, destination fee, title fee, registration fee, etc.
                </li>
                <li>
                  <strong>Sales Tax:</strong> Typically calculated on (sale price - trade-in value) in most states
                </li>
                <li>
                  <strong>Trade-in Value:</strong> Amount the dealer gives you for your current vehicle
                </li>
                <li>
                  <strong>Down Payment:</strong> Cash you pay upfront
                </li>
                <li>
                  <strong>Rebates:</strong> Manufacturer or dealer incentives that reduce the amount financed
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-auto bg-white shadow-md lg:shadow-none z-10 ${
          isChatOpen ? 'h-[400px] lg:h-auto lg:flex-1' : 'h-12'
        } transition-all duration-300`}>
          <div 
            className="bg-blue-700 text-white py-3 px-4 flex justify-between items-center cursor-pointer"
            onClick={toggleChat}
          >
            <h3 className="font-bold">Finance Assistant</h3>
            <button className="focus:outline-none">
              {isChatOpen ? '▼' : '▲'}
            </button>
          </div>
          
          {isChatOpen && (
            <div className="h-[calc(100%-48px)] lg:h-[calc(100vh-48px)] overflow-hidden">
              <Chat
                messages={messages}
                disabled={isLoading}
                promptValue={promptValue}
                setPromptValue={setPromptValue}
                setMessages={setMessages}
                handleChat={handleChat}
                topic="Loan Amount Calculation"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}