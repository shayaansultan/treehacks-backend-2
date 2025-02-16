import { HospitalInventory } from '../HospitalInventory';
import { EigenDAAdapter } from '../../EigenDAAdapter';
import { Hospital } from '../types';

jest.mock('../../EigenDAAdapter');

describe('HospitalInventory', () => {
  let hospitalInventory: HospitalInventory;
  let mockEigenDA: jest.Mocked<EigenDAAdapter>;

  const testHospital: Hospital = {
    id: 'test-hospital',
    name: 'Test Hospital',
    location: 'Test Location'
  };

  beforeEach(() => {
    mockEigenDA = new EigenDAAdapter({
      privateKey: 'test-key'
    }) as jest.Mocked<EigenDAAdapter>;
    hospitalInventory = new HospitalInventory(testHospital, mockEigenDA);
  });

  test('should update inventory and generate merkle root', async () => {
    const updates = [{
      drug: { name: 'Aspirin', quantity: 100 },
      action: 'add' as const
    }];

    const root = await hospitalInventory.updateInventory(updates);
    expect(root).toBeTruthy();
    expect(mockEigenDA.post).toHaveBeenCalled();
  });

  test('should generate proof for existing drug', async () => {
    await hospitalInventory.updateInventory([{
      drug: { name: 'Aspirin', quantity: 100 },
      action: 'add' as const
    }]);

    const proof = await hospitalInventory.generateDrugProof('Aspirin');
    expect(proof).toBeTruthy();
  });
}); 