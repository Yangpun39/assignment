

import express from 'express';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3000;

const filename = fileURLToPath(import.meta.url);
const directory_name = dirname(filename);
app.use(express.static(join(directory_name, 'frontend')));

const block_data = async (walletAddress) => {
  const url = `https://api.mainnet-beta.solana.com`;

  const requestBody = {
    method: "getConfirmedSignaturesForAddress2",
    jsonrpc: "2.0",
    id: 1,
    params: [walletAddress, { "limit": 50 }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to fetch: ${response.status} - ${errorMessage}`);
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to retrieve data' };
  }
};


app.get('/transactions/:address', async (req, res) => {
  const walletAddress = req.params.address;

  const transactions = await block_data(walletAddress);

  if (transactions.error) {
    return res.status(500).json({ status: 'error', message: transactions.error });
  }

  const show_data = transactions.result.map(tx => ({
    network: 'Solana',
    timestamp: new Date().toISOString(),
    slot:tx.slot,
    type: 'transaction', 
    wallet_address: walletAddress,
    transaction_hash: tx.signature,

    explorer_url: `https://solscan.io/tx/${tx.signature}?cluster=mainnet-beta`
  }));

  res.json({
    status: 'success',
    message: 'Activity retrieved successfully',
    data: show_data
  });
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});





//output

// {
//     "status": "success",
//     "message": "Activity retrieved successfully",
//     "data": [
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.086Z",
//             "slot": 279183092,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3ShMAXvJczacB1ALpBUdCAbx9FNdoMeAkurH2ePyLQ5t1HwYPi9iUdyn7rhoUogNzbsSdKkJWAZ16kbGSWWJfQTB",
//             "explorer_url": "https://solscan.io/tx/3ShMAXvJczacB1ALpBUdCAbx9FNdoMeAkurH2ePyLQ5t1HwYPi9iUdyn7rhoUogNzbsSdKkJWAZ16kbGSWWJfQTB?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279183092,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "5DKiTMqzcYnJapS8JJPkGaCrWUbP7FayC5oyh3v4UHGgv1wX6zN5PfErEDfAneVB5CLAbH1oxykdSPMz2juJALwh",
//             "explorer_url": "https://solscan.io/tx/5DKiTMqzcYnJapS8JJPkGaCrWUbP7FayC5oyh3v4UHGgv1wX6zN5PfErEDfAneVB5CLAbH1oxykdSPMz2juJALwh?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279159419,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3AQfoPFkEPAWEADmgYPDiqGPNYcNDyHarjkz7EAdpaE3mfxvqUJAvVJL3brETkBkkyAcVnnPsBAmECfJG9n1pANJ",
//             "explorer_url": "https://solscan.io/tx/3AQfoPFkEPAWEADmgYPDiqGPNYcNDyHarjkz7EAdpaE3mfxvqUJAvVJL3brETkBkkyAcVnnPsBAmECfJG9n1pANJ?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279157894,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "HbCg5G51H3dGzVApbDpUCC9ChcKf9iCg37DqpsYZetzgiP4nou1RVj4AHx5qxT33GPcKgcmfxwEXw8pXXuGa8um",
//             "explorer_url": "https://solscan.io/tx/HbCg5G51H3dGzVApbDpUCC9ChcKf9iCg37DqpsYZetzgiP4nou1RVj4AHx5qxT33GPcKgcmfxwEXw8pXXuGa8um?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279153572,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3aSrq2qo12gRJUbNHaSaHjoNZmJmsFGkGV6GZzGyJ4qtMRjecCXxhjMRVv2LahKuZJmKqM5Rs8AVG4ANyjXVAFCg",
//             "explorer_url": "https://solscan.io/tx/3aSrq2qo12gRJUbNHaSaHjoNZmJmsFGkGV6GZzGyJ4qtMRjecCXxhjMRVv2LahKuZJmKqM5Rs8AVG4ANyjXVAFCg?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279040423,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4HCXQ5FG8QF4zywtX9Df2pwDaDKCxQRPUGT1erXD1uhV5w3BTsGB8rz34o34pFWJBhyHhQ354vCNjHvVGkkQppaJ",
//             "explorer_url": "https://solscan.io/tx/4HCXQ5FG8QF4zywtX9Df2pwDaDKCxQRPUGT1erXD1uhV5w3BTsGB8rz34o34pFWJBhyHhQ354vCNjHvVGkkQppaJ?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279040423,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "xaqffWZiTiqftnWwohjEP7YciJE1jPwHydzRmLSDiD8Fr25MAdfGeudSZYHawXb6vdXx2mHWLAypWuxaJ5rYKUy",
//             "explorer_url": "https://solscan.io/tx/xaqffWZiTiqftnWwohjEP7YciJE1jPwHydzRmLSDiD8Fr25MAdfGeudSZYHawXb6vdXx2mHWLAypWuxaJ5rYKUy?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279036371,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4qhjtfAAN5euugByZEsjZUFod6YnsKaj9YvCm6Z9VFQHrXst7WHpiVxX1x1EGHwbhWSZP6cs79zzjNjR1VhK3DDx",
//             "explorer_url": "https://solscan.io/tx/4qhjtfAAN5euugByZEsjZUFod6YnsKaj9YvCm6Z9VFQHrXst7WHpiVxX1x1EGHwbhWSZP6cs79zzjNjR1VhK3DDx?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279036371,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "5CMk6FoqhaujSWnjXRKacfR6vVj8ENSHuXTYf9Y4fWjgtN4kBH7NELQUnbP6uWRZscNfDRmYtxQagmwLZ89y2mQu",
//             "explorer_url": "https://solscan.io/tx/5CMk6FoqhaujSWnjXRKacfR6vVj8ENSHuXTYf9Y4fWjgtN4kBH7NELQUnbP6uWRZscNfDRmYtxQagmwLZ89y2mQu?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279035480,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3NYmEmqzGWFYgnKZMNZgcUY8kjYvG9Upt8En2fM7sdorBi7txUe8EK3R5bhYsL9kmYpeRf76pyg5iBDNUxKz5S9A",
//             "explorer_url": "https://solscan.io/tx/3NYmEmqzGWFYgnKZMNZgcUY8kjYvG9Upt8En2fM7sdorBi7txUe8EK3R5bhYsL9kmYpeRf76pyg5iBDNUxKz5S9A?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279035480,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "2rYZRTN7dZi7VNTHDFNgQ7cAEiqduuabAsVnxUnaeFcpTcuXAsLnENtfjqtPxUMvHQwTWvzpBv3du2ALWKDGZGsc",
//             "explorer_url": "https://solscan.io/tx/2rYZRTN7dZi7VNTHDFNgQ7cAEiqduuabAsVnxUnaeFcpTcuXAsLnENtfjqtPxUMvHQwTWvzpBv3du2ALWKDGZGsc?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 279019092,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3H3JiPBPr7EG8iXt2uvqcSK1t3w9cJpWikdFVm7wyxvhgWKPRmtVdWGP5h47wUfDuQMCfN5cjKZU3A5YJNXPRvqJ",
//             "explorer_url": "https://solscan.io/tx/3H3JiPBPr7EG8iXt2uvqcSK1t3w9cJpWikdFVm7wyxvhgWKPRmtVdWGP5h47wUfDuQMCfN5cjKZU3A5YJNXPRvqJ?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278968612,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "ATUBz7Wdozizv2EsPzSA1rMRQ8S3s1J6nwBo2rcx2SeKZjHLLdVfvzy9WfbD3JEyuS1x8wLsDqBQdxukipHbwJf",
//             "explorer_url": "https://solscan.io/tx/ATUBz7Wdozizv2EsPzSA1rMRQ8S3s1J6nwBo2rcx2SeKZjHLLdVfvzy9WfbD3JEyuS1x8wLsDqBQdxukipHbwJf?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278823408,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "61c2LawVv6WDnR6yVUHV2VcZEmiiA1T3F5EACYKxxk2rE8PRDh7sfyJsj1fhkxS7S9fNA45LEbkcXKuePatX9ZAy",
//             "explorer_url": "https://solscan.io/tx/61c2LawVv6WDnR6yVUHV2VcZEmiiA1T3F5EACYKxxk2rE8PRDh7sfyJsj1fhkxS7S9fNA45LEbkcXKuePatX9ZAy?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278823331,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3FFd6wEXofoNC3bqP5XCypKscGjhAfvSe7ZZRmYYs6B9tAwp5NrY4VHHWhMfVbxsYYdzbjripkyztkgEs3iHBvDm",
//             "explorer_url": "https://solscan.io/tx/3FFd6wEXofoNC3bqP5XCypKscGjhAfvSe7ZZRmYYs6B9tAwp5NrY4VHHWhMfVbxsYYdzbjripkyztkgEs3iHBvDm?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278819793,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3nnaNxgZgXVWw3aZRtJkMtqijxX8LakhvtnTvDzFGFUEjLE2xUF4Q1jGTKJLWygihLjQfghc6Jfe8ArReoPWVkcV",
//             "explorer_url": "https://solscan.io/tx/3nnaNxgZgXVWw3aZRtJkMtqijxX8LakhvtnTvDzFGFUEjLE2xUF4Q1jGTKJLWygihLjQfghc6Jfe8ArReoPWVkcV?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278819783,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3hD5sUajQQndSqXtB1a1izX89Qkve19SrXKnnXvan5MwM513n7zGPLYgYMzPLCfdCXWFYeVJqyGpHyfo6SzbBn3q",
//             "explorer_url": "https://solscan.io/tx/3hD5sUajQQndSqXtB1a1izX89Qkve19SrXKnnXvan5MwM513n7zGPLYgYMzPLCfdCXWFYeVJqyGpHyfo6SzbBn3q?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278814578,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "2khQqYEmijySzoVcqFnfPrGguemMXVyGHU7MDpAwXhAkP2LWGMqNkZHJ8h5phqmc6pdZtE7gWQMbuWLfBnjcoBpM",
//             "explorer_url": "https://solscan.io/tx/2khQqYEmijySzoVcqFnfPrGguemMXVyGHU7MDpAwXhAkP2LWGMqNkZHJ8h5phqmc6pdZtE7gWQMbuWLfBnjcoBpM?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278796757,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3mVaw37LPprcJbtr6rnjLD5SMtASi56sgTvC3UxVCPvwpcvGg7gEddUnJHFdpgaDei66mV9tkVL3U7c72R7c9UCE",
//             "explorer_url": "https://solscan.io/tx/3mVaw37LPprcJbtr6rnjLD5SMtASi56sgTvC3UxVCPvwpcvGg7gEddUnJHFdpgaDei66mV9tkVL3U7c72R7c9UCE?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278796757,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "2cgXm9ooyC9kaxPmgrZ3PXhJxmfbNzgxGBY4xdLHHbsNofvVAbHsnf2x6c6hcXx5yqwKwj8BvXod2NvS5R7jZdRj",
//             "explorer_url": "https://solscan.io/tx/2cgXm9ooyC9kaxPmgrZ3PXhJxmfbNzgxGBY4xdLHHbsNofvVAbHsnf2x6c6hcXx5yqwKwj8BvXod2NvS5R7jZdRj?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278511948,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4nT794augGHSG5wuMwmZ5wQ3ALPLKr2ytcQ5Bq2gVo7qWXuDykAQV92Qz8Zn8AGirGRYNxkRChLp19dFzF2wQRYA",
//             "explorer_url": "https://solscan.io/tx/4nT794augGHSG5wuMwmZ5wQ3ALPLKr2ytcQ5Bq2gVo7qWXuDykAQV92Qz8Zn8AGirGRYNxkRChLp19dFzF2wQRYA?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278511892,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "5fMcKQvfSDoCLknJ74SBtkmB38zXEBEJe7TizZVahdCq2sA1uR5EF2naRdXWLuYjGa5zMuT2Fz4b88nywPmqiRnN",
//             "explorer_url": "https://solscan.io/tx/5fMcKQvfSDoCLknJ74SBtkmB38zXEBEJe7TizZVahdCq2sA1uR5EF2naRdXWLuYjGa5zMuT2Fz4b88nywPmqiRnN?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278486160,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "58Lo9sAGktLmG1fGr2M3sptrwWWy9bKzmhoSrTX9xUisrqqBFfTHidMWmdoMfaVSh6JCM4WuVtGMMc6SFVa3Kcer",
//             "explorer_url": "https://solscan.io/tx/58Lo9sAGktLmG1fGr2M3sptrwWWy9bKzmhoSrTX9xUisrqqBFfTHidMWmdoMfaVSh6JCM4WuVtGMMc6SFVa3Kcer?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278439125,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3DYhKKVr8TttxxQfLJDenRJBSQ9MqPrDBeVXL2sSJdo1urhHdXDceJX4ggqKjDY2p862rMth3FLguYn2DftZaUb5",
//             "explorer_url": "https://solscan.io/tx/3DYhKKVr8TttxxQfLJDenRJBSQ9MqPrDBeVXL2sSJdo1urhHdXDceJX4ggqKjDY2p862rMth3FLguYn2DftZaUb5?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278437728,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4vrhxxPyyyUQereWLRa3KXs72rEWcFKJ6xvX5ChUX4C9KA51Nv9mFqAnuj7bwDxCTXPkzaJwwtcXki7FtYCpRBfm",
//             "explorer_url": "https://solscan.io/tx/4vrhxxPyyyUQereWLRa3KXs72rEWcFKJ6xvX5ChUX4C9KA51Nv9mFqAnuj7bwDxCTXPkzaJwwtcXki7FtYCpRBfm?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278433346,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3Rcz2iUL262XmB3YWfw8zetYhr2cHfD5LwBLyFgbRCbouXyoLvyAxdNiW6M87tgkyHiHE7hCJne5TZLTRtu4TFoY",
//             "explorer_url": "https://solscan.io/tx/3Rcz2iUL262XmB3YWfw8zetYhr2cHfD5LwBLyFgbRCbouXyoLvyAxdNiW6M87tgkyHiHE7hCJne5TZLTRtu4TFoY?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278431838,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "56LaJsMYZPX4hbW38BpiHNReaeoCp8YsPs9zwddq5jCahtJgPJREDoUGtYuYid5XdXfyAko7HJ8FiouX9LywFqqL",
//             "explorer_url": "https://solscan.io/tx/56LaJsMYZPX4hbW38BpiHNReaeoCp8YsPs9zwddq5jCahtJgPJREDoUGtYuYid5XdXfyAko7HJ8FiouX9LywFqqL?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278431319,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "23pj3KsEmL4e8RDJJ8976hiBP8yxNMoTzCo1qBg47EgLyHdQXkLyCj5cDGeofTM4DXaD5BDhEzai8dmY26baBMVy",
//             "explorer_url": "https://solscan.io/tx/23pj3KsEmL4e8RDJJ8976hiBP8yxNMoTzCo1qBg47EgLyHdQXkLyCj5cDGeofTM4DXaD5BDhEzai8dmY26baBMVy?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278431240,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "5hgzbBRZYhvfbWL4LTz2kcr43uNVSYppmdXuYeraVkNcNYMhtvwXeV3pjbTcT7uBSKU3N6kc84phhLQf7UJeKCNw",
//             "explorer_url": "https://solscan.io/tx/5hgzbBRZYhvfbWL4LTz2kcr43uNVSYppmdXuYeraVkNcNYMhtvwXeV3pjbTcT7uBSKU3N6kc84phhLQf7UJeKCNw?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278430838,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "38Y26DLiuKHmgmPrYm4uyzMLZRgQTqz3279G3JDmQ3JA3xhvft2cERDhYaL7DrjRD7dMcyTPjG3kYtoW24qPurnw",
//             "explorer_url": "https://solscan.io/tx/38Y26DLiuKHmgmPrYm4uyzMLZRgQTqz3279G3JDmQ3JA3xhvft2cERDhYaL7DrjRD7dMcyTPjG3kYtoW24qPurnw?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278430157,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4PZpqxeRk4MwZku82wHcDxgxGESp8f8bKYyh6dSWrYgaXTBgHzajGNkqbmNJbu8sWRnxjxdn95TCWjT1b28fP4KK",
//             "explorer_url": "https://solscan.io/tx/4PZpqxeRk4MwZku82wHcDxgxGESp8f8bKYyh6dSWrYgaXTBgHzajGNkqbmNJbu8sWRnxjxdn95TCWjT1b28fP4KK?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278227502,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "5r2b4UkvYFo4mLXaN2jcERt1GdE9SYXv8xKM94BSVHNGXhQs33nFcgaeuAzUrXe9oJTGBY4g4Xp3qu1ut6TLGuhV",
//             "explorer_url": "https://solscan.io/tx/5r2b4UkvYFo4mLXaN2jcERt1GdE9SYXv8xKM94BSVHNGXhQs33nFcgaeuAzUrXe9oJTGBY4g4Xp3qu1ut6TLGuhV?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278227502,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3yWjSbVtBhqqzWYJKJj3xBSKUf4gqsSn1NT792ksxbaHjeB4BZ775CtdTjC3nGFn6YtRUQcBpXnDh2dzKz6XK89m",
//             "explorer_url": "https://solscan.io/tx/3yWjSbVtBhqqzWYJKJj3xBSKUf4gqsSn1NT792ksxbaHjeB4BZ775CtdTjC3nGFn6YtRUQcBpXnDh2dzKz6XK89m?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278225776,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "5HhhUyCgHKJD17znQwjH6T1WqGzvMzJXUFis8KXGENew8wA4j2fLZRsHNygWo1KgFeQHQ2uuzyDFvz7UYyeCaZmT",
//             "explorer_url": "https://solscan.io/tx/5HhhUyCgHKJD17znQwjH6T1WqGzvMzJXUFis8KXGENew8wA4j2fLZRsHNygWo1KgFeQHQ2uuzyDFvz7UYyeCaZmT?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278225636,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "Yno5wdvWPwchhArM5ZnP41tzUtyFwWKgXJ97Gdr4N5pjZmjwjHbxqtqiLsk5Cu9kU8LAYsViB1Mqg716RMZMXWc",
//             "explorer_url": "https://solscan.io/tx/Yno5wdvWPwchhArM5ZnP41tzUtyFwWKgXJ97Gdr4N5pjZmjwjHbxqtqiLsk5Cu9kU8LAYsViB1Mqg716RMZMXWc?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278224802,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "3wZUWqcNbiY9HYejcKuJ7gtsd5KHTenYpQ72rEmu5iny1vSoLHXg1bHpVJBAYYz5JiVtPZZBAsz88Jt1UvK2Dv8L",
//             "explorer_url": "https://solscan.io/tx/3wZUWqcNbiY9HYejcKuJ7gtsd5KHTenYpQ72rEmu5iny1vSoLHXg1bHpVJBAYYz5JiVtPZZBAsz88Jt1UvK2Dv8L?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278219904,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "33a6wnAFsa6aSRKvUHcCmwGKFFZ77vSkfdT4AxnFL4TBmg93f3RpZTQ9cMR7B4Z1ni94Zw9EfZnZ8ihL2XtuL156",
//             "explorer_url": "https://solscan.io/tx/33a6wnAFsa6aSRKvUHcCmwGKFFZ77vSkfdT4AxnFL4TBmg93f3RpZTQ9cMR7B4Z1ni94Zw9EfZnZ8ihL2XtuL156?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278217340,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4QfWvk9Rzyn6haAFPFt7h7hGvNnhFpVuNMA7B3NpE2VCptR3QLyL7AY8Pb4WyzPQPDHJQC8JcqeE5GEFLrcPzp7i",
//             "explorer_url": "https://solscan.io/tx/4QfWvk9Rzyn6haAFPFt7h7hGvNnhFpVuNMA7B3NpE2VCptR3QLyL7AY8Pb4WyzPQPDHJQC8JcqeE5GEFLrcPzp7i?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278217200,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4MuMVGAMNf7hoKjxuSANETsVEn6rFrBSCJD6RfvsKqhsfn2m74vv8hXHyKVzeXXA847VnXetiD5FywrL55FmKPjR",
//             "explorer_url": "https://solscan.io/tx/4MuMVGAMNf7hoKjxuSANETsVEn6rFrBSCJD6RfvsKqhsfn2m74vv8hXHyKVzeXXA847VnXetiD5FywrL55FmKPjR?cluster=mainnet-beta"
//         },
//         {
//             "network": "Solana",
//             "timestamp": "2024-07-24T20:02:17.087Z",
//             "slot": 278214372,
//             "type": "transaction",
//             "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
//             "transaction_hash": "4fuxgqh2MxWsAiRhsuTv2cPWffrFvzK2eJnoi1yatt69JhWCWf14wnampR5w9aiYpB8Fz36bzZ27bF1hJ9tvdQsg",
//             "explorer_url": "https://solscan.io/tx/4fuxgqh2MxWsAiRhsuTv2cPWffrFvzK2eJnoi1yatt69JhWCWf14wnampR5w9aiYpB8Fz36bzZ27bF1hJ9tvdQsg?cluster=mainnet-beta"
//         }
//     ]
// }