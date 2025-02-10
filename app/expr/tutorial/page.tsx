// app/tutorial/[role]/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TutorialStep {
  title: string;
  content: React.ReactNode;
  image?: string; // URL or path to the image
  interactiveComponent?: React.ReactNode;
}

interface TutorialLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

const TutorialLayout: React.FC<TutorialLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-semibold mb-4">Step {currentStep + 1}:</h2>
        {children}
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const TutorialSection: React.FC<{ step: TutorialStep }> = ({ step }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
      {step.image && (
        <div className="mb-4">
          <Image
            src={step.image}
            alt={step.title}
            width={500}
            height={300}
            className="rounded-md"
            style={{maxWidth: '100%', height: 'auto'}}
          />
        </div>
      )}
      <div className="mb-4">{step.content}</div>
      {step.interactiveComponent && <div>{step.interactiveComponent}</div>}
    </div>
  );
};

// Buyer Tutorial Content
const BuyerTutorialContent: React.FC = () => {
  const buyerTutorialSteps: TutorialStep[] = [
    {
      title: 'Understanding Your Dashboard',
      content: (
        <p>
          The Buyer Dashboard provides an overview of your current financial
          situation, including your credit score and available budget.
        </p>
      ),
      image: '/images/buyer_dashboard.png', // Replace with actual image path
    },
    {
      title: 'Using the Loan Calculator',
      content: (
        <p>
          Use the loan calculator to estimate your monthly payments based on the
          loan amount, interest rate, and loan term.
        </p>
      ),
      interactiveComponent: <p>Loan calculator interactive component goes here</p>
    },
    {
      title: 'Making Informed Decisions',
      content: (
        <p>
          Carefully consider all factors before making a purchase decision.
          Don't overextend yourself financially!
        </p>
      ),
    },
  ];

  return buyerTutorialSteps.map((step, index) => (
    <TutorialSection key={index} step={step} />
  ));
};

// Banker Tutorial Content
const BankerTutorialContent: React.FC = () => {
  const bankerTutorialSteps: TutorialStep[] = [
    {
      title: 'Assessing Loan Applications',
      content: (
        <p>
          As a banker, your main task is to assess loan applications and determine
          appropriate interest rates based on the applicant's risk profile.
        </p>
      ),
      image: '/images/banker_dashboard.png', // Replace with actual image path
    },
    {
      title: 'Setting Interest Rates',
      content: (
        <p>
          Consider the applicant's credit score, income, and debt-to-income ratio
          when setting the interest rate.
        </p>
      ),
    },
    {
      title: 'Managing Risk',
      content: (
        <p>
          It is essential to properly manage the risk to the bank. Setting appropriate interest rates can help to manage that risk.
        </p>
      ),
    },
  ];
  return bankerTutorialSteps.map((step, index) => (
    <TutorialSection key={index} step={step} />
  ));
};

// Dealer Tutorial Content
const DealerTutorialContent: React.FC = () => {
  const dealerTutorialSteps: TutorialStep[] = [
    {
      title: 'Managing Inventory',
      content: (
        <p>
          As a car dealer, you must properly manage your car inventory to maximize profits.
        </p>
      ),
      image: '/images/dealer_dashboard.png', // Replace with actual image path
    },
    {
      title: 'Setting Car Prices',
      content: (
        <p>
         Consider the current interest rates, customer demand, and available stock levels. 
        </p>
      ),
    },
    {
      title: 'Maximizing Profits',
      content: (
        <p>
          Setting a price that attracts customers while retaining good profits is the key to succeeding as a car dealer.
        </p>
      ),
    },
  ];
  return dealerTutorialSteps.map((step, index) => (
    <TutorialSection key={index} step={step} />
  ));
};

interface TutorialPageProps {
    params: { role: string };
}

const TutorialPage: React.FC<TutorialPageProps> = ({ params }) => {
  const { role } = params;
  let tutorialContent: React.FC;

  switch (role) {
    case 'buyer':
      tutorialContent = BuyerTutorialContent;
      break;
    case 'banker':
      tutorialContent = BankerTutorialContent;
      break;
    case 'dealer':
      tutorialContent = DealerTutorialContent;
      break;
    default:
      return <p>Invalid role selected.</p>;
  }

  const steps = (tutorialContent as any)().props.children;
  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <TutorialLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
     {steps[currentStep]}
    </TutorialLayout>
  );
};

export default TutorialPage;