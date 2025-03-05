'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function PortfolioProdigy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="w-full bg-blue-600 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Portfolio Prodigy: Master the Market</h1>
          <p className="mt-2 text-xl text-blue-100">An interactive investment simulation experience</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Portfolio Prodigy</h2>
            <p className="text-lg text-gray-600 mb-6">
              Step into the shoes of an investment analyst and apply portfolio theory to solve real-world 
              investment challenges. Build portfolios, analyze risk and return, interpret market factors, 
              and make strategic decisions while earning achievements along the way.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Your Learning Journey</h3>
              <p className="text-gray-700 mb-3">
                Portfolio Prodigy offers a progressive learning experience across four levels of complexity:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><span className="font-medium">Level 1: Portfolio Foundations</span> - Build your first portfolio and learn risk-adjusted decisions</li>
                <li><span className="font-medium">Level 2: Diversification & Optimization</span> - Master efficient portfolios and rebalancing strategies</li>
                <li><span className="font-medium">Level 3: Risk & Factor Analysis</span> - Explore downside risk measures and factor-based returns</li>
                <li><span className="font-medium">Level 4: Advanced Strategies</span> - Implement alternative investments and ESG integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Level Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Choose Your Challenge</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Level 1: Portfolio Foundations */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-blue-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Level 1: Portfolio Foundations</h3>
              <p className="text-gray-600 mb-4">
                Learn the essentials of portfolio construction, diversification, and risk-adjusted performance metrics.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Build Your First Portfolio</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Risk-Adjusted Decisions</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level1" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Start Level 1
                </Link>
              </div>
            </div>
          </div>

          {/* Level 2: Diversification & Optimization */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-green-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Level 2: Diversification & Optimization</h3>
              <p className="text-gray-600 mb-4">
                Apply modern portfolio theory to construct efficient portfolios and develop rebalancing strategies.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Crafting the Efficient Portfolio</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Mastering Rebalancing</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level2" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Start Level 2
                </Link>
              </div>
            </div>
          </div>

          {/* Level 3: Risk & Factor Analysis */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-purple-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Level 3: Risk & Factor Analysis</h3>
              <p className="text-gray-600 mb-4">
                Analyze downside risk, stress test portfolios, and understand the factors driving investment returns.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-purple-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Downside Risk Detective</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-purple-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Unmasking Performance Factors</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level3" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Start Level 3
                </Link>
              </div>
            </div>
          </div>

          {/* Level 4: Advanced Strategies */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="h-3 bg-amber-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Level 4: Advanced Strategies</h3>
              <p className="text-gray-600 mb-4">
                Implement alternative investments and ESG integration strategies for sophisticated portfolios.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-amber-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Alternative Investments Unleashed</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-amber-100 flex items-center justify-center">
                      <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">ESG Impact & Integration</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/portfolio/level4" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                  Start Level 4
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Game Features</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Portfolio Building</h3>
              <p className="text-gray-600">
                Drag-and-drop interface to construct portfolios using real-world investment data and see real-time results.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Dynamic Visualizations</h3>
              <p className="text-gray-600">
                Visualize risk-return relationships, efficient frontiers, and asset allocations through interactive charts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Client-Focused Scenarios</h3>
              <p className="text-gray-600">
                Solve realistic investment challenges based on client profiles with specific goals and constraints.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Intelligent Guidance</h3>
              <p className="text-gray-600">
                Receive adaptive hints and feedback from the AI "Investment Guru" based on your approach and decisions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Achievement System</h3>
              <p className="text-gray-600">
                Earn badges and track your progress as you master different aspects of portfolio management.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Applied Learning</h3>
              <p className="text-gray-600">
                Practice applying portfolio theory concepts through hands-on decision-making in realistic contexts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Investment Expertise?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with Level 1 and work your way to becoming a portfolio management expert.
          </p>
          <Link href="/portfolio/level1" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
            Begin Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
}