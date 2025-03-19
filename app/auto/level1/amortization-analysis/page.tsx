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

interface PaymentScheduleRow {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface AmortizationRow {
  month: number;
  interest: number;
  principal: number;
  balance: number;
  isCalculated: boolean;
}

interface UserCalculations {
  monthlyPayment?: number;
  totalInterest?: number;
  startBalance: number;
  amortizationTable: AmortizationRow[];
  selectedPaymentData?: {
    principal?: number;
    interest?: number;
    remainingBalance?: number;
  };
}

export default function AmortizationAnalysis() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for question-related functionality
  const [questionType, setQuestionType] = useState<'principal' | 'interest' | 'remaining'>('principal');
  const [questionPayment, setQuestionPayment] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState({
    principal: 0,
    interest: 0,
    remaining: 0,
    loanAmount: 0,
    totalInterest: 0,
    interestToLoanRatio: 0
  });
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleRow[]>([]);
  const [loanOffer, setLoanOffer] = useState<LoanOffer>({
    id: "civic",
    vehicle: "Honda Civic",
    price: 25000,
    apr: 4,
    term: 48,
    downPayment: 5000,
    image: "/imgs/honda_civic.jpg",
    additionalFees: {
      docFee: 150,
      taxRate: 6,
      titleFee: 100,
      registrationFee: 250
    }
  });
  
  // Loan details (fixed for this exercise)
  const loanDetails = {
    vehiclePrice: 25000, // Base vehicle price
    salesTax: 1500, // 6% sales tax
    documentationFee: 150, // Documentation fee
    titleFee: 100, // Title transfer fee
    registrationFee: 250, // Vehicle registration fee
    totalPrice: 27000, // Total price including all fees
    downPayment: 5000, // Down payment
    amount: 22000, // Loan amount (totalPrice - downPayment)
    interestRate: 4, // Annual interest rate (%)
    term: 48, // Loan term in months
    payment: 496.74, // Monthly payment
    totalPaid: 23843.52, // Total amount paid over the loan term
    financeCost: 1843.52 // Total interest paid (totalPaid - amount)
  };
  
  // Key months to display in amortization table
  const keyMonths = [1, 12, 24, 36, 48];
  
  // Get correct row data for validation (hidden from students)
  const getCorrectRowData = (month: number): { interest: number; principal: number; balance: number } => {
    // Use the starting balance from user input if available, otherwise use loan amount
    let balance = userCalculations.startBalance > 0 ? userCalculations.startBalance : loanDetails.amount;
    const monthlyRate = loanDetails.interestRate / 100 / 12;
    
    for (let i = 1; i <= month; i++) {
      const interest = balance * monthlyRate;
      const principal = loanDetails.payment - interest;
      balance = balance - principal;
      
      if (i === month) {
        return {
          interest,
          principal,
          balance: Math.max(0, balance) // Ensure balance doesn't go below 0
        };
      }
    }
    
    return { interest: 0, principal: 0, balance: 0 };
  };
  
  // Create initial table with empty calculations
  const initializeAmortizationTable = (): AmortizationRow[] => {
    return keyMonths.map(month => {
      return {
        month,
        interest: 0,
        principal: 0,
        balance: 0,
        isCalculated: false
      };
    });
  };
  
  // State for user calculations
  const [userCalculations, setUserCalculations] = useState<UserCalculations>({
    monthlyPayment: undefined,
    totalInterest: undefined,
    startBalance: 0,
    amortizationTable: initializeAmortizationTable(),
    selectedPaymentData: {
      principal: undefined,
      interest: undefined,
      remainingBalance: undefined
    }
  });
  
  // Display states
  const [showFormulas, setShowFormulas] = useState(false);
  
  // Track completion status for each calculation
  const [completedCalculations, setCompletedCalculations] = useState({
    monthlyPayment: false,
    amortizationTable: false,
    loanAmount: false,
    totalInterest: false,
    interestToLoanRatio: false
  });
  
