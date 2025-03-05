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
  earlyPayoffPenalty: number;
}

const currentLoan: CurrentLoan = {
  id: "current-loan",
  vehicle: "Honda Civic 2022",
  originalAmount: 28500,
  currentBalance: 22350,
  remainingMonths: 48, // 4 years remaining
  apr: 5.9,
  monthlyPayment: 547.12,
  image: "/imgs/honda_civic.jpg",
};

const refinanceOffers: RefinanceOffer[] = [
  {
    id: "offer1",
    lender: "AutoBank Finance",
    apr: 3.5,
    term: 48, // Same term as current
    refinanceFee: 350,
    earlyPayoffPenalty: 0,
  },
  {
    id: "offer2",
    lender: "Prime Auto Loans",
    apr: 3.2,
    term: 60, // Extended term
    refinanceFee: 499,
    earlyPayoffPenalty: 250,
  },
];

export default function RefinanceCalculator() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client evaluate refinancing options for their current auto loan. Your goal is to guide them through calculating new monthly payments and analyzing potential savings.
      
      If the user needs to calculate a refinanced payment, guide them through using the formula: Payment = P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1), where:
      - P = Principal (current loan balance plus any refinance fees)
      - r = Monthly interest rate (annual rate divided by 12 and converted to decimal)
      - n = New loan term in months
      
      Explain that refinancing considerations should include:
      1. Current loan balance and remaining term
      2. New interest rate and term length
      3. Any refinancing fees that need to be rolled into the new loan
      4. Potential early payoff penalties on the current loan
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I see you're considering refinancing your Honda Civic loan. I can help you evaluate whether refinancing makes sense and calculate your new monthly payment. Let's analyze the options together!",
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
    setSelectedOffer(offerId);
    const offer = refinanceOffers.find((o) => o.id === offerId);
    
    if (offer) {
      setPromptValue(`I'm considering refinancing my ${currentLoan.vehicle} loan. My current loan has a balance of $${currentLoan.currentBalance} with ${currentLoan.remainingMonths} months remaining at ${currentLoan.apr}% APR. I'm looking at an offer from ${offer.lender} with an APR of ${offer.apr}% for ${offer.term} months. There's a refinance fee of $${offer.refinanceFee} and an early payoff penalty of $${offer.earlyPayoffPenalty}. Can you help me calculate the new monthly payment?`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [calculatedPayment, setCalculatedPayment] = useState<number | null>(null);
  const [userCalculation, setUserCalculation] = useState<{
    newLoanAmount: number | null;
    newMonthlyPayment: number | null;
  }>({ newLoanAmount: null, newMonthlyPayment: null });

  const calculateNewLoanAmount = (offer: RefinanceOffer) => {
    if (!offer) return null;
    
    return currentLoan.currentBalance + offer.refinanceFee + offer.earlyPayoffPenalty;
  };

  const calculateNewMonthlyPayment = (offer: RefinanceOffer) => {
    if (!offer) return null;
    
    const principal = calculateNewLoanAmount(offer) || 0;
    const monthlyRate = offer.apr / 100 / 12;
    const termMonths = offer.term;
    
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    return payment;
  };

  useEffect(() => {
    if (selectedOffer) {
      const offer = refinanceOffers.find(o => o.id === selectedOffer);
      if (offer) {
        setCalculatedPayment(calculateNewMonthlyPayment(offer));
      }
    }
  }, [selectedOffer]);

  const handleSubmitCalculation = () => {
    if (!userCalculation.newMonthlyPayment || !calculatedPayment) return;
    
    const difference = Math.abs(userCalculation.newMonthlyPayment - calculatedPayment);
    const percentDifference = (difference / calculatedPayment) * 100;
    
    const isCorrect = percentDifference < 2; // Allow for some rounding differences
    
    setPromptValue(`I calculated the new monthly payment for the selected refinance offer. I got ${formatCurrency(userCalculation.newMonthlyPayment)}. ${isCorrect ? "Can you confirm if this is correct and explain the calculation step-by-step?" : "Could you help me figure out where I might have made a mistake?"}`);
    handleChat();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Refinance Payment Calculator</h1>
          <p className="max-w-3xl">
            Analyze refinancing options for an existing auto loan and calculate new monthly payments.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Current Loan Details</h2>
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
                <h3 className="text-xl font-semibold mb-4">{currentLoan.vehicle}</h3>
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Refinance Offers</h2>
            <p className="mb-4 text-gray-700">
              Select a refinance offer to analyze and calculate your new monthly payment.
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
                    <h3 className="text-xl font-semibold mb-3">{offer.lender}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                      <p className="text-gray-600">New APR:</p>
                      <p className="font-medium">{offer.apr}%</p>
                      
                      <p className="text-gray-600">Term:</p>
                      <p className="font-medium">{offer.term} months</p>
                      
                      <p className="text-gray-600">Refinance Fee:</p>
                      <p className="font-medium">{formatCurrency(offer.refinanceFee)}</p>
                      
                      <p className="text-gray-600">Early Payoff Penalty:</p>
                      <p className="font-medium">{formatCurrency(offer.earlyPayoffPenalty)}</p>
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

          {selectedOffer && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Your Calculation</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Step 1: Calculate the New Loan Amount
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Current balance + refinance fee + any early payoff penalty = new loan amount
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter new loan amount"
                      value={userCalculation.newLoanAmount === null ? '' : userCalculation.newLoanAmount}
                      onChange={(e) => setUserCalculation({
                        ...userCalculation,
                        newLoanAmount: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Step 2: Calculate the New Monthly Payment
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Use the PMT formula: P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter new monthly payment"
                      value={userCalculation.newMonthlyPayment === null ? '' : userCalculation.newMonthlyPayment}
                      onChange={(e) => setUserCalculation({
                        ...userCalculation,
                        newMonthlyPayment: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                    <button
                      className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={handleSubmitCalculation}
                      disabled={!userCalculation.newMonthlyPayment}
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Helpful Formula Reference</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Monthly Payment Formula:</strong> P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  <li>P = Principal (new loan amount)</li>
                  <li>r = Monthly interest rate (annual rate / 12 / 100)</li>
                  <li>n = New loan term in months</li>
                  <li>Example: For a $20,000 loan at 4% APR for 48 months:
                    <ul className="list-disc pl-5">
                      <li>P = $20,000</li>
                      <li>r = 0.04 / 12 = 0.0033</li>
                      <li>n = 48</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-between mt-6">
                <div className="text-blue-600">
                  <p className="text-sm font-medium">Your current monthly payment: {formatCurrency(currentLoan.monthlyPayment)}</p>
                </div>
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
                topic="Refinance Payment Calculation"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}