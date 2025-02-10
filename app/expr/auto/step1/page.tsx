'use client';
import type { NextPage } from 'next';
import { useState } from 'react';

// Define types for profile data
interface PlayerProfileData {
  creditScoreCategory: string;
  savings: number;
  income: number;
  riskAversion: string;
  bonusAmount: number | null;
  emergencyFund: number | null;
}

const PlayerProfile: NextPage = () => {
  const [profileData, setProfileData] = useState<PlayerProfileData>({
    creditScoreCategory: 'Fair',
    savings: 5000,
    income: 2500,
    riskAversion: 'Moderate',
    bonusAmount: null,
    emergencyFund: null,
  });

  const handleCreditScoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileData({ ...profileData, creditScoreCategory: event.target.value });
    console.log("Credit score category selected:", event.target.value); // Simulate sending to backend
  };

  const handleRiskAversionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, riskAversion: event.target.value });
    console.log("Risk aversion selected:", event.target.value); // Simulate sending to backend
  };

  const handleNextClick = () => {
    // Simulate passing profile data to the next page
    console.log('Profile data for next page:', profileData);
    // In a real application, you would likely use useRouter to navigate and pass data.
  };

  // Simulate calculation (for demonstration purposes only)
  const calculateBonusAmount = () => {
    // This is a VERY basic calculation to simulate the bonus amount based on income
    const calculatedBonus = profileData.income * 0.1;
    setProfileData({ ...profileData, bonusAmount: calculatedBonus });
    return calculatedBonus;
  };

  const calculateEmergencyFund = () => {
    // This is a VERY basic calculation to simulate emergency fund based on savings and risk aversion
    let riskMultiplier = 1;
    if (profileData.riskAversion === 'Risk Taker') {
      riskMultiplier = 0.5;
    } else if (profileData.riskAversion === 'Risk Avoider') {
      riskMultiplier = 1.5;
    }

    const calculatedEmergencyFund = profileData.savings * riskMultiplier;
    setProfileData({ ...profileData, emergencyFund: calculatedEmergencyFund });
    return calculatedEmergencyFund;
  };

  return (
    <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='max-w-md mx-auto'>
            {/* Header Section */}
            <div className='flex items-center space-x-5'>
              <div className='h-14 w-14 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-600'>
                {/* Placeholder for icon or avatar */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className='block'>
                <h1 className='font-medium text-gray-700 text-2xl'>Create Your Profile</h1>
              </div>
            </div>

            {/* Form Section */}
            <div className='divide-y divide-gray-200'>
              <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                {/* Credit Score Selection */}
                <div className='relative'>
                  <label htmlFor='creditScore' className='block text-sm font-medium text-gray-700'>
                    Credit Score Category
                  </label>
                  <select
                    id='creditScore'
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    value={profileData.creditScoreCategory}
                    onChange={handleCreditScoreChange}
                  >
                    <option>Poor</option>
                    <option>Fair</option>
                    <option>Good</option>
                    <option>Excellent</option>
                  </select>
                </div>

                {/* Savings and Income Display */}
                <div className='relative'>
                  <label htmlFor='savings' className='block text-sm font-medium text-gray-700'>
                    Savings
                  </label>
                  <input
                    type='text'
                    id='savings'
                    value={`$${profileData.savings}`}
                    readOnly
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  />
                </div>
                <div className='relative'>
                  <label htmlFor='income' className='block text-sm font-medium text-gray-700'>
                    Income
                  </label>
                  <input
                    type='text'
                    id='income'
                    value={`$${profileData.income}`}
                    readOnly
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  />
                </div>

                {/* Risk Aversion Selection */}
                <div className='relative'>
                  <label className='block text-sm font-medium text-gray-700'>Risk Aversion</label>
                  <div className='mt-2 space-y-2'>
                    <div className='flex items-center'>
                      <input
                        id='riskTaker'
                        name='riskAversion'
                        type='radio'
                        value='Risk Taker'
                        checked={profileData.riskAversion === 'Risk Taker'}
                        onChange={handleRiskAversionChange}
                        className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                      />
                      <label htmlFor='riskTaker' className='ml-3 block text-sm font-medium text-gray-700'>
                        Risk Taker
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='moderate'
                        name='riskAversion'
                        type='radio'
                        value='Moderate'
                        checked={profileData.riskAversion === 'Moderate'}
                        onChange={handleRiskAversionChange}
                        className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                      />
                      <label htmlFor='moderate' className='ml-3 block text-sm font-medium text-gray-700'>
                        Moderate
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='riskAvoider'
                        name='riskAversion'
                        type='radio'
                        value='Risk Avoider'
                        checked={profileData.riskAversion === 'Risk Avoider'}
                        onChange={handleRiskAversionChange}
                        className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                      />
                      <label htmlFor='riskAvoider' className='ml-3 block text-sm font-medium text-gray-700'>
                        Risk Avoider
                      </label>
                    </div>
                  </div>
                </div>

                {/* Missing Data Fields */}
                <div className='relative'>
                  <label htmlFor='bonusAmount' className='block text-sm font-medium text-gray-700'>
                    Bonus Amount: ______
                  </label>
                  <input
                    type='text'
                    id='bonusAmount'
                    placeholder='Calculate externally'
                    readOnly
                    value={profileData.bonusAmount !== null ? `$${profileData.bonusAmount.toFixed(2)}` : ''} //Display calculated bonus if available
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    title="Calculate your available emergency fund (bonus amount missing) using your savings and risk factor."
                    onClick={calculateBonusAmount} //Trigger the bonus calculation when the field is clicked
                  />
                </div>

                <div className='relative'>
                  <label htmlFor='emergencyFund' className='block text-sm font-medium text-gray-700'>
                    Emergency Fund Status: ______
                  </label>
                  <input
                    type='text'
                    id='emergencyFund'
                    placeholder='Calculate externally'
                    readOnly
                    value={profileData.emergencyFund !== null ? `$${profileData.emergencyFund.toFixed(2)}` : ''} //Display the calculated emergency fund
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    title="Hint: Based on your savings and risk aversion level."
                    onClick={calculateEmergencyFund} // Trigger emergency fund calculation
                  />
                </div>
              </div>

              {/* Next Button */}
              <div className='pt-4 flex items-center justify-end space-x-4'>
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='button'
                  onClick={handleNextClick}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;