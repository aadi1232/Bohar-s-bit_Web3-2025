// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PromptMarketplace is ERC721URIStorage, ERC2981, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    bool public paused = false;

    struct Listing {
        address seller;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => Listing) private listings;

    event PromptMinted(address indexed creator, uint256 tokenId, string tokenURI);
    event PromptListed(uint256 indexed tokenId, uint256 price);
    event PromptSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event PromptUnlisted(uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("PromptVersePrompt", "PVP") Ownable(initialOwner) {
        _setDefaultRoyalty(initialOwner, 250); // 2.5% default royalty
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // Mint a new prompt NFT with royalty
    function mintPrompt(string memory tokenURI, uint96 royaltyFeesInBips) external whenNotPaused returns (uint256) {
        require(royaltyFeesInBips <= 10000, "Royalty fee too high");
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _setTokenRoyalty(newItemId, msg.sender, royaltyFeesInBips);
        emit PromptMinted(msg.sender, newItemId, tokenURI);
        return newItemId;
    }

    // List a prompt for sale
    function listPrompt(uint256 tokenId, uint256 price) external whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be > 0");
        require(!listings[tokenId].isListed, "Already listed");
        listings[tokenId] = Listing(msg.sender, price, true);
        approve(address(this), tokenId);
        emit PromptListed(tokenId, price);
    }

    // Unlist a prompt
    function unlistPrompt(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        require(listings[tokenId].isListed, "Not listed");
        listings[tokenId].isListed = false;
        emit PromptUnlisted(tokenId);
    }

    // Buy a listed prompt
    function buyPrompt(uint256 tokenId) external payable nonReentrant whenNotPaused {
        Listing memory item = listings[tokenId];
        require(item.isListed, "Not for sale");
        require(msg.value >= item.price, "Insufficient ETH sent");
        require(item.seller != msg.sender, "Cannot buy own NFT");
        
        (address royaltyReceiver, uint256 royaltyAmount) = royaltyInfo(tokenId, item.price);
        uint256 sellerAmount = item.price - royaltyAmount;
        address seller = item.seller;
        
        // Remove listing before transfer
        listings[tokenId].isListed = false;
        
        // Transfer token from seller to buyer
        _transfer(seller, msg.sender, tokenId);
        
        // Transfer payments
        if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
            payable(royaltyReceiver).transfer(royaltyAmount);
        }
        payable(seller).transfer(sellerAmount);
        
        // Refund excess payment
        if (msg.value > item.price) {
            payable(msg.sender).transfer(msg.value - item.price);
        }
        
        emit PromptSold(tokenId, msg.sender, item.price);
    }

    // Get listing details for a prompt
    function getListing(uint256 tokenId) external view returns (address seller, uint256 price, bool isListed) {
        Listing memory listing = listings[tokenId];
        return (listing.seller, listing.price, listing.isListed);
    }

    // Get all prompt IDs (minted)
    function getAllPrompts() external view returns (uint256[] memory) {
        uint256[] memory allPrompts = new uint256[](_tokenIds);
        for (uint256 i = 0; i < _tokenIds; i++) {
            allPrompts[i] = i + 1;
        }
        return allPrompts;
    }

    // Get all listed prompt IDs
    function getAllListedPrompts() external view returns (uint256[] memory) {
        uint256[] memory temp = new uint256[](_tokenIds);
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (listings[i].isListed) {
                temp[count] = i;
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = temp[j];
        }
        return result;
    }

    // Get all prompt IDs owned by a specific address
    function getPromptsByOwner(address owner) external view returns (uint256[] memory) {
        uint256[] memory temp = new uint256[](_tokenIds);
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    temp[count] = i;
                    count++;
                }
            } catch {}
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = temp[j];
        }
        return result;
    }

    // Get prompt details (owner and URI)
    function getPromptDetails(uint256 tokenId) external view returns (address owner, string memory uri) {
        owner = ownerOf(tokenId);
        uri = tokenURI(tokenId);
    }

    // Pause/unpause contract (owner only)
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    // Withdraw contract balance (owner only)
    function withdrawContractBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    // Royalty management (owner only)
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }
    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }
    function resetTokenRoyalty(uint256 tokenId) external onlyOwner {
        _resetTokenRoyalty(tokenId);
    }

    // ERC165 support
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Allow contract to receive ETH
    receive() external payable {}
}