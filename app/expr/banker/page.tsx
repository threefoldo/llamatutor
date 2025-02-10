// app/banker/page.tsx
'use client'

import React, { useState } from 'react';

// Define TypeScript types
interface LoanApplication {
  id: number;
  applicantName: string;
  creditScore: number;
  income: number;
  loanAmountRequested: number;
  interestRate?: number; // Banker can set this
}

interface MarketData {
  interestRate: number;
}

// Mock Data
const mockLoanApplications: LoanApplication[] = [
  { id: 1, applicantName: 'John Doe', creditScore: 680, income: 60000, loanAmountRequested: 25000 },
  { id: 2, applicantName: 'Jane Smith', creditScore: 720, income: 75000, loanAmountRequested: 35000 },
  { id: 3, applicantName: 'Peter Jones', creditScore: 650, income: 50000, loanAmountRequested: 20000 },
];

const mockMarketData: MarketData = {
  interestRate: 0.06,
};

// Fake AI Assistant Service
const fakeAiAssistantService = (query: string): string => {
  query = query.toLowerCase();
  if (query.includes("loan amortization")) {
    return "Loan amortization is the process of paying off a loan over time with regular payments.";
  } else if (query.includes("credit score")) {
    return "A credit score is a numerical representation of your creditworthiness.";
  } else {
    return "I'm sorry, I don't have information on that topic.";
  }
};

// Components
const LoanApplicationItem: React.FC<{ application: LoanApplication; onInterestRateChange: (id: number, rate: number) => void }> = ({ application, onInterestRateChange }) => {
  const [interestRate, setInterestRate] = useState<number | undefined>(application.interestRate);

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setInterestRate(newRate);
    onInterestRateChange(application.id, newRate);
  };

  return (
    <li className="border p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold">{application.applicantName}</h3>
      <p>Credit Score: {application.creditScore}</p>
      <p>Income: ${application.income}</p>
      <p>Loan Amount Requested: ${application.loanAmountRequested}</p>
      <div>
        <label htmlFor={`interestRate-${application.id}`} className="block text-sm font-medium text-gray-700">
          Interest Rate:
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="number"
            id={`interestRate-${application.id}`}
            className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter rate"
            value={interestRate !== undefined ? interestRate.toString() : ''}
            onChange={handleRateChange}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">%</span>
          </div>
        </div>
      </div>
    </li>
  );
};

const LoanApplicationList: React.FC<{ applications: LoanApplication[]; onInterestRateChange: (id: number, rate: number) => void }> = ({ applications, onInterestRateChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Loan Applications</h2>
      {applications.length > 0 ? (
        <ul className="space-y-4">
          {applications.map((application) => (
            <LoanApplicationItem key={application.id} application={application} onInterestRateChange={onInterestRateChange} />
          ))}
        </ul>
      ) : (
        <p>No pending loan applications.</p>
      )}
    </div>
  );
};

const FilterableLoanApplicationList: React.FC<{ applications: LoanApplication[]; onInterestRateChange: (id: number, rate: number) => void }> = ({ applications, onInterestRateChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredApplications, setFilteredApplications] = useState(applications);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = applications.filter(app => 
            app.applicantName.toLowerCase().includes(term.toLowerCase()) ||
            app.creditScore.toString().includes(term)
        );
        setFilteredApplications(filtered);
    };

    return (
        <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Applicants:</label>
            <input 
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search by name or credit score"
                value={searchTerm}
                onChange={handleSearch}
            />
            <LoanApplicationList applications={filteredApplications} onInterestRateChange={onInterestRateChange} />
        </div>
    );
};


const RiskAssessmentTools: React.FC = () => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">Risk Assessment Tools</h2>
      <p>Credit Score Analysis: Check credit history and identify potential risks.</p>
      <p>Debt-to-Income Ratio Calculation: Analyze applicant's ability to repay the loan.</p>
      {/* Add more tools as needed */}
    </div>
  );
};

const CalculatorLinks: React.FC = () => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">Financial Calculators</h2>
      <div className="grid grid-cols-2 gap-4">
        <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Loan Amortization
        </a>
        <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Interest Calculation
        </a>
        <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Total Cost of Ownership
        </a>
        <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Lease vs. Buy
        </a>
      </div>
    </div>
  );
};

const MarketUpdates: React.FC<{ marketData: MarketData }> = ({ marketData }) => {
    return (
      <div className="border p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Market Updates</h2>
        <p>Current Interest Rate: {marketData.interestRate * 100}%</p>
      </div>
    );
  };

const AiAssistant: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = () => {
        const aiResponse = fakeAiAssistantService(query);
        setResponse(aiResponse);
    };

    return (
        <div className="border p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
            <input
                type="text"
                className="w-full border rounded p-2 mb-2"
                placeholder="Ask a question..."
                value={query}
                onChange={handleQueryChange}
            />
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Ask</button>
            {response && <p className="mt-2"><strong>AI Response:</strong> {response}</p>}
        </div>
    );
};


const DecisionScenarioPanel: React.FC = () => {
  // Mock Scenario
  const scenario = {
    id: 1,
    description: "A borrower with a low credit score is requesting a large loan. What do you do?",
    options: [
      { id: 1, text: "Approve the loan with a high interest rate." },
      { id: 2, text: "Deny the loan." },
      { id: 3, text: "Request additional information." },
    ],
  };

  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">Decision Scenario</h2>
      <p>{scenario.description}</p>
      <ul className="mt-2">
        {scenario.options.map((option) => (
          <li key={option.id} className="mb-1">
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">{option.text}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Page Component
const BankerDashboard: React.FC = () => {
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>(mockLoanApplications);

  const handleInterestRateChange = (id: number, rate: number) => {
    setLoanApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === id ? { ...app, interestRate: rate } : app
      )
    );
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Banker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <FilterableLoanApplicationList applications={loanApplications} onInterestRateChange={handleInterestRateChange} />
        </div>
        <div>
          <RiskAssessmentTools />
          <CalculatorLinks />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <MarketUpdates marketData={mockMarketData} />
          <AiAssistant />
          <DecisionScenarioPanel />
      </div>
    </div>
  );
};

export default BankerDashboard;