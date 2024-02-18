// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecentralisedNFT is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId;
    string private _baseURIExtended;

    constructor() ERC721("DecentralisedNFT", "DNFT") Ownable(msg.sender) {
        _setBaseURI("ipfs://");
    }

    function _setBaseURI(string memory baseURI) private {
        _baseURIExtended = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIExtended;
    }

    function mintCollectionNFT(address collector, string memory metadataURI) public onlyOwner() {
        _currentTokenId++;
        uint256 tokenId = _currentTokenId;
        _safeMint(collector, tokenId);
        _setTokenURI(tokenId, metadataURI);
    }

    function mint(address to, uint256 tokenId, string memory tokenURI) public onlyOwner {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _currentTokenId++;
    }

    function safeTransferTokenFrom(address from, address to, uint256 tokenId) public {
        safeTransferTokenFrom(from, to, tokenId, "");
    }

    function safeTransferTokenFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    function approveToken(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );
        approve(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId <= _currentTokenId, "ERC721Metadata: URI query for nonexistent token");
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
}
