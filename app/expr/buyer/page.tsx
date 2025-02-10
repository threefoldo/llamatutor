// app/buyer/page.tsx
"use client";

import { useState, useEffect } from 'react';

// Define TypeScript types
interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    interest_rate: number;
    monthly_payment: number;
}

interface MarketData {
    interest_rate: number;
    average_car_price: number;
}

interface Scenario {
    id: number;
    description: string;
    options: string[];
}

interface User {
  id: string;
  credit_score: number;
  budget: number;
}

// Mock Data (replace with real Supabase data fetching in a real application)
const MockCarData: Car[] = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2023, price: 28000, interest_rate: 0.05, monthly_payment: 500 },
    { id: 2, make: 'Honda', model: 'Civic', year: 2022, price: 25000, interest_rate: 0.04, monthly_payment: 450 },
    { id: 3, make: 'Ford', model: 'F-150', year: 2024, price: 40000, interest_rate: 0.06, monthly_payment: 750 },
];

const initialMockMarketData: MarketData = {
    interest_rate: 0.055,
    average_car_price: 32000,
};

const MockScenarioData: Scenario = {
    id: 1,
    description: 'You need a car for your new job, but your credit score is average.  What do you do?',
    options: ['Buy a new car with a high interest loan.', 'Buy a used car with cash.', 'Lease a new car.', 'Take public transportation and save money.'],
};

const MockUser: User = {
  id: 'user123',
  credit_score: 680,
  budget: 30000,
}

// Fake Supabase Service (for demonstration purposes)
const FakeSupabaseService = {
    getUser: async (): Promise<User> => {
        return MockUser;
    },
    getCars: async (): Promise<Car[]> => {
        return MockCarData;
    },
    getMarketData: async (): Promise<MarketData> => {
        return initialMockMarketData;
    },
};

// UI Components
const UserInfo = ({ user }: { user: User }) => (
  <div className="bg-blue-100 p-4 rounded-md shadow-md">
    <h2 className="text-lg font-semibold">Your Info</h2>
    <p>Budget: ${user.budget}</p>
    <p>Credit Score: {user.credit_score}</p>
  </div>
);

const CarList = ({ cars }: { cars: Car[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
            <CarListItem key={car.id} car={car} />
        ))}
    </div>
);

const CarListItem = ({ car }: { car: Car }) => (
    <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-md font-semibold">{car.make} {car.model}</h3>
        <p>Year: {car.year}</p>
        <p>Price: ${car.price}</p>
        <p>Estimated Monthly Payment: ${car.monthly_payment}</p>
    </div>
);

const CalculatorLinks = () => (
    <div className="flex flex-wrap gap-4">
        <a href="/calculators/loan-amortization" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700">Loan Amortization</a>
        <a href="/calculators/interest-calculation" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700">Interest Calculation</a>
        <a href="/calculators/total-cost" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700">Total Cost of Ownership</a>
        <a href="/calculators/depreciation" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700">Depreciation</a>
        <a href="/calculators/lease-vs-buy" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700">Lease vs. Buy</a>
    </div>
);

const MarketUpdates = ({ marketData }: { marketData: MarketData }) => (
    <div className="bg-yellow-100 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold">Market Updates</h2>
        <p>Interest Rate: {marketData.interest_rate}%</p>
        <p>Average Car Price: ${marketData.average_car_price}</p>
    </div>
);

const AiAssistant = () => (
    <div>
        <button className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700">Ask the AI Assistant</button>
    </div>
);

const DecisionScenario = ({ scenario }: { scenario: Scenario }) => (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold">Decision Scenario</h2>
        <p>{scenario.description}</p>
        <ul>
            {scenario.options.map((option, index) => (
                <li key={index}>
                    <button className="bg-blue-300 py-1 px-2 rounded">{option}</button>
                </li>
            ))}
        </ul>
    </div>
);

// BuyerDashboard Page Component
const BuyerDashboard = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [marketData, setMarketData] = useState<MarketData>(initialMockMarketData);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const carsData = await FakeSupabaseService.getCars();
            setCars(carsData);

            const initialMarketData = await FakeSupabaseService.getMarketData();
            setMarketData(initialMarketData);

            const userData = await FakeSupabaseService.getUser();
            setUser(userData);
        };

        fetchData();

        // Simulate real-time market updates (replace with a real-time service)
        const intervalId = setInterval(async () => {
            // In a real application, fetch updated market data from an API
            const newMarketData: MarketData = {
                interest_rate: initialMockMarketData.interest_rate + (Math.random() - 0.5) * 0.01, // Vary by +/- 0.01
                average_car_price: initialMockMarketData.average_car_price + (Math.random() - 0.5) * 1000, // Vary by +/- 1000
            };
            setMarketData(newMarketData);
        }, 5000);

        return () => clearInterval(intervalId); // Clean up the interval on unmount
    }, []);

    if (!user) {
      return <div>Loading user data...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>

            <UserInfo user={user} />

            <MarketUpdates marketData={marketData} />

            <h2 className="text-xl font-semibold mt-4 mb-2">Available Cars</h2>
            <CarList cars={cars} />

            <h2 className="text-xl font-semibold mt-4 mb-2">Calculators</h2>
            <CalculatorLinks />

            <h2 className="text-xl font-semibold mt-4 mb-2">AI Assistant</h2>
            <AiAssistant />

            <h2 className="text-xl font-semibold mt-4 mb-2">Decision Scenario</h2>
            <DecisionScenario scenario={MockScenarioData} />
        </div>
    );
};

export default BuyerDashboard;