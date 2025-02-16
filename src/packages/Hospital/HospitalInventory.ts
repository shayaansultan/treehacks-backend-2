import { MerkleTree } from '../MerkleTree/MerkleTree';
import { Drug, DrugProof } from '../MerkleTree/types';
import { Hospital, InventoryItem, InventoryUpdate } from './types';
import { EigenDAAdapter } from '../EigenDAAdapter';
import { INITIAL_INVENTORY } from '../../data/mockData';

export class HospitalInventory {
  public merkleTree: MerkleTree;
  private inventory: Map<string, InventoryItem>;
  private hospital: Hospital;
  private eigenDA: EigenDAAdapter | undefined;

  constructor(hospital: Hospital, eigenDA: EigenDAAdapter | undefined) {
    this.merkleTree = new MerkleTree();
    this.inventory = new Map();
    this.hospital = hospital;
    this.eigenDA = eigenDA;

    // Load initial inventory if available
    const initialInventory = INITIAL_INVENTORY[hospital.id as keyof typeof INITIAL_INVENTORY];
    if (initialInventory) {
      initialInventory.forEach((drug: { name: string; quantity: number }) => {
        this.inventory.set(drug.name, {
          ...drug,
          lastUpdated: Date.now()
        });
      });
      // Build initial Merkle tree
      this.merkleTree.buildTree(Array.from(this.inventory.values()));
    }
  }

  async updateInventory(updates: InventoryUpdate[]): Promise<string> {
    // Apply updates to inventory
    for (const update of updates) {
      const currentItem = this.inventory.get(update.drug.name);
      
      switch (update.action) {
        case 'add':
          this.inventory.set(update.drug.name, {
            ...update.drug,
            quantity: (currentItem?.quantity || 0) + (update.quantity || 0),
            lastUpdated: Date.now()
          });
          break;
        case 'remove':
          if (currentItem) {
            const newQuantity = currentItem.quantity - (update.quantity || 0);
            if (newQuantity > 0) {
              this.inventory.set(update.drug.name, {
                ...currentItem,
                quantity: newQuantity,
                lastUpdated: Date.now()
              });
            } else {
              this.inventory.delete(update.drug.name);
            }
          }
          break;
        case 'set':
          this.inventory.set(update.drug.name, {
            ...update.drug,
            lastUpdated: Date.now()
          });
          break;
      }
    }

    // Rebuild Merkle tree
    const drugs: Drug[] = Array.from(this.inventory.values());
    const root = this.merkleTree.buildTree(drugs);

    // Store root in EigenDA
    // await this.eigenDA.post({
    //   type: 'hospital_inventory',
    //   hospitalId: this.hospital.id,
    //   root,
    //   timestamp: Date.now()
    // });

    return root;
  }

  async generateDrugProof(drugName: string): Promise<DrugProof | null> {
    const drug = this.inventory.get(drugName);
    if (!drug) return null;

    return this.merkleTree.generateProof(drug);
  }

  async checkDrugAvailability(drugName: string, quantity: number): Promise<boolean> {
    const drug = this.inventory.get(drugName);
    return drug ? drug.quantity >= quantity : false;
  }
} 