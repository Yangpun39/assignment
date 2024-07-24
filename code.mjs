import express from 'express';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the public directory
app.use(express.static(join(__dirname, 'public')));

// Function to fetch transaction signatures
const fetchTransactionSignatures = async (walletAddress) => {
  const url = 'https://solana-api.projectserum.com';  // Updated endpoint
  const requestBody = {
    method: "getConfirmedSignaturesForAddress2",
    jsonrpc: "2.0",
    id: 1,
    params: [walletAddress, { "limit": 10 }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch signatures: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to retrieve signatures' };
  }
};

// Function to fetch transaction details
const fetchTransactionDetails = async (signature) => {
  const url = 'https://solana-api.projectserum.com';  // Updated endpoint
  const requestBody = {
    method: "getConfirmedTransaction",
    jsonrpc: "2.0",
    id: 1,
    params: [signature]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction details: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to retrieve transaction details' };
  }
};

// Define the GET endpoint
app.get('/transactions/:address', async (req, res) => {
  const walletAddress = req.params.address;

  // Fetch transaction signatures
  const signatures = await fetchTransactionSignatures(walletAddress);

  if (signatures.error) {
    return res.status(500).json({ status: 'error', message: signatures.error });
  }

  // Fetch details for each transaction
  const transactions = await Promise.all(
    signatures.map(async (tx) => {
      const details = await fetchTransactionDetails(tx.signature);
      return {
        signature: tx.signature,
        slot: tx.slot,
        confirmations: details.confirmations || 'N/A',
        transaction: details.transaction || 'N/A'
      };
    })
  );

  res.json({
    status: 'success',
    message: 'Activity retrieved successfully',
    data: transactions
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
