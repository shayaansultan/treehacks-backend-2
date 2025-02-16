import { Drug } from "../MerkleTree/types";

export interface Hospital {
  id: string;
  name: string;
  location: string;
}

export interface InventoryItem extends Drug {
  lastUpdated: number;
}

export interface InventoryUpdate {
  drug: Drug;
  action: 'add' | 'remove' | 'set';
  quantity?: number;
} 