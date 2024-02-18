const { ethers } = require("hardhat");

async function main() {
    const contractOwner = await ethers.getSigners();

    const DecentralisedNFT = await ethers.getContractFactory('DecentralisedNFT');

    const decentralisedNFT = await DecentralisedNFT.deploy();
    await decentralisedNFT.deployed();
    console.log(`DecentralisedNFT deployed to: ${decentralisedNFT.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });