import crypto from 'crypto';
import { MerkleNode, Drug, MerkleProof, DrugProof } from './types';

export class MerkleTree {
  private root: MerkleNode | null = null;
  private leaves: MerkleNode[] = [];

  constructor() {}

  private hashData(data: Drug): string {
    const stringData = `${data.name}:${data.quantity}`;
    return crypto.createHash('sha256').update(stringData).digest('hex');
  }

  private hashPair(left: string, right: string): string {
    const combined = left + right;
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  buildTree(drugs: Drug[]): string {
    // Create leaf nodes
    this.leaves = drugs.map(drug => ({
      hash: this.hashData(drug)
    }));

    // If no drugs, return empty hash
    if (this.leaves.length === 0) {
      this.root = { hash: this.hashPair('', '') };
      return this.root.hash;
    }

    // Build tree level by level
    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      const nextLevel: MerkleNode[] = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const leftNode = currentLevel[i];
        const rightNode = i + 1 < currentLevel.length 
          ? currentLevel[i + 1] 
          : currentLevel[i]; // Duplicate last node if odd number

        const parentNode: MerkleNode = {
          hash: this.hashPair(leftNode.hash, rightNode.hash),
          left: leftNode,
          right: rightNode
        };

        nextLevel.push(parentNode);
      }

      currentLevel = nextLevel;
    }

    this.root = currentLevel[0];
    return this.root.hash;
  }

  generateProof(drug: Drug): DrugProof | null {
    const targetHash = this.hashData(drug);
    const proofs: MerkleProof[] = [];
    
    // Find the leaf node
    let currentNode = this.leaves.find(leaf => leaf.hash === targetHash);
    if (!currentNode) {
      return null;
    }

    // Traverse up the tree
    let current = currentNode;
    let parent = this.findParent(current);

    while (parent) {
      const isLeft = parent.left === current;
      proofs.push({
        position: isLeft ? 'right' : 'left',
        pairHash: isLeft ? parent.right!.hash : parent.left!.hash
      });

      current = parent;
      parent = this.findParent(current);
    }

    return {
      drug,
      proofs,
      root: this.root!.hash
    };
  }

  private findParent(node: MerkleNode): MerkleNode | null {
    const findParentRecursive = (current: MerkleNode): MerkleNode | null => {
      if (!current.left && !current.right) return null;
      if (current.left === node || current.right === node) return current;

      const leftResult = current.left ? findParentRecursive(current.left) : null;
      if (leftResult) return leftResult;

      return current.right ? findParentRecursive(current.right) : null;
    };

    return this.root ? findParentRecursive(this.root) : null;
  }

  verifyProof(proof: DrugProof): boolean {
    let currentHash = this.hashData(proof.drug);

    for (const p of proof.proofs) {
      currentHash = p.position === 'left'
        ? this.hashPair(p.pairHash, currentHash)
        : this.hashPair(currentHash, p.pairHash);
    }

    return currentHash === proof.root;
  }
} 