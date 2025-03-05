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

interface PaymentScheduleRow {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

const loanOffer: LoanOffer = {
  id: "offer1",
  vehicle: "Tesla Model 3 2024",
  price: 47000,
  apr: 4.25,
  term: 60, // 5 years in months
  downPayment: 5000,
  image: "/imgs/tesla_model3.jpg",
  additionalFees: {
    docFee: 499,
    taxRate: 6.5, // percentage
    titleFee: 75,
    registrationFee: 365,
  },
};

export default function AmortizationAnalysis() {
  const router = useRouter();
  const [isCalculating, setIsCalculating] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client understand amortization schedules. Your goal is to guide them through analyzing how payments are split between principal and interest over time. Be educational, explain the concepts, and guide them step by step.
      
      Explain to the client:
      - How amortization works (fixed payment but changing principal/interest ratios)
      - Why early payments are mostly interest while later payments are mostly principal
      - How to calculate the principal and interest portions of any payment
      - How to find the remaining balance at any point in the loan
      
      Use the standard amortization formula and explain each component:
      - Monthly Payment: P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)
      - Interest portion: Remaining Balance × Monthly Rate
      - Principal portion: Monthly Payment - Interest portion
      - New Remaining Balance: Previous Remaining Balance - Principal portion
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand how amortization works in your Tesla Model 3 loan. Let's explore how your monthly payments are divided between principal and interest, and how this changes over the life of your loan!",
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
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleRow[]>([]);
  const [hoveredPayment, setHoveredPayment] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionType, setQuestionType] = useState<'principal' | 'interest' | 'remaining'>('remaining');
  const [questionPayment, setQuestionPayment] = useState<number>(0);

  const calculateLoanAmount = () => {
    const salesTax = loanOffer.price * (loanOffer.additionalFees.taxRate / 100);
    const totalFees = loanOffer.additionalFees.docFee + 
                    salesTax + 
                    loanOffer.additionalFees.titleFee + 
                    loanOffer.additionalFees.registrationFee;
    
    return loanOffer.price + totalFees - loanOffer.downPayment;
  };

  const calculateMonthlyPayment = () => {
    const principal = calculateLoanAmount();
    const monthlyRate = loanOffer.apr / 100 / 12;
    const termMonths = loanOffer.term;
    
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    return payment;
  };

  const generateAmortizationSchedule = () => {
    const loanAmount = calculateLoanAmount();
    const monthlyPayment = calculateMonthlyPayment();
    const monthlyRate = loanOffer.apr / 100 / 12;
    const schedule: PaymentScheduleRow[] = [];
    
    let remainingBalance = loanAmount;
    
    for (let paymentNumber = 1; paymentNumber <= loanOffer.term; paymentNumber++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      remainingBalance -= principalPayment;
      
      schedule.push({
        paymentNumber,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
      });
    }
    
    return schedule;
  };

  useEffect(() => {
    const schedule = generateAmortizationSchedule();
    setPaymentSchedule(schedule);
    
    // Generate a random question
    generateRandomQuestion(schedule);
  }, []);

  const generateRandomQuestion = (schedule: PaymentScheduleRow[]) => {
    // Choose a random payment between 1 and term
    const randomPayment = Math.floor(Math.random() * loanOffer.term) + 1;
    
    // Choose a random question type
    const questionTypes: ('principal' | 'interest' | 'remaining')[] = ['principal', 'interest', 'remaining'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    setQuestionType(randomType);
    setQuestionPayment(randomPayment);
    setUserAnswer(null);
    setIsCorrect(null);
    setSelectedPayment(randomPayment);
  };

  const checkAnswer = () => {
    if (userAnswer === null || selectedPayment === null) return;
    
    const paymentRow = paymentSchedule[selectedPayment - 1];
    let correctAnswer: number = 0;
    
    switch (questionType) {
      case 'principal':
        correctAnswer = paymentRow.principal;
        break;
      case 'interest':
        correctAnswer = paymentRow.interest;
        break;
      case 'remaining':
        correctAnswer = paymentRow.remainingBalance;
        break;
    }
    
    const difference = Math.abs(userAnswer - correctAnswer);
    const percentDifference = (difference / correctAnswer) * 100;
    const correct = percentDifference < 2; // Allow for some rounding differences
    
    setIsCorrect(correct);
    
    // Ask the assistant about the answer
    const questionTypeText = {
      'principal': 'principal payment',
      'interest': 'interest payment',
      'remaining': 'remaining balance'
    };
    
    setPromptValue(`I calculated the ${questionTypeText[questionType]} for payment #${selectedPayment} to be ${formatCurrency(userAnswer)}. ${correct ? "I got it right! Can you explain how this is calculated?" : "I'm not getting the right answer. Can you walk me through how to calculate this correctly?"}`);
    handleChat();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handlePaymentSelect = (paymentNumber: number) => {
    setSelectedPayment(paymentNumber);
    setUserAnswer(null);
    setIsCorrect(null);
  };

  const getPaymentBreakdown = (paymentNumber: number) => {
    if (paymentNumber < 1 || paymentNumber > paymentSchedule.length) return null;
    
    const row = paymentSchedule[paymentNumber - 1];
    const totalPayment = row.payment;
    
    const principalPercentage = (row.principal / totalPayment) * 100;
    const interestPercentage = (row.interest / totalPayment) * 100;
    
    return {
      principalPercentage,
      interestPercentage,
      ...row,
    };
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Amortization Analysis</h1>
          <p className="max-w-3xl">
            Understand how auto loan payments are divided between principal and interest over time, and how to calculate remaining balances.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Scenario</h2>
            <p className="mb-6 text-gray-700">
              Your client has been approved for financing on a new Tesla Model 3. They want to understand how their loan will be paid off over time, 
              specifically how each payment is split between principal and interest. Help them analyze the amortization schedule and answer their 
              specific questions about the loan.
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/3">
                <div className="border rounded-lg p-6">
                  <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                    <Image
                      src={loanOffer.image}
                      alt={loanOffer.vehicle}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{loanOffer.vehicle}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="text-gray-600">Price:</p>
                    <p className="font-medium">{formatCurrency(loanOffer.price)}</p>
                    
                    <p className="text-gray-600">APR:</p>
                    <p className="font-medium">{loanOffer.apr}%</p>
                    
                    <p className="text-gray-600">Term:</p>
                    <p className="font-medium">{loanOffer.term} months</p>
                    
                    <p className="text-gray-600">Down Payment:</p>
                    <p className="font-medium">{formatCurrency(loanOffer.downPayment)}</p>
                    
                    <p className="text-gray-600">Loan Amount:</p>
                    <p className="font-medium">{formatCurrency(calculateLoanAmount())}</p>
                    
                    <p className="text-gray-600">Monthly Payment:</p>
                    <p className="font-medium">{formatCurrency(calculateMonthlyPayment())}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <div className="border rounded-lg p-6 h-full">
                  <h3 className="text-lg font-semibold mb-4">Amortization Schedule</h3>
                  
                  <div className="mb-4">
                    <div className="relative w-full h-10 bg-gray-100 rounded-lg overflow-hidden mb-2">
                      {paymentSchedule.map((row, index) => {
                        const totalPaid = (row.paymentNumber / loanOffer.term) * 100;
                        const width = `${100 / loanOffer.term}%`;
                        const isSelected = selectedPayment === row.paymentNumber;
                        const isHovered = hoveredPayment === row.paymentNumber;
                        
                        return (
                          <div 
                            key={row.paymentNumber}
                            className={`absolute top-0 h-full cursor-pointer transition-all ${isSelected ? 'bg-blue-600' : isHovered ? 'bg-blue-400' : 'bg-blue-300'}`}
                            style={{ 
                              left: `${(row.paymentNumber - 1) * (100 / loanOffer.term)}%`,
                              width 
                            }}
                            onClick={() => handlePaymentSelect(row.paymentNumber)}
                            onMouseEnter={() => setHoveredPayment(row.paymentNumber)}
                            onMouseLeave={() => setHoveredPayment(null)}
                          />
                        );
                      })}
                      <div className="absolute inset-0 flex justify-between px-2 items-center text-xs font-semibold">
                        <span>1</span>
                        <span>{loanOffer.term}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Click on a payment to analyze its details
                    </p>
                  </div>
                  
                  {selectedPayment !== null && (
                    <div>
                      <h4 className="font-semibold mb-2">Payment #{selectedPayment} Details</h4>
                      
                      {getPaymentBreakdown(selectedPayment) && (
                        <div>
                          <div className="mb-4">
                            <div className="relative w-full h-12 bg-gray-100 rounded-lg overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-blue-500"
                                style={{ width: `${getPaymentBreakdown(selectedPayment)!.principalPercentage}%` }}
                              >
                                <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                                  Principal: {formatCurrency(getPaymentBreakdown(selectedPayment)!.principal)}
                                </div>
                              </div>
                              <div 
                                className="absolute top-0 right-0 h-full bg-orange-500"
                                style={{ width: `${getPaymentBreakdown(selectedPayment)!.interestPercentage}%` }}
                              >
                                <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                                  Interest: {formatCurrency(getPaymentBreakdown(selectedPayment)!.interest)}
                                </div>
                              </div>
                            </div>
                            <div className="text-center text-sm mt-1">
                              Total Payment: {formatCurrency(getPaymentBreakdown(selectedPayment)!.payment)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Previous Balance</p>
                              <p className="font-medium">
                                {selectedPayment > 1 
                                  ? formatCurrency(getPaymentBreakdown(selectedPayment - 1)!.remainingBalance) 
                                  : formatCurrency(calculateLoanAmount())}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Remaining Balance</p>
                              <p className="font-medium">
                                {formatCurrency(getPaymentBreakdown(selectedPayment)!.remainingBalance)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Practice Problem</h4>
                        <p className="mb-4">
                          {questionType === 'principal' && `Calculate the principal portion of payment #${questionPayment}.`}
                          {questionType === 'interest' && `Calculate the interest portion of payment #${questionPayment}.`}
                          {questionType === 'remaining' && `Calculate the remaining balance after payment #${questionPayment} is made.`}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-1"
                            placeholder="Enter your answer"
                            value={userAnswer === null ? '' : userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value ? parseFloat(e.target.value) : null)}
                          />
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={checkAnswer}
                            disabled={userAnswer === null}
                          >
                            Check
                          </button>
                        </div>
                        
                        {isCorrect !== null && (
                          <div className={`mt-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect 
                              ? 'Correct! Great job!' 
                              : 'Not quite right. Try again or check with the assistant for help.'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Helpful Formula Reference</h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Understanding Amortization:</strong>
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>
                  <strong>Interest Payment</strong> = Current Balance × (Annual Rate ÷ 12 ÷ 100)
                </li>
                <li>
                  <strong>Principal Payment</strong> = Monthly Payment - Interest Payment
                </li>
                <li>
                  <strong>New Balance</strong> = Previous Balance - Principal Payment
                </li>
                <li>
                  Early in the loan, most of each payment goes to interest because the balance is high
                </li>
                <li>
                  Later in the loan, more of each payment goes to principal as the balance decreases
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
                topic="Amortization Analysis"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}