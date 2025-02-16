import express, { Request, Response, RequestHandler } from 'express';
import { HospitalInventory } from '../packages/Hospital/HospitalInventory';
import { EigenDAAdapter } from '../packages/EigenDAAdapter';
import { Hospital, InventoryUpdate } from '../packages/Hospital/types';
import { HOSPITALS } from '../data/mockData';

const router = express.Router();

// Initialize multiple hospital inventories
const hospitalInventories = new Map<string, HospitalInventory>();

// Initialize EigenDA adapter
const eigenDAAdapter = new EigenDAAdapter({
  apiUrl: process.env.EIGENDA_API_URL as string,
  rpcUrl: process.env.EIGENDA_BASE_RPC_URL as string,
  privateKey: process.env.EIGENDA_PRIVATE_KEY as string,
  creditsContractAddress: process.env.EIGENDA_CREDITS_CONTRACT as string,
});

// Initialize all hospitals
HOSPITALS.forEach(hospital => {
  hospitalInventories.set(hospital.id, new HospitalInventory(hospital, eigenDAAdapter));
});

// Get all hospitals
router.get('/hospitals', (req, res) => {
  res.json({ success: true, hospitals: HOSPITALS });
});

// Get hospital inventory
router.get('/hospital/:hospitalId', (req, res) => {
  const inventory = hospitalInventories.get(req.params.hospitalId);
  if (!inventory) {
    return res.status(404).json({ success: false, error: 'Hospital not found' });
  }
  res.json({ success: true, inventory });
});

// Update inventory for specific hospital
router.post('/hospital/:hospitalId/update', async (req, res) => {
  const inventory = hospitalInventories.get(req.params.hospitalId);
  if (!inventory) {
    return res.status(404).json({ success: false, error: 'Hospital not found' });
  }

  try {
    const updates = req.body.updates;
    const root = await inventory.updateInventory(updates);
    res.json({ success: true, root });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate proof for a drug in specific hospital
router.get('/hospital/:hospitalId/proof/:drugName', async (req, res) => {
  const inventory = hospitalInventories.get(req.params.hospitalId);
  if (!inventory) {
    return res.status(404).json({ success: false, error: 'Hospital not found' });
  }

  try {
    const proof = await inventory.generateDrugProof(req.params.drugName);
    if (!proof) {
      return res.status(404).json({ success: false, error: 'Drug not found' });
    }
    res.json({ success: true, proof });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 