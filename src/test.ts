import * as dotenv from 'dotenv';
import { EigenDAAdapter } from './packages/EigenDAAdapter';

dotenv.config();

async function main() {
  console.log('got here');
  try {
    console.log('Creating EigenDA adapter...');
    const eigenDA = new EigenDAAdapter({
      privateKey: process.env.EIGENDA_PRIVATE_KEY!,
      apiUrl: process.env.EIGENDA_API_URL,
      rpcUrl: process.env.EIGENDA_BASE_RPC_URL,
      creditsContractAddress: process.env.EIGENDA_CREDITS_CONTRACT
    });

    console.log('Initializing adapter...');
    await eigenDA.initialize();
    console.log('✅ Initialization successful');

    console.log('Checking balance...');
    const balance = await eigenDA.getBalance();
    console.log('Balance:', balance);

    return;

  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

main(); 