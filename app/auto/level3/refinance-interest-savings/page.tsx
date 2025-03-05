"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Chat from "@/components/Chat";

interface CurrentLoan {
  id: string;
  vehicle: string;
  originalAmount: number;
  currentBalance: number;
  remainingMonths: number;
  apr: number;
  monthlyPayment: number;
  image: string;
}

interface RefinanceOffer {
  id: string;
  lender: string;
  apr: number;
  term: number; // in months
  refinanceFee: number;
  monthlyPayment: number | null;
}

const currentLoan: CurrentLoan = {
  id: "current-loan",
  vehicle: "BMW 3 Series 2023",
  originalAmount: 45000,
  currentBalance: 38500,
  remainingMonths: 54, // 4.5 years remaining
  apr: 6.25,
  monthlyPayment: 875.63,
  image: "/imgs/bmw_3_series.jpg",
};

const refinanceOffers: RefinanceOffer[] = [
  {
    id: "offer1",
    lender: "LuxuryAuto Finance",
    apr: 4.49,
    term: 54, // Same term as current
    refinanceFee: 499,
    monthlyPayment: null,
  },
  {
    id: "offer2",
    lender: "Premium Auto Credit",
    apr: 4.15,
    term: 60, // Extended term
    refinanceFee: 650,
    monthlyPayment: null,
  },
];

