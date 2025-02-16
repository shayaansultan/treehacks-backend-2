import { HospitalInventory } from '../HospitalInventory';
import { EigenDAAdapter } from '../../EigenDAAdapter';
import { Hospital } from '../types';
import { DrugProof } from '../../MerkleTree/types';
import dotenv from 'dotenv';

dotenv.config();

describe('Hospital Inventory Integration Tests', () => {
  let hospitalInventory: HospitalInventory;
  let eigenDA: EigenDAAdapter;
  
  const testHospital: Hospital = {
    id: 'hospital-1',
    name: 'Test Hospital',
    location: 'Test Location'
  };

  beforeAll(async () => {
    try {
      // Initialize with the test environment credentials
      eigenDA = new EigenDAAdapter({
        privateKey: process.env.EIGENDA_PRIVATE_KEY!,
        apiUrl: process.env.EIGENDA_API_URL,
        rpcUrl: process.env.EIGENDA_BASE_RPC_URL, // Note: using BASE_RPC_URL
        creditsContractAddress: process.env.EIGENDA_CREDITS_CONTRACT // Note: using CREDITS_CONTRACT
      });

      console.log('Attempting to initialize EigenDA adapter...');
      await eigenDA.initialize();
      console.log('✅ EigenDA adapter initialized successfully');

      hospitalInventory = new HospitalInventory(testHospital, eigenDA);
    } catch (error: any) {
      console.error('❌ Failed to initialize EigenDA:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  });

  // Simple connection test
  test('should connect to EigenDA', async () => {
    try {
      const balance = await eigenDA.getBalance();
      console.log('Current EigenDA balance:', balance);
      expect(balance).toBeDefined();
    } catch (error: any) {
      console.error('❌ EigenDA connection test failed:', error.message);
      throw error;
    }
  }, 30000); // 30 second timeout

  // Basic inventory test
  test('should handle basic inventory operations', async () => {
    try {
      // Add a drug to inventory
      const updates = [{
        drug: { name: 'TestDrug', quantity: 100 },
        action: 'add' as const
      }];

      console.log('Adding drug to inventory...');
      const root = await hospitalInventory.updateInventory(updates);
      console.log('✅ Merkle root generated:', root);

      // Generate proof
      console.log('Generating proof for TestDrug...');
      const proof = await hospitalInventory.generateDrugProof('TestDrug');
      expect(proof).toBeTruthy();
      console.log('✅ Proof generated successfully');

      // Verify drug availability
      const isAvailable = await hospitalInventory.checkDrugAvailability('TestDrug', 50);
      expect(isAvailable).toBe(true);
      console.log('✅ Drug availability verified');

    } catch (error: any) {
      console.error('❌ Test failed:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }, 60000); // 60 second timeout
}); 