// app/calculators/page.tsx

import Link from 'next/link';

interface Calculator {
  name: string;
  description: string;
  href: string;
}

const calculators: Calculator[] = [
  {
    name: 'Loan Amortization Calculator',
    description: 'Calculate your loan amortization schedule.',
    href: '/calculators/loan-amortization',
  },
  {
    name: 'Interest Calculation Calculator',
    description: 'Calculate interest earned or paid.',
    href: '/calculators/interest-calculation',
  },
  {
    name: 'Total Cost of Ownership Calculator',
    description: 'Calculate the total cost of owning a vehicle.',
    href: '/calculators/total-cost-of-ownership',
  },
    {
    name: 'Depreciation Calculator',
    description: 'Calculate the depreciation of a car.',
    href: '/calculators/depreciation',
  },
  {
    name: 'Lease vs. Buy Calculator',
    description: 'Compare the costs of leasing versus buying a car.',
    href: '/calculators/lease-vs-buy',
  },
];

const CalculatorCard = ({ calculator }: { calculator: Calculator }) => {
  return (
    <Link href={calculator.href} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{calculator.name}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">{calculator.description}</p>
    </Link>
  );
};

const CalculatorList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {calculators.map((calculator) => (
        <CalculatorCard key={calculator.name} calculator={calculator} />
      ))}
    </div>
  );
};


export default function CalculatorsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Financial Calculators</h1>
      <CalculatorList />
    </div>
  );
}