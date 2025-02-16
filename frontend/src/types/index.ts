export interface Hospital {
  hospitalId: string;
  name: string;
  location: string;
}

export interface DrugAvailability {
  success: boolean;
  available: boolean;
}

export interface HospitalSearchResults {
  success: boolean;
  results: Hospital[];
}

export type VerificationStep = {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
};

export type ProcessState = {
  currentStep: number;
  steps: VerificationStep[];
  isComplete: boolean;
  error?: string;
}; 