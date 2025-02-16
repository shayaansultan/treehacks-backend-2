import { MerkleTree } from './MerkleTree';
import { Drug } from './types';

const inventory = {
    "Stanford Hospital": [
      { name: "Gabapentin", quantity: 120 },
      { name: "Prednisone", quantity: 90 },
      { name: "Albuterol inhalation solution", quantity: 150 },
      { name: "Amoxicillin", quantity: 200 },
      { name: "Morphine", quantity: 50 }
    ],
    "UCSF Medical Center": [
      { name: "Gabapentin", quantity: 85 },
      { name: "Azithromycin", quantity: 180 },
      { name: "Tramadol", quantity: 95 },
      { name: "Pantoprazole", quantity: 130 },
      { name: "Ondansetron", quantity: 75 }
    ],
    "Santa Clara Valley Medical Center": [
      { name: "Albuterol inhalation solution", quantity: 175 },
      { name: "Prednisone", quantity: 80 },
      { name: "Amoxicillin and potassium clavulanate", quantity: 160 },
      { name: "Clonazepam", quantity: 70 },
      { name: "Morphine", quantity: 40 }
    ],
    "El Camino Hospital": [
      { name: "Azithromycin", quantity: 110 },
      { name: "Amphetamine salt combo extended-release", quantity: 65 },
      { name: "Tramadol", quantity: 100 },
      { name: "Pantoprazole", quantity: 140 },
      { name: "Gabapentin", quantity: 95 }
    ],
    "Kaiser Permanente San Francisco": [
      { name: "Amoxicillin", quantity: 190 },
      { name: "Albuterol inhalation solution", quantity: 160 },
      { name: "Prednisone", quantity: 75 },
      { name: "Clonazepam", quantity: 60 },
      { name: "Morphine", quantity: 55 }
    ],
    "Zuckerberg San Francisco General Hospital": [
      { name: "Gabapentin", quantity: 105 },
      { name: "Azithromycin", quantity: 95 },
      { name: "Pantoprazole", quantity: 115 },
      { name: "Tramadol", quantity: 90 },
      { name: "Ondansetron", quantity: 85 }
    ],
    "Good Samaritan Hospital": [
      { name: "Albuterol inhalation solution", quantity: 135 },
      { name: "Amoxicillin and potassium clavulanate", quantity: 120 },
      { name: "Morphine", quantity: 45 },
      { name: "Clonazepam", quantity: 80 },
      { name: "Prednisone", quantity: 70 }
    ],
    "Sequoia Hospital": [
      { name: "Azithromycin", quantity: 125 },
      { name: "Tramadol", quantity: 85 },
      { name: "Pantoprazole", quantity: 135 },
      { name: "Gabapentin", quantity: 100 },
      { name: "Ondansetron", quantity: 60 }
    ],
    "Regional Medical Center of San Jose": [
      { name: "Amoxicillin", quantity: 175 },
      { name: "Morphine", quantity: 50 },
      { name: "Albuterol inhalation solution", quantity: 145 },
      { name: "Azithromycin", quantity: 130 },
      { name: "Amphetamine salt combo extended-release", quantity: 55 }
    ],
    "John Muir Medical Center": [
      { name: "Gabapentin", quantity: 90 },
      { name: "Tramadol", quantity: 110 },
      { name: "Pantoprazole", quantity: 120 },
      { name: "Prednisone", quantity: 95 },
      { name: "Ondansetron", quantity: 70 }
    ]
  };
  
// Function to generate Merkle tree root hash for a hospital
function generateHospitalRootHash(hospitalName: string, drugs: Drug[]): string {
  const merkleTree = new MerkleTree();
  
  // Modify drugs to only use names for hashing
  const simplifiedDrugs = drugs.map(drug => ({
    name: drug.name,
    quantity: 0  // Set to 0 since we're only using names
  }));

  // Build the tree and return root hash
  return merkleTree.buildTree(simplifiedDrugs);
}

// Generate root hashes for all hospitals
function generateAllHospitalRootHashes() {
  // Store root hashes in a simple map
  const hospitalRootHashes: { [hospital: string]: string } = {};

  Object.entries(inventory).forEach(([hospitalName, drugs]) => {
    hospitalRootHashes[hospitalName] = generateHospitalRootHash(hospitalName, drugs);
  });

  // Output the root hashes in a clean format
  console.log('\nHospital Root Hashes:');
  console.log(JSON.stringify(hospitalRootHashes, null, 2));
  
  return hospitalRootHashes;
}

// Run the generation
const rootHashes = generateAllHospitalRootHashes();
  