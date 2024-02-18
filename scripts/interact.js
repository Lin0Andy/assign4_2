const { ethers } = require('hardhat');
const fs = require('fs').promises;
const { create } = require('ipfs-http-client');
const path = require("path");

async function main() {
    const contractAddress = '0x573FAd4136C0785afbb0103f76f7A0B2c82f4B62';
    const decentralisedNFT = await ethers.getContractAt('DecentralisedNFT', contractAddress);

    const ipfs = create();

    let imagesSummary = [];

    const imgDirPath = path.join(__dirname, 'images');
    const files = await fs.readdir(imgDirPath);

    let imagesData = [];

    for (const file of files) {
        if (file.endsWith('.png')) {
            const imagePath = path.join(imgDirPath, file);
            const imageData = await fs.readFile(imagePath);
            imagesData.push(imageData);
        }
    }

    for (const imageData of imagesData) {
        const { cid: imageCID } = await ipfs.add({ content: imageData });

        const metadata = {
            name: 'Screenshots',
            description: 'Medium & Twitter Screenshots',
            image: imageCID.toString()
        };

        const { cid: metadataCID } = await ipfs.add({ content: JSON.stringify(metadata) });

        const contractOwner = (await ethers.getSigners())[0].address;
        const deployedTokenId = await decentralisedNFT.mintCollectionNFT(contractOwner, metadataCID.toString());
        await deployedTokenId.wait();

        const transferEvents = await decentralisedNFT.queryFilter("Transfer");
        const mintedNFTId = transferEvents[transferEvents.length - 1].args.tokenId.toString();

        imagesSummary.push({
            imageCID: imageCID,
            metadataCID: metadataCID,
            mintedNFTId: mintedNFTId,
            metadataURI: `ipfs://${metadataCID}`,
        });
        console.log(metadataCID)
    }

    console.debug(imagesSummary);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
