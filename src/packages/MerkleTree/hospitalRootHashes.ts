export const HOSPITAL_ROOT_HASHES = {
  "Stanford Hospital": "2eeaa423a92f60a976ed84553d22f49e9bf27720e710791b9abb8c4306717a29",
  "UCSF Medical Center": "9e8cc06863933157db710f0704548a8a5f3f0bc6ed09df88583e1aa9c2e70a83",
  "Santa Clara Valley Medical Center": "34cfc6b592b5cd0d1364ee7a1a5cb1dde42efc166aa3e52ed8cb54c070326ec1",
  "El Camino Hospital": "9189ab6e3653f17b6a01f8aaf58c9edc72292376d4f92ad3640583f4a2ed31a4",
  "Kaiser Permanente San Francisco": "38c87aa34cc29b3866118c7742306dc3dc81050f78796fc5750f9709d0f7b77f",
  "Zuckerberg San Francisco General Hospital": "d8d7ce1cd8729940fe92a5a0c56a6bba0adda8a366b507b80ddee506ee62aba9",
  "Good Samaritan Hospital": "61928623f6e39d765e4a2d0d722e7ff51fbe04387b3077ff2512ff523113f3c3",
  "Sequoia Hospital": "bfed4f5f8debf8db8fe4b14953034dc392ac1b260183288d9a453424c3639cf0",
  "Regional Medical Center of San Jose": "bc64709eee9bc10a2e8ea5e8b4cac69ea6803a6c3d10590fa2c987dca8bd2da2",
  "John Muir Medical Center": "83f7db3ab17701cf901ece9909017a3b48a5656f77b399035b89b2fa427f5d0d"
} as const;

