'use client';

import React, { useState } from 'react';

// Define types for vehicle options
interface Vehicle {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface LoanDetails {
    downPayment: number;
    loanTerm: number;
    interestRate: number;
    monthlyPayment: number;
    totalCost: number;
}

interface LeaseDetails {
    downPayment: number;
    leaseTerm: number;
    monthlyPayment: number;
    totalCost: number;
}

const CarPurchaseOptions = () => {
    // State for selected vehicle
    const [selectedVehicle, setSelectedVehicle] = useState<string>('Honda Civic');

    // State for selected purchase option tab
    const [activeTab, setActiveTab] = useState<string>('cash');

    // State for loan details
    const [loanDetails, setLoanDetails] = useState<LoanDetails>({
        downPayment: 0,
        loanTerm: 0,
        interestRate: 7, // Default value, to be determined by credit score
        monthlyPayment: 0,
        totalCost: 0,
    });

    // State for lease details
    const [leaseDetails, setLeaseDetails] = useState<LeaseDetails>({
        downPayment: 0,
        leaseTerm: 0,
        monthlyPayment: 0,
        totalCost: 0,
    });

    // Placeholder data for vehicle options
    const vehicleOptions: Vehicle[] = [
        { id: 'civic', name: 'Honda Civic', price: 25000, imageUrl: '/imgs/honda_civic.jpg' },
        { id: 'bmw', name: 'BMW 3 Series', price: 45000, imageUrl: '/imgs/bmw_3_series.jpg' },
        { id: 'tesla', name: 'Tesla Model 3', price: 40000, imageUrl: '/imgs/tesla_model3.jpg' },
    ];

    // Placeholder data for financial calculations (replace with actual logic)
    const [cashPurchaseTotal, setCashPurchaseTotal] = useState<number>(0);

    // Function to calculate cash purchase total
    const calculateCashTotal = (price: number) => {
        const salesTaxRate = 0.06; // Example sales tax rate
        const registrationFee = 150; // Example registration fee
        const total = price + (price * salesTaxRate) + registrationFee;
        setCashPurchaseTotal(total);
    };

    const [downPaymentLoan, setDownPaymentLoan] = useState<number>(0);
    const [loanTermLoan, setLoanTermLoan] = useState<number>(0);
    const [monthlyPaymentLoan, setMonthlyPaymentLoan] = useState<number>(0);
    const [totalCostLoan, setTotalCostLoan] = useState<number>(0);

    // Function to calculate Loan payment

    const calculateLoanPayment = () => {
        // Simulate API call or calculation
        console.log('Calculating loan payment with', downPaymentLoan, loanTermLoan, loanDetails.interestRate);
        // Placeholder loan calculation logic
        const principal = vehicleOptions.find((vehicle) => vehicle.name === selectedVehicle)?.price ?? 0;
        const loanAmount = principal - downPaymentLoan;
        const monthlyInterestRate = loanDetails.interestRate / 100 / 12;

        if (monthlyInterestRate === 0) {
            return; // Prevent division by zero for 0% interest.

        }

        const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanTermLoan));

        const totalPayment = monthlyPayment * loanTermLoan;
        const totalCost = totalPayment + downPaymentLoan;

