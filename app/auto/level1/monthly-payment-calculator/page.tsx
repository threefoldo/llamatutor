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
];

export default function MonthlyPaymentCalculator() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
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
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand your loan options and calculate the monthly payments for the Honda Civic you're considering. Let's work through this together!",
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
    const offer = loanOffers.find((o) => o.id === offerId);
    
    if (offer) {
      setPromptValue(`I'm considering the ${offer.vehicle} with a price of $${offer.price}. The loan offer has an APR of ${offer.apr}% for ${offer.term} months with a down payment of $${offer.downPayment}. Additional fees include a documentation fee of $${offer.additionalFees.docFee}, sales tax of ${offer.additionalFees.taxRate}%, title fee of $${offer.additionalFees.titleFee}, and registration fee of $${offer.additionalFees.registrationFee}. Can you help me calculate the monthly payment?`);
      
      // Don't automatically send - let the user review and send
      // handleChat();
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
  const [loanAmount, setLoanAmount] = useState<number | null>(null);
  const [userCalculation, setUserCalculation] = useState<{
    loanAmount: number | null;
    monthlyPayment: number | null;
  }>({ loanAmount: null, monthlyPayment: null });

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

  useEffect(() => {
    if (selectedOffer) {
      const offer = loanOffers.find(o => o.id === selectedOffer);
      if (offer) {
        const amount = calculateLoanAmount(offer);
        setLoanAmount(amount);
        setCalculatedPayment(calculateMonthlyPayment(offer));
      }
    }
  }, [selectedOffer]);

  const handleSubmitCalculation = () => {
    if (!userCalculation.monthlyPayment || !calculatedPayment) return;
    
    const difference = Math.abs(userCalculation.monthlyPayment - calculatedPayment);
    const percentDifference = (difference / calculatedPayment) * 100;
    
    const isCorrect = percentDifference < 2; // Allow for some rounding differences
    
    setPromptValue(`I calculated the monthly payment for the selected loan offer. I got ${formatCurrency(userCalculation.monthlyPayment)}. Am I correct? ${isCorrect ? "If I'm right, can you explain the calculation step-by-step?" : "If I'm wrong, can you help me figure out where I made a mistake?"}`);
    handleChat();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Auto Loan Monthly Payment Calculator</h1>
          <p className="max-w-3xl">
            Practice calculating monthly payments for auto loans by analyzing loan offers and their terms.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Scenario</h2>
            <p className="mb-6 text-gray-700">
              You're helping a client who is considering financing a new Honda Civic. They've received two different loan offers from 
              different lenders and want to understand which one will result in a lower monthly payment. Select one of the offers below 
              to analyze the monthly payment calculation.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {loanOffers.map((offer) => (
                <div 
                  key={offer.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedOffer === offer.id 
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

          {selectedOffer && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Your Calculation</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Step 1: Calculate the Loan Amount
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Vehicle price + fees - down payment = loan amount
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter loan amount"
                      value={userCalculation.loanAmount === null ? '' : userCalculation.loanAmount}
                      onChange={(e) => setUserCalculation({
                        ...userCalculation,
                        loanAmount: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                    {loanAmount !== null && userCalculation.loanAmount !== null && (
                      <div className="ml-3">
                        {Math.abs(loanAmount - userCalculation.loanAmount) < 1 ? (
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
                    Step 2: Calculate the Monthly Payment
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Use the PMT formula: P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter monthly payment"
                      value={userCalculation.monthlyPayment === null ? '' : userCalculation.monthlyPayment}
                      onChange={(e) => setUserCalculation({
                        ...userCalculation,
                        monthlyPayment: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                    <button
                      className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={handleSubmitCalculation}
                      disabled={!userCalculation.monthlyPayment}
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
                  <li>P = Principal (loan amount)</li>
                  <li>r = Monthly interest rate (annual rate / 12 / 100)</li>
                  <li>n = Loan term in months</li>
                  <li>Example: For a $20,000 loan at 5% APR for 60 months:
                    <ul className="list-disc pl-5">
                      <li>P = $20,000</li>
                      <li>r = 0.05 / 12 = 0.00417</li>
                      <li>n = 60</li>
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
                topic="Monthly Payment Calculation"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}