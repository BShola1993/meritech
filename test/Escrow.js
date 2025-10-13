const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Escrow', () => {
    let buyer, seller, inspector, lender;
    let realEstate, escrow;
    beforeEach(async () => {
    // Get test accounts
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    // Deploy RealEstate contract
    const RealEstate = await ethers.getContractFactory('RealEstate');
    realEstate = await RealEstate.deploy();
    await realEstate.deployed();

    // Mint NFT to seller
    let transaction = await realEstate.connect(seller).mint(
        "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png"
    );
    await transaction.wait();

    // Deploy Escrow contract
    const Escrow = await ethers.getContractFactory('Escrow');
    escrow = await Escrow.deploy(
        realEstate.address,
        seller.address,
        inspector.address,
        lender.address
    );
    await escrow.deployed();

    // Approve NFT for Escrow
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);
    await transaction.wait();

    // List NFT in Escrow
    transaction = await escrow.connect(seller).list(
        1,            // nftID
        buyer.address, // buyer
        tokens(10),    // purchase price
        tokens(5)      // escrow amount
    );
    await transaction.wait();
});


    
    describe('Deployment', () => {
        it('Returns NFT address', async () => {
            const result = await escrow.nftAddress();
            expect(result).to.be.equal(realEstate.address);
        });

        it('Returns seller', async () => {
            const result = await escrow.seller();
            expect(result).to.be.equal(seller.address);
        });

        it('Returns inspector', async () => {
            const result = await escrow.inspector();
            expect(result).to.be.equal(inspector.address);
        });

        it('Returns lender', async () => {
            const result = await escrow.lender();
            expect(result).to.be.equal(lender.address);
        });
    });

    describe('Listing', () => {
        it('Update as Listed', async ()=>{
            const result = await escrow.isListed(1)
            expect(result).to.be.equal(true)
        })
        it('Updates ownership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
        });
        it('Returns buyer', async ()=>{
            const result = await escrow.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })
        it('Returns purcahsePrice', async ()=>{
            const result = await escrow.purchasePrice(1)
            expect(result).to.be.equal(tokens(10))
        })
        it('Returns escrow amount', async ()=>{
            const result = await escrow.escrowAmount(1)
            expect(result).to.be.equal(tokens(5))
        })
    });

    describe('Deposits', ()=>{
        it('Update contract balance', async ()=>{
            const transaction = await escrow.connect(buyer).depositEarnest(1, {value:tokens(5)})
            await transaction.wait()
            const result = await escrow.getBalance()
            expect(result).to.be.equal(tokens(5))



        }) 
    })

    describe('Inspection', ()=>{
        it('update inspection status', async ()=>{
            const transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()
            const result = await escrow.inspectionPassed(1);
                expect(result).to.be.equal(true)
        }) 
    })
    
    describe('Approval',()=>{
        it('Update approval status', async()=>{
            let transaction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()

            expect(await escrow.approval(1, buyer.address)).to.be.equal(true)
            expect(await escrow.approval(1, seller.address)).to.be.equal(true)
            expect(await escrow.approval(1, lender.address)).to.be.equal(true)
        })

    })

    describe('Sale', async()=>{
        beforeEach(async()=>{
            let transaction = await escrow.connect(buyer).depositEarnest(1, {value:tokens(5)})
            await transaction.wait()
            transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()
            transaction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()
            
            transaction = await lender.sendTransaction({to: escrow.address, value: tokens(5)})
            transaction =await escrow.connect(seller).finalizeSale(1)
            await transaction.wait()
        })
        it('Update ownership', async()=>{
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address);
        })
        it('Update balance', async()=>{
            expect(await escrow.getBalance()).to.be.equal(tokens(0))

        })

    })

    
})
