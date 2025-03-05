"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Chat from "@/components/Chat";

interface VehicleOwnership {
  id: string;
  vehicle: string;
  price: number;
  downPayment: number;
  tradeInValue: number;
  loanTerm: number; // months
  apr: number;
  image: string;
  fees: {
    docFee: number;
    destinationFee: number;
    titleFee: number;
    registrationFee: number;
    salesTaxRate: number;
  };
  costs: {
    insuranceMonthly: number;
    maintenanceYearly: number;
    fuelMonthly: number;
    annualMiles: number;
    mpg: number;
    fuelPricePerGallon: number;
    depreciationRate: number; // percentage per year
    yearsOwned: number;
  };
}

const vehicleOwnership: VehicleOwnership = {
  id: "ownership1",
  vehicle: "Tesla Model 3 2024",
  price: 47000,
  downPayment: 5000,
  tradeInValue: 0,
  loanTerm: 60, // 5 years
  apr: 4.25,
  image: "/imgs/tesla_model3.jpg",
  fees: {
    docFee: 499,
    destinationFee: 1200,
    titleFee: 75,
    registrationFee: 365,
    salesTaxRate: 6.5, // percentage
  },
  costs: {
    insuranceMonthly: 150,
    maintenanceYearly: 500, // EV maintenance is typically lower
    fuelMonthly: 75, // electricity costs
    annualMiles: 12000,
    mpg: 0, // Not applicable for EVs, using kWh instead
    fuelPricePerGallon: 0, // Not applicable for EVs
    depreciationRate: 15, // percentage per year
    yearsOwned: 7,
  },
};