  // User progress trackers
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [totalCells, setTotalCells] = useState<number>(keyMonths.length * 3);

  // Initialize component
  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Calculate monthly payment
  const calculateMonthlyPayment = (principal: number, rate: number, term: number): number => {
    const monthlyRate = rate / 100 / 12;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  };
  
  // Validate a user-entered value against the correct answer
  const validateValue = (value: number, correctValue: number): boolean => {
    const difference = Math.abs(value - correctValue);
    const percentDifference = (difference / correctValue) * 100;
    return percentDifference < 2; // Allow for rounding differences (2% tolerance)
  };
  
  // Validate monthly payment calculation
  const validateMonthlyPaymentInput = (value: string): boolean => {
    if (!value) return false;
    
    const userValue = parseFloat(value);
    if (isNaN(userValue)) return false;
    
    const correctValue = loanDetails.payment;
    const isCorrect = validateValue(userValue, correctValue);
    
    if (isCorrect && !completedCalculations.monthlyPayment) {
      setCompletedCalculations(prev => ({...prev, monthlyPayment: true}));
    }
    
    return isCorrect;
  };
  
  // Validate a table cell value
  const validateTableCell = (
    month: number, 
    field: 'interest' | 'principal' | 'balance', 
    value: string
  ): boolean => {
    if (!value) return false;
    
    const userValue = parseFloat(value);
    if (isNaN(userValue)) return false;
    
    const correctData = getCorrectRowData(month);
    const correctValue = correctData[field];
    
    return validateValue(userValue, correctValue);
  };
  
  // Handle table cell value change
  const handleCellValueChange = (
    month: number, 
    field: 'interest' | 'principal' | 'balance', 
    value: string
  ) => {
    if (!value) return;
    
    const userValue = parseFloat(value);
    if (isNaN(userValue)) return;
    
    const isCorrect = validateTableCell(month, field, value);
    
    setUserCalculations(prev => {
      // Check if this value was previously incorrect and is now correct
      // or was previously correct and is now incorrect
      const previousRowData = prev.amortizationTable.find(row => row.month === month);
      const wasCorrect = previousRowData ? 
        validateTableCell(month, field, previousRowData[field].toString()) : false;
      
      // Update total correct count
      if (isCorrect && !wasCorrect) {
        setTotalCorrect(prev => prev + 1);
      } else if (!isCorrect && wasCorrect) {
        setTotalCorrect(prev => prev - 1);
      }
    
      const updatedTable = prev.amortizationTable.map(row => {
        if (row.month === month) {
          const updatedRow = { ...row, [field]: userValue };
          
          // Check if all fields for this row are correctly calculated
          const interestCorrect = validateTableCell(month, 'interest', field === 'interest' ? value : row.interest.toString());
          const principalCorrect = validateTableCell(month, 'principal', field === 'principal' ? value : row.principal.toString());
          const balanceCorrect = validateTableCell(month, 'balance', field === 'balance' ? value : row.balance.toString());
          
          updatedRow.isCalculated = interestCorrect && principalCorrect && balanceCorrect;
          
          return updatedRow;
        }
        return row;
      });
      
      // Check if all rows are correctly calculated
      const allRowsCalculated = updatedTable.every(row => row.isCalculated);
      if (allRowsCalculated && !completedCalculations.amortizationTable) {
        setCompletedCalculations(prev => ({...prev, amortizationTable: true}));
      }
      
      return { ...prev, amortizationTable: updatedTable };
    });
  };

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

  // This function will be used for the Honda Civic example later
const calculatePaymentForOffer = (offer: LoanOffer) => {
    if (!offer) return 0;
    
    const principal = calculateLoanAmount(offer);
    const monthlyRate = offer.apr / 100 / 12;
    const termMonths = offer.term;
    
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    return payment;
  };

