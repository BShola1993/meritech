# RealEstateX 🏠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
[![Built with React](https://img.shields.io/badge/Built%20with-React-blue)](https://reactjs.org)  
[![Ethereum](https://img.shields.io/badge/Ethereum-Smart%20Contracts-green)](https://ethereum.org)


## Overview

**RealEstateX** is a blockchain-powered real estate application designed to **eliminate middlemen and fraudulent agents** in property transactions in Nigeria. The platform ensures **transparent, secure, and direct dealings** between property owners and buyers, reducing costs and increasing trust.  

By leveraging **smart contracts, IPFS, and decentralized finance principles**, RealEstateX ensures ownership records are immutable, verifiable, and easily accessible.

## Vision

- Revolutionize property transactions in Nigeria by eliminating unnecessary intermediaries.  
- Empower property owners and buyers with transparency, trust, and efficiency.  
- Integrate blockchain technology into everyday real estate operations for a seamless experience.

## Target Audience

- Home buyers and renters seeking authentic listings and secure transactions.  
- Property owners wanting to list properties directly without paying agent fees.  
- Investors looking for reliable, transparent, and tamper-proof property records.  
- Government agencies for verifying ownership and reducing fraudulent listings.

## Problem Statement

- Middlemen and agent scams inflate property prices and create distrust.  
- Lack of transparency in property ownership and history leads to disputes.  
- Time-consuming processes for buyers and sellers to verify and finalize deals.

## Solution

RealEstateX solves these challenges by:  

1. **Smart Contracts** – Automate property transactions, escrow, and ownership transfer.  
2. **IPFS Storage** – Store property details, documents, and images securely and immutably.  
3. **Direct Listings** – Enable property owners to list directly, removing agents.  
4. **Transparent Verification** – Every transaction is verifiable on the blockchain.  
5. **Escrow Integration** – Secure funds until transaction conditions are met.

## Tech Stack

- **Frontend:** React.js  
- **Blockchain Interaction:** Ethers.js  
- **Smart Contract Development:** Hardhat  
- **Database:** MongoDB  
- **Decentralized Storage:** IPFS  
- **Smart Contracts:** Escrow for secure transactions

## Architecture

```text
[User Frontend - React] <--> [Backend API - Node.js / Express] <--> [MongoDB]
                         \
                          \
                           --> [Ethereum Blockchain via Ethers.js / Hardhat]
                           --> [IPFS Storage for documents]