export default function RefinanceInterestSavings() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'document' | 'calculation'>('document');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client evaluate the potential interest savings from refinancing their auto loan. Your goal is to guide them through comparing the total interest costs of their current loan versus a refinance option.
      
      If the user needs to calculate total interest paid for either loan, guide them through the process:
      1. For the current loan: remaining months × current monthly payment - current balance
      2. For the refinance loan: new term × new monthly payment - (current balance + refinance fee)
      
      Explain key factors that impact interest savings:
      - The difference in interest rates
      - The refinance fee amount
      - Any changes in loan term
      - Factors that should be considered in breakeven analysis
      
      Be careful not to give away exact answers - encourage the user to try the calculations themselves. If they're struggling, provide hints or guide them through the process step by step.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I can help you analyze whether refinancing your BMW 3 Series loan will save you money on interest. Let me know what refinance offer you're considering, and we'll calculate the potential savings together!",
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

  // Calculate monthly payments for refinance offers
  useEffect(() => {
    const updatedOffers = refinanceOffers.map(offer => {
      const newLoanAmount = currentLoan.currentBalance + offer.refinanceFee;
      const monthlyRate = offer.apr / 100 / 12;
      const payment = (newLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -offer.term));
      return { ...offer, monthlyPayment: payment };
    });
    
    refinanceOffers.forEach((offer, index) => {
      refinanceOffers[index].monthlyPayment = updatedOffers[index].monthlyPayment;
    });
  }, []);

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffer(offerId);
    const offer = refinanceOffers.find((o) => o.id === offerId);
    
    if (offer && offer.monthlyPayment) {
      setPromptValue(`I'm considering refinancing my ${currentLoan.vehicle} loan. My current loan has a balance of $${currentLoan.currentBalance} with ${currentLoan.remainingMonths} months remaining at ${currentLoan.apr}% APR and a monthly payment of $${currentLoan.monthlyPayment.toFixed(2)}. 
      
I'm looking at an offer from ${offer.lender} with an APR of ${offer.apr}% for ${offer.term} months. There's a refinance fee of $${offer.refinanceFee} that would be added to my loan, and the new monthly payment would be about $${offer.monthlyPayment.toFixed(2)}. 

Can you help me calculate how much interest I would save by refinancing?`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [calculatedValues, setCalculatedValues] = useState<{
    currentTotalInterest: number | null;
    refinanceTotalInterest: number | null;
    interestSavings: number | null;
  }>({ currentTotalInterest: null, refinanceTotalInterest: null, interestSavings: null });

  const [userCalculations, setUserCalculations] = useState<{
    currentTotalInterest: number | null;
    refinanceTotalInterest: number | null;
    interestSavings: number | null;
  }>({ currentTotalInterest: null, refinanceTotalInterest: null, interestSavings: null });

  // Calculate the correct answers (for validation, not displayed to user)
  useEffect(() => {
    if (selectedOffer) {
      const offer = refinanceOffers.find(o => o.id === selectedOffer);
      if (offer && offer.monthlyPayment) {
        // Calculate total interest for current loan
        const currentTotalInterest = (currentLoan.monthlyPayment * currentLoan.remainingMonths) - currentLoan.currentBalance;
        
        // Calculate total interest for refinance offer
        const newLoanAmount = currentLoan.currentBalance + offer.refinanceFee;
        const refinanceTotalInterest = (offer.monthlyPayment * offer.term) - newLoanAmount;
        
        // Calculate interest savings
        const interestSavings = currentTotalInterest - refinanceTotalInterest;
        
        setCalculatedValues({
          currentTotalInterest,
          refinanceTotalInterest,
          interestSavings
        });
      }
    }
  }, [selectedOffer]);

  const handleSubmitCalculation = () => {
    if (!userCalculations.interestSavings || !calculatedValues.interestSavings) return;
    
    const difference = Math.abs(userCalculations.interestSavings - calculatedValues.interestSavings);
    const percentDifference = (difference / calculatedValues.interestSavings) * 100;
    
    const isCorrect = percentDifference < 3; // Allow for some rounding differences
    
    setPromptValue(`I calculated the potential interest savings from refinancing. My current loan would have ${userCalculations.currentTotalInterest ? formatCurrency(userCalculations.currentTotalInterest) : '[missing]'} in remaining interest. The refinance option would have ${userCalculations.refinanceTotalInterest ? formatCurrency(userCalculations.refinanceTotalInterest) : '[missing]'} in total interest. This gives me an interest savings of ${formatCurrency(userCalculations.interestSavings)}. ${isCorrect ? "Does this calculation look correct?" : "Could you check my work and see where I might have made a mistake?"}`);
    handleChat();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Refinance Interest Savings</h1>
          <p className="max-w-3xl">
            Calculate and analyze how much interest you could save by refinancing your auto loan.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="mb-4 flex justify-end">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'document' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('document')}
              >
                Document View
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'calculation' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('calculation')}
              >
                Calculation View
              </button>
            </div>
          </div>

          {viewMode === 'document' && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Current Loan Statement</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-48 h-48 overflow-hidden rounded-md">
                    <Image
                      src={currentLoan.image}
                      alt={currentLoan.vehicle}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{currentLoan.vehicle}</h3>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Current Loan
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-gray-200 py-4 mb-4">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <p className="text-gray-600 text-sm">Original Loan Amount:</p>
                          <p className="font-medium">{formatCurrency(currentLoan.originalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Current Balance:</p>
                          <p className="font-medium">{formatCurrency(currentLoan.currentBalance)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Current APR:</p>
                          <p className="font-medium">{currentLoan.apr}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Remaining Term:</p>
                          <p className="font-medium">{currentLoan.remainingMonths} months</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Monthly Payment:</p>
                          <p className="font-medium">{formatCurrency(currentLoan.monthlyPayment)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Note:</span> To calculate remaining interest, multiply the monthly payment by the remaining months, then subtract the current balance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Refinance Offers</h2>
                <p className="mb-4 text-gray-700">
                  Select a refinance offer to analyze and calculate your potential interest savings.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {refinanceOffers.map((offer) => (
                    <div 
                      key={offer.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        selectedOffer === offer.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleSelectOffer(offer.id)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="mb-3 flex justify-between items-center">
                          <h3 className="text-xl font-semibold">{offer.lender}</h3>
                          <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {offer.apr}% APR
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                          <p className="text-gray-600">Term:</p>
                          <p className="font-medium">{offer.term} months</p>
                          
                          <p className="text-gray-600">Refinance Fee:</p>
                          <p className="font-medium">{formatCurrency(offer.refinanceFee)}</p>
                          
                          <p className="text-gray-600">New Loan Amount:</p>
                          <p className="font-medium">{formatCurrency(currentLoan.currentBalance + offer.refinanceFee)}</p>
                          
                          <p className="text-gray-600">New Monthly Payment:</p>
                          <p className="font-medium">{offer.monthlyPayment ? formatCurrency(offer.monthlyPayment) : 'Calculating...'}</p>
                        </div>
                        
                        {selectedOffer === offer.id && (
                          <div className="mt-auto pt-3 border-t border-gray-200">
                            <p className="text-blue-600 font-medium text-sm">Selected for analysis</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewMode === 'calculation' && selectedOffer && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Interest Savings Calculation</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-blue-800">Current Loan</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">Current Balance:</span> {formatCurrency(currentLoan.currentBalance)}</li>
                    <li><span className="font-medium">Monthly Payment:</span> {formatCurrency(currentLoan.monthlyPayment)}</li>
                    <li><span className="font-medium">Remaining Months:</span> {currentLoan.remainingMonths}</li>
                    <li><span className="font-medium">APR:</span> {currentLoan.apr}%</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  {refinanceOffers.find(o => o.id === selectedOffer) && (
                    <>
                      <h3 className="font-bold mb-3 text-green-800">Selected Refinance Offer</h3>
                      <ul className="space-y-2 text-sm">
                        <li><span className="font-medium">New Loan Amount:</span> {formatCurrency(currentLoan.currentBalance + (refinanceOffers.find(o => o.id === selectedOffer)?.refinanceFee || 0))}</li>
                        <li><span className="font-medium">Monthly Payment:</span> {formatCurrency(refinanceOffers.find(o => o.id === selectedOffer)?.monthlyPayment || 0)}</li>
                        <li><span className="font-medium">Term:</span> {refinanceOffers.find(o => o.id === selectedOffer)?.term} months</li>
                        <li><span className="font-medium">APR:</span> {refinanceOffers.find(o => o.id === selectedOffer)?.apr}%</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 1: Calculate Total Interest - Current Loan</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Monthly payment × remaining months - current balance = total remaining interest
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter total interest for current loan"
                      value={userCalculations.currentTotalInterest === null ? '' : userCalculations.currentTotalInterest}
                      onChange={(e) => setUserCalculations({
                        ...userCalculations,
                        currentTotalInterest: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 2: Calculate Total Interest - Refinance Loan</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    New monthly payment × new term - new loan amount = total interest for new loan
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter total interest for refinance loan"
                      value={userCalculations.refinanceTotalInterest === null ? '' : userCalculations.refinanceTotalInterest}
                      onChange={(e) => setUserCalculations({
                        ...userCalculations,
                        refinanceTotalInterest: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 3: Calculate Interest Savings</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Current loan total interest - refinance loan total interest = interest savings
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter interest savings"
                      value={userCalculations.interestSavings === null ? '' : userCalculations.interestSavings}
                      onChange={(e) => setUserCalculations({
                        ...userCalculations,
                        interestSavings: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                    <button
                      className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={handleSubmitCalculation}
                      disabled={!userCalculations.interestSavings}
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Important Considerations</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Refinancing makes sense when interest savings exceed refinancing costs</li>
                  <li>Consider how many months it will take to "break even" on the refinance fee</li>
                  <li>Extended loan terms can increase total interest despite lower rates</li>
                  <li>Calculate the total cost of both options (payments × months) for complete comparison</li>
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
                topic="Refinance Interest Savings"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}