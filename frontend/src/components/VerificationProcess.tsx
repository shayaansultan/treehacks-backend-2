import { VerificationStep } from '@/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface VerificationProcessProps {
  steps: VerificationStep[];
  currentStep: number;
}

export default function VerificationProcess({ steps, currentStep }: VerificationProcessProps) {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`bg-white rounded-lg p-4 shadow-sm border ${
              currentStep === index ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
              </div>
              <div className="ml-4">
                {step.status === 'completed' && (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                )}
                {step.status === 'processing' && (
                  <ArrowPathIcon className="w-6 h-6 text-blue-500 animate-spin" />
                )}
                {step.status === 'error' && (
                  <XCircleIcon className="w-6 h-6 text-red-500" />
                )}
                {step.status === 'pending' && (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                )}
              </div>
            </div>
            {currentStep === index && step.status === 'processing' && (
              <motion.div
                className="mt-3 h-1 bg-blue-100 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="h-full w-full bg-blue-500 rounded-full" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 