// Proofs for each hospital's drugs
export const HOSPITAL_PROOFS = {
  "Stanford Hospital": {
    "Gabapentin": {
      proofs: [
        { position: "right", pairHash: "8bf731bf7fc9da69617a6f1b4665550a7371cf5d3806bbf0dd8601fbc2c1287c" },
        { position: "right", pairHash: "8822adbdf9108dd418f90c037578ebba1109b12f9e9205339eac51dbe850e2c8" },
        { position: "right", pairHash: "953c5fb18b2b36441697a4b1d9dd1c7f75dd8e89ad4a7b68cbc9d428b2743d4d" }
      ],
      root: "2eeaa423a92f60a976ed84553d22f49e9bf27720e710791b9abb8c4306717a29"
    },
    "Prednisone": {
      proofs: [
        { position: "left", pairHash: "9cb6ccdd821c770474262e91e055fe0eee874ec7f4ee93e0258482b708482c4b" },
        { position: "right", pairHash: "8822adbdf9108dd418f90c037578ebba1109b12f9e9205339eac51dbe850e2c8" },
        { position: "right", pairHash: "953c5fb18b2b36441697a4b1d9dd1c7f75dd8e89ad4a7b68cbc9d428b2743d4d" }
      ],
      root: "2eeaa423a92f60a976ed84553d22f49e9bf27720e710791b9abb8c4306717a29"
    },
    "Albuterol inhalation solution": {
      proofs: [
        { position: "right", pairHash: "a3d756b0a91aed27a8438d6c9e16f2b51c7b68fa2f6cdc4d5b8715d77b9eab87" },
        { position: "left", pairHash: "d04e93b7b6dde89f6ca2634310b04e0fa39c5db0c8a8a85523e9c0aaf71af285" },
        { position: "right", pairHash: "953c5fb18b2b36441697a4b1d9dd1c7f75dd8e89ad4a7b68cbc9d428b2743d4d" }
      ],
      root: "2eeaa423a92f60a976ed84553d22f49e9bf27720e710791b9abb8c4306717a29"
    },
    "Amoxicillin": {
      proofs: [
        { position: "left", pairHash: "450dbd9f389b15601036a4000d9f95a3ce8c66ff65607a51e51735a425c91329" },
        { position: "left", pairHash: "d04e93b7b6dde89f6ca2634310b04e0fa39c5db0c8a8a85523e9c0aaf71af285" },
        { position: "right", pairHash: "953c5fb18b2b36441697a4b1d9dd1c7f75dd8e89ad4a7b68cbc9d428b2743d4d" }
      ],
      root: "2eeaa423a92f60a976ed84553d22f49e9bf27720e710791b9abb8c4306717a29"
    },
    "Morphine": {
      proofs: [
        { position: "left", pairHash: "dbe800695a098adb522567a6bc6ab00fde26577ef86ce3d87fad702986319eb3" }
      ],
      root: "2eeaa423a92f60a976ed84553d22f49e9bf27720e710791b9abb8c4306717a29"
    }
  },
  "UCSF Medical Center": {
    "Gabapentin": {
      proofs: [
        { position: "right", pairHash: "c80ef9bd210dae330c2db5d1031a4b29f8bdf495e7dc4ea42af2e6fa6ac67a4a" },
        { position: "right", pairHash: "ce3f46c4e5fc6da4a557f4559e5d7649fb3b2c7d05ae55ce6c5ce9254611a774" },
        { position: "right", pairHash: "16ff96066d72e757741d6119695bd8ca1bd70b302713d8c66c962014fbd7ebe3" }
      ],
      root: "9e8cc06863933157db710f0704548a8a5f3f0bc6ed09df88583e1aa9c2e70a83"
    },
    "Azithromycin": {
      proofs: [
        { position: "left", pairHash: "9cb6ccdd821c770474262e91e055fe0eee874ec7f4ee93e0258482b708482c4b" },
        { position: "right", pairHash: "ce3f46c4e5fc6da4a557f4559e5d7649fb3b2c7d05ae55ce6c5ce9254611a774" },
        { position: "right", pairHash: "16ff96066d72e757741d6119695bd8ca1bd70b302713d8c66c962014fbd7ebe3" }
      ],
      root: "9e8cc06863933157db710f0704548a8a5f3f0bc6ed09df88583e1aa9c2e70a83"
    },
    "Tramadol": {
      proofs: [
        { position: "right", pairHash: "f3565016564512145e2f36d39095070312159dabcc3d62321468d280387f2cf5" },
        { position: "left", pairHash: "b31e5b47976afb03e42e0ed77dc34930ca7175d32564965ac211a7a82aa91667" },
        { position: "right", pairHash: "16ff96066d72e757741d6119695bd8ca1bd70b302713d8c66c962014fbd7ebe3" }
      ],
      root: "9e8cc06863933157db710f0704548a8a5f3f0bc6ed09df88583e1aa9c2e70a83"
    },
    "Pantoprazole": {
      proofs: [
        { position: "left", pairHash: "21babee74f3ef8fadf4c399935de98dadce81455c1bad9eea0b786a661049f63" },
        { position: "left", pairHash: "b31e5b47976afb03e42e0ed77dc34930ca7175d32564965ac211a7a82aa91667" },
        { position: "right", pairHash: "16ff96066d72e757741d6119695bd8ca1bd70b302713d8c66c962014fbd7ebe3" }
      ],
      root: "9e8cc06863933157db710f0704548a8a5f3f0bc6ed09df88583e1aa9c2e70a83"
    },
    "Ondansetron": {
      proofs: [
        { position: "left", pairHash: "befb106809c4a96dd9b2a148b59e94ad5d52bf12fc7dc380888f8599413ccc35" }
      ],
      root: "9e8cc06863933157db710f0704548a8a5f3f0bc6ed09df88583e1aa9c2e70a83"
    }
  }
} as const;

// Types
export type HospitalName = keyof typeof HOSPITAL_ROOT_HASHES;
// export type DrugName = keyof (typeof HOSPITAL_PROOFS)[HospitalName];

// Interface for proof structure
export interface MerkleProof {
  position: 'left' | 'right';
  pairHash: string;
}

export interface DrugProof {
  proofs: MerkleProof[];
  root: string;
} 