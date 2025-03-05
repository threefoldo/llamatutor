"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Chat from "@/components/Chat";

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

const loanOffers: LoanOffer[] = [
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
];

export default function TotalInterestComparison() {
  const router = useRouter();
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [userCalculations, setUserCalculations] = useState<{
    [key: string]: {
      monthlyPayment: number | null;
      totalInterest: number | null;
    };
  }>({
    offer1: { monthlyPayment: null, totalInterest: null },
    offer2: { monthlyPayment: null, totalInterest: null },
  });
  const [calculatedValues, setCalculatedValues] = useState<{
    [key: string]: {
      loanAmount: number;
      monthlyPayment: number;
      totalInterest: number;
    };
  }>({});

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

  useEffect(() => {
    const newCalculatedValues: {[key: string]: any} = {};
    
    loanOffers.forEach(offer => {
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
  }, []);

  const handleSubmitCalculation = () => {
    if (selectedOffers.length !== 2) return;
    
    const offerLabels = {
      [selectedOffers[0]]: "first", 
      [selectedOffers[1]]: "second"
    };
    
    const totalInterestComparison = 
      userCalculations[selectedOffers[0]].totalInterest && 
      userCalculations[selectedOffers[1]].totalInterest ? 
      `I've calculated the total interest for both loan options:
      
      ${offerLabels[selectedOffers[0]]} offer: ${formatCurrency(userCalculations[selectedOffers[0]].totalInterest!)}
      ${offerLabels[selectedOffers[1]]} offer: ${formatCurrency(userCalculations[selectedOffers[1]].totalInterest!)}
      
      Can you confirm if my calculations are correct and explain why the offer with the lower monthly payment might end up costing more in total interest?` : 
      "I'm trying to calculate the total interest on these two loans. Can you walk me through how to do it?";
    
    setPromptValue(totalInterestComparison);
    handleChat();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const checkCalculationAccuracy = (offerId: string, type: 'monthlyPayment' | 'totalInterest') => {
    if (!userCalculations[offerId][type] || !calculatedValues[offerId]) return null;
    
    const userValue = userCalculations[offerId][type]!;
    const calculatedValue = calculatedValues[offerId][type];
    const difference = Math.abs(userValue - calculatedValue);
    const percentDifference = (difference / calculatedValue) * 100;
    
    return percentDifference < 2; // Allow for some rounding differences
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Total Interest Comparison</h1>
          <p className="max-w-3xl">
            Compare two loan offers and understand how different loan terms affect the total interest paid over the life of the loan.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Scenario</h2>
            <p className="mb-6 text-gray-700">
              You're helping a client who is considering financing a new BMW 3 Series. They've received two different loan offers from 
              different lenders and want to understand which one will result in the lowest total interest cost over the life of the loan. 
              Select both offers to compare them side by side.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {loanOffers.map((offer) => (
                <div 
                  key={offer.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedOffers.includes(offer.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectOffer(offer.id)}
                >
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-48 h-32 overflow-hidden rounded-md">
                      <Image
                        src={offer.image}
                        alt={offer.vehicle}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{offer.vehicle}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium mb-2">Additional Fees:</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <p className="text-gray-600">Documentation Fee:</p>
                      <p>{formatCurrency(offer.additionalFees.docFee)}</p>
                      
                      <p className="text-gray-600">Sales Tax:</p>
                      <p>{offer.additionalFees.taxRate}%</p>
                      
                      <p className="text-gray-600">Title Fee:</p>
                      <p>{formatCurrency(offer.additionalFees.titleFee)}</p>
                      
                      <p className="text-gray-600">Registration Fee:</p>
                      <p>{formatCurrency(offer.additionalFees.registrationFee)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedOffers.length === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Total Interest Comparison</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {selectedOffers.map((offerId, index) => {
                  const offer = loanOffers.find(o => o.id === offerId);
                  if (!offer) return null;
                  
                  return (
                    <div key={offerId} className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Offer {index + 1}: {offer.term / 12} Years at {offer.apr}%</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Step 1: Monthly Payment
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                              placeholder="Enter monthly payment"
                              value={userCalculations[offerId].monthlyPayment === null ? '' : userCalculations[offerId].monthlyPayment}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                [offerId]: {
                                  ...userCalculations[offerId],
                                  monthlyPayment: e.target.value ? parseFloat(e.target.value) : null
                                }
                              })}
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
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                              placeholder="Enter total interest"
                              value={userCalculations[offerId].totalInterest === null ? '' : userCalculations[offerId].totalInterest}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                [offerId]: {
                                  ...userCalculations[offerId],
                                  totalInterest: e.target.value ? parseFloat(e.target.value) : null
                                }
                              })}
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
                        
                        {calculatedValues[offerId] && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ 
                                width: `${(calculatedValues[offerId].loanAmount / (calculatedValues[offerId].loanAmount + calculatedValues[offerId].totalInterest)) * 100}%` 
                              }}>
                                <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                                  Principal
                                </div>
                              </div>
                              <div className="absolute top-0 right-0 h-full bg-orange-500" style={{ 
                                width: `${(calculatedValues[offerId].totalInterest / (calculatedValues[offerId].loanAmount + calculatedValues[offerId].totalInterest)) * 100}%` 
                              }}>
                                <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                                  Interest
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleSubmitCalculation}
                >
                  Verify My Calculations
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <h3 className="font-bold mb-2">Helpful Formula Reference</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Total Interest Formula:</strong> (Monthly Payment × Number of Payments) - Principal Amount
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  <li>Monthly Payment: P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)</li>
                  <li>Number of Payments: Loan term in months</li>
                  <li>Principal Amount: Loan amount before interest</li>
                  <li>Example: For a $20,000 loan with payments of $377.42 for 60 months:
                    <ul className="list-disc pl-5">
                      <li>Total Payments: $377.42 × 60 = $22,645.20</li>
                      <li>Total Interest: $22,645.20 - $20,000 = $2,645.20</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          )}
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
                topic="Total Interest Comparison"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}