'use client'

import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioLevel1() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="w-full bg-blue-600 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Level 1: Portfolio Foundations</h1>
          <p className="mt-2 text-xl text-blue-100">Learn the essentials of portfolio construction and risk-adjusted performance</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started with Portfolio Management</h2>
            <p className="text-lg text-gray-600 mb-6">
              In Level 1, you'll establish a solid foundation in portfolio theory by learning how to build diversified portfolios 
              and evaluate investments using risk-adjusted performance metrics. These fundamental skills will prepare you for 
              more advanced portfolio management concepts in later levels.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Learning Objectives</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Construct a basic portfolio combining individual stocks and ETFs</li>
                <li>Calculate expected portfolio return and risk</li>
                <li>Understand and explain the benefits of diversification</li>
                <li>Calculate and interpret risk-adjusted performance metrics (Sharpe and Treynor ratios)</li>
                <li>Make investment recommendations based on risk-adjusted analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Level 1 Challenges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Challenge 1.1: Build Your First Portfolio */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-blue-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Challenge 1.1</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Beginner</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Build Your First Portfolio</h4>
              <p className="text-gray-600 mb-4">
                Help Maria Chen, a 35-year-old software engineer, create a balanced portfolio for her home down payment savings.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Allocate investments across ETFs and stocks</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Balance risk and return for a 3-5 year time horizon</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Analyze diversification benefits using correlation data</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level1/challenge1" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Start Challenge
                </Link>
              </div>
            </div>
          </div>

          {/* Challenge 1.2: Risk-Adjusted Decisions */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-blue-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Challenge 1.2</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Intermediate</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Risk-Adjusted Decisions</h4>
              <p className="text-gray-600 mb-4">
                Analyze six investments using risk-adjusted performance metrics and recommend the best options for client portfolios.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Calculate and compare Sharpe ratios</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Calculate and compare Treynor ratios</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Make data-driven investment recommendations</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level1/challenge2" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
            <Link href="/portfolio" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              ← Back to Portfolio Prodigy
            </Link>
            <Link href="/portfolio/level2" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              Next: Level 2 - Diversification & Optimization →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}