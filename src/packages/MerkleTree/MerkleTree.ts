import { MerkleTree as MerkleTreeJS } from 'merkletreejs';
import { SHA256 } from 'crypto-js';
import { Drug, DrugProof } from './types';

export class MerkleTree {
  private tree: MerkleTreeJS;
  private leaves: string[] = [];
  private drugMap: Map<string, Drug> = new Map();

  constructor() {
    this.tree = new MerkleTreeJS([], SHA256);
  }

  private hashData(data: Drug): string {
    return SHA256(`${data.name}:${data.quantity}`).toString();
  }

  buildTree(drugs: Drug[]): string {
    this.drugMap.clear();
    this.leaves = drugs.map(drug => {
      const hash = this.hashData(drug);
      this.drugMap.set(hash, drug);
      return hash;
    });

    this.tree = new MerkleTreeJS(this.leaves, SHA256);
    return this.tree.getRoot().toString('hex');
  }

  generateProof(drug: Drug): DrugProof | null {
    const leaf = this.hashData(drug);
    if (!this.tree.getLeaves().map(l => l.toString('hex')).includes(leaf)) {
      return null;
    }

    const proof = this.tree.getProof(leaf);
    return {
      drug,
      proofs: proof.map(p => ({
        position: p.position === 'right' ? 'right' : 'left',
        pairHash: p.data.toString('hex')
      })),
      root: this.tree.getRoot().toString('hex')
    };
  }

  verifyProof(proof: DrugProof): boolean {
    const leaf = this.hashData(proof.drug);
    const proofArray = proof.proofs.map(p => ({
      position: p.position,
      data: Buffer.from(p.pairHash, 'hex')
    }));

    return this.tree.verify(proofArray, leaf, proof.root);
  }
} 