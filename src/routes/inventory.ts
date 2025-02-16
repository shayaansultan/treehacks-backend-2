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

// Check if a drug is available at Stanford Hospital
router.get('/stanford/check/:drugName', async (req, res) => {
  const stanfordInventory = hospitalInventories.get('stanford-hospital');
  if (!stanfordInventory) {
    return res.status(500).json({ 
      success: false, 
      error: 'Stanford Hospital inventory not initialized' 
    });
  }

  const drugName = req.params.drugName;
  const isAvailable = await stanfordInventory.checkDrugAvailability(drugName, 1);

  return res.json({
    success: true,
    available: isAvailable
  });
});

// Search for a drug at hospitals other than Stanford
router.get('/search/other-hospitals/:drugName', async (req, res) => {
  const drugName = req.params.drugName;
  const availableHospitals: Array<{ hospitalId: string; name: string; location: string }> = [];

  for (const [hospitalId, inventory] of hospitalInventories) {
    // Skip Stanford Hospital
    if (hospitalId === 'stanford-hospital') continue;

    try {
      const isAvailable = await inventory.checkDrugAvailability(drugName, 1);
      if (isAvailable) {
        // Find the hospital info from HOSPITALS array
        const hospitalInfo = HOSPITALS.find(h => h.id === hospitalId);
        if (hospitalInfo) {
          availableHospitals.push({
            hospitalId: hospitalInfo.id,
            name: hospitalInfo.name,
            location: hospitalInfo.location
          });
        }
      }
    } catch (error) {
      console.error(`Error checking hospital ${hospitalId}:`, error);
      continue;
    }
  }

  return res.json({
    success: true,
    results: availableHospitals
  });
});

export default router; 