        setMonthlyPaymentLoan(monthlyPayment);
        setTotalCostLoan(totalCost);

    };

    // Function to handle Loan DownPayment change
    const handleLoanDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDownPaymentLoan(parseFloat(e.target.value));
    };

    // Function to handle Loan LoanTerm change
    const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoanTermLoan(parseFloat(e.target.value));
    };

    const [downPaymentLease, setDownPaymentLease] = useState<number>(0);
    const [leaseTermLease, setLeaseTermLease] = useState<number>(0);
    const [monthlyPaymentLease, setMonthlyPaymentLease] = useState<number>(0);
    const [totalCostLease, setTotalCostLease] = useState<number>(0);

    // Function to handle Loan DownPayment change
    const handleLeaseDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDownPaymentLease(parseFloat(e.target.value));
    };

    // Function to handle Loan LoanTerm change
    const handleLeaseTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLeaseTermLease(parseFloat(e.target.value));
    };


    const calculateLeasePayment = () => {
        // Simulate API call or calculation
        console.log('Calculating lease payment with', downPaymentLease, leaseTermLease);
        // Placeholder lease calculation logic
        const principal = vehicleOptions.find((vehicle) => vehicle.name === selectedVehicle)?.price ?? 0;

        const residualValuePercentage = 0.6; // Example

        const residualValue = principal * residualValuePercentage;
        const depreciation = principal - residualValue;
        const rentCharge = (principal + residualValue) * (0.001);

        const monthlyPayment = (depreciation / leaseTermLease) + rentCharge;

        const totalCost = (monthlyPayment * leaseTermLease) + downPaymentLease;

        setMonthlyPaymentLease(monthlyPayment);
        setTotalCostLease(totalCost);
    };

    React.useEffect(() => {
        const selectedCarPrice = vehicleOptions.find(vehicle => vehicle.name === selectedVehicle)?.price || 0;
        calculateCashTotal(selectedCarPrice);
    }, [selectedVehicle]);

    return (
        <div className="container mx-auto py-4">
            {/* Header */}
            <header className="text-2xl font-bold mb-4">
                Car Purchase Options Analysis Exercise
            </header>

            {/* Introduction Section */}
            <section className="mb-6">
                <p>
                    This exercise helps you understand the financial implications of different car buying
                    options through practical calculations and comparisons.
                </p>
            </section>

            {/* Vehicle Selection Section */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Available Vehicles</h2>
                <div className="flex space-x-4">
                    {vehicleOptions.map((vehicle) => (
                        <div key={vehicle.id} className="border rounded-md p-4 shadow-md w-1/3">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                <input
                                    type="radio"
                                    name="vehicle"
                                    value={vehicle.id}
                                    checked={selectedVehicle === vehicle.name}
                                    onChange={() => setSelectedVehicle(vehicle.name)}
                                    className="mr-2 leading-tight"
                                />
                                <span className="text-base">{vehicle.name}</span>
                            </label>
                            <p>Price: ${vehicle.price.toLocaleString()}</p>
                            <img src={vehicle.imageUrl} alt={vehicle.name} className="h-48 w-full bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Purchase Option Analysis Section */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Purchase Options</h2>
                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'cash'
                            ? 'bg-gray-200 border-b-2 border-blue-500'
                            : 'hover:bg-gray-100'
                            }`}
                        onClick={() => setActiveTab('cash')}
                    >
                        Cash Purchase
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'loan'
                            ? 'bg-gray-200 border-b-2 border-blue-500'
                            : 'hover:bg-gray-100'
                            }`}
                        onClick={() => setActiveTab('loan')}
                    >
                        Bank Loan
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'dealership'
                            ? 'bg-gray-200 border-b-2 border-blue-500'
                            : 'hover:bg-gray-100'
                            }`}
                        onClick={() => setActiveTab('dealership')}
                    >
                        Dealership Financing
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'lease'
                            ? 'bg-gray-200 border-b-2 border-blue-500'
                            : 'hover:bg-gray-100'
                            }`}
                        onClick={() => setActiveTab('lease')}
                    >
                        Leasing
                    </button>
                </div>

                {/* Tab Content */}
                <div className="py-4">
                    {activeTab === 'cash' && (
                        <div>
                            <p>Total Cost: ${cashPurchaseTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                    )}
                    {activeTab === 'loan' && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Down Payment:
                                <input
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter down payment"
                                    value={downPaymentLoan}
                                    onChange={handleLoanDownPaymentChange}
                                />
                            </label>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Loan Term (months):
                                <input
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter loan term"
                                    value={loanTermLoan}
                                    onChange={handleLoanTermChange}
                                />
                            </label>

                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={calculateLoanPayment}
                            >
                                Calculate
                            </button>
                            {
                                monthlyPaymentLoan > 0 && (

                                    <div>
                                        <p>Monthly Payment: ${monthlyPaymentLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        <p>Total Cost: ${totalCostLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                    </div>

                                )
                            }
                        </div>
                    )}
                    {activeTab === 'dealership' && (
                        <div>
                            <p>Dealership Financing options will be shown here.</p>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                View Options
                            </button>
                        </div>
                    )}
                    {activeTab === 'lease' && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Down Payment:
                                <input
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter down payment"
                                    value={downPaymentLease}
                                    onChange={handleLeaseDownPaymentChange}
                                />
                            </label>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Lease Term (months):
                                <input
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter lease term"
                                    value={leaseTermLease}
                                    onChange={handleLeaseTermChange}
                                />
                            </label>

                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={calculateLeasePayment}
                            >
                                Calculate
                            </button>
                            {
                                monthlyPaymentLease > 0 && (

                                    <div>
                                        <p>Monthly Payment: ${monthlyPaymentLease.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        <p>Total Cost: ${totalCostLease.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                    </div>

                                )
                            }
                        </div>
                    )}
                </div>
            </section>

            {/* Comparison Section */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Comparison</h2>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Option</th>
                            <th className="px-4 py-2">Total Cost</th>
                            <th className="px-4 py-2">Monthly Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Cash Purchase</td>
                            <td className="border px-4 py-2">${cashPurchaseTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="border px-4 py-2">N/A</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Bank Loan</td>
                            <td className="border px-4 py-2">${totalCostLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="border px-4 py-2">${monthlyPaymentLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Leasing</td>
                            <td className="border px-4 py-2">${totalCostLease.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="border px-4 py-2">${monthlyPaymentLease.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Learning Objectives Section */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Learning Objectives</h2>
                <ul>
                    <li>Understand how interest rates affect total cost.</li>
                    <li>Understand the relationship between down payment and total interest paid.</li>
                    <li>Understand the true cost difference between buying and leasing.</li>
                    <li>Understand the impact of loan term length on total cost.</li>
                    <li>Understand how credit scores affect financing options.</li>
                </ul>
            </section>
        </div>
    );
};

export default CarPurchaseOptions;