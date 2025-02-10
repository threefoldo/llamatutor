'use client';
import type { NextPage } from 'next';
import { useState } from 'react';

// Define types for form data
interface DecisionFormData {
  car: string;
  financing: string;
  tco: number;
  interest: number;
  affordability: string;
}

const DecisionPage: NextPage = () => {
  // State for form data
  const [formData, setFormData] = useState<DecisionFormData>({
    car: 'Used Honda Civic', // Default value
    financing: 'Cash', // Default value
    tco: 0,
    interest: 0,
    affordability: '',
  });

  // Event handler for form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Event handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to an API
    console.log('Form data submitted:', formData);

    // Placeholder for navigation to Feedback Page
    alert('Decision submitted! (Navigating to Feedback Page - Placeholder)');
  };

  return (
    <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      {/* Main container */}
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative bg-white shadow-lg sm:rounded-3xl p-5'>
          {/* Header Section */}
          <header className='text-center mb-6'>
            <h1 className='text-2xl font-bold text-gray-800'>Your Decision</h1>
            <p className='text-gray-600'>Document your chosen option and calculations.</p>
          </header>

          {/* Main Content Section */}
          <main>
            {/* Form Section */}
            <form className='space-y-4' onSubmit={handleSubmit}>
              {/* Car Selection */}
              <div>
                <label htmlFor='car' className='block text-sm font-medium text-gray-700'>
                  Chosen Car
                </label>
                <select
                  id='car'
                  className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  value={formData.car}
                  onChange={handleChange}
                >
                  <option>Used Honda Civic</option>
                  <option>New BMW 3 Series</option>
                  <option>Vehicle Option Placeholder</option>
                </select>
              </div>

              {/* Financing Option */}
              <div>
                <label htmlFor='financing' className='block text-sm font-medium text-gray-700'>
                  Financing Option
                </label>
                <select
                  id='financing'
                  className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  value={formData.financing}
                  onChange={handleChange}
                >
                  <option>Cash</option>
                  <option>Loan</option>
                  <option>Lease</option>
                </select>
              </div>

              {/* TCO Input */}
              <div>
                <label htmlFor='tco' className='block text-sm font-medium text-gray-700'>
                  Total Cost of Ownership (TCO)
                </label>
                <input
                  type='number'
                  id='tco'
                  className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  placeholder='Enter TCO'
                  value={formData.tco}
                  onChange={handleChange}
                />
              </div>

              {/* Total Interest Paid Input */}
              <div>
                <label htmlFor='interest' className='block text-sm font-medium text-gray-700'>
                  Total Interest Paid
                </label>
                <input
                  type='number'
                  id='interest'
                  className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  placeholder='Enter Total Interest'
                  value={formData.interest}
                  onChange={handleChange}
                />
              </div>

              {/* Affordability Input */}
              <div>
                <label htmlFor='affordability' className='block text-sm font-medium text-gray-700'>
                  Affordability Metrics (e.g., Monthly Payment as % of Income)
                </label>
                <input
                  type='text'
                  id='affordability'
                  className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  placeholder='Enter Affordability Metrics'
                  value={formData.affordability}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type='submit'
                  className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Submit Decision
                </button>
              </div>
            </form>
          </main>

          {/* Footer Section (Optional) */}
          <footer className='mt-6 text-center text-gray-500'>
            <p>&copy; 2023 Wheels & Deals</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DecisionPage;