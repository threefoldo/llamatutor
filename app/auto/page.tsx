"use client";

import Link from "next/link";
import Image from "next/image";

export default function AutoFinancePage() {
  const levels = [
    {
      level: 1,
      title: "Loan Fundamentals",
      description: "Calculate and compare basic auto loan options",
      miniGames: [
        {
          id: "monthly-payment-calculator",
          title: "Monthly Payment Calculator",
          description: "Calculate loan payments and understand how different loan terms affect your monthly budget",
          path: "/auto/level1/monthly-payment-calculator",
          image: "/imgs/honda_civic.jpg",
          skills: ["PMT Formula", "Total Cost Analysis", "Term Comparison"]
        },
        {
          id: "total-interest-comparison",
          title: "Total Interest Comparison",
          description: "Compare different loan options to find the one with the lowest total interest cost",
          path: "/auto/level1/total-interest-comparison",
          image: "/imgs/bmw_3_series.jpg",
          skills: ["Interest Calculation", "Cost Comparison", "Financial Decision Making"]
        },
        {
          id: "amortization-analysis",
          title: "Amortization Analysis",
          description: "Understand how payments are split between principal and interest over time",
          path: "/auto/level1/amortization-analysis",
          image: "/imgs/tesla_model3.jpg",
          skills: ["Payment Breakdown", "Interest Analysis", "Loan Progression"]
        },
      ],
    },
    {
      level: 2,
      title: "Purchase Cost Analysis",
      description: "Calculate complete purchase costs including fees and trade-ins",
      miniGames: [
        {
          id: "loan-amount-calculator",
          title: "Loan Amount Calculator",
          image: "/imgs/tesla_model3.jpg",
          description: "Determine the final loan amount accounting for all factors in the purchasing process",
          path: "/auto/level2/loan-amount-calculator",
          skills: ["Document Analysis", "Fee Calculation", "Trade-in Valuation"]
        },
        {
          id: "total-cost-calculator",
          title: "Total Cost Calculator",
          image: "/imgs/bmw_3_series.jpg",
          description: "Calculate the comprehensive lifetime cost of vehicle ownership",
          path: "/auto/level2/total-cost-calculator",
          skills: ["Ownership Cost Analysis", "Long-term Planning", "Financial Projection"]
        },
        {
          id: "monthly-payment-with-fees",
          title: "Monthly Payment with Fees",
          image: "/imgs/honda_civic.jpg",
          description: "Recalculate monthly payments integrating all fees and dealer add-ons",
          path: "/auto/level2/monthly-payment-with-fees",
          skills: ["Advertisement Analysis", "Fee Integration", "Payment Comparison"]
        },
      ],
    },
    {
      level: 3,
      title: "Refinancing Analysis",
      description: "Evaluate refinancing opportunities and early payoff strategies",
      miniGames: [
        {
          id: "refinance-calculator",
          title: "Refinance Payment Calculator",
          description: "Calculate potential savings from refinancing an existing auto loan",
          path: "/auto/level3/refinance-calculator",
          image: "/imgs/honda_civic.jpg",
          skills: ["Rate Comparison", "Term Adjustment", "Break-even Analysis"]
        },
        {
          id: "refinance-interest-savings",
          title: "Refinance Interest Savings",
          description: "Calculate and analyze the total interest savings from refinancing your auto loan",
          path: "/auto/level3/refinance-interest-savings",
          image: "/imgs/bmw_3_series.jpg",
          skills: ["Interest Comparison", "Cost-Benefit Analysis", "Financial Planning"]
        },
        {
          id: "early-payoff-analysis",
          title: "Early Payoff Analysis",
          description: "Determine the impact of making extra payments or lump sum payments on a loan",
          path: "/auto/step3/early-payoff-analysis",
          image: "/imgs/tesla_model3.jpg",
          skills: ["Amortization Adjustment", "Interest Savings", "Financial Strategy"]
        },
      ],
    },
    {
      level: 4,
      title: "Lease vs. Buy Decision",
      description: "Compare financial implications of leasing versus buying",
      miniGames: [
        {
          id: "total-lease-cost",
          title: "Total Lease Cost Calculator",
          description: "Calculate the comprehensive cost of a vehicle lease including all fees",
          path: "/auto/step4/total-lease-cost",
          image: "/imgs/tesla_model3.jpg",
          skills: ["Lease Structure Analysis", "Fee Calculation", "Mileage Impact"]
        },
        {
          id: "buy-option-analysis",
          title: "Buy Option Analysis",
          description: "Analyze the total cost of buying a vehicle including depreciation and resale value",
          path: "/auto/step4/buy-option-analysis",
          image: "/imgs/bmw_3_series.jpg",
          skills: ["Depreciation Calculation", "Ownership Cost Analysis", "Resale Value Projection"]
        },
        {
          id: "lease-vs-buy-recommendation",
          title: "Lease vs. Buy Recommendation",
          description: "Compare the financial implications of leasing versus buying a vehicle",
          path: "/auto/step4/lease-vs-buy-recommendation",
          image: "/imgs/honda_civic.jpg",
          skills: ["Comparative Analysis", "Long-term Planning", "Financial Decision-Making"]
        },
      ],
    },
    {
      level: 5,
      title: "Advanced Financing Concepts",
      description: "Evaluate specialized auto financing structures and insurance products",
      miniGames: [
        {
          id: "balloon-payment-analysis",
          title: "Balloon Payment Analysis",
          description: "Analyze the financial implications of balloon loans with deferred principal payments",
          path: "/auto/step5/balloon-payment-analysis",
          image: "/imgs/bmw_3_series.jpg",
          skills: ["Payment Structure Analysis", "Cash Flow Management", "Loan Comparison"]
        },
        {
          id: "gap-insurance-evaluation",
          title: "GAP Insurance Evaluation",
          description: "Determine the value of GAP insurance by analyzing the depreciation curve versus loan balance",
          path: "/auto/step5/gap-insurance-evaluation",
          image: "/imgs/tesla_model3.jpg",
          skills: ["Risk Assessment", "Depreciation Analysis", "Insurance Value Calculation"]
        },
        {
          id: "credit-score-impact",
          title: "Credit Score Impact Analysis",
          description: "Calculate the financial benefits of improving your credit score before financing a vehicle",
          path: "/auto/step5/credit-score-impact",
          image: "/imgs/honda_civic.jpg",
          skills: ["Interest Rate Analysis", "Payment Comparison", "Long-term Savings Calculation"]
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-blue-800 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">Auto Finance Advisor Pro</h1>
          <p className="text-xl max-w-3xl">
            Practice your auto financing calculations with real-world scenarios and document-based learning experiences.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 max-w-xs">
              <h3 className="text-lg font-semibold mb-2">Educational Focus</h3>
              <p className="text-sm">Self-directed practice environment for reinforcing finance concepts through authentic scenarios</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 max-w-xs">
              <h3 className="text-lg font-semibold mb-2">Calculation-Centered</h3>
              <p className="text-sm">Develop practical financial calculation skills using real formulas and complete solutions</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 max-w-xs">
              <h3 className="text-lg font-semibold mb-2">AI-Guided Learning</h3>
              <p className="text-sm">Get personalized guidance and feedback as you work through complex financial calculations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="space-y-16">
          {levels.map((level) => (
            <div key={level.level} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b">
                <h2 className="text-2xl font-bold">
                  Level {level.level}: {level.title}
                </h2>
                <p className="text-gray-700">{level.description}</p>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {level.miniGames.map((game) => (
                    <div key={game.id} className="relative">
                      {game.comingSoon ? (
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <div className="h-40 bg-gray-200 relative">
                            {game.image && (
                              <Image
                                src={game.image}
                                alt={game.title}
                                fill
                                className="opacity-30"
                                style={{ objectFit: "cover" }}
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Coming Soon
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2 text-gray-500">{game.title}</h3>
                            <p className="text-gray-400 text-sm mb-3">{game.description}</p>
                            {game.skills && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {game.skills.map((skill) => (
                                  <span key={skill} className="bg-gray-200 text-gray-500 px-2 py-1 rounded-full text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={game.path}
                          className="block border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all"
                        >
                          <div className="h-40 bg-gray-100 relative">
                            {game.image && (
                              <Image
                                src={game.image}
                                alt={game.title}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                            {game.skills && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {game.skills.map((skill) => (
                                  <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">How to Use This Learning Tool</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-3">1. Select a Scenario</h3>
                <p className="text-gray-600 text-sm">
                  Choose a mini-game that matches the financial calculation skill you want to practice.
                  Each scenario includes authentic documents and real-world situations.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-3">2. Analyze & Calculate</h3>
                <p className="text-gray-600 text-sm">
                  Review the scenario details, extract relevant information, and perform the necessary
                  financial calculations. Use scratch paper or a calculator as needed.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-3">3. Get Interactive Guidance</h3>
                <p className="text-gray-600 text-sm">
                  Each scenario includes an AI assistant that can help guide you through the calculation 
                  process, provide hints, and check your understanding of key concepts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}