import { EigenDAClient } from 'eigenda-sdk';
import dotenv from 'dotenv';

// Define the actual API response type
interface ApiUploadResponse {
  job_id: string;
  message: string;
  request_id: string;
  status: string;
}

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Initialize the client
  const client = new EigenDAClient({
    apiUrl: process.env.EIGENDA_API_URL, // Optional: defaults to mainnet
    rpcUrl: process.env.EIGENDA_BASE_RPC_URL, // Optional: defaults to mainnet
    privateKey: process.env.EIGENDA_PRIVATE_KEY as string,
  });

  try {
    let identifier;
    const existingIdentifiers = await client.getIdentifiers();
    if (existingIdentifiers.length > 0) {
      identifier = existingIdentifiers[0];
    } else {
      identifier = await client.createIdentifier();
    }

    const balance = await client.getBalance(identifier);
    console.log('Balance:', balance);

    if (balance < 0.001) {
      console.log('Balance is low. Topping up credits...');
      const topupResult = await client.topupCredits(identifier, 0.001); // 0.001 ETH
      console.log('Topup result:', topupResult);
      
      // Verify new balance
      const newBalance = await client.getBalance(identifier);
      console.log('New balance:', newBalance, 'ETH');
    }

    // Upload data with identifier
    // console.log('Uploading data...');
    // const content = JSON.stringify({
    //   message: 'Hello EigenDA!',
    //   timestamp: Date.now()
    // });
    // const uploadResult = (await client.upload(content, identifier)) as unknown as ApiUploadResponse;
    // console.log('Upload result:', uploadResult);

    // // Wait for the blob to be confirmed
    // console.log('Waiting for blob to be confirmed...');
    // let status;
    // let attempts = 0;
    // const maxAttempts = 60; // Increased max attempts
    // const waitTime = 30000; // Increased to 30 seconds

    // while (attempts < maxAttempts) {
    //   status = await client.getStatus(uploadResult.job_id);
    //   console.log('Current status:', status);
      
    //   if (status.status === 'CONFIRMED' || status.status === 'FINALIZED') {
    //     console.log('Data confirmed! Proceeding to retrieval...');
    //     break;
    //   }
      
    //   if (status.status === 'FAILED') {
    //     throw new Error('Data upload failed');
    //   }
      
    //   attempts++;
    //   console.log(`Waiting ${waitTime/1000} seconds before next check (attempt ${attempts}/${maxAttempts})...`);
    //   await new Promise(resolve => setTimeout(resolve, waitTime));
    // }

    // if (status?.status !== 'CONFIRMED' && status?.status !== 'FINALIZED') {
    //   throw new Error('Data upload did not confirm in time');
    // }

    // // Give a little extra time after confirmation before retrieval
    // console.log('Waiting an additional 30 seconds before retrieval...');
    // await new Promise(resolve => setTimeout(resolve, 30000));

    // // Retrieve data with different options
    // console.log('Retrieving by job ID...');
    // console.log('uploadResult.job_id:', uploadResult.job_id);
    const request_id = 'b6a40004608bf0e37cd31cddedbc30d64dab33d9afc11cb1a578f5128ae3d3aa-313733393639383638323130383237313836362f302f33332f312f33332fe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    const dataByJobId = await client.retrieve({
      requestId: request_id,
      waitForCompletion: true
    });
    console.log('Retrieved data by job ID:', dataByJobId);

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);