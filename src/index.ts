import express, { Express, Request, Response } from 'express';
import { EigenDAAdapter } from './packages/EigenDAAdapter';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Initialize EigenDA adapter
const eigenDAAdapter = new EigenDAAdapter({
  apiUrl: process.env.EIGENDA_API_URL as string,
  rpcUrl: process.env.EIGENDA_RPC_URL as string,
  privateKey: process.env.EIGENDA_PRIVATE_KEY as string,
  creditsContractAddress: process.env.EIGENDA_CREDITS_CONTRACT_ADDRESS as string,
});

// Initialize the adapter when the server starts
eigenDAAdapter.initialize().catch(console.error);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript!' });
});

// Add a shutdown handler
process.on('SIGTERM', async () => {
  await eigenDAAdapter.shutdown();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}); 