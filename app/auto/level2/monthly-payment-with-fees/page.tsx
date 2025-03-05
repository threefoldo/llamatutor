"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Chat from "@/components/Chat";

interface VehicleAdvertisement {
  id: string;
  vehicle: string;
  advertised: {
    price: number;
    downPayment: number;
    apr: number;
    term: number; // months
    monthlyPayment: number;
  };
  actual: {
    docFee: number;
    destinationFee: number;
    titleFee: number;
    registrationFee: number;
    salesTaxRate: number;
    dealerAddOns: {
      name: string;
      price: number;
      optional: boolean;
    }[];
  };
  image: string;
}

const vehicleAdvertisement: VehicleAdvertisement = {
  id: "advert1",
  vehicle: "BMW 3 Series 2024",
  advertised: {
    price: 43000,
    downPayment: 5000,
    apr: 3.9,
    term: 60, // 5 years
    monthlyPayment: 699,
  },
  actual: {
    docFee: 499,
    destinationFee: 995,
    titleFee: 75,
    registrationFee: 365,
    salesTaxRate: 6.5, // percentage
    dealerAddOns: [
      {
        name: "Protection Package",
        price: 1295,
        optional: true
      },
      {
        name: "Extended Warranty",
        price: 2500,
        optional: true
      },
      {
        name: "Nitrogen Tire Fill",
        price: 195,
        optional: true
      }
    ]
  },
  image: "/imgs/bmw_3_series.jpg",
};

