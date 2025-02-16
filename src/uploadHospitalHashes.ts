import { EigenDAClient } from 'eigenda-sdk';
import dotenv from 'dotenv';
import { HOSPITAL_ROOT_HASHES } from './packages/MerkleTree/hospitalRootHashes';
import fs from 'fs';

// Define the API response type
interface ApiUploadResponse {
  job_id: string;
  message: string;
  request_id: string;
  status: string;
}

// Load environment variables from .env file
dotenv.config();

const RETRY_DELAY = 30000; // 30 seconds
const MIN_BALANCE = 0.0005; // 0.0005 ETH minimum balance
const TOP_UP_AMOUNT = 0.001; // 0.001 ETH top up amount
const MAX_STATUS_CHECKS = 60; // Maximum number of status checks before giving up

// Sleep utility function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  // Initialize the client
  const client = new EigenDAClient({
    apiUrl: process.env.EIGENDA_API_URL,
    rpcUrl: process.env.EIGENDA_BASE_RPC_URL,
    privateKey: process.env.EIGENDA_PRIVATE_KEY as string,
  });

  try {
    // Get or create identifier
    let identifier;
    const existingIdentifiers = await client.getIdentifiers();
    if (existingIdentifiers.length > 0) {
      identifier = existingIdentifiers[0];
    } else {
      identifier = await client.createIdentifier();
    }

    // Check and top up balance if needed
    const balance = await client.getBalance(identifier);
    console.log('\nCurrent balance:', balance, 'ETH');

    if (balance < MIN_BALANCE) {
      console.log(`Balance is low (${balance} ETH). Attempting to top up with ${TOP_UP_AMOUNT} ETH...`);
      try {
        const topupResult = await client.topupCredits(identifier, TOP_UP_AMOUNT);
        console.log('Top-up successful:', topupResult);
        
        const newBalance = await client.getBalance(identifier);
        console.log('New balance:', newBalance, 'ETH');
      } catch (error: any) {
        console.error('Failed to top up credits:', error.message);
        console.error('Please ensure your wallet has sufficient ETH on Base network');
        process.exit(1);
      }
    }

    // Upload each hospital hash
    const uploadResults = [];
    for (const [hospitalName, rootHash] of Object.entries(HOSPITAL_ROOT_HASHES)) {
      console.log(`\nUploading data for ${hospitalName}...`);
      
      const content = JSON.stringify({
        hospital: hospitalName,
        rootHash: rootHash,
        timestamp: Date.now()
      });

      try {
        const uploadResult = await client.upload(content, identifier) as unknown as ApiUploadResponse;
        console.log(`Upload initiated for ${hospitalName}:`, uploadResult);

        uploadResults.push({
          hospitalName,
          jobId: uploadResult.job_id,
          requestId: uploadResult.request_id
        });
      } catch (error) {
        console.error(`Failed to upload data for ${hospitalName}:`, error);
        process.exit(1);
      }
    }

    console.log('\nAll uploads initiated. Waiting for confirmations...');
    console.log('Note: This may take ~10 minutes for each upload.');

    // Continuously check status until all are confirmed
    let attempts = 0;
    while (attempts < MAX_STATUS_CHECKS) {
      let allConfirmed = true;
      
      for (const result of uploadResults) {
        try {
          const status = await client.getStatus(result.jobId);
          console.log(`\nStatus for ${result.hospitalName}:`, status);
          
          if (status.status === 'FAILED') {
            console.error(`Upload failed for ${result.hospitalName}`);
            process.exit(1);
          }
          
          if (status.status !== 'CONFIRMED' && status.status !== 'FINALIZED') {
            allConfirmed = false;
          }
        } catch (error) {
          console.error(`Error checking status for ${result.hospitalName}:`, error);
          allConfirmed = false;
        }
      }

      if (allConfirmed) {
        console.log('\nAll uploads confirmed successfully!');
        
        // Create a constant file with the results
        const resultOutput = `// This file is auto-generated. DO NOT EDIT.
export const HOSPITAL_UPLOAD_IDS = ${JSON.stringify(uploadResults, null, 2)} as const;

export type HospitalUploadResult = {
  hospitalName: string;
  jobId: string;
  requestId: string;
};
`;

        // Write results to a new file
        fs.writeFileSync(
          './src/packages/MerkleTree/hospitalUploadIds.ts',
          resultOutput
        );

        console.log('Results saved to hospitalUploadIds.ts');
        break;
      }

      attempts++;
      console.log(`\nSome uploads still pending. Checking again in ${RETRY_DELAY/1000} seconds... (attempt ${attempts}/${MAX_STATUS_CHECKS})`);
      await sleep(RETRY_DELAY);
    }

    if (attempts >= MAX_STATUS_CHECKS) {
      console.error('\nUploads did not confirm within the maximum number of attempts.');
      process.exit(1);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error); 