  const generateAmortizationSchedule = (offer: LoanOffer) => {
    if (!offer) return [];
    
    const loanAmount = calculateLoanAmount(offer);
    const monthlyPayment = calculatePaymentForOffer(offer);
    const monthlyRate = offer.apr / 100 / 12;
    const schedule: PaymentScheduleRow[] = [];
    
    let remainingBalance = loanAmount;
    
    for (let paymentNumber = 1; paymentNumber <= offer.term; paymentNumber++) {
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

  const generateRandomQuestion = (schedule: PaymentScheduleRow[]) => {
    if (!loanOffer || !schedule.length) return;
    
    // Choose a random payment between 1 and term
    const randomPayment = Math.floor(Math.random() * (loanOffer.term)) + 1;
    
    // Choose a random question type
    const questionTypes: ('principal' | 'interest' | 'remaining')[] = ['principal', 'interest', 'remaining'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    setQuestionType(randomType);
    setQuestionPayment(randomPayment);
    setUserAnswer('');
    setIsCorrect(null);
    setSelectedPayment(randomPayment);
    
    // Reset user calculations for the new selected payment
    setUserCalculations(prev => ({
      ...prev,
      selectedPaymentData: {
        principal: undefined,
        interest: undefined,
        remainingBalance: undefined
      }
    }));
    
    // Store correct answers internally (never shown to student)
    const paymentRow = schedule[randomPayment - 1];
    if (paymentRow) {
      setCorrectAnswers(prev => ({
        ...prev,
        principal: paymentRow.principal,
        interest: paymentRow.interest,
        remaining: paymentRow.remainingBalance
      }));
    }
  };

  const handlePaymentSelect = (paymentNumber: number) => {
    if (!paymentSchedule.length) return;
    
    setSelectedPayment(paymentNumber);
    setUserAnswer('');
    setIsCorrect(null);
    
    // Update the question to match the selected payment
    setQuestionPayment(paymentNumber);
    
    // Reset user calculations for the new selected payment
    setUserCalculations(prev => ({
      ...prev,
      selectedPaymentData: {
        principal: undefined,
        interest: undefined,
        remainingBalance: undefined
      }
    }));
    
    // Store correct answers internally (never shown to student)
    const paymentRow = paymentSchedule[paymentNumber - 1];
    if (paymentRow) {
      setCorrectAnswers(prev => ({
        ...prev,
        principal: paymentRow.principal,
        interest: paymentRow.interest,
        remaining: paymentRow.remainingBalance
      }));
    }
  };

  const validateAnswer = () => {
    if (!userAnswer || selectedPayment === null) return;
    
    const userValue = parseFloat(userAnswer);
    if (isNaN(userValue)) return;
    
    let correctAnswer: number = 0;
    let fieldToUpdate: 'principal' | 'interest' | 'remainingBalance' = 'remainingBalance';
    
    switch (questionType) {
      case 'principal':
        correctAnswer = correctAnswers.principal;
        fieldToUpdate = 'principal';
        break;
      case 'interest':
        correctAnswer = correctAnswers.interest;
        fieldToUpdate = 'interest';
        break;
      case 'remaining':
        correctAnswer = correctAnswers.remaining;
        fieldToUpdate = 'remainingBalance';
        break;
    }
    
    const difference = Math.abs(userValue - correctAnswer);
    const percentDifference = (difference / correctAnswer) * 100;
    const correct = percentDifference < 2; // Allow for some rounding differences
    
    setIsCorrect(correct);
    
    // Store the user's calculation regardless of correctness
    setUserCalculations(prev => ({
      ...prev,
      selectedPaymentData: {
        ...prev.selectedPaymentData,
        [fieldToUpdate]: userValue
      }
    }));
    
    if (!correct) {
      // Show formula reference if answer is incorrect
      setShowFormulas(true);
    }
  };
  
  const validateLoanAmount = (value: string) => {
    if (!value || !loanOffer) return false;
    
    const userValue = parseFloat(value);
    if (isNaN(userValue)) return false;
    
    const difference = Math.abs(userValue - correctAnswers.loanAmount);
    const percentDifference = (difference / correctAnswers.loanAmount) * 100;
    
    const isCorrect = percentDifference < 2; // Allow for some rounding differences
    
    if (isCorrect && !completedCalculations.loanAmount) {
      setCompletedCalculations(prev => ({...prev, loanAmount: true}));
    }
    
    return isCorrect;
  };
  
  const validateCalculatedMonthlyPayment = (value: string) => {
    if (!value) return false;
    
    const userValue = parseFloat(value);
    if (isNaN(userValue)) return false;
    
    const correctValue = loanDetails.payment;
    const difference = Math.abs(userValue - correctValue);
    const percentDifference = (difference / correctValue) * 100;
    
    const isCorrect = percentDifference < 2; // Allow for some rounding differences
    
    if (isCorrect && !completedCalculations.monthlyPayment) {
      setCompletedCalculations(prev => ({...prev, monthlyPayment: true}));
    }
    
    return isCorrect;
  };
  
  const validateTotalInterest = (value: string) => {
    if (!value || !paymentSchedule.length) return false;
    
    const userValue = parseFloat(value);
    if (isNaN(userValue)) return false;
    
    const difference = Math.abs(userValue - correctAnswers.totalInterest);
    const percentDifference = (difference / correctAnswers.totalInterest) * 100;
    
    const isCorrect = percentDifference < 2; // Allow for some rounding differences
    
    if (isCorrect && !completedCalculations.totalInterest) {
      setCompletedCalculations(prev => ({...prev, totalInterest: true}));
    }
    
    return isCorrect;
  };
  
  const validateInterestRatio = (value: string) => {
    if (!value || !paymentSchedule.length) return false;
    
    const userValue = parseFloat(value);
    if (isNaN(userValue)) return false;
    
    const difference = Math.abs(userValue - correctAnswers.interestToLoanRatio);
    const percentDifference = difference < 10 ? difference : (difference / correctAnswers.interestToLoanRatio) * 100;
    
    const isCorrect = percentDifference < 2; // Allow for some rounding differences
    
    if (isCorrect && !completedCalculations.interestToLoanRatio) {
      setCompletedCalculations(prev => ({...prev, interestToLoanRatio: true}));
    }
    
    return isCorrect;
  };


  const getPaymentBreakdown = (paymentNumber: number) => {
    if (!paymentSchedule.length || paymentNumber < 1 || paymentNumber > paymentSchedule.length) return null;
    
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

  // Define system prompts for the assistant
  const initialMessages = [
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
      
      IMPORTANT: Never provide specific dollar amounts or numerical answers to calculations. Only provide general formulas and conceptual explanations. Guide the student to discover the answers themselves.
      
      Be helpful, patient, and ensure they understand the concepts. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand how amortization works in auto loans. Let's explore how monthly payments are divided between principal and interest, and how this changes over the life of your loan!",
    },
  ];

  // Scenario description
  const scenarioText = `
As a financial advisor, you're helping a client understand the amortization schedule for their auto loan. They've been approved for financing on a car with the following terms:

Loan amount: $20,000
Interest rate: 4%
Loan term: 48 months (4 years)

Your client is particularly interested in:
1. How their payments are divided between principal and interest
2. Why the proportion of principal to interest changes over the life of the loan
3. How to calculate the remaining balance at different points in the loan term

Your task is to:
- Calculate the monthly payment for this loan
- Complete an amortization table showing key months in the loan term (1, 12, 24, 36, and 48)
- For each key month, calculate the interest portion, principal portion, and remaining balance

This exercise will help you understand how amortization works and how to calculate key values at any point in a loan's term.
`;

  // Main content components
  const LoanDetailsSection = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading loan details...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="py-8 text-center text-red-500">
          {error}
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Loan Amortization Analysis</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Loan Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p className="text-gray-600">Vehicle Base Price:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.vehiclePrice)}</p>
                  
                  <p className="text-gray-600">Sales Tax (6%):</p>
                  <p className="font-medium">{formatCurrency(loanDetails.salesTax)}</p>
                  
                  <p className="text-gray-600">Documentation Fee:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.documentationFee)}</p>
                  
                  <p className="text-gray-600">Title Fee:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.titleFee)}</p>
                  
                  <p className="text-gray-600">Registration Fee:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.registrationFee)}</p>
                  
                  <p className="text-gray-600 font-semibold">Total Vehicle Price:</p>
                  <p className="font-medium font-semibold">{formatCurrency(loanDetails.totalPrice)}</p>
                  
                  <p className="text-gray-600">Down Payment:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.downPayment)}</p>
                  
                  <p className="text-gray-600 font-semibold">Loan Amount:</p>
                  <p className="font-medium font-semibold">{formatCurrency(loanDetails.amount)}</p>
                  
                  <p className="text-gray-600">Interest Rate:</p>
                  <p className="font-medium">{loanDetails.interestRate}%</p>
                  
                  <p className="text-gray-600">Loan Term:</p>
                  <p className="font-medium">{loanDetails.term} months</p>
                  
                  <p className="text-gray-600">Monthly Payment:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.payment)}</p>
                  
                  <p className="text-gray-600">Total Amount Paid:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.totalPaid)}</p>
                  
                  <p className="text-gray-600">Finance Cost:</p>
                  <p className="font-medium">{formatCurrency(loanDetails.financeCost)}</p>
                </div>
              </div>
            </div>
            
            
            {/* Amortization Table */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Amortization Schedule</h3>
                <button
                  onClick={() => setShowFormulas(!showFormulas)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  {showFormulas ? 'Hide Formulas' : 'Show Formulas'}
                </button>
              </div>
              
              
              {/* Formula Reference */}
              {showFormulas && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 animate-fadeIn">
                  <h4 className="font-bold mb-2">Amortization Formula Reference</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Monthly Payment Formula:</p>
                      <p className="text-gray-700">Payment = P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)</p>
                      <p className="text-gray-600 text-xs mt-1">Where:</p>
                      <ul className="list-disc pl-5 text-gray-600 text-xs">
                        <li>P = Principal (loan amount)</li>
                        <li>r = Monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
                        <li>n = Total number of payments (term in months)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">For each payment:</p>
                      <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                        <li>Interest = Current Balance × Monthly Rate</li>
                        <li>Principal = Payment - Interest</li>
                        <li>New Balance = Previous Balance - Principal</li>
                      </ol>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      <p><strong>Key Insight:</strong> Early in the loan, most of the payment goes to interest because the balance is high. Later, more goes to principal as the balance decreases.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-4">
                Complete the amortization table below by calculating the interest, principal, and balance for each month.
                Use the following steps for each row:
                <ol className="list-decimal pl-5 text-xs mt-2 space-y-1">
                  <li><strong>Interest</strong>: Current balance × monthly rate (4% ÷ 12 ÷ 100 = 0.0033)</li>
                  <li><strong>Principal</strong>: Monthly payment − interest</li>
                  <li><strong>Balance</strong>: Previous balance − principal</li>
                </ol>
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b border-r text-left">Month</th>
                      <th className="py-2 px-4 border-b border-r text-right">Interest</th>
                      <th className="py-2 px-4 border-b border-r text-right">Principal</th>
                      <th className="py-2 px-4 border-b text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border-b border-r font-medium">Start</td>
                      <td className="py-2 px-4 border-b border-r text-right">-</td>
                      <td className="py-2 px-4 border-b border-r text-right">-</td>
                      <td className="py-2 px-4 border-b text-right">
                        <input
                          type="text"
                          className={`w-full py-1 px-2 text-right border rounded ${
                            userCalculations.startBalance > 0 && Math.abs(userCalculations.startBalance - loanDetails.amount) < 1
                              ? 'border-green-500' 
                              : 'border-gray-300'
                          }`}
                          value={userCalculations.startBalance || ''}
                          placeholder="Enter initial balance"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                              setUserCalculations(prev => ({
                                ...prev,
                                startBalance: value === '' ? 0 : parseFloat(value)
                              }));
                            }
                          }}
                        />
                      </td>
                    </tr>
                    
                    {userCalculations.amortizationTable.map((row, index) => {
                      return (
                        <tr 
                          key={row.month} 
                          className={`${row.isCalculated ? 'bg-green-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="py-2 px-4 border-b border-r font-medium">{row.month}</td>
                          
                          {/* Interest Cell */}
                          <td className="py-2 px-4 border-b border-r text-right">
                            <input
                              type="text"
                              className={`w-full py-1 px-2 text-right border rounded ${
                                row.interest > 0 && validateTableCell(row.month, 'interest', row.interest.toString()) 
                                  ? 'border-green-500' 
                                  : 'border-gray-300'
                              }`}
                              value={row.interest || ''}
                              placeholder="Enter interest"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                                  handleCellValueChange(
                                    row.month, 
                                    'interest', 
                                    value
                                  );
                                }
                              }}
                            />
                          </td>
                          
                          {/* Principal Cell */}
                          <td className="py-2 px-4 border-b border-r text-right">
                            <input
                              type="text"
                              className={`w-full py-1 px-2 text-right border rounded ${
                                row.principal > 0 && validateTableCell(row.month, 'principal', row.principal.toString()) 
                                  ? 'border-green-500' 
                                  : 'border-gray-300'
                              }`}
                              value={row.principal || ''}
                              placeholder="Enter principal"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                                  handleCellValueChange(
                                    row.month, 
                                    'principal', 
                                    value
                                  );
                                }
                              }}
                            />
                          </td>
                          
                          {/* Balance Cell */}
                          <td className="py-2 px-4 border-b text-right">
                            <input
                              type="text"
                              className={`w-full py-1 px-2 text-right border rounded ${
                                row.balance > 0 && validateTableCell(row.month, 'balance', row.balance.toString()) 
                                  ? 'border-green-500' 
                                  : 'border-gray-300'
                              }`}
                              value={row.balance || ''}
                              placeholder="Enter balance"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                                  handleCellValueChange(
                                    row.month, 
                                    'balance', 
                                    value
                                  );
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Instructions for table */}
              <div className="mt-3 text-xs text-gray-600">
                <p>Enter your calculated values in each box. Boxes will turn green when correctly calculated.</p>
                <p>Note: For simplicity, we're using dollar values rounded to the nearest dollar.</p>
              </div>
              
              {/* Insights box - shows when all calculations are complete */}
              {completedCalculations.amortizationTable && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-bold mb-2">Key Insights from Your Analysis</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><span className="font-medium">Interest vs. Principal Shift:</span> In month 1, approximately 15% of your payment goes to principal and 85% to interest. By month 48, nearly 99% goes to principal.</li>
                    <li><span className="font-medium">Total Interest Paid:</span> Over the life of this loan, you pay approximately {formatCurrency(loanDetails.payment * loanDetails.term - loanDetails.amount)} in interest.</li>
                    <li><span className="font-medium">Faster Equity Building:</span> Notice how the balance decreases more quickly in later months as more of each payment is applied to the principal.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <AutoLayout
      title="Car Loan Amortization Analysis"
      description="Calculate and understand how auto loan payments are divided between principal and interest over time."
      scenario={scenarioText}
      initialMessages={initialMessages}
      topic="Auto Financing - Amortization"
    >
      <div className="space-y-6">
        <LoanDetailsSection />
      </div>
    </AutoLayout>
  );
}