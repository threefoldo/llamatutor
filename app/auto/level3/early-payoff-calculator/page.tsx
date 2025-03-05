"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Chat from "@/components/Chat";

interface Loan {
  id: string;
  vehicle: string;
  originalAmount: number;
  currentBalance: number;
  remainingMonths: number;
  apr: number;
  monthlyPayment: number;
  image: string;
}

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const currentLoan: Loan = {
  id: "current-loan",
  vehicle: "Tesla Model 3 2023",
  originalAmount: 52000,
  currentBalance: 45750,
  remainingMonths: 60, // 5 years remaining
  apr: 4.75,
  monthlyPayment: 857.32,
  image: "/imgs/tesla_model3.jpg",
};

export default function EarlyPayoffCalculator() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client understand the financial impact of making an early lump sum payment on their auto loan. Your goal is to guide them through calculating the revised loan schedule and interest savings.
      
      If the user needs help calculating the impact of an early payoff or lump sum payment:
      1. Guide them to recalculate the remaining loan balance after applying the lump sum
      2. Help them understand how to recalculate the remaining interest based on the reduced principal
      3. Show them how to calculate their interest savings compared to the original loan schedule
      
      Explain key concepts:
      - How lump sum payments primarily reduce principal
      - How reducing principal early in the loan term saves more interest
      - Different strategies for applying extra payments (reducing term vs. reducing payment)
      
      Be careful not to give away exact answers - encourage the user to try the calculations themselves. If they're struggling, provide hints or guide them through the process step by step.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I can help you analyze the impact of making a lump sum payment on your Tesla Model 3 loan. Making extra payments can significantly reduce your interest costs and potentially shorten your loan term. Let me know what scenario you're considering, and we'll calculate the potential savings together!",
    },
  ]);
  const [promptValue, setPromptValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const [viewMode, setViewMode] = useState<'document' | 'analysis'>('document');
  const [lumpSumPayment, setLumpSumPayment] = useState<number>(0);
  const [paymentMonth, setPaymentMonth] = useState<number>(1);
  const [showModifiedSchedule, setShowModifiedSchedule] = useState(false);
  const [modifiedSchedule, setModifiedSchedule] = useState<AmortizationEntry[]>([]);
  const [selectedTableRow, setSelectedTableRow] = useState<number | null>(null);
  const [paymentStrategy, setPaymentStrategy] = useState<'reduce-term' | 'reduce-payment'>('reduce-term');
  
  const [userCalculations, setUserCalculations] = useState<{
    originalInterest: number | null;
    newInterest: number | null;
    interestSavings: number | null;
    newTerm: number | null;
  }>({ 
    originalInterest: null, 
    newInterest: null, 
    interestSavings: null,
    newTerm: null 
  });

  const [calculatedValues, setCalculatedValues] = useState<{
    originalInterest: number;
    newInterest: number;
    interestSavings: number;
    newTerm: number;
  }>({ 
    originalInterest: 0, 
    newInterest: 0, 
    interestSavings: 0,
    newTerm: 0 
  });

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

  // Generate initial amortization schedule
  useEffect(() => {
    const schedule: AmortizationEntry[] = [];
    let balance = currentLoan.currentBalance;
    const monthlyRate = currentLoan.apr / 100 / 12;

    for (let month = 1; month <= currentLoan.remainingMonths; month++) {
      const interest = balance * monthlyRate;
      const principal = currentLoan.monthlyPayment - interest;
      balance -= principal;
      
      schedule.push({
        month,
        payment: currentLoan.monthlyPayment,
        principal,
        interest,
        balance: Math.max(0, balance)
      });
    }

    setAmortizationSchedule(schedule);
    
    // Calculate original total interest
    const originalInterest = schedule.reduce((sum, entry) => sum + entry.interest, 0);
    setCalculatedValues(prev => ({ ...prev, originalInterest }));
  }, []);

  // Calculate modified schedule when lump sum payment changes
  useEffect(() => {
    if (lumpSumPayment > 0 && paymentMonth >= 1 && amortizationSchedule.length > 0) {
      // Make a deep copy of the original schedule up to the payment month
      const newSchedule: AmortizationEntry[] = [];
      for (let i = 0; i < paymentMonth - 1; i++) {
        newSchedule.push({ ...amortizationSchedule[i] });
      }
      
      // Apply lump sum to the balance at the payment month
      const originalEntry = amortizationSchedule[paymentMonth - 1];
      let newBalance = originalEntry.balance - lumpSumPayment;
      
      if (newBalance <= 0) {
        // Loan is fully paid off
        newSchedule.push({
          month: paymentMonth,
          payment: originalEntry.interest + originalEntry.balance,
          principal: originalEntry.balance,
          interest: originalEntry.interest,
          balance: 0
        });
        
        // Calculate new interest and savings
        const newInterest = newSchedule.reduce((sum, entry) => sum + entry.interest, 0);
        const interestSavings = calculatedValues.originalInterest - newInterest;
        
        setModifiedSchedule(newSchedule);
        setCalculatedValues({
          originalInterest: calculatedValues.originalInterest,
          newInterest,
          interestSavings,
          newTerm: paymentMonth
        });
        return;
      }
      
      // Add the payment month entry with the lump sum
      newSchedule.push({
        month: paymentMonth,
        payment: originalEntry.payment + lumpSumPayment,
        principal: originalEntry.principal + lumpSumPayment,
        interest: originalEntry.interest,
        balance: newBalance
      });
      
      // Recalculate the remaining schedule with the new balance
      const monthlyRate = currentLoan.apr / 100 / 12;
      let month = paymentMonth + 1;
      
      while (newBalance > 0) {
        const interest = newBalance * monthlyRate;
        const principal = Math.min(currentLoan.monthlyPayment - interest, newBalance);
        newBalance -= principal;
        
        newSchedule.push({
          month,
          payment: principal + interest,
          principal,
          interest,
          balance: Math.max(0, newBalance)
        });
        
        month++;
        
        // Safety check to prevent infinite loops
        if (month > 360) break;
      }
      
      setModifiedSchedule(newSchedule);
      
      // Calculate new interest, savings, and term
      const newInterest = newSchedule.reduce((sum, entry) => sum + entry.interest, 0);
      const interestSavings = calculatedValues.originalInterest - newInterest;
      
      setCalculatedValues({
        originalInterest: calculatedValues.originalInterest,
        newInterest,
        interestSavings,
        newTerm: newSchedule.length
      });

      // Show modified schedule when parameters change
      setShowModifiedSchedule(true);
    }
  }, [lumpSumPayment, paymentMonth, amortizationSchedule]);

  const handleLumpSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLumpSumPayment(isNaN(value) ? 0 : value);
  };

  const handlePaymentMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPaymentMonth(isNaN(value) ? 1 : Math.min(Math.max(1, value), currentLoan.remainingMonths));
  };

  // Initialize the analysis automatically when parameters change
  useEffect(() => {
    if (lumpSumPayment > 0) {
      setShowModifiedSchedule(true);
    }
  }, [lumpSumPayment, paymentMonth]);
  
  // Function to run detailed analysis with chat assistance
  const handleRunAnalysis = () => {
    if (lumpSumPayment > 0) {
      setPromptValue(`I'm analyzing making a ${formatCurrency(lumpSumPayment)} lump sum payment in month ${paymentMonth} of my auto loan. My current loan for the Tesla Model 3 has a balance of ${formatCurrency(currentLoan.currentBalance)} with ${currentLoan.remainingMonths} months remaining at ${currentLoan.apr}% APR. Can you help me understand how this will affect my loan and how much interest I might save?`);
      handleChat();
    }
  };

  const handleSubmitCalculation = () => {
    if (!userCalculations.interestSavings || !calculatedValues.interestSavings) return;
    
    const differenceInterest = Math.abs(userCalculations.interestSavings - calculatedValues.interestSavings);
    const percentDifferenceInterest = (differenceInterest / calculatedValues.interestSavings) * 100;
    
    const differenceTerm = Math.abs((userCalculations.newTerm || 0) - calculatedValues.newTerm);
    
    const isCorrect = percentDifferenceInterest < 3 && differenceTerm <= 1; // Allow for some rounding differences
    
    setPromptValue(`I calculated the impact of my ${formatCurrency(lumpSumPayment)} lump sum payment in month ${paymentMonth}. 
    
The original total interest would be ${userCalculations.originalInterest ? formatCurrency(userCalculations.originalInterest) : "[missing]"}, and with the early payment, the total interest would be ${userCalculations.newInterest ? formatCurrency(userCalculations.newInterest) : "[missing]"}. 

This gives me an interest savings of ${formatCurrency(userCalculations.interestSavings)}, and my new loan term would be ${userCalculations.newTerm} months instead of ${currentLoan.remainingMonths} months. 

${isCorrect ? "Does this analysis look correct?" : "Could you check my work and see where I might have made a mistake?"}`);
    
    handleChat();
  };

  const [isChatOpen, setIsChatOpen] = useState(true);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Early Payoff Analysis</h1>
          <p className="max-w-3xl">
            Analyze the impact of making lump sum payments on your auto loan and calculate interest savings.
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
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'analysis' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('analysis')}
              >
                Analysis View
              </button>
            </div>
          </div>

          {viewMode === 'document' && (
            <>
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
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{currentLoan.vehicle}</h3>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Current Loan
                      </div>
                    </div>
                    
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
                <h2 className="text-xl font-bold mb-4">Early Payoff Scenario</h2>
                <p className="mb-4 text-gray-700">
                  Analyze how making a lump sum payment will affect your loan term and interest costs.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Lump Sum Payment Amount
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 absolute ml-3">$</span>
                      <input
                        type="number"
                        className="shadow appearance-none border rounded py-2 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                        placeholder="Enter amount"
                        value={lumpSumPayment || ''}
                        onChange={handleLumpSumChange}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Payment Month
                    </label>
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter month"
                      value={paymentMonth || ''}
                      onChange={handlePaymentMonthChange}
                      min="1"
                      max={currentLoan.remainingMonths}
                    />
                  </div>
                </div>
                
                <button
                  className={`${lumpSumPayment > 0 ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  onClick={handleRunAnalysis}
                  disabled={lumpSumPayment <= 0}
                >
                  {lumpSumPayment > 0 ? "Get Expert Analysis" : "Enter a lump sum amount"}
                </button>
              </div>

              {showModifiedSchedule && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Loan Amortization Timeline</h2>
                  
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                          type="button"
                          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${!showModifiedSchedule ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setShowModifiedSchedule(false)}
                        >
                          Original Schedule
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${showModifiedSchedule ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setShowModifiedSchedule(true)}
                        >
                          Modified Schedule
                        </button>
                      </div>
                      
                      <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                          type="button"
                          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${paymentStrategy === 'reduce-term' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setPaymentStrategy('reduce-term')}
                        >
                          Reduce Term
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${paymentStrategy === 'reduce-payment' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setPaymentStrategy('reduce-payment')}
                          disabled={true} // Feature to be implemented in future release
                        >
                          Reduce Payment <span className="text-xs">(Coming Soon)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loan timeline visualization */}
                  <div className="mb-6 overflow-hidden">
                    <div className="relative w-full h-16 rounded-lg bg-gray-100 mb-2">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-200"
                        style={{ width: '100%' }}
                      ></div>
                      
                      {/* Original loan progress */}
                      <div 
                        className="absolute top-0 left-0 h-8 bg-blue-500"
                        style={{ width: `${(1 - (currentLoan.currentBalance / currentLoan.originalAmount)) * 100}%` }}
                      ></div>
                      
                      {/* Current position */}
                      <div 
                        className="absolute top-0 h-16 border-l-2 border-yellow-500"
                        style={{ left: `${(1 - (currentLoan.currentBalance / currentLoan.originalAmount)) * 100}%` }}
                      >
                        <div className="absolute -left-6 top-4 w-12 text-center">
                          <span className="text-xs font-medium text-yellow-800">Now</span>
                        </div>
                      </div>
                      
                      {/* Lump sum payment position */}
                      {showModifiedSchedule && (
                        <div 
                          className="absolute top-0 h-16 border-l-2 border-green-500"
                          style={{ 
                            left: `${(1 - (currentLoan.currentBalance / currentLoan.originalAmount)) * 100 + 
                              (paymentMonth / currentLoan.remainingMonths) * 
                              (currentLoan.currentBalance / currentLoan.originalAmount) * 100}%` 
                          }}
                        >
                          <div className="absolute -left-12 top-10 w-24 text-center">
                            <span className="text-xs font-medium text-green-800">Lump Sum Payment</span>
                          </div>
                        </div>
                      )}
                      
                      {/* New loan end (if modified) */}
                      {showModifiedSchedule && (
                        <div 
                          className="absolute top-8 h-8 bg-green-500"
                          style={{ 
                            left: `${(1 - (currentLoan.currentBalance / currentLoan.originalAmount)) * 100}%`,
                            width: `${(modifiedSchedule.length / currentLoan.remainingMonths) * 
                              (currentLoan.currentBalance / currentLoan.originalAmount) * 100}%`
                          }}
                        ></div>
                      )}
                      
                      {/* Original loan end */}
                      <div 
                        className="absolute top-0 h-16 border-l-2 border-red-500"
                        style={{ left: '100%' }}
                      >
                        <div className="absolute -left-14 top-4 w-28 text-center">
                          <span className="text-xs font-medium text-red-800">Original End Date</span>
                        </div>
                      </div>
                      
                      {/* New loan end position (if modified) */}
                      {showModifiedSchedule && modifiedSchedule.length < currentLoan.remainingMonths && (
                        <div 
                          className="absolute top-0 h-16 border-l-2 border-green-500"
                          style={{ 
                            left: `${(1 - (currentLoan.currentBalance / currentLoan.originalAmount)) * 100 + 
                              (modifiedSchedule.length / currentLoan.remainingMonths) * 
                              (currentLoan.currentBalance / currentLoan.originalAmount) * 100}%` 
                          }}
                        >
                          <div className="absolute -left-10 top-4 w-20 text-center">
                            <span className="text-xs font-medium text-green-800">New End Date</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Start</span>
                      <span>End</span>
                    </div>
                  </div>
                  
                  {/* Stats about the impact */}
                  {showModifiedSchedule && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Term Impact</h3>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Original:</p>
                            <p className="text-lg font-medium">{currentLoan.remainingMonths} months</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">New:</p>
                            <p className="text-lg font-medium">{modifiedSchedule.length} months</p>
                          </div>
                        </div>
                        <div className="mt-2 text-right">
                          <p className="text-sm font-bold text-green-600">
                            {currentLoan.remainingMonths - modifiedSchedule.length} months saved
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Interest Impact</h3>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Original:</p>
                            <p className="text-base font-medium">{formatCurrency(calculatedValues.originalInterest)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">New:</p>
                            <p className="text-base font-medium">{formatCurrency(calculatedValues.newInterest)}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-right">
                          <p className="text-sm font-bold text-green-600">
                            {formatCurrency(calculatedValues.interestSavings)} saved
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Total Payments</h3>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Original:</p>
                            <p className="text-base font-medium">{formatCurrency(currentLoan.monthlyPayment * currentLoan.remainingMonths)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">New:</p>
                            <p className="text-base font-medium">
                              {formatCurrency(
                                modifiedSchedule.reduce((sum, entry) => sum + entry.payment, 0)
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-right">
                          <p className="text-sm font-bold text-green-600">
                            {formatCurrency(
                              (currentLoan.monthlyPayment * currentLoan.remainingMonths) - 
                              modifiedSchedule.reduce((sum, entry) => sum + entry.payment, 0)
                            )} saved
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Interactive Amortization Table */}
                  <div className="overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-2">Amortization Schedule</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Click on any row to see detailed payment breakdown
                    </p>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Principal
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interest
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remaining Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(showModifiedSchedule ? modifiedSchedule : amortizationSchedule).slice(0, 12).map((entry) => (
                          <tr 
                            key={entry.month} 
                            className={`${entry.month === paymentMonth && showModifiedSchedule ? "bg-green-50" : ""} 
                                      ${selectedTableRow === entry.month ? "bg-yellow-50" : ""}
                                      cursor-pointer hover:bg-gray-50`}
                            onClick={() => setSelectedTableRow(entry.month)}
                          >
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                              {entry.month}
                              {entry.month === paymentMonth && showModifiedSchedule && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Lump Sum
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(entry.payment)}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(entry.principal)}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(entry.interest)}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(entry.balance)}
                            </td>
                          </tr>
                        ))}
                        {(showModifiedSchedule ? modifiedSchedule : amortizationSchedule).length > 12 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              Showing first 12 months. Complete schedule has {(showModifiedSchedule ? modifiedSchedule : amortizationSchedule).length} entries.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Selected row details */}
                  {selectedTableRow !== null && (
                    <div className="mt-6 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-bold mb-2">Payment Details - Month {selectedTableRow}</h3>
                      {(() => {
                        const schedule = showModifiedSchedule ? modifiedSchedule : amortizationSchedule;
                        const entry = schedule.find(e => e.month === selectedTableRow);
                        if (!entry) return <p>No details available</p>;
                        
                        const principalPercentage = (entry.principal / entry.payment) * 100;
                        const interestPercentage = (entry.interest / entry.payment) * 100;
                        
                        return (
                          <div>
                            <div className="mb-2 flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className="bg-blue-600 h-4 rounded-l-full" style={{ width: `${principalPercentage}%` }}></div>
                              </div>
                              <span className="ml-2 text-sm font-medium">{principalPercentage.toFixed(1)}% Principal</span>
                            </div>
                            
                            <div className="mb-4 flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className="bg-red-500 h-4 rounded-l-full" style={{ width: `${interestPercentage}%` }}></div>
                              </div>
                              <span className="ml-2 text-sm font-medium">{interestPercentage.toFixed(1)}% Interest</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Monthly Payment:</p>
                                <p className="font-medium">{formatCurrency(entry.payment)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Applied to Principal:</p>
                                <p className="font-medium">{formatCurrency(entry.principal)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Applied to Interest:</p>
                                <p className="font-medium">{formatCurrency(entry.interest)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Remaining Balance:</p>
                                <p className="font-medium">{formatCurrency(entry.balance)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {viewMode === 'analysis' && showModifiedSchedule && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Early Payoff Analysis</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-blue-800">Original Loan Scenario</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">Monthly Payment:</span> {formatCurrency(currentLoan.monthlyPayment)}</li>
                    <li><span className="font-medium">Remaining Term:</span> {currentLoan.remainingMonths} months</li>
                    <li><span className="font-medium">Total Payments:</span> {formatCurrency(currentLoan.monthlyPayment * currentLoan.remainingMonths)}</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-green-800">With Lump Sum Payment</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">Lump Sum Payment:</span> {formatCurrency(lumpSumPayment)} (Month {paymentMonth})</li>
                    <li><span className="font-medium">Revised Term:</span> {modifiedSchedule.length} months</li>
                    <li><span className="font-medium">Months Saved:</span> {currentLoan.remainingMonths - modifiedSchedule.length} months</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 1: Calculate Total Interest - Original Loan</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Sum of all interest payments in the original schedule
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter total original interest"
                      value={userCalculations.originalInterest === null ? '' : userCalculations.originalInterest}
                      onChange={(e) => setUserCalculations({
                        ...userCalculations,
                        originalInterest: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 2: Calculate Total Interest - Modified Loan</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Sum of all interest payments in the modified schedule
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter total modified interest"
                      value={userCalculations.newInterest === null ? '' : userCalculations.newInterest}
                      onChange={(e) => setUserCalculations({
                        ...userCalculations,
                        newInterest: e.target.value ? parseFloat(e.target.value) : null
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 3: Calculate Interest Savings</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Original total interest - modified total interest = interest savings
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
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 4: New Loan Term</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Enter the new term length (in months) after the lump sum payment
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                      placeholder="Enter new term in months"
                      value={userCalculations.newTerm === null ? '' : userCalculations.newTerm}
                      onChange={(e) => setUserCalculations({
                        ...userCalculations,
                        newTerm: e.target.value ? parseInt(e.target.value) : null
                      })}
                    />
                    <button
                      className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={handleSubmitCalculation}
                      disabled={!userCalculations.interestSavings || !userCalculations.newTerm}
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Key Early Payoff Considerations</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Early lump sum payments have the greatest impact when made early in the loan term</li>
                  <li>The full lump sum payment is applied to principal after the monthly interest is paid</li>
                  <li>You can typically choose between reducing your loan term or reducing your monthly payment</li>
                  <li>Check if your loan has any prepayment penalties before making extra payments</li>
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
                topic="Early Payoff Analysis"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}