export default function TotalCostCalculator() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client understand the total cost of vehicle ownership. Your goal is to guide them through analyzing all components that make up the lifetime cost of owning a vehicle, beyond just the purchase price. Be educational, explain each component, and guide them step by step.
      
      Explain to the client:
      - How to calculate the total cost of ownership (TCO)
      - Which ongoing costs should be included beyond the purchase price
      - How depreciation affects the true cost of ownership
      - How to account for financing costs (interest paid)
      - The difference between fixed costs and variable costs
      
      The total cost of ownership calculation typically includes:
      - Initial purchase costs (vehicle price, taxes, fees, minus trade-in and down payment)
      - Financing costs (total interest paid over the loan term)
      - Insurance costs over the ownership period
      - Maintenance and repair costs
      - Fuel/energy costs
      - Depreciation (loss in value)
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand the true cost of owning your Tesla Model 3. Many people focus only on the purchase price, but there are several other significant costs to consider over the life of ownership. Let's work through calculating the total cost of ownership together!",
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
  const [activeCategory, setActiveCategory] = useState('purchase');
  
  const [userCalculations, setUserCalculations] = useState({
    initialCost: null as number | null,
    financingCost: null as number | null,
    insuranceCost: null as number | null,
    maintenanceCost: null as number | null,
    fuelCost: null as number | null,
    depreciationCost: null as number | null,
    totalCost: null as number | null,
  });
  
  const [calculationFeedback, setCalculationFeedback] = useState({
    initialCost: null as boolean | null,
    financingCost: null as boolean | null,
    insuranceCost: null as boolean | null,
    maintenanceCost: null as boolean | null,
    fuelCost: null as boolean | null,
    depreciationCost: null as boolean | null,
    totalCost: null as boolean | null,
  });

  // Calculate correct values
  const calculateInitialCost = () => {
    const salesTax = vehicleOwnership.price * (vehicleOwnership.fees.salesTaxRate / 100);
    const totalFees = vehicleOwnership.fees.docFee + 
                     vehicleOwnership.fees.destinationFee + 
                     vehicleOwnership.fees.titleFee + 
                     vehicleOwnership.fees.registrationFee;
    
    return vehicleOwnership.price + totalFees + salesTax - vehicleOwnership.downPayment - vehicleOwnership.tradeInValue;
  };

  const calculateLoanPayment = () => {
    const loanAmount = calculateInitialCost();
    const monthlyRate = vehicleOwnership.apr / 100 / 12;
    const termMonths = vehicleOwnership.loanTerm;
    
    const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    return payment;
  };

  const calculateFinancingCost = () => {
    const loanPayment = calculateLoanPayment();
    const totalPayments = loanPayment * vehicleOwnership.loanTerm;
    const loanAmount = calculateInitialCost();
    
    // Total interest paid = Total payments - Principal
    return totalPayments - loanAmount;
  };

  const calculateInsuranceCost = () => {
    // Monthly insurance cost * 12 months * years owned
    return vehicleOwnership.costs.insuranceMonthly * 12 * vehicleOwnership.costs.yearsOwned;
  };

  const calculateMaintenanceCost = () => {
    // Yearly maintenance cost * years owned
    return vehicleOwnership.costs.maintenanceYearly * vehicleOwnership.costs.yearsOwned;
  };

  const calculateFuelCost = () => {
    // Monthly fuel cost * 12 months * years owned
    return vehicleOwnership.costs.fuelMonthly * 12 * vehicleOwnership.costs.yearsOwned;
  };

  const calculateDepreciationCost = () => {
    // Calculate the value after depreciation
    let currentValue = vehicleOwnership.price;
    const yearsOwned = vehicleOwnership.costs.yearsOwned;
    const depreciationRate = vehicleOwnership.costs.depreciationRate / 100;
    
    for (let year = 1; year <= yearsOwned; year++) {
      currentValue *= (1 - depreciationRate);
    }
    
    // Depreciation cost = Initial value - Final value
    return vehicleOwnership.price - currentValue;
  };

  const calculateTotalCost = () => {
    return calculateInitialCost() + 
           calculateFinancingCost() + 
           calculateInsuranceCost() + 
           calculateMaintenanceCost() + 
           calculateFuelCost() +
           calculateDepreciationCost();
  };

  const checkCalculation = (type: keyof typeof userCalculations) => {
    if (userCalculations[type] === null) return null;
    
    let correctValue: number;
    switch (type) {
      case 'initialCost':
        correctValue = calculateInitialCost();
        break;
      case 'financingCost':
        correctValue = calculateFinancingCost();
        break;
      case 'insuranceCost':
        correctValue = calculateInsuranceCost();
        break;
      case 'maintenanceCost':
        correctValue = calculateMaintenanceCost();
        break;
      case 'fuelCost':
        correctValue = calculateFuelCost();
        break;
      case 'depreciationCost':
        correctValue = calculateDepreciationCost();
        break;
      case 'totalCost':
        correctValue = calculateTotalCost();
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
    
    if (type === 'totalCost' && isCorrect) {
      setPromptValue(`I calculated the total cost of ownership for the Tesla Model 3 over ${vehicleOwnership.costs.yearsOwned} years to be ${formatCurrency(userCalculations.totalCost as number)}. That's significantly higher than the purchase price of ${formatCurrency(vehicleOwnership.price)}. Can you explain why there's such a big difference and which costs contribute the most to the total cost of ownership?`);
      handleChat();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Calculate proportions for the cost breakdown chart
  const calculateProportions = () => {
    const initialCost = calculateInitialCost();
    const financingCost = calculateFinancingCost();
    const insuranceCost = calculateInsuranceCost();
    const maintenanceCost = calculateMaintenanceCost();
    const fuelCost = calculateFuelCost();
    const depreciationCost = calculateDepreciationCost();
    const totalCost = calculateTotalCost();
    
    return {
      initialProportion: (initialCost / totalCost) * 100,
      financingProportion: (financingCost / totalCost) * 100,
      insuranceProportion: (insuranceCost / totalCost) * 100,
      maintenanceProportion: (maintenanceCost / totalCost) * 100,
      fuelProportion: (fuelCost / totalCost) * 100,
      depreciationProportion: (depreciationCost / totalCost) * 100,
    };
  };

  const costProportions = calculateProportions();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Total Cost of Ownership Calculator</h1>
          <p className="max-w-3xl">
            Learn to calculate the true cost of owning a vehicle over its lifetime, including all expenses beyond the purchase price.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Scenario</h2>
            <p className="mb-6 text-gray-700">
              Your client is considering purchasing a Tesla Model 3 and wants to understand the true cost of ownership 
              over a 7-year period. They're surprised when you mention that the total cost will be much higher than 
              just the purchase price. Help them calculate and break down the total cost of ownership to make a fully 
              informed decision.
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/3">
                <div className="border rounded-lg p-6">
                  <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                    <Image
                      src={vehicleOwnership.image}
                      alt={vehicleOwnership.vehicle}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{vehicleOwnership.vehicle}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="text-gray-600">Purchase Price:</p>
                    <p className="font-medium">{formatCurrency(vehicleOwnership.price)}</p>
                    
                    <p className="text-gray-600">Down Payment:</p>
                    <p className="font-medium">{formatCurrency(vehicleOwnership.downPayment)}</p>
                    
                    <p className="text-gray-600">Loan Term:</p>
                    <p className="font-medium">{vehicleOwnership.loanTerm / 12} years</p>
                    
                    <p className="text-gray-600">APR:</p>
                    <p className="font-medium">{vehicleOwnership.apr}%</p>
                    
                    <p className="text-gray-600">Years of Ownership:</p>
                    <p className="font-medium">{vehicleOwnership.costs.yearsOwned} years</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6 mt-4">
                  <h3 className="font-semibold mb-3">Cost Factors</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="text-gray-600">Insurance:</p>
                    <p className="font-medium">{formatCurrency(vehicleOwnership.costs.insuranceMonthly)}/month</p>
                    
                    <p className="text-gray-600">Maintenance:</p>
                    <p className="font-medium">{formatCurrency(vehicleOwnership.costs.maintenanceYearly)}/year</p>
                    
                    <p className="text-gray-600">Electricity:</p>
                    <p className="font-medium">{formatCurrency(vehicleOwnership.costs.fuelMonthly)}/month</p>
                    
                    <p className="text-gray-600">Annual Miles:</p>
                    <p className="font-medium">{vehicleOwnership.costs.annualMiles.toLocaleString()}</p>
                    
                    <p className="text-gray-600">Depreciation:</p>
                    <p className="font-medium">{vehicleOwnership.costs.depreciationRate}%/year</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <div className="mb-6">
                  <div className="flex border-b">
                    <button
                      className={`py-2 px-4 font-medium ${activeCategory === 'purchase' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveCategory('purchase')}
                    >
                      Initial Purchase
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${activeCategory === 'ongoing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveCategory('ongoing')}
                    >
                      Ongoing Costs
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${activeCategory === 'depreciation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveCategory('depreciation')}
                    >
                      Depreciation
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${activeCategory === 'total' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveCategory('total')}
                    >
                      Total Cost
                    </button>
                  </div>
                  
                  <div className="p-4 border border-t-0 rounded-b-lg">
                    {activeCategory === 'purchase' && (
                      <div>
                        <h3 className="font-semibold mb-3">Initial Purchase Costs</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          The initial purchase cost includes the price of the vehicle plus all taxes and fees, minus any down payment or trade-in value.
                        </p>
                        
                        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-600">Vehicle Price:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.price)}</p>
                            
                            <p className="text-gray-600">+ Documentation Fee:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.fees.docFee)}</p>
                            
                            <p className="text-gray-600">+ Destination Fee:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.fees.destinationFee)}</p>
                            
                            <p className="text-gray-600">+ Title Fee:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.fees.titleFee)}</p>
                            
                            <p className="text-gray-600">+ Registration Fee:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.fees.registrationFee)}</p>
                            
                            <p className="text-gray-600">+ Sales Tax ({vehicleOwnership.fees.salesTaxRate}%):</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.price * (vehicleOwnership.fees.salesTaxRate / 100))}</p>
                            
                            <p className="text-gray-600">- Down Payment:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.downPayment)}</p>
                            
                            <p className="text-gray-600">- Trade-in Value:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.tradeInValue)}</p>
                            
                            <p className="col-span-2 border-t mt-2 pt-2"></p>
                            
                            <p className="text-gray-800 font-semibold">Initial Financed Amount:</p>
                            <p className="font-bold">{formatCurrency(calculateInitialCost())}</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                          <h4 className="font-semibold mb-2">Financing Costs</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Calculate the total interest paid over the life of the loan.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-600">Loan Amount:</p>
                            <p className="font-medium">{formatCurrency(calculateInitialCost())}</p>
                            
                            <p className="text-gray-600">APR:</p>
                            <p className="font-medium">{vehicleOwnership.apr}%</p>
                            
                            <p className="text-gray-600">Loan Term:</p>
                            <p className="font-medium">{vehicleOwnership.loanTerm} months</p>
                            
                            <p className="text-gray-600">Monthly Payment:</p>
                            <p className="font-medium">{formatCurrency(calculateLoanPayment())}</p>
                            
                            <p className="text-gray-600">Total Payments:</p>
                            <p className="font-medium">{formatCurrency(calculateLoanPayment() * vehicleOwnership.loanTerm)}</p>
                            
                            <p className="col-span-2 border-t mt-2 pt-2"></p>
                            
                            <p className="text-gray-800 font-semibold">Total Interest Paid:</p>
                            <p className="font-bold">{formatCurrency(calculateFinancingCost())}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-blue-100 mb-6">
                          <h5 className="font-medium text-blue-800 mb-3">Purchase & Financing Cost Breakdown</h5>
                          <div className="h-48 relative mb-4">
                            {/* Pie chart visualization */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-36 h-36 rounded-full border-8 border-blue-500 relative overflow-hidden">
                                <div 
                                  className="absolute bg-red-500 w-full h-full origin-bottom-left"
                                  style={{
                                    transform: `rotate(${(calculateInitialCost() / (calculateInitialCost() + calculateFinancingCost())) * 360}deg)`
                                  }}
                                ></div>
                                <div className="absolute inset-0 rounded-full bg-white" style={{ margin: '20%' }}></div>
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                                  {formatCurrency(calculateInitialCost() + calculateFinancingCost())}
                                </div>
                              </div>
                            </div>
                            
                            {/* Labels */}
                            <div className="absolute left-0 top-1/4 pr-4">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                                <div>
                                  <p className="text-xs font-medium">Initial Purchase</p>
                                  <p className="text-sm font-bold">{formatCurrency(calculateInitialCost())}</p>
                                  <p className="text-xs text-gray-500">
                                    {Math.round((calculateInitialCost() / (calculateInitialCost() + calculateFinancingCost())) * 100)}%
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="absolute right-0 top-1/4 pl-4">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                                <div>
                                  <p className="text-xs font-medium">Financing Cost</p>
                                  <p className="text-sm font-bold">{formatCurrency(calculateFinancingCost())}</p>
                                  <p className="text-xs text-gray-500">
                                    {Math.round((calculateFinancingCost() / (calculateInitialCost() + calculateFinancingCost())) * 100)}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Calculate Initial Purchase Cost + Financing
                              </label>
                              <p className="text-xs text-gray-600 mb-1">
                                Initial financed amount + Total interest paid
                              </p>
                            </div>
                            <div className="flex items-center">
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">$</span>
                                <input
                                  type="number"
                                  className="shadow appearance-none border rounded py-2 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Enter cost"
                                  value={userCalculations.initialCost === null ? '' : userCalculations.initialCost}
                                  onChange={(e) => setUserCalculations({
                                    ...userCalculations,
                                    initialCost: e.target.value ? parseFloat(e.target.value) : null
                                  })}
                                />
                              </div>
                              <button
                                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                                onClick={() => handleCalculationCheck('initialCost')}
                              >
                                Check
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                          <div className="flex-1 pr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Calculate Interest Costs
                            </label>
                            <p className="text-xs text-gray-600 mb-1">
                              Total payments - Principal amount
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Enter cost"
                              value={userCalculations.financingCost === null ? '' : userCalculations.financingCost}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                financingCost: e.target.value ? parseFloat(e.target.value) : null
                              })}
                            />
                            <button
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                              onClick={() => handleCalculationCheck('financingCost')}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        {calculationFeedback.initialCost !== null && (
                          <div className={`mt-2 text-sm ${calculationFeedback.initialCost ? 'text-green-600' : 'text-red-600'}`}>
                            {calculationFeedback.initialCost 
                              ? 'Correct! You\'ve calculated the initial purchase costs correctly.' 
                              : 'That\'s not quite right. Remember to add the vehicle price, fees, and taxes, then subtract the down payment and trade-in value.'}
                          </div>
                        )}
                        
                        {calculationFeedback.financingCost !== null && (
                          <div className={`mt-2 text-sm ${calculationFeedback.financingCost ? 'text-green-600' : 'text-red-600'}`}>
                            {calculationFeedback.financingCost 
                              ? 'Correct! You\'ve calculated the financing costs correctly.' 
                              : 'That\'s not quite right. Remember that financing cost is the total payments minus the principal amount.'}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeCategory === 'ongoing' && (
                      <div>
                        <h3 className="font-semibold mb-3">Ongoing Ownership Costs</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Ongoing costs include insurance, maintenance, and fuel/electricity expenses over the entire ownership period.
                        </p>
                        
                        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                          <h4 className="font-semibold mb-2">Insurance Costs</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Calculate the total insurance cost over the ownership period.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-600">Monthly Insurance:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.costs.insuranceMonthly)}</p>
                            
                            <p className="text-gray-600">Years of Ownership:</p>
                            <p className="font-medium">{vehicleOwnership.costs.yearsOwned}</p>
                            
                            <p className="col-span-2 border-t mt-2 pt-2"></p>
                            
                            <p className="text-gray-800 font-semibold">Total Insurance Cost:</p>
                            <p className="font-bold">{formatCurrency(calculateInsuranceCost())}</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                          <h4 className="font-semibold mb-2">Maintenance Costs</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Calculate the total maintenance cost over the ownership period.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-600">Yearly Maintenance:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.costs.maintenanceYearly)}</p>
                            
                            <p className="text-gray-600">Years of Ownership:</p>
                            <p className="font-medium">{vehicleOwnership.costs.yearsOwned}</p>
                            
                            <p className="col-span-2 border-t mt-2 pt-2"></p>
                            
                            <p className="text-gray-800 font-semibold">Total Maintenance Cost:</p>
                            <p className="font-bold">{formatCurrency(calculateMaintenanceCost())}</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                          <h4 className="font-semibold mb-2">Fuel/Electricity Costs</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Calculate the total fuel or electricity cost over the ownership period.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-600">Monthly Electricity:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.costs.fuelMonthly)}</p>
                            
                            <p className="text-gray-600">Years of Ownership:</p>
                            <p className="font-medium">{vehicleOwnership.costs.yearsOwned}</p>
                            
                            <p className="col-span-2 border-t mt-2 pt-2"></p>
                            
                            <p className="text-gray-800 font-semibold">Total Electricity Cost:</p>
                            <p className="font-bold">{formatCurrency(calculateFuelCost())}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                          <div className="flex-1 pr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Calculate Insurance Costs
                            </label>
                            <p className="text-xs text-gray-600 mb-1">
                              Monthly insurance × 12 months × years owned
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Enter cost"
                              value={userCalculations.insuranceCost === null ? '' : userCalculations.insuranceCost}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                insuranceCost: e.target.value ? parseFloat(e.target.value) : null
                              })}
                            />
                            <button
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                              onClick={() => handleCalculationCheck('insuranceCost')}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                          <div className="flex-1 pr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Calculate Maintenance Costs
                            </label>
                            <p className="text-xs text-gray-600 mb-1">
                              Yearly maintenance × years owned
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Enter cost"
                              value={userCalculations.maintenanceCost === null ? '' : userCalculations.maintenanceCost}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                maintenanceCost: e.target.value ? parseFloat(e.target.value) : null
                              })}
                            />
                            <button
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                              onClick={() => handleCalculationCheck('maintenanceCost')}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                          <div className="flex-1 pr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Calculate Fuel/Electricity Costs
                            </label>
                            <p className="text-xs text-gray-600 mb-1">
                              Monthly fuel cost × 12 months × years owned
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Enter cost"
                              value={userCalculations.fuelCost === null ? '' : userCalculations.fuelCost}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                fuelCost: e.target.value ? parseFloat(e.target.value) : null
                              })}
                            />
                            <button
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                              onClick={() => handleCalculationCheck('fuelCost')}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        {calculationFeedback.insuranceCost !== null && (
                          <div className={`mt-2 text-sm ${calculationFeedback.insuranceCost ? 'text-green-600' : 'text-red-600'}`}>
                            {calculationFeedback.insuranceCost 
                              ? 'Correct! You\'ve calculated the insurance costs correctly.' 
                              : 'That\'s not quite right. Multiply the monthly insurance cost by 12 months and then by the years of ownership.'}
                          </div>
                        )}
                        
                        {calculationFeedback.maintenanceCost !== null && (
                          <div className={`mt-2 text-sm ${calculationFeedback.maintenanceCost ? 'text-green-600' : 'text-red-600'}`}>
                            {calculationFeedback.maintenanceCost 
                              ? 'Correct! You\'ve calculated the maintenance costs correctly.' 
                              : 'That\'s not quite right. Multiply the yearly maintenance cost by the years of ownership.'}
                          </div>
                        )}
                        
                        {calculationFeedback.fuelCost !== null && (
                          <div className={`mt-2 text-sm ${calculationFeedback.fuelCost ? 'text-green-600' : 'text-red-600'}`}>
                            {calculationFeedback.fuelCost 
                              ? 'Correct! You\'ve calculated the fuel/electricity costs correctly.' 
                              : 'That\'s not quite right. Multiply the monthly fuel cost by 12 months and then by the years of ownership.'}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeCategory === 'depreciation' && (
                      <div>
                        <h3 className="font-semibold mb-3">Depreciation Costs</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Depreciation is the loss in value of the vehicle over time, which is a significant but often overlooked cost of ownership.
                        </p>
                        
                        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                          <h4 className="font-semibold mb-2">Depreciation Calculation</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Calculate the total depreciation over the ownership period.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-600">Initial Vehicle Value:</p>
                            <p className="font-medium">{formatCurrency(vehicleOwnership.price)}</p>
                            
                            <p className="text-gray-600">Annual Depreciation Rate:</p>
                            <p className="font-medium">{vehicleOwnership.costs.depreciationRate}%</p>
                            
                            <p className="text-gray-600">Years of Ownership:</p>
                            <p className="font-medium">{vehicleOwnership.costs.yearsOwned}</p>
                            
                            <p className="text-gray-600">Estimated Final Value:</p>
                            <p className="font-medium">
                              {formatCurrency(vehicleOwnership.price * Math.pow(1 - vehicleOwnership.costs.depreciationRate/100, vehicleOwnership.costs.yearsOwned))}
                            </p>
                            
                            <p className="col-span-2 border-t mt-2 pt-2"></p>
                            
                            <p className="text-gray-800 font-semibold">Total Depreciation:</p>
                            <p className="font-bold">{formatCurrency(calculateDepreciationCost())}</p>
                          </div>
                        </div>
                        
                        <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden mb-4">
                          <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: '100%' }}>
                            <div className="h-full flex items-center justify-center text-white font-medium">
                              Initial Value: {formatCurrency(vehicleOwnership.price)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden mb-4">
                          <div className="absolute top-0 left-0 h-full bg-blue-300" style={{ 
                            width: `${(vehicleOwnership.price - calculateDepreciationCost()) / vehicleOwnership.price * 100}%` 
                          }}>
                            <div className="h-full flex items-center justify-center text-white font-medium">
                              Final Value: {formatCurrency(vehicleOwnership.price - calculateDepreciationCost())}
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 h-full bg-red-400" style={{ 
                            width: `${calculateDepreciationCost() / vehicleOwnership.price * 100}%` 
                          }}>
                            <div className="h-full flex items-center justify-center text-white font-medium">
                              Depreciation: {formatCurrency(calculateDepreciationCost())}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-6">
                          <div className="flex-1 pr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Calculate Depreciation Cost
                            </label>
                            <p className="text-xs text-gray-600 mb-1">
                              Initial value - Final value after depreciation
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Enter cost"
                              value={userCalculations.depreciationCost === null ? '' : userCalculations.depreciationCost}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                depreciationCost: e.target.value ? parseFloat(e.target.value) : null
                              })}
                            />
                            <button
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                              onClick={() => handleCalculationCheck('depreciationCost')}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        {calculationFeedback.depreciationCost !== null && (
                          <div className={`mt-2 text-sm ${calculationFeedback.depreciationCost ? 'text-green-600' : 'text-red-600'}`}>
                            {calculationFeedback.depreciationCost 
                              ? 'Correct! You\'ve calculated the depreciation cost correctly.' 
                              : 'That\'s not quite right. Subtract the final value after depreciation from the initial vehicle value.'}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeCategory === 'total' && (
                      <div>
                        <h3 className="font-semibold mb-3">Total Cost of Ownership</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          The total cost of ownership is the sum of all costs associated with buying, financing, operating, maintaining, and eventually selling or trading in the vehicle.
                        </p>
                        
                        <div className="border rounded-lg p-4 bg-gray-50 mb-6">
                          <h4 className="font-semibold mb-3">Cost Breakdown Summary</h4>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                            <p className="text-gray-600">Initial Cost (incl. financing):</p>
                            <p className="font-medium">{formatCurrency(calculateInitialCost() + calculateFinancingCost())}</p>
                            
                            <p className="text-gray-600">Insurance Costs:</p>
                            <p className="font-medium">{formatCurrency(calculateInsuranceCost())}</p>
                            
                            <p className="text-gray-600">Maintenance Costs:</p>
                            <p className="font-medium">{formatCurrency(calculateMaintenanceCost())}</p>
                            
                            <p className="text-gray-600">Fuel/Electricity Costs:</p>
                            <p className="font-medium">{formatCurrency(calculateFuelCost())}</p>
                            
                            <p className="text-gray-600">Depreciation Costs:</p>
                            <p className="font-medium">{formatCurrency(calculateDepreciationCost())}</p>
                            
                            <p className="col-span-2 border-t mt-2 pt-2"></p>
                            
                            <p className="text-gray-800 font-semibold">Total Cost of Ownership:</p>
                            <p className="font-bold">{formatCurrency(calculateTotalCost())}</p>
                            
                            <p className="text-gray-600">Monthly Average:</p>
                            <p className="font-medium">
                              {formatCurrency(calculateTotalCost() / (vehicleOwnership.costs.yearsOwned * 12))}
                            </p>
                          </div>
                          
                          <div className="relative h-30 bg-gray-100 rounded-lg overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-blue-500" 
                                 style={{ width: `${costProportions.initialProportion}%` }}>
                              <div className="h-full flex items-center justify-center text-white text-xs px-1">
                                Initial
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 h-full bg-green-500" 
                                 style={{ 
                                   width: `${costProportions.financingProportion}%`,
                                   marginLeft: `${costProportions.initialProportion}%`
                                 }}>
                              <div className="h-full flex items-center justify-center text-white text-xs px-1">
                                Financing
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 h-full bg-yellow-500" 
                                 style={{ 
                                   width: `${costProportions.insuranceProportion}%`,
                                   marginLeft: `${costProportions.initialProportion + costProportions.financingProportion}%`
                                 }}>
                              <div className="h-full flex items-center justify-center text-white text-xs px-1">
                                Insurance
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 h-full bg-orange-500" 
                                 style={{ 
                                   width: `${costProportions.maintenanceProportion}%`,
                                   marginLeft: `${costProportions.initialProportion + costProportions.financingProportion + costProportions.insuranceProportion}%`
                                 }}>
                              <div className="h-full flex items-center justify-center text-white text-xs px-1">
                                Maint.
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 h-full bg-purple-500" 
                                 style={{ 
                                   width: `${costProportions.fuelProportion}%`,
                                   marginLeft: `${costProportions.initialProportion + costProportions.financingProportion + costProportions.insuranceProportion + costProportions.maintenanceProportion}%`
                                 }}>
                              <div className="h-full flex items-center justify-center text-white text-xs px-1">
                                Fuel
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 h-full bg-red-500" 
                                 style={{ 
                                   width: `${costProportions.depreciationProportion}%`,
                                   marginLeft: `${costProportions.initialProportion + costProportions.financingProportion + costProportions.insuranceProportion + costProportions.maintenanceProportion + costProportions.fuelProportion}%`
                                 }}>
                              <div className="h-full flex items-center justify-center text-white text-xs px-1">
                                Deprec.
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-6">
                          <div className="flex-1 pr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Calculate Total Cost of Ownership
                            </label>
                            <p className="text-xs text-gray-600 mb-1">
                              Add all costs: Initial + Financing + Insurance + Maintenance + Fuel + Depreciation
                            </p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Enter total cost"
                              value={userCalculations.totalCost === null ? '' : userCalculations.totalCost}
                              onChange={(e) => setUserCalculations({
                                ...userCalculations,
                                totalCost: e.target.value ? parseFloat(e.target.value) : null
                              })}
                            />
                            <button
                              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                              onClick={() => handleCalculationCheck('totalCost')}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        {calculationFeedback.totalCost !== null && (
                          <div className={`mt-2 text-sm ${calculationFeedback.totalCost ? 'text-green-600' : 'text-red-600'}`}>
                            {calculationFeedback.totalCost 
                              ? 'Correct! You\'ve calculated the total cost of ownership correctly.' 
                              : 'That\'s not quite right. Add up all the individual costs to get the total cost of ownership.'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Helpful Reference</h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Total Cost of Ownership Components:</strong>
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>
                  <strong>Initial Purchase Costs:</strong> Vehicle price + fees + taxes - down payment - trade-in
                </li>
                <li>
                  <strong>Financing Costs:</strong> Total loan payments - principal amount
                </li>
                <li>
                  <strong>Insurance Costs:</strong> Monthly insurance cost × 12 months × years owned
                </li>
                <li>
                  <strong>Maintenance Costs:</strong> Yearly maintenance cost × years owned
                </li>
                <li>
                  <strong>Fuel/Energy Costs:</strong> Monthly fuel cost × 12 months × years owned
                </li>
                <li>
                  <strong>Depreciation:</strong> Initial vehicle value - final value after depreciation
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
                topic="Total Cost of Ownership"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}