export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
}

export interface Drug {
  name: string;
  quantity: number;
}

export interface MerkleProof {
  position: 'left' | 'right';
  pairHash: string;
}

export interface DrugProof {
  drug: Drug;
  proofs: MerkleProof[];
  root: string;
} 