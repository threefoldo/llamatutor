'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SelectedCar {
  name: string;
  msrp: number;
  // Add other properties as needed
}

interface UserProfile {
  creditScore: number;
  savings: number;
  monthlyIncome: number;
  riskAversion: string;
  // Add other properties as needed
}

type FinancingOption = 'cash' | 'loan' | 'lease';

const FinancingOptionsPage = () => {
  const router = useRouter();

  // Placeholder data (replace with actual data fetching or props)
  const selectedCar: SelectedCar = {
    name: 'Used Honda Civic',
    msrp: 15000,
  };

  const userProfile: UserProfile = {
    creditScore: 680,
    savings: 5000,
    monthlyIncome: 2500,
    riskAversion: 'Moderate',
  };

  const [activeTab, setActiveTab] = useState<FinancingOption>('cash');
  const [salesTax, setSalesTax] = useState<number | null>(null);
  const [loanDownPayment, setLoanDownPayment] = useState<number | null>(null);
  const [loanTerm, setLoanTerm] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [leaseDownPayment, setLeaseDownPayment] = useState<number | null>(null);
  const [leaseTerm, setLeaseTerm] = useState<number | null>(null);
  const [residualValuePercentage, setResidualValuePercentage] = useState<number | null>(null);
  const [principalPaid, setPrincipalPaid] = useState<number | null>(null);
  const [interestPaid, setInterestPaid] = useState<number | null>(null);
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null);
  const [monthlyLeaseFee, setMonthlyLeaseFee] = useState<number | null>(null);

  // Placeholder function to calculate the Sales tax.
  const calculateSalesTax = (carPrice: number, taxRate: number): string => {
    return (carPrice * taxRate).toFixed(0);
  };

  //Placeholder function to calculate the interest based on the credit Score
  const calculateInterestRate = (creditScore: number): string => {
    let interest = 0.07
    if (creditScore < 600) {
      interest = 0.15
    } else if (creditScore < 700) {
      interest = 0.10
    }

    return interest.toFixed(2);
  };

  // Placeholder function to calculate monthly payment of the loan based on the interest rate
  const calculateMonthlyPayment = (principal: number, interestRate: number, loanTerm: number): string => {
    const monthlyInterestRate = interestRate / 12;
    const numberOfPayments = loanTerm;
    const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    return monthlyPayment.toFixed(2);
  }

  // Placeholder function to calculate the residual value for a lease
  const calculateResidualValue = (msrp: number, residualValuePercentage: number): string => {
    return (msrp * residualValuePercentage).toFixed(0);
  };

  // Placeholder function to calculate monthly fee for a lease
  const calculateLeaseFee = (msrp: number, residualValuePercentage: number): string => {
    return ((msrp * residualValuePercentage)/12).toFixed(2);
  }

  const handleProceed = () => {
    // TODO: Prepare data and navigate to the TCO Analysis Page
    console.log("Navigating to TCO Analysis page");
    router.push('/tco-analysis');
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Financing Options for {selectedCar.name}</h1>

      {/* Financing Options Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'cash' ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500'}`}
          onClick={() => setActiveTab('cash')}
        >
          Cash
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'loan' ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500'}`}
          onClick={() => setActiveTab('loan')}
        >
          Loan
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'lease' ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500'}`}
          onClick={() => setActiveTab('lease')}
        >
          Lease
        </button>
      </div>

      {/* Conditional Rendering for each tab */}
      {activeTab === 'cash' && (
        <section className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Cash Purchase</h2>
          <p>Car Price: ${selectedCar.msrp}</p>
          <div className="mb-4">
            <label htmlFor="salesTax" className="block text-gray-700 text-sm font-bold mb-2">
              Sales Tax (Calculate tax as 8% of the car price):
              <span className="relative inline-block">
                <input
                  type="number"
                  id="salesTax"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  placeholder=""
                  value={salesTax !== null ? salesTax : ''}
                  onChange={(e) => setSalesTax(Number(e.target.value))}
                />
                <div className="absolute -top-2 -right-2">
                    <div className="relative inline-block">
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 cursor-pointer">
                        <span title="Calculate tax as 8% of the car price.">{ "?" }</span>
                      </div>
                    </div>
                 </div>
              </span>
            </label>
            {salesTax !== null && (
              <p>Calculated Sales Tax: ${calculateSalesTax(selectedCar.msrp, 0.08)}</p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'loan' && (
        <section className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Loan Option</h2>
          <div className="mb-4">
            <label htmlFor="loanDownPayment" className="block text-gray-700 text-sm font-bold mb-2">
              Down Payment:
            </label>
            <input
              type="number"
              id="loanDownPayment"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter down payment"
              value={loanDownPayment !== null ? loanDownPayment : ''}
              onChange={(e) => setLoanDownPayment(Number(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="loanTerm" className="block text-gray-700 text-sm font-bold mb-2">
              Loan Term (months):
            </label>
            <select
              id="loanTerm"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={loanTerm !== null ? loanTerm : ''}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
            >
              <option value="">Select Term</option>
              <option value="36">36</option>
              <option value="48">48</option>
              <option value="60">60</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="interestRate" className="block text-gray-700 text-sm font-bold mb-2">
              Interest Rate (Calculate based on credit score):
              <span className="relative inline-block">
                <input
                  type="number"
                  id="interestRate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  placeholder=""
                  value={interestRate !== null ? interestRate : ''}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <div className="absolute -top-2 -right-2">
                    <div className="relative inline-block">
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 cursor-pointer">
                        <span title="Credit score modifier to calculate the actual rate from the base range of 7%–11%.">{ "?" }</span>
                      </div>
                    </div>
                 </div>
              </span>
            </label>
            {interestRate !== null && (
              <p>Calculated Interest Rate: {calculateInterestRate(userProfile.creditScore)}%</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Amortization Table (Month 1)</h3>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="bg-gray-100 text-left py-2 px-4 font-semibold text-gray-700">Payment</th>
                  <th className="bg-gray-100 text-left py-2 px-4 font-semibold text-gray-700">Principal Paid</th>
                  <th className="bg-gray-100 text-left py-2 px-4 font-semibold text-gray-700">Interest Paid</th>
                  <th className="bg-gray-100 text-left py-2 px-4 font-semibold text-gray-700">Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">1</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder=""
                      value={principalPaid !== null ? principalPaid : ''}
                      onChange={(e) => setPrincipalPaid(Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder=""
                      value={interestPaid !== null ? interestPaid : ''}
                      onChange={(e) => setInterestPaid(Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder=""
                      value={remainingBalance !== null ? remainingBalance : ''}
                      onChange={(e) => setRemainingBalance(Number(e.target.value))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {loanDownPayment !== null && loanTerm !== null && interestRate !== null && (
            <p>Estimated Monthly Payment: ${calculateMonthlyPayment(selectedCar.msrp - loanDownPayment, Number(calculateInterestRate(userProfile.creditScore)), Number(loanTerm))}</p>
          )}
        </section>
      )}

      {activeTab === 'lease' && (
        <section className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Lease Option</h2>
          <div className="mb-4">
            <label htmlFor="leaseDownPayment" className="block text-gray-700 text-sm font-bold mb-2">
              Down Payment:
            </label>
            <input
              type="number"
              id="leaseDownPayment"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter down payment"
              value={leaseDownPayment !== null ? leaseDownPayment : ''}
              onChange={(e) => setLeaseDownPayment(Number(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="leaseTerm" className="block text-gray-700 text-sm font-bold mb-2">
              Lease Term (months):
            </label>
            <input
              type="number"
              id="leaseTerm"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter lease term"
              value={leaseTerm !== null ? leaseTerm : ''}
              onChange={(e) => setLeaseTerm(Number(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="residualValuePercentage" className="block text-gray-700 text-sm font-bold mb-2">
              Residual Value (% of MSRP):
               <span className="relative inline-block">
                <input
                  type="number"
                  id="residualValuePercentage"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  placeholder=""
                  value={residualValuePercentage !== null ? residualValuePercentage : ''}
                  onChange={(e) => setResidualValuePercentage(Number(e.target.value))}
                />
                <div className="absolute -top-2 -right-2">
                    <div className="relative inline-block">
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 cursor-pointer">
                        <span title="Calculate the residual value for the lease">{ "?" }</span>
                      </div>
                    </div>
                 </div>
              </span>
            </label>
            {residualValuePercentage !== null && (
                <p>Calculated Residual Value: ${calculateResidualValue(selectedCar.msrp, residualValuePercentage/100)}</p>
              )}
          </div>

          <div className="mb-4">
            <label htmlFor="monthlyLeaseFee" className="block text-gray-700 text-sm font-bold mb-2">
              Monthly Lease Fee (Approximate):
               <span className="relative inline-block">
               <input
                  type="number"
                  id="monthlyLeaseFee"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  placeholder=""
                  value={monthlyLeaseFee !== null ? monthlyLeaseFee : ''}
                  onChange={(e) => setMonthlyLeaseFee(Number(e.target.value))}
                />
                <div className="absolute -top-2 -right-2">
                    <div className="relative inline-block">
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 cursor-pointer">
                        <span title="Calculate the monthly fee for the lease">{ "?" }</span>
                      </div>
                    </div>
                 </div>
              </span>
            </label>
             {residualValuePercentage !== null && (
                <p>Calculated Lease Fee: ${calculateLeaseFee(selectedCar.msrp, residualValuePercentage/100)}</p>
              )}
          </div>
        </section>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleProceed}
      >
        Proceed to TCO Analysis
      </button>
    </div>
  );
};

export default FinancingOptionsPage;