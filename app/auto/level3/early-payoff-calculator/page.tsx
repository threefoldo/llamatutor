"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Chat from "@/components/Chat";

export default function EarlyPayoffCalculator() {
  // State for chat functionality
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client calculate how making extra payments affects their loan payoff schedule. Your goal is to guide them through analyzing early payoff strategies. Be educational, explain the concepts, and guide them step by step.
      
      Explain key concepts like:
      - How extra payments reduce the principal balance
      - Why reducing principal early saves more interest
      - How to calculate a new payoff date when making extra payments
      - The impact of different extra payment strategies (lump sum vs monthly extra)
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand how making extra payments can reduce your loan term and save on interest. Let's work through this together!",
    },
  ]);
  
  const [promptValue, setPromptValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  
  // Example loan details
  const loanDetails = {
    vehicle: "Honda Civic 2024",
    originalAmount: 25000,
    currentBalance: 22500,
    apr: 5.25,
    originalTerm: 60, // 5 years in months
    remainingTerm: 54, // 4.5 years in months
    monthlyPayment: 474.15, // Regular monthly payment
    image: "/imgs/honda_civic.jpg",
  };
  
  // State for user inputs
  const [extraPaymentType, setExtraPaymentType] = useState<'monthly' | 'lump'>('monthly');
  const [extraMonthlyAmount, setExtraMonthlyAmount] = useState<number>(100);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(2000);
  const [calculationResults, setCalculationResults] = useState<{
    newPayoffDate: number;
    interestSaved: number;
    monthsSaved: number;
  } | null>(null);
  
  // Function to handle chat
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

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Function to calculate early payoff results
  const calculateEarlyPayoff = () => {
    const currentBalance = loanDetails.currentBalance;
    const monthlyRate = loanDetails.apr / 100 / 12;
    const monthlyPayment = loanDetails.monthlyPayment;
    
    // Calculate total interest for regular payment schedule
    let remainingBalance = currentBalance;
    let totalInterestRegular = 0;
    
    for (let i = 0; i < loanDetails.remainingTerm; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      totalInterestRegular += interestPayment;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
    }
    
    // Calculate new payoff with extra payments
    remainingBalance = currentBalance;
    let monthsToPayoff = 0;
    let totalInterestWithExtra = 0;
    
    if (extraPaymentType === 'lump') {
      // Apply lump sum first
      remainingBalance -= lumpSumAmount;
      
      // Then continue with regular payments
      while (remainingBalance > 0) {
        const interestPayment = remainingBalance * monthlyRate;
        totalInterestWithExtra += interestPayment;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        monthsToPayoff++;
        
        // Safety check to prevent infinite loop
        if (monthsToPayoff > 360) break;
      }
    } else {
      // Monthly extra payments
      const totalMonthlyPayment = monthlyPayment + extraMonthlyAmount;
      
      while (remainingBalance > 0) {
        const interestPayment = remainingBalance * monthlyRate;
        totalInterestWithExtra += interestPayment;
        const principalPayment = totalMonthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        monthsToPayoff++;
        
        // Safety check to prevent infinite loop
        if (monthsToPayoff > 360) break;
      }
    }
    
    const interestSaved = totalInterestRegular - totalInterestWithExtra;
    const monthsSaved = loanDetails.remainingTerm - monthsToPayoff;
    
    setCalculationResults({
      newPayoffDate: monthsToPayoff,
      interestSaved,
      monthsSaved,
    });
    
    // Set a message for the assistant
    const promptMessage = extraPaymentType === 'lump'
      ? `I calculated that making a lump sum payment of ${formatCurrency(lumpSumAmount)} on my auto loan would save me ${formatCurrency(interestSaved)} in interest and let me pay off the loan ${monthsSaved} months earlier. Can you explain why this works and check my calculations?`
      : `I calculated that making an extra monthly payment of ${formatCurrency(extraMonthlyAmount)} on my auto loan would save me ${formatCurrency(interestSaved)} in interest and let me pay off the loan ${monthsSaved} months earlier. Can you explain why this works and check my calculations?`;
    
    setPromptValue(promptMessage);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Early Payoff Calculator</h1>
          <p className="max-w-3xl">
            Calculate the impact of making extra payments on your auto loan, including interest savings and early payoff date.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Main Calculation Area */}
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          {/* Task Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Your Task</h2>
            <p className="mb-4 text-gray-700">
              You're helping a client understand how making extra payments on their auto loan will affect their payoff date and interest costs.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <h3 className="font-bold text-lg mb-1">Goal</h3>
              <p className="text-gray-700">Calculate how making extra payments will reduce the loan term and total interest paid.</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <h3 className="font-bold text-lg mb-1">Tips</h3>
              <ul className="list-disc ml-5 text-gray-700">
                <li>Extra payments directly reduce the principal balance</li>
                <li>Less principal means less interest is calculated in future months</li>
                <li>The monthly payment stays the same, but more goes to principal</li>
                <li>Compare different strategies: lump sum vs. small monthly extras</li>
              </ul>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
              <h3 className="font-bold text-lg mb-1">Key Terms</h3>
              <dl className="text-gray-700">
                <dt className="font-semibold mt-1">Principal</dt>
                <dd className="ml-4">The remaining loan balance that you're paying interest on</dd>
                <dt className="font-semibold mt-1">Amortization</dt>
                <dd className="ml-4">The process of paying off debt with regular payments over time</dd>
                <dt className="font-semibold mt-1">Extra Payment</dt>
                <dd className="ml-4">Additional money applied directly to reducing the principal balance</dd>
              </dl>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Current Loan Details</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative md:w-1/3 h-48 overflow-hidden rounded-md">
                <Image
                  src={loanDetails.image}
                  alt={loanDetails.vehicle}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">{loanDetails.vehicle}</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <p className="text-gray-600">Original Loan Amount:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.originalAmount)}</p>
                  
                  <p className="text-gray-600">Current Balance:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.currentBalance)}</p>
                  
                  <p className="text-gray-600">Interest Rate (APR):</p>
                  <p className="font-medium">{loanDetails.apr}%</p>
                  
                  <p className="text-gray-600">Original Term:</p>
                  <p className="font-medium">{loanDetails.originalTerm} months</p>
                  
                  <p className="text-gray-600">Remaining Term:</p>
                  <p className="font-medium">{loanDetails.remainingTerm} months</p>
                  
                  <p className="text-gray-600">Monthly Payment:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.monthlyPayment)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Extra Payment Options */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Extra Payment Options</h2>
            <p className="mb-4 text-gray-700">
              Choose a payment strategy and calculate the impact:
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div 
                className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                  extraPaymentType === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setExtraPaymentType('monthly')}
              >
                <h3 className="font-semibold mb-2">Monthly Extra Payments</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add a fixed amount to each monthly payment
                </p>
                <div className="mt-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Extra Amount Per Month
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-200 py-2 px-3 rounded-l">$</span>
                    <input
                      type="number"
                      className="shadow appearance-none border rounded-r py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter amount"
                      value={extraMonthlyAmount}
                      onChange={(e) => setExtraMonthlyAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      disabled={extraPaymentType !== 'monthly'}
                    />
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                  extraPaymentType === 'lump' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setExtraPaymentType('lump')}
              >
                <h3 className="font-semibold mb-2">One-Time Lump Sum Payment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Make a single larger payment to reduce principal
                </p>
                <div className="mt-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Lump Sum Amount
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-200 py-2 px-3 rounded-l">$</span>
                    <input
                      type="number"
                      className="shadow appearance-none border rounded-r py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter amount"
                      value={lumpSumAmount}
                      onChange={(e) => setLumpSumAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      disabled={extraPaymentType !== 'lump'}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                onClick={calculateEarlyPayoff}
              >
                Calculate Impact
              </button>
            </div>
          </div>

          {/* Results Section */}
          {calculationResults && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Early Payoff Results</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-gray-700 mb-1">New Payoff Time</h3>
                  <p className="text-3xl font-bold text-green-700">{calculationResults.newPayoffDate} months</p>
                  <p className="text-sm text-gray-600">({Math.floor(calculationResults.newPayoffDate / 12)} years, {calculationResults.newPayoffDate % 12} months)</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-gray-700 mb-1">Months Saved</h3>
                  <p className="text-3xl font-bold text-blue-700">{calculationResults.monthsSaved}</p>
                  <p className="text-sm text-gray-600">({Math.floor(calculationResults.monthsSaved / 12)} years, {calculationResults.monthsSaved % 12} months)</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-gray-700 mb-1">Interest Saved</h3>
                  <p className="text-3xl font-bold text-purple-700">{formatCurrency(calculationResults.interestSaved)}</p>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Comparison</h3>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div></div>
                  <div className="text-center font-medium">Original</div>
                  <div className="text-center font-medium">With Extra Payments</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-1">
                  <div>Total Months</div>
                  <div className="text-center">{loanDetails.remainingTerm}</div>
                  <div className="text-center">{calculationResults.newPayoffDate}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-1">
                  <div>Payoff Date</div>
                  <div className="text-center">
                    {new Date(Date.now() + loanDetails.remainingTerm * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-center">
                    {new Date(Date.now() + calculationResults.newPayoffDate * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-300">
                  <div>Total Cost</div>
                  <div className="text-center">{formatCurrency(loanDetails.monthlyPayment * loanDetails.remainingTerm)}</div>
                  <div className="text-center">
                    {extraPaymentType === 'monthly' 
                      ? formatCurrency((loanDetails.monthlyPayment + extraMonthlyAmount) * calculationResults.newPayoffDate)
                      : formatCurrency(lumpSumAmount + (loanDetails.monthlyPayment * calculationResults.newPayoffDate))
                    }
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleChat}
                >
                  Ask About Results
                </button>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Helpful Formula Reference</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Calculating Early Payoff:</strong>
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>
                Each month, interest is calculated as: Remaining Balance × (APR ÷ 12 ÷ 100)
              </li>
              <li>
                Principal portion = Monthly Payment - Interest Portion
              </li>
              <li>
                With extra payments, you reduce the principal faster, which reduces future interest
              </li>
              <li>
                To calculate the payoff date, you need to recalculate the amortization schedule with the extra payments
              </li>
            </ul>
          </div>
        </div>

        {/* Chat Panel */}
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
                topic="Early Payoff Calculation"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}