'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function PortfolioLevel4() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 4: Advanced Strategies</h1>
            <h2 className="text-lg">Mastering Alternative Investments & ESG</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/portfolio" className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded text-sm font-medium">
              Mission Map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to Advanced Portfolio Strategies</h2>
          <p className="text-gray-600 mb-4">
            In Level 4, you'll tackle expert-level challenges that focus on more sophisticated investment approaches, 
            including alternative investments and ESG (Environmental, Social, and Governance) integration strategies.
          </p>
          <p className="text-gray-600 mb-4">
            These challenges will test your ability to balance complex investment objectives, manage fee impacts, 
            understand unique risk-return characteristics, and implement modern portfolio approaches beyond traditional stocks and bonds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Challenge 1 Card */}
          <Link href="/portfolio/level4/challenge1" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-indigo-700 h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Challenge 4.1</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">Expert</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Alternative Investments Unleashed</h4>
                <p className="text-gray-600 mb-4">
                  Evaluate alternative investments, assess their unique risk-return profiles, understand fee structures, and incorporate them effectively into a diversified portfolio.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Alternative ETFs, Liquid Alternatives, Fee Analysis
                </div>
              </div>
            </div>
          </Link>

          {/* Challenge 2 Card */}
          <Link href="/portfolio/level4/challenge2" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-indigo-700 h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Challenge 4.2</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">Expert</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">ESG Impact & Integration</h4>
                <p className="text-gray-600 mb-4">
                  Evaluate ESG metrics, analyze their impact on portfolio characteristics, and implement sustainable investment strategies while maintaining financial performance.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ESG Integration, Sustainability Metrics, Impact Investing
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 flex justify-between">
          <Link href="/portfolio/level3" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Level 3
          </Link>
          <Link href="/portfolio" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center">
            Mission Map
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}