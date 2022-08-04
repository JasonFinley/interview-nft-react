//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";

contract ArcadeGalaxyInterviewNFT is
    ERC721Enumerable,
    ReentrancyGuard,
    AccessControl,
    Pausable
{
	using Strings for uint256;
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    bytes32 public constant ADMIN_ROLE    = keccak256("ADMIN_ROLE");
    bytes32 public constant OWNER_ROLE    = keccak256("OWNER_ROLE");

    event BaseURIChanged(string newBaseURI);
    
    string public __baseURI;

    uint _mintingPrice;

    constructor(
        string memory baseURI,
        uint mintingPrice
    ) ERC721("Arcade Galaxy Interview Token", "AGITK") {
        _setupRole(ADMIN_ROLE, _msgSender());
        _setupRole(OWNER_ROLE, _msgSender());

        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(OWNER_ROLE, ADMIN_ROLE);

         __baseURI = baseURI;
        _mintingPrice = mintingPrice;
    }

    function setMintingPrice(uint newMintingPrice) public onlyRole(OWNER_ROLE) {
        _mintingPrice = newMintingPrice;
    }

    function _baseURI() internal view override returns (string memory) {
        return __baseURI;
    }

    function setBaseURI(string calldata newbaseURI) external onlyRole(OWNER_ROLE) {
        __baseURI = newbaseURI;
        emit BaseURIChanged(newbaseURI);
    }

    function pause() public onlyRole(OWNER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(OWNER_ROLE) {
        _unpause();
    }

    function mint(uint256 tokenID, address tokenOwner, bytes calldata signature) payable public whenNotPaused nonReentrant {
        uint payment = msg.value;
        require(payment >= _mintingPrice, "Payment not enough");

        bytes memory message = abi.encodePacked(tokenID, tokenOwner);
        bytes32 hashedMessage= keccak256(message);
        address signer = hashedMessage.toEthSignedMessageHash().recover(signature);
        require(hasRole(OWNER_ROLE, signer), "Invalid signature");

        _mint(tokenID, tokenOwner);
    }

    function _mint(uint256 tokenID, address tokenOwner) private {
        _safeMint(tokenOwner, tokenID);
    }

    function supportsInterface(
        bytes4 interfaceId
    )   public
        view
        virtual
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }
}
