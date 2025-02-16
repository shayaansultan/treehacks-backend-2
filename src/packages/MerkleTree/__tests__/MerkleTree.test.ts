import { MerkleTree } from '../MerkleTree';
import { Drug } from '../types';

describe('MerkleTree', () => {
  let merkleTree: MerkleTree;

  beforeEach(() => {
    merkleTree = new MerkleTree();
  });

  const sampleDrugs: Drug[] = [
    { name: 'Aspirin', quantity: 100 },
    { name: 'Ibuprofen', quantity: 50 },
    { name: 'Paracetamol', quantity: 75 },
    { name: 'Amoxicillin', quantity: 30 }
  ];

  test('should build tree and generate root hash', () => {
    const root = merkleTree.buildTree(sampleDrugs);
    expect(root).toBeTruthy();
    expect(typeof root).toBe('string');
    expect(root.length).toBe(64); // SHA-256 hash length in hex
  });

  test('should generate and verify proof for existing drug', () => {
    merkleTree.buildTree(sampleDrugs);
    const proof = merkleTree.generateProof(sampleDrugs[0]);
    
    expect(proof).toBeTruthy();
    expect(merkleTree.verifyProof(proof!)).toBe(true);
  });

  test('should return null proof for non-existent drug', () => {
    merkleTree.buildTree(sampleDrugs);
    const nonExistentDrug: Drug = { name: 'NonExistent', quantity: 0 };
    const proof = merkleTree.generateProof(nonExistentDrug);
    
    expect(proof).toBeNull();
  });

  test('should handle empty drug list', () => {
    const root = merkleTree.buildTree([]);
    expect(root).toBeTruthy();
  });
}); 