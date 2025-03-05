"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface VehicleScenario {
  name: string;
  carPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  leaseTerm: number;
  monthlyLeasePayment: number;
  leaseDownPayment: number;
  residualValue: number;
  annualDepreciation: number;
  image: string;
  
  // Additional attributes
  insuranceBuy: number;
  insuranceLease: number;
  maintenanceBuy: number;
  maintenanceLease: number;
  dispositionFee: number;
  acquisitionFee: number;
}

const LeaseVsBuyRecommendation: React.FC = () => {
  // Vehicle scenarios
  const scenarios: VehicleScenario[] = [
    {
      name: "Family SUV",
      carPrice: 40000,
      downPayment: 8000,
      interestRate: 4.5,
      loanTerm: 60,
      leaseTerm: 36,
      monthlyLeasePayment: 450,
      leaseDownPayment: 4000,
      residualValue: 22000,
      annualDepreciation: 15,
      image: "/imgs/honda_civic.jpg", // Using existing image as placeholder
      
      insuranceBuy: 1800,
      insuranceLease: 2100,
      maintenanceBuy: 1200,
      maintenanceLease: 600,
      dispositionFee: 350,
      acquisitionFee: 895
    },
    {
      name: "Luxury Sedan",
      carPrice: 55000,
      downPayment: 11000,
      interestRate: 5.25,
      loanTerm: 60,
      leaseTerm: 36,
      monthlyLeasePayment: 650,
      leaseDownPayment: 5500,
      residualValue: 27500,
      annualDepreciation: 20,
      image: "/imgs/bmw_3_series.jpg",
      
      insuranceBuy: 2400,
      insuranceLease: 2600,
      maintenanceBuy: 2000,
      maintenanceLease: 800,
      dispositionFee: 450,
      acquisitionFee: 995
    },
    {
      name: "Electric Vehicle",
      carPrice: 48000,
      downPayment: 9600,
      interestRate: 3.9,
      loanTerm: 60,
      leaseTerm: 36,
      monthlyLeasePayment: 550,
      leaseDownPayment: 4800,
      residualValue: 24000,
      annualDepreciation: 25,
      image: "/imgs/tesla_model3.jpg",
      
      insuranceBuy: 2000,
      insuranceLease: 2200,
      maintenanceBuy: 800,
      maintenanceLease: 400,
      dispositionFee: 395,
      acquisitionFee: 945
    }
  ];

  // State variables
  const [selectedScenario, setSelectedScenario] = useState<VehicleScenario>(scenarios[0]);
  const [ownership, setOwnership] = useState<number>(5); // Years
  const [miles, setMiles] = useState<number>(15000); // Annual miles
  const [carPrice, setCarPrice] = useState<number>(scenarios[0].carPrice);
  const [loanTerm, setLoanTerm] = useState<number>(scenarios[0].loanTerm);
  const [interestRate, setInterestRate] = useState<number>(scenarios[0].interestRate);
  const [downPayment, setDownPayment] = useState<number>(scenarios[0].downPayment);
  const [leaseDownPayment, setLeaseDownPayment] = useState<number>(scenarios[0].leaseDownPayment);
  const [monthlyLeasePayment, setMonthlyLeasePayment] = useState<number>(scenarios[0].monthlyLeasePayment);
  const [leaseTerm, setLeaseTerm] = useState<number>(scenarios[0].leaseTerm);
  const [annualDepreciation, setAnnualDepreciation] = useState<number>(scenarios[0].annualDepreciation);
  
  // User assessment state
  const [userRecommendation, setUserRecommendation] = useState<'lease' | 'buy' | null>(null);
  const [userRationale, setUserRationale] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Calculated results state
  const [buyDetails, setBuyDetails] = useState<{
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
    maintenanceCosts: number;
    insuranceCosts: number;
    residualValue: number;
    netCost: number;
    monthlyCost: number;
  }>({
    monthlyPayment: 0,
    totalPayments: 0,
    totalInterest: 0,
    maintenanceCosts: 0,
    insuranceCosts: 0,
    residualValue: 0,
    netCost: 0,
    monthlyCost: 0,
  });
  
  const [leaseDetails, setLeaseDetails] = useState<{
    totalPayments: number;
    acquisitionFee: number;
    dispositionFee: number;
    maintenanceCosts: number;
    insuranceCosts: number;
    netCost: number;
    monthlyCost: number;
    costAfterOwnership: number; // Cost if continuing to lease for ownership period
  }>({
    totalPayments: 0,
    acquisitionFee: 0,
    dispositionFee: 0,
    maintenanceCosts: 0,
    insuranceCosts: 0,
    netCost: 0,
    monthlyCost: 0,
    costAfterOwnership: 0,
  });
  
  const [advantageousOption, setAdvantageousOption] = useState<'lease' | 'buy' | 'equal'>('equal');
  const [breakEvenPoint, setBreakEvenPoint] = useState<number | null>(null);
  
  // Update form values when scenario changes
  useEffect(() => {
    setCarPrice(selectedScenario.carPrice);
    setLoanTerm(selectedScenario.loanTerm);
    setInterestRate(selectedScenario.interestRate);
    setDownPayment(selectedScenario.downPayment);
    setLeaseDownPayment(selectedScenario.leaseDownPayment);
    setMonthlyLeasePayment(selectedScenario.monthlyLeasePayment);
    setLeaseTerm(selectedScenario.leaseTerm);
    setAnnualDepreciation(selectedScenario.annualDepreciation);
  }, [selectedScenario]);
  
  // Calculate buy and lease details when values change
  useEffect(() => {
    calculateBuyDetails();
    calculateLeaseDetails();
  }, [
    carPrice, loanTerm, interestRate, downPayment, leaseDownPayment,
    monthlyLeasePayment, leaseTerm, ownership, miles, selectedScenario
  ]);
  
  // Determine advantageous option when details change
  useEffect(() => {
    if (buyDetails.netCost < leaseDetails.costAfterOwnership) {
      setAdvantageousOption('buy');
    } else if (buyDetails.netCost > leaseDetails.costAfterOwnership) {
      setAdvantageousOption('lease');
    } else {
      setAdvantageousOption('equal');
    }
    
    calculateBreakEvenPoint();
  }, [buyDetails, leaseDetails]);
  
  const calculateBuyDetails = () => {
    // Calculate loan details
    const loanAmount = carPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const totalPayments = monthlyPayment * loanTerm;
    const totalInterest = totalPayments - loanAmount;
    
    // Calculate ownership costs
    const maintenanceCosts = selectedScenario.maintenanceBuy * ownership;
    const insuranceCosts = selectedScenario.insuranceBuy * ownership;
    
    // Calculate residual value after ownership period
    let residualValue = carPrice;
    for (let year = 1; year <= ownership; year++) {
      residualValue = residualValue * (1 - annualDepreciation / 100);
    }
    
    // Calculate net cost of ownership
    const netCost = downPayment + totalPayments + maintenanceCosts + insuranceCosts - residualValue;
    const monthlyCost = netCost / (ownership * 12);
    
    setBuyDetails({
      monthlyPayment,
      totalPayments,
      totalInterest,
      maintenanceCosts,
      insuranceCosts,
      residualValue,
      netCost,
      monthlyCost,
    });
  };
  
  const calculateLeaseDetails = () => {
    // Calculate lease costs for initial term
    const totalLeasePayments = monthlyLeasePayment * leaseTerm;
    const acquisitionFee = selectedScenario.acquisitionFee;
    const dispositionFee = selectedScenario.dispositionFee;
    
    // Calculate maintenance and insurance for initial lease term
    const initialLeasePeriodYears = leaseTerm / 12;
    const maintenanceCosts = selectedScenario.maintenanceLease * initialLeasePeriodYears;
    const insuranceCosts = selectedScenario.insuranceLease * initialLeasePeriodYears;
    
    // Calculate net cost for initial lease term
    const netCost = leaseDownPayment + totalLeasePayments + acquisitionFee + dispositionFee + maintenanceCosts + insuranceCosts;
    const monthlyCost = netCost / leaseTerm;
    
    // Calculate cost if leasing for full ownership period
    const numberOfLeases = Math.ceil(ownership / (leaseTerm / 12));
    const costAfterOwnership = netCost * numberOfLeases;
    
    setLeaseDetails({
      totalPayments: totalLeasePayments,
      acquisitionFee,
      dispositionFee,
      maintenanceCosts,
      insuranceCosts,
      netCost,
      monthlyCost,
      costAfterOwnership,
    });
  };
  
  const calculateBreakEvenPoint = () => {
    // Simple approach - check years 1-10 and find when buying becomes cheaper than leasing
    for (let year = 1; year <= 10; year++) {
      // Calculate buy cost for this period
      let buyCost = downPayment;
      const loanAmount = carPrice - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
      
      // Add loan payments (capped at loan term)
      const paymentMonths = Math.min(year * 12, loanTerm);
      buyCost += monthlyPayment * paymentMonths;
      
      // Add maintenance and insurance
      buyCost += selectedScenario.maintenanceBuy * year;
      buyCost += selectedScenario.insuranceBuy * year;
      
      // Subtract residual value
      let residualValue = carPrice;
      for (let i = 1; i <= year; i++) {
        residualValue = residualValue * (1 - annualDepreciation / 100);
      }
      buyCost -= residualValue;
      
      // Calculate lease cost for this period
      const leasesNeeded = Math.ceil(year / (leaseTerm / 12));
      let leaseCost = (leaseDownPayment + selectedScenario.acquisitionFee) * leasesNeeded;
      leaseCost += (monthlyLeasePayment * leaseTerm) * leasesNeeded;
      leaseCost += selectedScenario.dispositionFee * leasesNeeded;
      leaseCost += selectedScenario.maintenanceLease * year;
      leaseCost += selectedScenario.insuranceLease * year;
      
      // If buying is cheaper, this is our break-even point
      if (buyCost < leaseCost) {
        setBreakEvenPoint(year);
        return;
      }
    }
    
    // If we get here, buying doesn't become cheaper within 10 years
    setBreakEvenPoint(null);
  };
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  const getAdvantageAmount = (): number => {
    return Math.abs(buyDetails.netCost - leaseDetails.costAfterOwnership);
  };
  
  const handleSubmitRecommendation = () => {
    if (!userRecommendation || !userRationale) {
      alert("Please provide both a recommendation and rationale.");
      return;
    }
    
    // Compare user recommendation with calculated advantage
    const isCorrect = userRecommendation === advantageousOption || advantageousOption === 'equal';
    let feedback = "";
    
    if (isCorrect) {
      feedback = "Good analysis! Your recommendation aligns with the financial calculations.";
      
      // Check rationale quality
      const keywords = [
        'ownership', 'equity', 'depreciation', 'residual', 'interest', 
        'maintenance', 'insurance', 'monthly payment', 'long-term', 'short-term'
      ];
      
      const mentionedFactors = keywords.filter(word => 
        userRationale.toLowerCase().includes(word.toLowerCase())
      );
      
      if (mentionedFactors.length >= 3) {
        feedback += " Your rationale shows good consideration of multiple factors.";
      } else {
        feedback += " To strengthen your analysis, consider additional factors like depreciation, residual value, and long-term ownership costs.";
      }
    } else {
      feedback = `Your recommendation differs from the financially advantageous option based on the calculations. For this scenario, ${advantageousOption === 'buy' ? 'buying' : 'leasing'} would save approximately ${formatCurrency(getAdvantageAmount())} over the ${ownership}-year period. Consider reviewing the cost breakdown.`;
    }
    
    setFeedbackMessage(feedback);
    setShowFeedback(true);
  };
  
  // Generate data for comparison chart
  const getComparisonChartData = () => {
    const buyCategories = {
      vehicle: downPayment + buyDetails.totalPayments - buyDetails.totalInterest,
      interest: buyDetails.totalInterest,
      maintenance: buyDetails.maintenanceCosts,
      insurance: buyDetails.insuranceCosts,
      residualValue: -buyDetails.residualValue // Negative because it reduces cost
    };
    
    const leaseCategories = {
      payments: leaseDownPayment + leaseDetails.costAfterOwnership - leaseDetails.maintenanceCosts - leaseDetails.insuranceCosts,
      maintenance: leaseDetails.maintenanceCosts,
      insurance: leaseDetails.insuranceCosts
    };
    
    return {
      labels: ['Buy', 'Lease'],
      datasets: [
        {
          label: 'Vehicle Cost/Payments',
          data: [buyCategories.vehicle, leaseCategories.payments],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Interest',
          data: [buyCategories.interest, 0],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
        {
          label: 'Maintenance',
          data: [buyCategories.maintenance, leaseCategories.maintenance],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Insurance',
          data: [buyCategories.insurance, leaseCategories.insurance],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
        },
        {
          label: 'Residual Value',
          data: [buyCategories.residualValue, 0],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ],
    };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lease vs. Buy Recommendation</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Select a Vehicle Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 ${selectedScenario.name === scenario.name ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedScenario(scenario)}
            >
              <img
                src={scenario.image}
                alt={scenario.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{scenario.name}</h3>
                <p className="text-gray-700">Price: {formatCurrency(scenario.carPrice)}</p>
                <p className="text-sm text-gray-600">
                  Lease: {formatCurrency(scenario.monthlyLeasePayment)}/mo for {scenario.leaseTerm} months
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Financing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Price</label>
              <input
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (Buy)</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (months)</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Lease Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (Lease)</label>
              <input
                type="number"
                value={leaseDownPayment}
                onChange={(e) => setLeaseDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
              <input
                type="number"
                value={monthlyLeasePayment}
                onChange={(e) => setMonthlyLeasePayment(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lease Term (months)</label>
              <input
                type="number"
                value={leaseTerm}
                onChange={(e) => setLeaseTerm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Depreciation (%)</label>
              <input
                type="number"
                value={annualDepreciation}
                onChange={(e) => setAnnualDepreciation(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Ownership Period</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How long do you plan to keep/use this vehicle? ({ownership} years)
          </label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={ownership} 
            onChange={(e) => setOwnership(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(year => (
              <span key={year} className={year === ownership ? 'font-bold text-blue-600' : ''}>{year}</span>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual mileage estimate ({miles.toLocaleString()} miles/year)
          </label>
          <input 
            type="range" 
            min="5000" 
            max="25000" 
            step="1000"
            value={miles} 
            onChange={(e) => setMiles(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>5k</span>
            <span>10k</span>
            <span>15k</span>
            <span>20k</span>
            <span>25k</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cost Comparison</h2>
        
        <div className="mb-6">
          <div className="h-64">
            <Bar 
              data={getComparisonChartData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed.y !== null) {
                          label += formatCurrency(context.parsed.y);
                        }
                        return label;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Buy Option</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monthly Payment:</span>
                <span className="font-medium">{formatCurrency(buyDetails.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Down Payment:</span>
                <span className="font-medium">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Loan Payments:</span>
                <span className="font-medium">{formatCurrency(buyDetails.totalPayments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Interest Paid:</span>
                <span className="font-medium">{formatCurrency(buyDetails.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Maintenance ({ownership} years):</span>
                <span className="font-medium">{formatCurrency(buyDetails.maintenanceCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Insurance ({ownership} years):</span>
                <span className="font-medium">{formatCurrency(buyDetails.insuranceCosts)}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span className="text-sm">Estimated Resale Value:</span>
                <span className="font-medium">-{formatCurrency(buyDetails.residualValue)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
                <span>Net Cost ({ownership} years):</span>
                <span>{formatCurrency(buyDetails.netCost)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Monthly Average:</span>
                <span>{formatCurrency(buyDetails.monthlyCost)}/month</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Lease Option</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monthly Payment:</span>
                <span className="font-medium">{formatCurrency(monthlyLeasePayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Down Payment:</span>
                <span className="font-medium">{formatCurrency(leaseDownPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Lease Payments:</span>
                <span className="font-medium">{formatCurrency(leaseDetails.totalPayments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Acquisition Fee:</span>
                <span className="font-medium">{formatCurrency(leaseDetails.acquisitionFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Disposition Fee:</span>
                <span className="font-medium">{formatCurrency(leaseDetails.dispositionFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Maintenance (Initial Lease):</span>
                <span className="font-medium">{formatCurrency(leaseDetails.maintenanceCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Insurance (Initial Lease):</span>
                <span className="font-medium">{formatCurrency(leaseDetails.insuranceCosts)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
                <span>Initial Lease Cost:</span>
                <span>{formatCurrency(leaseDetails.netCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-blue-700">
                <span>Total for {ownership} years:</span>
                <span>{formatCurrency(leaseDetails.costAfterOwnership)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Monthly Average:</span>
                <span>{formatCurrency(leaseDetails.monthlyCost)}/month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>
              Over {ownership} years, {advantageousOption === 'buy' ? 'buying' : advantageousOption === 'lease' ? 'leasing' : 'both options cost approximately the same'}.
              {advantageousOption !== 'equal' && ` The ${advantageousOption} option saves approximately ${formatCurrency(getAdvantageAmount())}.`}
            </li>
            {breakEvenPoint && (
              <li>
                Buying becomes more economical than leasing after {breakEvenPoint} years of ownership.
              </li>
            )}
            {breakEvenPoint === null && (
              <li>
                Leasing remains more economical than buying throughout the 10-year analysis period.
              </li>
            )}
            <li>
              Monthly costs: {formatCurrency(buyDetails.monthlyCost)} (buy) vs. {formatCurrency(leaseDetails.monthlyCost)} (lease)
            </li>
            <li>
              {miles > 15000 ? "High annual mileage may incur excess mileage charges with leasing." : "Your mileage is within typical lease allowances."}
            </li>
          </ul>
          
          <div className="hidden">
            <div className="text-center font-semibold mb-2">
              Financial recommendation: {advantageousOption === 'buy' ? 'Buy' : advantageousOption === 'lease' ? 'Lease' : 'Either option is viable'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Recommendation</h2>
        <p className="mb-4 text-gray-700">
          Based on the analysis above and considering your specific situation, what would you recommend? 
          Provide your reasoning based on the financial calculations and other considerations.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${userRecommendation === 'buy' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setUserRecommendation('buy')}
            >
              Buy
            </button>
            <button
              className={`px-4 py-2 rounded-md ${userRecommendation === 'lease' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setUserRecommendation('lease')}
            >
              Lease
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rationale</label>
          <textarea
            value={userRationale}
            onChange={(e) => setUserRationale(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Explain why you recommend buying or leasing based on the financial analysis and other considerations..."
          ></textarea>
        </div>
        
        <button
          onClick={handleSubmitRecommendation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Recommendation
        </button>
        
        {showFeedback && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium mb-1">Feedback</h3>
            <p className="text-sm text-gray-800">{feedbackMessage}</p>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Additional Considerations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Buy Advantages</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Build equity in the vehicle over time</li>
              <li>No mileage restrictions</li>
              <li>Freedom to modify the vehicle</li>
              <li>Lower costs after loan is paid off</li>
              <li>Potential investment if vehicle maintains value</li>
              <li>No worry about wear-and-tear charges</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Lease Advantages</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lower monthly payments typically</li>
              <li>Newer vehicles with latest technology</li>
              <li>Less maintenance during warranty period</li>
              <li>Easier to upgrade every few years</li>
              <li>No long-term commitment</li>
              <li>No concerns about selling the vehicle later</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Personal Factors to Consider</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>How long do you typically keep vehicles?</li>
            <li>How important is having the latest technology and features?</li>
            <li>Do you drive significantly more or less than average?</li>
            <li>How important is customization/modification?</li>
            <li>Do you have stable income for long-term financing?</li>
            <li>Tax considerations (especially for business use)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaseVsBuyRecommendation;