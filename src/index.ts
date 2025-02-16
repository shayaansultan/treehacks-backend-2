import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import inventoryRoutes from './routes/inventory';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use inventory routes
app.use('/api/inventory', inventoryRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 