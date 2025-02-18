# Meta-Ledger
MediLedger is all about collaboration: providing a decentralized platform on which hospitals can more securely and confidently transmit sensitive data. Our system enables hospitals to securely check drug availability at other hospitals without exposing full inventory details on both ends.

Instead of storing a simple list of drugs, each hospital stores its own inventory in a Merkle tree, where each leaf node contains a cryptographic hash of a drug name and quantity. The Merkle root (a compact summary of the entire inventory) is then submitted to EigenDA, a decentralized data availability layer. EigenDA allows hospitals to store inventory commitments on-chain without revealing individual stock details and ensures data integrity—any change in inventory changes the Merkle root, which prevents tampering.

When a hospital needs a drug, the AI agent first checks the local hospital’s inventory. If the drug is out of stock or the supply is trending low, the AI agent fetches Merkle roots of nearby hospitals from EigenDA using Zero-Knowledge Proofs (zkProof) and the provided Merkle trees. The hospitals that have the requested drug generate a Merkle proof, which extracts the leaf node (hashed drug and quantity) from the Merkle tree, includes all necessary sibling hashes to allow recomputation of the Merkle root, and ensures the proof matches the stored Merkle root on EigenDA. The system then outputs a list of hospitals whose Merkle proofs have been validated, thus proving they have the drug in stock.

Backend Dev (Express, Node, TypeScript): Shayaan and Cynthia <br>
Frontend (FlutterFlow): Taarush <br>
Biotech Technicals & Slides: Bernardo
