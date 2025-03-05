'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function PortfolioLevel3() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-purple-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Level 3: Risk & Factor Analysis</h1>
            <h2 className="text-lg">Advanced Portfolio Management Challenges</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/portfolio" className="px-3 py-1 bg-purple-500 hover:bg-purple-400 rounded text-sm font-medium">
              Mission Map
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to Advanced Risk Analysis</h2>
          <p className="text-gray-600 mb-4">
            In Level 3, you'll tackle more sophisticated challenges that focus on analyzing and managing portfolio risk, 
            understanding factor attribution, and making better investment decisions with advanced metrics.
          </p>
          <p className="text-gray-600 mb-4">
            These challenges will test your understanding of concepts like Value at Risk (VaR), stress testing, 
            and factor analysis - essential skills for any advanced portfolio manager.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Challenge 1 Card */}
          <Link href="/portfolio/level3/challenge1" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-purple-700 h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Challenge 3.1</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">Advanced</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Downside Risk Detective</h4>
                <p className="text-gray-600 mb-4">
                  Master downside risk metrics (VaR, CVaR) and stress testing to evaluate portfolio vulnerabilities and recommend risk mitigation strategies.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Value at Risk (VaR), Stress Testing
                </div>
              </div>
            </div>
          </Link>

          {/* Challenge 2 Card */}
          <Link href="/portfolio/level3/challenge2" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-purple-700 h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Challenge 3.2</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">Advanced</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Unmasking Performance Factors</h4>
                <p className="text-gray-600 mb-4">
                  Apply factor analysis to evaluate fund performance, distinguishing between market-driven returns and manager skill through attribution analysis.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Factor Models, Attribution Analysis
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 flex justify-between">
          <Link href="/portfolio/level2" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Level 2
          </Link>
          <Link href="/portfolio/level4" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center">
            Level 4
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}