'use client';
import type { NextPage } from 'next';
import { useState } from 'react';

// Define data types
interface Vehicle {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}


const VehicleSelection: NextPage = () => {
  // State variables
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [downPayment, setDownPayment] = useState<number | null>(null);
  const [loanTerm, setLoanTerm] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [leaseTerm, setLeaseTerm] = useState<number | null>(null);

  // Placeholder vehicle data
  const vehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Used Honda Civic',
      imageUrl: '/honda_civic.jpg', // Ensure you have this image in your public directory
      price: 15000,
      description: 'A reliable and fuel-efficient used car.'
    },
    {
      id: 2,
      name: 'New BMW 3 Series',
      imageUrl: '/bmw_3_series.jpg', // Ensure you have this image in your public directory
      price: 45000,
      description: 'A luxurious and sporty new car.'
    }
  ];

  // Event handlers
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleDownPaymentSelect = (amount: number) => {
    setDownPayment(amount);
    console.log(`Down Payment Selected: $${amount}`); // Simulate data "sending"
  };

  const handleLoanTermSelect = (term: number) => {
    setLoanTerm(term);
    console.log(`Loan Term Selected: ${term} months`); // Simulate data "sending"
  };

  const handleInterestRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      setInterestRate(value);
      console.log(`Interest Rate entered ${value}`);
  }

  const handleLeaseTermSelect = (term: number) => {
    setLeaseTerm(term);
    console.log(`Lease Term Selected: ${term} months`); // Simulate data "sending"
  };

  const calculateCashPurchase = () => {
    if (!selectedVehicle) return 0;
    const taxRate = 0.06; // Example tax rate
    const registrationFeeRate = 0.01; // Example registration fee rate
    const tax = selectedVehicle.price * taxRate;
    const registrationFees = selectedVehicle.price * registrationFeeRate;
    return selectedVehicle.price + tax + registrationFees;
  };

  const cashPurchasePrice = calculateCashPurchase();

  const amortizationSchedule: AmortizationRow[] = selectedVehicle && downPayment && loanTerm && interestRate ?
  [
    {
      month: 1,
      payment: 100, //Placeholder Values, actual computation can be complex
      principal: 50,
      interest: 50,
      balance: 10000
    }
  ] : [];

  const residualValuePercentage = 60;

  const proceedToTCO = () => {
    console.log('Proceeding to TCO Calculation with:', {
      selectedVehicle,
      downPayment,
      loanTerm,
      interestRate,
      leaseTerm
    });
    // Placeholder for navigation logic
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Vehicle Selection</h1>
        <p className="text-gray-600">Browse available vehicles and explore financing options.</p>
      </header>

      {/* Main Content Section */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicle Browsing Section */}
        <section className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Available Vehicles</h2>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white shadow-md rounded-lg p-4">
                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-48 object-cover mb-2 rounded-md" />
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <p className="text-gray-600">Price: ${vehicle.price}</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Vehicle Details and Pricing Options Section */}
        <aside className="lg:col-span-2 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Vehicle Details & Pricing</h2>
          {selectedVehicle ? (
            <>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Selected Vehicle: {selectedVehicle.name}</h3>
                <img src={selectedVehicle.imageUrl} alt={selectedVehicle.name} className="w-full h-64 object-cover rounded-md mb-4" />
                <p className="text-gray-700">{selectedVehicle.description}</p>
              </div>

              {/* Cash Purchase Section */}
              <section className="mb-4">
                <h4 className="text-lg font-semibold mb-2">1. Cash Purchase</h4>
                <p>Full Vehicle Price: ${selectedVehicle.price}</p>
                <p>Tax: $ {selectedVehicle.price * 0.06} </p>
                <p>Registration Fees: ${selectedVehicle.price * 0.01}</p>
                <p className="font-bold">Total Out-of-Door Price: ${cashPurchasePrice.toFixed(2)}</p>
              </section>

              {/* Loan Options Section */}
              <section className="mb-4">
                <h4 className="text-lg font-semibold mb-2">2. Loan Options</h4>
                <p>Down Payment Options:</p>
                <div className="flex space-x-2">
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${downPayment === 1000 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleDownPaymentSelect(1000)}
                  >
                    $1,000
                  </button>
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${downPayment === 3000 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleDownPaymentSelect(3000)}
                  >
                    $3,000
                  </button>
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${downPayment === 5000 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleDownPaymentSelect(5000)}
                  >
                    $5,000
                  </button>
                </div>
                <p className="mt-2">Loan Terms:</p>
                <div className="flex space-x-2">
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${loanTerm === 36 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleLoanTermSelect(36)}
                  >
                    36 months
                  </button>
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${loanTerm === 48 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleLoanTermSelect(48)}
                  >
                    48 months
                  </button>
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${loanTerm === 60 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleLoanTermSelect(60)}
                  >
                    60 months
                  </button>
                </div>
                <p className="mt-2">Interest Rate: 
                    <input 
                        type="number" 
                        value={interestRate === null ? '' : interestRate.toString()} 
                        onChange={handleInterestRateChange}
                        placeholder="Enter Rate"
                        className="ml-2 p-1 border rounded"
                    />
                     %</p>
                <p className="mt-2">Amortization Schedule:</p>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Month</th>
                      <th className="px-4 py-2">Payment</th>
                      <th className="px-4 py-2">Principal</th>
                      <th className="px-4 py-2">Interest</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.map((row) => (
                        <tr key={row.month}>
                            <td className="border px-4 py-2">{row.month}</td>
                            <td className="border px-4 py-2">${row.payment.toFixed(2)}</td>
                            <td className="border px-4 py-2">${row.principal.toFixed(2)}</td>
                            <td className="border px-4 py-2">${row.interest.toFixed(2)}</td>
                            <td className="border px-4 py-2">${row.balance.toFixed(2)}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Lease Options Section */}
              <section>
                <h4 className="text-lg font-semibold mb-2">3. Lease Options</h4>
                <p>Lease Term:</p>
                <div className="flex space-x-2">
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${leaseTerm === 24 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleLeaseTermSelect(24)}
                  >
                    24 months
                  </button>
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ${leaseTerm === 36 ? 'bg-blue-300' : ''}`}
                    onClick={() => handleLeaseTermSelect(36)}
                  >
                    36 months
                  </button>
                </div>
                <p className="mt-2">Monthly Payment: $______</p>
                <p>Residual Value: {residualValuePercentage}%</p>
              </section>

              {/* Navigation to TCO */}
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={proceedToTCO}
              >
                Proceed to Total Cost of Ownership Calculation
              </button>
            </>
          ) : (
            <p>Select a vehicle to view details and pricing options.</p>
          )}
        </aside>
      </main>

      {/* Footer Section */}
      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; 2024 Wheels & Deals</p>
      </footer>
    </div>
  );
};

export default VehicleSelection;