export default function MonthlyPaymentWithFees() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are an auto finance assistant helping a client understand the difference between advertised monthly payments and actual monthly payments when all fees and add-ons are included. Your goal is to guide them through recalculating the actual monthly payment based on the real total cost. Be educational, explain each component, and guide them step by step.
      
      Explain to the client:
      - Why advertised payments often differ from actual payments
      - How fees and add-ons increase the loan amount
      - The impact of sales tax on the total amount financed
      - How to recalculate the monthly payment with all fees included
      - Which dealer add-ons are optional vs. required
      
      Guide them through the calculation process:
      1. Calculate the actual price (MSRP + required fees + selected add-ons)
      2. Add sales tax on the taxable amount
      3. Subtract the down payment to get the loan amount
      4. Calculate the new monthly payment using the loan formula
      
      Be helpful, patient, and ensure they understand the concepts. Always show your work and explain the formulas used. Encourage them to try calculations themselves.`,
    },
    {
      role: "assistant",
      content: "Hello! I'm your auto finance assistant. I'm here to help you understand why the advertised monthly payment for this BMW 3 Series might differ significantly from what you'll actually pay once all fees and add-ons are included. Let's work through recalculating the real monthly payment together!",
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
  const [viewMode, setViewMode] = useState<'advertisement' | 'calculation'>('advertisement');
  
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  
  const [userCalculations, setUserCalculations] = useState({
    totalPrice: null as number | null,
    salesTax: null as number | null,
    loanAmount: null as number | null,
    monthlyPayment: null as number | null,
  });
  
  const [calculationFeedback, setCalculationFeedback] = useState({
    totalPrice: null as boolean | null,
    salesTax: null as boolean | null,
    loanAmount: null as boolean | null,
    monthlyPayment: null as boolean | null,
  });

  // Calculate correct values
  const calculateTotalPrice = () => {
    const basePrice = vehicleAdvertisement.advertised.price;
    const requiredFees = 
      vehicleAdvertisement.actual.docFee + 
      vehicleAdvertisement.actual.destinationFee + 
      vehicleAdvertisement.actual.titleFee + 
      vehicleAdvertisement.actual.registrationFee;
    
    const selectedAddOnsTotal = vehicleAdvertisement.actual.dealerAddOns
      .filter(addon => selectedAddOns.includes(addon.name))
      .reduce((total, addon) => total + addon.price, 0);
    
    return basePrice + requiredFees + selectedAddOnsTotal;
  };

  const calculateSalesTax = () => {
    return calculateTotalPrice() * (vehicleAdvertisement.actual.salesTaxRate / 100);
  };

  const calculateLoanAmount = () => {
    return calculateTotalPrice() + calculateSalesTax() - vehicleAdvertisement.advertised.downPayment;
  };

  const calculateMonthlyPayment = () => {
    const principal = calculateLoanAmount();
    const monthlyRate = vehicleAdvertisement.advertised.apr / 100 / 12;
    const termMonths = vehicleAdvertisement.advertised.term;
    
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    return payment;
  };

  const checkCalculation = (type: keyof typeof userCalculations) => {
    if (userCalculations[type] === null) return null;
    
    let correctValue: number;
    switch (type) {
      case 'totalPrice':
        correctValue = calculateTotalPrice();
        break;
      case 'salesTax':
        correctValue = calculateSalesTax();
        break;
      case 'loanAmount':
        correctValue = calculateLoanAmount();
        break;
      case 'monthlyPayment':
        correctValue = calculateMonthlyPayment();
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
    
    if (type === 'monthlyPayment' && isCorrect) {
      const paymentDifference = calculateMonthlyPayment() - vehicleAdvertisement.advertised.monthlyPayment;
      
      setPromptValue(`I calculated that the actual monthly payment would be ${formatCurrency(userCalculations.monthlyPayment as number)}, which is ${formatCurrency(paymentDifference)} more than the advertised payment of ${formatCurrency(vehicleAdvertisement.advertised.monthlyPayment)}. Why is there such a big difference, and what factors contributed most to this increase?`);
      handleChat();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleAddOn = (addonName: string) => {
    setSelectedAddOns(prev => {
      if (prev.includes(addonName)) {
        return prev.filter(name => name !== addonName);
      } else {
        return [...prev, addonName];
      }
    });
  };

  // Calculate the difference between advertised and actual
  const paymentDifference = calculateMonthlyPayment() - vehicleAdvertisement.advertised.monthlyPayment;
  const percentIncrease = (paymentDifference / vehicleAdvertisement.advertised.monthlyPayment) * 100;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Monthly Payment with Fees</h1>
          <p className="max-w-3xl">
            Learn to calculate the actual monthly payment by incorporating all fees, taxes, and add-ons 
            that may not be included in advertised payment amounts.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${isChatOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Scenario</h2>
            <p className="mb-6 text-gray-700">
              Your client is interested in a new BMW 3 Series advertised with a monthly payment of $699. 
              However, they're concerned that the actual payment will be much higher once all fees, 
              taxes, and dealer add-ons are included. Help them recalculate what their true monthly 
              payment will be based on the full cost of the vehicle.
            </p>

            <div className="flex justify-end mb-4">
              <button
                onClick={() => setViewMode(viewMode === 'advertisement' ? 'calculation' : 'advertisement')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded transition-colors"
              >
                {viewMode === 'advertisement' ? 'Switch to Calculation Mode' : 'View Advertisement'}
              </button>
            </div>

            {viewMode === 'advertisement' ? (
              <div className="border rounded-lg p-6 mb-6 bg-gradient-to-br from-blue-50 to-gray-50">
                <div className="flex justify-between items-start">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-800">Special Offer</h3>
                    <p className="text-lg font-semibold text-gray-700">{vehicleAdvertisement.vehicle}</p>
                  </div>
                  <div className="bg-red-600 text-white py-1 px-3 rounded-full text-sm font-bold">
                    Limited Time Offer
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="w-full md:w-1/2">
                    <div className="relative w-full h-60 mb-4 overflow-hidden rounded-md">
                      <Image
                        src={vehicleAdvertisement.image}
                        alt={vehicleAdvertisement.vehicle}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="text-xl font-bold text-blue-800 mb-4">Lease for only</h4>
                      <div className="text-center mb-4">
                        <span className="text-5xl font-bold text-blue-800">${vehicleAdvertisement.advertised.monthlyPayment}</span>
                        <span className="text-xl text-gray-600">/mo</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm border-t pt-4">
                        <p className="text-gray-600">MSRP:</p>
                        <p className="text-right font-medium">{formatCurrency(vehicleAdvertisement.advertised.price)}</p>
                        
                        <p className="text-gray-600">Down Payment:</p>
                        <p className="text-right font-medium">{formatCurrency(vehicleAdvertisement.advertised.downPayment)}</p>
                        
                        <p className="text-gray-600">Term:</p>
                        <p className="text-right font-medium">{vehicleAdvertisement.advertised.term} months</p>
                        
                        <p className="text-gray-600">APR:</p>
                        <p className="text-right font-medium">{vehicleAdvertisement.advertised.apr}%</p>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500 italic">
                        <p>*Excludes tax, title, license, and dealer fees. Not all buyers will qualify. See dealer for details.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Additional Fees & Add-ons</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Required Fees
                      </h5>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-500 mb-2 italic">Hover over each fee to learn more</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <p className="text-gray-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded cursor-help group relative" title="Fee charged by the dealer for handling paperwork">
                            Documentation Fee:
                            <span className="hidden group-hover:block absolute z-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs mt-1 left-0">
                              Fee charged by the dealer for preparing and filing all necessary paperwork for your vehicle purchase.
                            </span>
                          </p>
                          <p className="text-right">{formatCurrency(vehicleAdvertisement.actual.docFee)}</p>
                          
                          <p className="text-gray-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded cursor-help group relative" title="Fee for transporting the vehicle to the dealership">
                            Destination Fee:
                            <span className="hidden group-hover:block absolute z-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs mt-1 left-0">
                              Manufacturer's charge for shipping the vehicle from the factory to the dealership. This fee is set by the manufacturer, not the dealer.
                            </span>
                          </p>
                          <p className="text-right">{formatCurrency(vehicleAdvertisement.actual.destinationFee)}</p>
                          
                          <p className="text-gray-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded cursor-help group relative" title="Government fee for issuing a title certificate">
                            Title Fee:
                            <span className="hidden group-hover:block absolute z-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs mt-1 left-0">
                              State government fee for issuing a certificate of title for your vehicle. This is required for all vehicle purchases.
                            </span>
                          </p>
                          <p className="text-right">{formatCurrency(vehicleAdvertisement.actual.titleFee)}</p>
                          
                          <p className="text-gray-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded cursor-help group relative" title="Government fee for vehicle registration">
                            Registration Fee:
                            <span className="hidden group-hover:block absolute z-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs mt-1 left-0">
                              State government fee for registering the vehicle in your name and issuing license plates. Varies based on vehicle type and location.
                            </span>
                          </p>
                          <p className="text-right">{formatCurrency(vehicleAdvertisement.actual.registrationFee)}</p>
                          
                          <p className="text-gray-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded cursor-help group relative" title="Percentage tax applied to vehicle purchase">
                            Sales Tax Rate:
                            <span className="hidden group-hover:block absolute z-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs mt-1 left-0">
                              State and local tax percentage applied to the vehicle purchase price. This is collected by the dealer and paid to the government.
                            </span>
                          </p>
                          <p className="text-right">{vehicleAdvertisement.actual.salesTaxRate}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Dealer Add-ons
                      </h5>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-500 mb-2 italic">Hover over add-ons to learn more</p>
                        {vehicleAdvertisement.actual.dealerAddOns.map((addon) => (
                          <div 
                            key={addon.name} 
                            className="flex items-center justify-between py-2 border-b last:border-b-0 hover:bg-blue-50 transition-colors px-2 rounded group relative"
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={addon.name.replace(/\s+/g, '-').toLowerCase()}
                                checked={selectedAddOns.includes(addon.name)}
                                onChange={() => toggleAddOn(addon.name)}
                                className="mr-2"
                              />
                              <label htmlFor={addon.name.replace(/\s+/g, '-').toLowerCase()} className="text-sm cursor-pointer">
                                {addon.name}
                                {!addon.optional && (
                                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Required</span>
                                )}
                              </label>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(addon.price)}</span>
                            
                            <div className="hidden group-hover:block absolute z-10 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs right-0 top-10">
                              <p className="font-medium mb-1">{addon.name}</p>
                              <p className="text-gray-600 mb-2">
                                {addon.name === "Protection Package" && "Includes paint protection, fabric guard, and extended warranty for interior components."}
                                {addon.name === "Premium Sound System" && "Upgraded speakers and amplifier for enhanced audio quality while driving."}
                                {addon.name === "Nitrogen Tire Fill" && "Fills tires with nitrogen instead of regular air, which may help maintain tire pressure longer."}
                                {addon.name === "Window Tinting" && "Professional tinting of windows for UV protection and privacy."}
                              </p>
                              <div className="flex justify-between border-t pt-2">
                                <span>{addon.optional ? "Optional add-on" : "Required by dealer"}</span>
                                <span className="font-medium">{formatCurrency(addon.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Recalculate the True Monthly Payment</h3>
                <p className="mb-6 text-gray-700">
                  Using the information from the advertisement and the additional fees and add-ons, 
                  calculate what the actual monthly payment will be.
                </p>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 1: Calculate the Total Price</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Add the vehicle price, required fees, and any selected add-ons.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">MSRP: {formatCurrency(vehicleAdvertisement.advertised.price)}</p>
                        <p className="text-sm">+ Doc Fee: {formatCurrency(vehicleAdvertisement.actual.docFee)}</p>
                        <p className="text-sm">+ Destination Fee: {formatCurrency(vehicleAdvertisement.actual.destinationFee)}</p>
                        <p className="text-sm">+ Title Fee: {formatCurrency(vehicleAdvertisement.actual.titleFee)}</p>
                        <p className="text-sm">+ Registration Fee: {formatCurrency(vehicleAdvertisement.actual.registrationFee)}</p>
                        
                        {selectedAddOns.length > 0 && (
                          <>
                            <p className="text-sm font-medium mt-2">Selected Add-ons:</p>
                            {selectedAddOns.map(addonName => {
                              const addon = vehicleAdvertisement.actual.dealerAddOns.find(a => a.name === addonName);
                              return addon ? (
                                <p key={addonName} className="text-sm">+ {addonName}: {formatCurrency(addon.price)}</p>
                              ) : null;
                            })}
                          </>
                        )}
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
                          : 'That\'s not quite right. Make sure to add the MSRP, all required fees, and any selected add-ons.'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 2: Calculate the Sales Tax</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Calculate sales tax on the total price from step 1.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">Total Price: {userCalculations.totalPrice !== null && calculationFeedback.totalPrice 
                          ? formatCurrency(userCalculations.totalPrice) 
                          : 'Calculate in Step 1'}</p>
                        <p className="text-sm">× Tax Rate: {vehicleAdvertisement.actual.salesTaxRate}%</p>
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
                            disabled={!calculationFeedback.totalPrice}
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
                          : 'That\'s not quite right. Multiply the total price by the sales tax rate (as a decimal) to get the sales tax amount.'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 3: Calculate the Loan Amount</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Add the total price and sales tax, then subtract the down payment.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">Total Price: {userCalculations.totalPrice !== null && calculationFeedback.totalPrice 
                          ? formatCurrency(userCalculations.totalPrice) 
                          : 'Calculate in Step 1'}</p>
                        <p className="text-sm">+ Sales Tax: {userCalculations.salesTax !== null && calculationFeedback.salesTax 
                          ? formatCurrency(userCalculations.salesTax) 
                          : 'Calculate in Step 2'}</p>
                        <p className="text-sm">- Down Payment: {formatCurrency(vehicleAdvertisement.advertised.downPayment)}</p>
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
                            disabled={!calculationFeedback.totalPrice || !calculationFeedback.salesTax}
                          >
                            Check
                          </button>
                        </div>
                      </div>
                    </div>
                    {calculationFeedback.loanAmount !== null && (
                      <div className={`mt-2 text-sm ${calculationFeedback.loanAmount ? 'text-green-600' : 'text-red-600'}`}>
                        {calculationFeedback.loanAmount 
                          ? 'Correct! You\'ve calculated the loan amount correctly.' 
                          : 'That\'s not quite right. Add the total price and sales tax, then subtract the down payment.'}
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Step 4: Calculate the Monthly Payment</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Calculate the monthly payment using the loan formula: P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">Loan Amount: {userCalculations.loanAmount !== null && calculationFeedback.loanAmount 
                          ? formatCurrency(userCalculations.loanAmount) 
                          : 'Calculate in Step 3'}</p>
                        <p className="text-sm">APR: {vehicleAdvertisement.advertised.apr}%</p>
                        <p className="text-sm">Term: {vehicleAdvertisement.advertised.term} months</p>
                        <p className="text-sm mt-2">Monthly Rate: {(vehicleAdvertisement.advertised.apr / 100 / 12).toFixed(6)}</p>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center w-full">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                            placeholder="Enter monthly payment"
                            value={userCalculations.monthlyPayment === null ? '' : userCalculations.monthlyPayment}
                            onChange={(e) => setUserCalculations({
                              ...userCalculations,
                              monthlyPayment: e.target.value ? parseFloat(e.target.value) : null
                            })}
                          />
                          <button
                            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                            onClick={() => handleCalculationCheck('monthlyPayment')}
                            disabled={!calculationFeedback.loanAmount}
                          >
                            Check
                          </button>
                        </div>
                      </div>
                    </div>
                    {calculationFeedback.monthlyPayment !== null && (
                      <div className={`mt-2 text-sm ${calculationFeedback.monthlyPayment ? 'text-green-600' : 'text-red-600'}`}>
                        {calculationFeedback.monthlyPayment 
                          ? 'Correct! You\'ve calculated the monthly payment correctly.' 
                          : 'That\'s not quite right. Use the loan formula: P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)'}
                      </div>
                    )}
                  </div>
                  
                  {calculationFeedback.monthlyPayment && (
                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                      <h4 className="font-semibold mb-4 text-lg text-center">Advertised vs. Actual Payment Comparison</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 relative">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Advertisement
                          </div>
                          <div className="text-center mb-4">
                            <p className="text-sm text-gray-600 mb-1">Advertised Monthly Payment</p>
                            <p className="text-3xl font-bold text-blue-800">{formatCurrency(vehicleAdvertisement.advertised.monthlyPayment)}</p>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600 flex justify-between">
                              <span>Price:</span>
                              <span className="font-medium">{formatCurrency(vehicleAdvertisement.advertised.price)}</span>
                            </p>
                            <p className="text-gray-600 flex justify-between">
                              <span>Down Payment:</span>
                              <span className="font-medium">{formatCurrency(vehicleAdvertisement.advertised.downPayment)}</span>
                            </p>
                            <p className="text-gray-600 flex justify-between">
                              <span>APR:</span>
                              <span className="font-medium">{vehicleAdvertisement.advertised.apr}%</span>
                            </p>
                            <p className="text-gray-600 flex justify-between">
                              <span>Term:</span>
                              <span className="font-medium">{vehicleAdvertisement.advertised.term} months</span>
                            </p>
                            <div className="border-t pt-2 text-xs italic text-gray-500 mt-2">
                              <p>* Fees and additional costs not included in advertisement</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 p-5 rounded-lg border border-red-100 relative">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Actual Cost
                          </div>
                          <div className="text-center mb-4">
                            <p className="text-sm text-gray-600 mb-1">Actual Monthly Payment</p>
                            <p className="text-3xl font-bold text-red-800">{formatCurrency(calculateMonthlyPayment())}</p>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600 flex justify-between">
                              <span>Base Price:</span>
                              <span className="font-medium">{formatCurrency(vehicleAdvertisement.advertised.price)}</span>
                            </p>
                            <p className="text-gray-600 flex justify-between">
                              <span>+ Fees & Taxes:</span>
                              <span className="font-medium">{formatCurrency(calculateTotalFees())}</span>
                            </p>
                            <p className="text-gray-600 flex justify-between">
                              <span>+ Dealer Add-ons:</span>
                              <span className="font-medium">{formatCurrency(calculateAddOns())}</span>
                            </p>
                            <p className="text-gray-600 flex justify-between font-medium">
                              <span>= Total Price:</span>
                              <span>{formatCurrency(calculateTotalPrice())}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h5 className="text-lg font-bold text-yellow-800 mb-1">Cost Difference Analysis</h5>
                            <p className="font-medium">Monthly Payment Difference: <span className="text-red-600 font-bold">{formatCurrency(paymentDifference)}</span> more per month</p>
                            <p className="text-sm font-medium">({percentIncrease.toFixed(1)}% increase from advertised price)</p>
                            <p className="text-sm mt-2">Over the {vehicleAdvertisement.advertised.term}-month loan term, you'll pay <span className="font-bold text-red-600">{formatCurrency(paymentDifference * vehicleAdvertisement.advertised.term)}</span> more than advertised.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Helpful Reference</h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Why Advertised Payments Can Be Misleading:</strong>
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>
                  <strong>Excluded Fees:</strong> Advertised payments often exclude taxes, title, registration, and dealer fees
                </li>
                <li>
                  <strong>Optional Add-ons:</strong> Dealer add-ons can significantly increase the final price
                </li>
                <li>
                  <strong>Qualified Buyers Only:</strong> Advertised rates may only be available to buyers with excellent credit
                </li>
                <li>
                  <strong>Special Conditions:</strong> Advertised offers may require specific down payment amounts or term lengths
                </li>
                <li>
                  <strong>Monthly Payment Formula:</strong> P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)
                  <ul className="list-disc pl-5">
                    <li>P = Principal (loan amount)</li>
                    <li>r = Monthly interest rate (annual rate / 12 / 100)</li>
                    <li>n = Loan term in months</li>
                  </ul>
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
                topic="Monthly Payment Calculation with Fees"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}