const { expect } = require('chai');
const {ethers} = require("hardhat");

describe("DecentralisedNFT", function () {
    let DecentralisedNFT;
    let decentralisedNFT;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        DecentralisedNFT = await ethers.getContractFactory("DecentralisedNFT");
        [owner, addr1, addr2] = await ethers.getSigners();
        decentralisedNFT = await DecentralisedNFT.deploy();
        await decentralisedNFT.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await decentralisedNFT.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        it("Should mint NFT correctly", async function () {
            await decentralisedNFT.mint(addr1.address, 1, "metadataURI");
            expect(await decentralisedNFT.ownerOf(1)).to.equal(addr1.address);
        });

        it("Should mint collection NFT correctly", async function () {
            await decentralisedNFT.mintCollectionNFT(addr1.address, "collectionMetadataURI");
            expect(await decentralisedNFT.ownerOf(1)).to.equal(addr1.address);
        });
    });

    describe("Transferring", function () {
        it("Should transfer token correctly", async function () {
            await decentralisedNFT.mint(addr1.address, 1, "metadataURI");
            await decentralisedNFT.connect(addr1).approveToken(addr2.address, 1);
            await decentralisedNFT.safeTransferTokenFrom(addr1.address, addr2.address, 1);
            expect(await decentralisedNFT.ownerOf(1)).to.equal(addr2.address);
        });

        it("Should not transfer token if not approved", async function () {
            await decentralisedNFT.mint(addr1.address, 1, "metadataURI");
            await expect(decentralisedNFT.connect(addr2).safeTransferTokenFrom(addr1.address, addr2.address, 1)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
        });

        it("Should approve and then transfer token correctly", async function () {
            await decentralisedNFT.mint(addr1.address, 1, "metadataURI");
            await decentralisedNFT.approveToken(addr2.address, 1);
            await decentralisedNFT.connect(addr2).safeTransferTokenFrom(addr1.address, addr2.address, 1);
            expect(await decentralisedNFT.ownerOf(1)).to.equal(addr2.address);
        });
    });

    describe("Token Metadata", function () {
        it("Should return correct token URI", async function () {
            await decentralisedNFT.mint(addr1.address, 1, "metadataURI");
            expect(await decentralisedNFT.tokenURI(1)).to.equal("ipfs://metadataURI");
        });

        it("Should revert if querying non-existent token URI", async function () {
            await expect(decentralisedNFT.tokenURI(100)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
        });
    });
});
