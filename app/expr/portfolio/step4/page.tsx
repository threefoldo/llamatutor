'use client';

import React, { useState } from 'react';

interface JournalEntry {
  date: string;
  phase: string;
  investmentStrategy: string;
  riskTolerance: string;
  assetAllocationChanges: string;
  rationale: string;
  diversification: string;
  expectedOutcome: string;
  portfolioReturn: number;
  marketReturn: number;
}

interface OverallReflection {
 successfulDecisions: string;
 unsuccessfulDecisions: string;
 strategyVsExperience: string;
 diversificationLearning: string;
 newsInfluence: string;
 futureChanges: string;
}

const InvestmentJournal = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const totalPhases = 6;
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [investmentStrategy, setInvestmentStrategy] = useState('Balanced');
  const [riskTolerance, setRiskTolerance] = useState('Medium');
  const [rationale, setRationale] = useState('');
  const [diversification, setDiversification] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [overallReflection, setOverallReflection] = useState<OverallReflection>({
    successfulDecisions: '',
    unsuccessfulDecisions: '',
    strategyVsExperience: '',
    diversificationLearning: '',
    newsInfluence: '',
    futureChanges: '',
  });

  const handleSaveJournalEntry = () => {
    const newEntry: JournalEntry = {
      date: new Date().toLocaleDateString(),
      phase: `Month ${currentPhase}`,
      investmentStrategy,
      riskTolerance,
      assetAllocationChanges: 'Placeholder - Display changes from trading actions',
      rationale,
      diversification,
      expectedOutcome,
      portfolioReturn: (Math.random() - 0.5) * 10, // Placeholder - calculate real return
      marketReturn: (Math.random() - 0.5) * 5, // Placeholder - calculate market return
    };

    setJournalEntries([...journalEntries, newEntry]);
    // Clear the form after saving
    setRationale('');
    setDiversification('');
    setExpectedOutcome('');
    setInvestmentStrategy('Balanced');
    setRiskTolerance('Medium');

    // Move to the next phase (or end the simulation)
    if (currentPhase < totalPhases) {
      setCurrentPhase(currentPhase + 1);
    } else {
      alert("Simulation Complete! Please complete your overall reflection.");
    }
  };

  const handleViewDetails = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleOverallReflectionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof OverallReflection) => {
    setOverallReflection({ ...overallReflection, [field]: e.target.value });
  };

  const isSimulationComplete = currentPhase > totalPhases;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Investment Journal & Review</h1>

      {/* Progress Indicator */}
      <div className="mb-4">
        <p>Progress: Month {currentPhase} of {totalPhases}</p>
      </div>

      {/* Journal Entry Form */}
      {!isSimulationComplete && (
        <section className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Journal Entry (Month {currentPhase})</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="text"
              value={new Date().toLocaleDateString()}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phase">
              Phase:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phase"
              type="text"
              value={`Month ${currentPhase}`}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="investmentStrategy">
              Investment Strategy:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="investmentStrategy"
              value={investmentStrategy}
              onChange={(e) => setInvestmentStrategy(e.target.value)}
            >
              <option>Growth</option>
              <option>Income</option>
              <option>Balanced</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="riskTolerance">
              Risk Tolerance:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="riskTolerance"
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assetAllocationChanges">
              Asset Allocation Changes:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="assetAllocationChanges"
              type="text"
              value="Placeholder - Display changes from trading actions"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rationale">
              Rationale for Asset Selection:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="rationale"
              rows={3}
              placeholder="Explain why you made these specific buy/sell decisions."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diversification">
              Diversification Rationale:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="diversification"
              rows={3}
              placeholder="How diversified is your portfolio at this point?"
              value={diversification}
              onChange={(e) => setDiversification(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expectedOutcome">
              Expected Outcome: (Optional)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="expectedOutcome"
              rows={3}
              placeholder="What do you expect to happen in the next phase?"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSaveJournalEntry}
          >
            Save Journal Entry
          </button>
        </section>
      )}

      {/* Journal Review Table */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Journal Review</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-bold">
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Phase</th>
                <th className="px-4 py-2 border">Strategy</th>
                <th className="px-4 py-2 border">Risk</th>
                <th className="px-4 py-2 border">Asset Changes</th>
                <th className="px-4 py-2 border">Portfolio Return</th>
                <th className="px-4 py-2 border">Market Return</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {journalEntries.map((entry, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 border">{entry.date}</td>
                  <td className="px-4 py-2 border">{entry.phase}</td>
                  <td className="px-4 py-2 border">{entry.investmentStrategy}</td>
                  <td className="px-4 py-2 border">{entry.riskTolerance}</td>
                  <td className="px-4 py-2 border">{entry.assetAllocationChanges}</td>
                  <td className="px-4 py-2 border">{entry.portfolioReturn.toFixed(2)}%</td>
                  <td className="px-4 py-2 border">{entry.marketReturn.toFixed(2)}%</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                      onClick={() => handleViewDetails(entry)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Overall Reflection Form */}
      {isSimulationComplete && (
        <section className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Overall Reflection</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="successfulDecisions">
              What were your most successful decisions? Why?
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="successfulDecisions"
              rows={3}
              value={overallReflection.successfulDecisions}
              onChange={(e) => handleOverallReflectionChange(e, 'successfulDecisions')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unsuccessfulDecisions">
              What were your least successful decisions? What would you do differently?
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="unsuccessfulDecisions"
              rows={3}
              value={overallReflection.unsuccessfulDecisions}
              onChange={(e) => handleOverallReflectionChange(e, 'unsuccessfulDecisions')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="strategyVsExperience">
              How did your initial investment strategy and risk tolerance compare to your actual experience?
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="strategyVsExperience"
              rows={3}
              value={overallReflection.strategyVsExperience}
              onChange={(e) => handleOverallReflectionChange(e, 'strategyVsExperience')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diversificationLearning">
              What did you learn about diversification and its impact on portfolio performance?
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="diversificationLearning"
              rows={3}
              value={overallReflection.diversificationLearning}
              onChange={(e) => handleOverallReflectionChange(e, 'diversificationLearning')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newsInfluence">
              How did the news events influence your decisions, and how effective were your reactions?
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newsInfluence"
              rows={3}
              value={overallReflection.newsInfluence}
              onChange={(e) => handleOverallReflectionChange(e, 'newsInfluence')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="futureChanges">
              If you were to continue investing, what changes would you make to your approach?
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="futureChanges"
              rows={3}
              value={overallReflection.futureChanges}
              onChange={(e) => handleOverallReflectionChange(e, 'futureChanges')}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => alert('Overall Reflection Saved!')}
          >
            Save Overall Reflection
          </button>
        </section>
      )}

      {/* View Details Modal */}
      {isModalOpen && selectedEntry && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Journal Entry Details</h2>
            <p className="mb-2">
              <strong>Date:</strong> {selectedEntry.date}
            </p>
            <p className="mb-2">
              <strong>Phase:</strong> {selectedEntry.phase}
            </p>
            <p className="mb-2">
              <strong>Investment Strategy:</strong> {selectedEntry.investmentStrategy}
            </p>
            <p className="mb-2">
              <strong>Risk Tolerance:</strong> {selectedEntry.riskTolerance}
            </p>
            <p className="mb-2">
              <strong>Rationale:</strong> {selectedEntry.rationale}
            </p>
            <p className="mb-2">
              <strong>Diversification:</strong> {selectedEntry.diversification}
            </p>
            <p className="mb-2">
              <strong>Expected Outcome:</strong> {selectedEntry.expectedOutcome}
            </p>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentJournal;