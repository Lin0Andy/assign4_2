const { ethers } = require("hardhat");

async function main() {
    const DecentralisedNFT = await ethers.getContractFactory('DecentralisedNFT');

    const decentralisedNFT = await DecentralisedNFT.deploy();
    await decentralisedNFT.deployed();
    console.log(`DecentralisedNFT deployed to: ${decentralisedNFT.address}`)

    // const ipfs = create();
    //
    // const contractOwner = (await ethers.getSigners())[0].address;
    //
    // const imgDirPath = path.join(__dirname, "images");
    // const files = await fs.readdir(imgDirPath);
    //
    // for (const file of files) {
    //     if (file.endsWith(".png")) {
    //         const imagePath = path.join(imgDirPath, file);
    //         const imageData = await fs.readFile(imagePath);
    //
    //         const { cid: imageCID } = await ipfs.add({ content: imageData });
    //
    //         const metadata = {
    //             name: "Screenshot",
    //             description: "Description of the screenshot",
    //             image: `ipfs://${imageCID.toString()}`
    //         };
    //
    //         const { cid: metadataCID } = await ipfs.add({ content: JSON.stringify(metadata) });
    //
    //         const deployedTokenId = await decentralisedNFT.mintCollectionNFT(contractOwner, metadataCID.toString());
    //         await deployedTokenId.wait();
    //     }
    // }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });