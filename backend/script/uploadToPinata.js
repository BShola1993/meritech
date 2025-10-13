// scripts/uploadToPinata.js
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Pinata
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
});

// Folder to upload
const folderPath = path.resolve('./metadata');

async function uploadToPinata() {
  console.log('🔍 Checking environment keys...');
  if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
    console.error('❌ Missing API credentials in .env file!');
    return;
  }

  try {
    console.log('🚀 Uploading folder to Pinata...');
    const result = await pinata.pinFromFS(folderPath);
    console.log('✅ Upload successful!');
    console.log('🔗 IPFS CID:', result.IpfsHash);
    console.log(`🌐 View on IPFS: https://ipfs.io/ipfs/${result.IpfsHash}/`);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

uploadToPinata();
