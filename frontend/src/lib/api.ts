import axios from 'axios';
import { DrugAvailability, HospitalSearchResults } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://treehacks-backend-2.onrender.com',
});

export async function checkStanfordDrugAvailability(drugName: string): Promise<DrugAvailability> {
  const response = await api.get(`/api/inventory/stanford/check/${drugName}`);
  return response.data;
}

export async function searchOtherHospitals(drugName: string): Promise<HospitalSearchResults> {
  const response = await api.get(`/api/inventory/search/other-hospitals/${drugName}`);
  return response.data;
} 