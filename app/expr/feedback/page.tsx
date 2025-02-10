'use client';
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';

interface UserDecisionData {
  carChoice: string;
  financingOption: string;
  totalCostOfOwnership: number;
  totalInterestPaid: number;
  affordability: string;
}

interface CalculationFeedback {
  msrpDiscount: string;
  interestRate: string;
  amortization: string;
  tco: string;
  repairEvent: string;
}

const FeedbackPage: NextPage = () => {
  // Placeholder for user decision data passed from the decision page
  const [userDecision, setUserDecision] = useState<UserDecisionData | null>(null);

  // Placeholder for the correct calculation data
  const [calculationFeedback, setCalculationFeedback] = useState<CalculationFeedback>({
    msrpDiscount: 'MSRP: $15,000 - (5% of $15,000) = $14,250',
    interestRate: 'Base Rate: 7% + Credit Score Modifier (Example) = Adjusted Interest Rate',
    amortization: 'Monthly Payment = [P x (r x (1+r)^n)] / [(1+r)^n – 1]  (where P = Principal, r = monthly interest rate, n = number of months)',
    tco: 'Depreciation = (Original Price - Resale Value) / Number of Years',
    repairEvent: 'Repair Cost = Base Repair Fee × (1 + (Risk Multiplier × (5 - Reliability Rating)))',
  });

  useEffect(() => {
    // Simulate receiving user decision data from the Decision Page
    // Replace with actual data retrieval or prop passing in a real application
    const simulatedUserDecision: UserDecisionData = {
      carChoice: 'Used Honda Civic',
      financingOption: '60-month Loan',
      totalCostOfOwnership: 18000,
      totalInterestPaid: 1500,
      affordability: 'Affordable',
    };

    setUserDecision(simulatedUserDecision);

    //Simulate getting calculation feedback
    const simulatedCalculationFeedback: CalculationFeedback = {
      msrpDiscount: 'MSRP: $15,000 - (5% of $15,000) = $14,250',
      interestRate: 'Base Rate: 7% + Credit Score Modifier (Example) = Adjusted Interest Rate',
      amortization: 'Monthly Payment = [P x (r x (1+r)^n)] / [(1+r)^n – 1]  (where P = Principal, r = monthly interest rate, n = number of months)',
      tco: 'Depreciation = (Original Price - Resale Value) / Number of Years',
      repairEvent: 'Repair Cost = Base Repair Fee × (1 + (Risk Multiplier × (5 - Reliability Rating)))',
    }

    setCalculationFeedback(simulatedCalculationFeedback)
  }, []);

  return (
    <div className='bg-gray-100 min-h-screen py-6'>
      <header className='bg-white shadow-md py-4'>
        <div className='container mx-auto px-4'>
          <h1 className='text-2xl font-bold text-gray-800'>Feedback & Reflection</h1>
        </div>
      </header>

      <main className='container mx-auto px-4 mt-6'>
        {/* Introduction Section */}
        <section className='mb-8'>
          <h2 className='text-xl font-semibold mb-2'>Overview</h2>
          <p className='text-gray-700'>
            Review the detailed breakdown of each calculation to understand the correct methods and identify any areas where your calculations differed.
          </p>

          {userDecision && (
            <>
              <h3 className="text-lg font-semibold mt-4">Your Decision Summary:</h3>
              <p>Car Choice: {userDecision.carChoice}</p>
              <p>Financing Option: {userDecision.financingOption}</p>
              <p>Total Cost of Ownership: ${userDecision.totalCostOfOwnership}</p>
              <p>Total Interest Paid: ${userDecision.totalInterestPaid}</p>
              <p>Affordability: {userDecision.affordability}</p>
            </>
          )}
        </section>

        {/* Calculation Breakdown Sections */}
        <section className='bg-white shadow-md rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold mb-2'>MSRP Discount Calculation</h3>
          <p className='text-gray-700 mb-2'>Correct Calculation:</p>
          <div className='bg-gray-50 p-3 rounded'>
            <p className='font-mono text-sm'>{calculationFeedback.msrpDiscount}</p>
          </div>
          <p className='text-gray-600 mt-2'>
            <span className='font-semibold'>Annotation:</span> Remember to convert the percentage to a decimal before multiplying.
          </p>
          {/* Optional Comparison Table Placeholder - Add if needed */}
        </section>

        <section className='bg-white shadow-md rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Interest Rate Calculation</h3>
          <p className='text-gray-700 mb-2'>Correct Calculation:</p>
          <div className='bg-gray-50 p-3 rounded'>
            <p className='font-mono text-sm'>{calculationFeedback.interestRate}</p>
          </div>
          <p className='text-gray-600 mt-2'>
            <span className='font-semibold'>Annotation:</span> The credit score modifier is based on the provided credit score range in the scenario.
          </p>
        </section>

        <section className='bg-white shadow-md rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Amortization Calculation</h3>
          <p className='text-gray-700 mb-2'>Correct Calculation:</p>
          <div className='bg-gray-50 p-3 rounded'>
            <p className='font-mono text-sm'>{calculationFeedback.amortization}</p>
            <p className='font-mono text-sm'>Principal Paid (Month 1) =  Monthly Payment - Interest Paid</p>
            <p className='font-mono text-sm'>Interest Paid (Month 1) = Loan Balance * Monthly Interest Rate</p>
          </div>
          <p className='text-gray-600 mt-2'>
            <span className='font-semibold'>Annotation:</span>  Ensure that the interest rate is converted to a monthly rate (annual rate / 12) and expressed as a decimal.
          </p>
        </section>

        <section className='bg-white shadow-md rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Total Cost of Ownership (TCO) Components</h3>
          <p className='text-gray-700 mb-2'>Correct Calculation:</p>
          <div className='bg-gray-50 p-3 rounded'>
            <p className='font-mono text-sm'>{calculationFeedback.tco}</p>
            <p className='font-mono text-sm'>Fuel Cost = (Miles Driven / MPG) x Price per Gallon</p>
            {/* Add other TCO component formulas here */}
          </div>
          <p className='text-gray-600 mt-2'>
            <span className='font-semibold'>Annotation:</span>  TCO should include all costs associated with owning and operating a vehicle, including depreciation, fuel, insurance, maintenance, and loan payments.
          </p>
        </section>

        <section className='bg-white shadow-md rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Repair Event Calculation</h3>
          <p className='text-gray-700 mb-2'>Correct Calculation:</p>
          <div className='bg-gray-50 p-3 rounded'>
            <p className='font-mono text-sm'>{calculationFeedback.repairEvent}</p>
          </div>
          <p className='text-gray-600 mt-2'>
            <span className='font-semibold'>Annotation:</span> Remember to use the risk multiplier associated with the Player's risk aversion profile.
          </p>
        </section>
      </main>

      <footer className='bg-gray-200 py-4 mt-8'>
        <div className='container mx-auto px-4 text-center text-gray-600'>
          <p>&copy; 2024 Wheels & Deals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackPage;