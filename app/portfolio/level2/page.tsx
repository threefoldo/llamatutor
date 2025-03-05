'use client'

import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioLevel2() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="w-full bg-green-600 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Level 2: Diversification & Optimization</h1>
          <p className="mt-2 text-xl text-green-100">Master modern portfolio theory and portfolio rebalancing strategies</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Portfolio Construction</h2>
            <p className="text-lg text-gray-600 mb-6">
              In Level 2, you'll apply modern portfolio theory to construct optimal portfolios and develop effective rebalancing strategies.
              These advanced techniques will help you maximize returns for a given level of risk and maintain desired allocations over time.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Learning Objectives</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Apply mean-variance optimization to construct efficient portfolios</li>
                <li>Visualize and understand the efficient frontier</li>
                <li>Analyze portfolio drift and calculate rebalancing requirements</li>
                <li>Develop cost-effective rebalancing strategies</li>
                <li>Balance mathematical optimization with practical constraints and client needs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Level 2 Challenges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Challenge 2.1: Crafting the Efficient Portfolio */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-green-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Challenge 2.1</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Intermediate</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Crafting the Efficient Portfolio</h4>
              <p className="text-gray-600 mb-4">
                Design an optimal portfolio for the Thompson family using mean-variance optimization and efficient frontier principles.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Use modern portfolio theory to optimize allocations</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Visualize the efficient frontier and identify optimal portfolios</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Maximize Sharpe ratio while meeting client constraints</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level2/challenge1" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Start Challenge
                </Link>
              </div>
            </div>
          </div>

          {/* Challenge 2.2: Mastering Rebalancing */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-green-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Challenge 2.2</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Advanced</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Mastering Rebalancing</h4>
              <p className="text-gray-600 mb-4">
                Analyze portfolio drift for the Anderson Community Foundation and develop a cost-effective rebalancing strategy.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Calculate drift from target allocations</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Determine optimal trades to realign portfolio</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Minimize rebalancing costs while adhering to policy guidelines</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level2/challenge2" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Start Challenge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/portfolio/level1" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              ← Back to Level 1
            </Link>
            <Link href="/portfolio/level3" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
              Next: Level 3 - Risk & Factor Analysis →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}