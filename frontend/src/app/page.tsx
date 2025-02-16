'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { checkStanfordDrugAvailability, searchOtherHospitals } from '@/lib/api';
import { Hospital, ProcessState, VerificationStep } from '@/types';
import VerificationProcess from '@/components/VerificationProcess';

const initialSteps: VerificationStep[] = [
  {
    id: 1,
    title: 'Initializing EigenDA Connection',
    description: 'Establishing secure connection to the EigenDA network...',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Generating Zero-Knowledge Proof',
    description: 'Creating a ZK proof for secure drug availability verification...',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Verifying Hospital Merkle Tree',
    description: 'Validating hospital inventory data integrity...',
    status: 'pending'
  },
  {
    id: 4,
    title: 'Processing Trust-Less Query',
    description: 'Executing privacy-preserving inventory search...',
    status: 'pending'
  }
];

export default function Home() {
  const [drugName, setDrugName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stanfordAvailability, setStanfordAvailability] = useState<boolean | null>(null);
  const [otherHospitals, setOtherHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processState, setProcessState] = useState<ProcessState>({
    currentStep: -1,
    steps: initialSteps,
    isComplete: false
  });

  const updateStep = (stepIndex: number, status: VerificationStep['status']) => {
    setProcessState(prev => ({
      ...prev,
      steps: prev.steps.map((step, idx) => 
        idx === stepIndex ? { ...step, status } : step
      )
    }));
  };

  const simulateVerificationProcess = async () => {
    // Step 1: EigenDA Connection
    setProcessState(prev => ({ ...prev, currentStep: 0 }));
    updateStep(0, 'processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStep(0, 'completed');

    // Step 2: ZK Proof Generation
    setProcessState(prev => ({ ...prev, currentStep: 1 }));
    updateStep(1, 'processing');
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateStep(1, 'completed');

    // Step 3: Merkle Tree Verification
    setProcessState(prev => ({ ...prev, currentStep: 2 }));
    updateStep(2, 'processing');
    await new Promise(resolve => setTimeout(resolve, 2500));
    updateStep(2, 'completed');

    // Step 4: Query Processing
    setProcessState(prev => ({ ...prev, currentStep: 3 }));
    updateStep(3, 'processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStep(3, 'completed');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName.trim()) return;

    setIsLoading(true);
    setError(null);
    setStanfordAvailability(null);
    setOtherHospitals([]);
    
    try {
      // Start verification process
      await simulateVerificationProcess();

      // Actual API calls
      const [stanfordResult, otherHospitalsResult] = await Promise.all([
        checkStanfordDrugAvailability(drugName),
        searchOtherHospitals(drugName)
      ]);

      setStanfordAvailability(stanfordResult.available);
      setOtherHospitals(otherHospitalsResult.results);
      setProcessState(prev => ({ ...prev, isComplete: true }));
    } catch (err) {
      setError('Failed to fetch drug availability. Please try again.');
      console.error(err);
      // Mark all remaining steps as error
      setProcessState(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => ({
          ...step,
          status: idx <= prev.currentStep ? 'error' : 'pending'
        }))
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Secure Hospital Drug Verification
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Privacy-preserving drug availability search powered by EigenDA and ZK-PTLS
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto">
          <div className="flex shadow-sm rounded-md">
            <input
              type="text"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              placeholder="Enter drug name..."
              className="block w-full rounded-l-md border-0 py-3 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400"
            >
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              {isLoading ? 'Verifying...' : 'Search'}
            </button>
          </div>
        </form>

        {processState.currentStep >= 0 && (
          <VerificationProcess
            steps={processState.steps}
            currentStep={processState.currentStep}
          />
        )}

        {error && (
          <div className="mt-6 text-center text-red-600">
            {error}
          </div>
        )}

        {stanfordAvailability !== null && !error && processState.isComplete && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Verified Results</h2>
            
            <div className="bg-white shadow rounded-lg p-6 mb-6 transform transition-all duration-500 hover:shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Stanford Hospital</h3>
              <p className={`text-lg ${stanfordAvailability ? 'text-green-600' : 'text-red-600'}`}>
                {stanfordAvailability ? '✓ Drug is available' : '✗ Drug is not available'}
              </p>
            </div>

            {otherHospitals.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6 transform transition-all duration-500 hover:shadow-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Other Hospitals</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {otherHospitals.map((hospital) => (
                    <div
                      key={hospital.hospitalId}
                      className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-blue-500"
                    >
                      <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">{hospital.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherHospitals.length === 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">No other hospitals have this drug available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
