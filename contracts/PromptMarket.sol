// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PromptMarketplace {
    uint public max_prompts = 1000000;
    uint public ETH_to_prompt_price = 1000000000000000; // 0.001 ETH per prompt (in wei)
    uint public total_prompts_sold = 0;
    
    struct Prompt {
        uint promptId;
        string title;
        string description;
        string category;
        string promptText;
        address creator;
        uint price;
        bool isActive;
        uint purchaseCount;
    }
    
    mapping(uint => Prompt) public prompts;
    mapping(address => uint[]) public user_created_prompts;
    mapping(address => uint[]) public user_purchased_prompts;
    mapping(address => mapping(uint => bool)) public has_purchased;
    mapping(address => uint) public user_earnings; // ETH earned from selling prompts
    
    uint public next_prompt_id = 1;
    
    // Events for better tracking
    event PromptCreated(uint indexed promptId, address indexed creator, string title, uint price);
    event PromptPurchased(uint indexed promptId, address indexed buyer, address indexed creator, uint price);
    event PromptDeactivated(uint indexed promptId, address indexed creator);
    event EarningsWithdrawn(address indexed creator, uint amount);
    
    modifier prompt_exists(uint promptId) {
        require(prompts[promptId].creator != address(0), "Prompt does not exist");
        _;
    }
    
    modifier only_creator(uint promptId) {
        require(prompts[promptId].creator == msg.sender, "Only creator can modify this prompt");
        _;
    }
    
    modifier prompt_is_active(uint promptId) {
        require(prompts[promptId].isActive, "Prompt is not active");
        _;
    }
    
    // Create/List a new prompt for sale
    function create_prompt(
        string memory title,
        string memory description,
        string memory category,
        string memory promptText,
        uint price_in_wei
    ) external {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(promptText).length > 0, "Prompt text cannot be empty");
        require(price_in_wei > 0, "Price must be greater than 0");
        
        uint promptId = next_prompt_id;
        next_prompt_id++;
        
        prompts[promptId] = Prompt({
            promptId: promptId,
            title: title,
            description: description,
            category: category,
            promptText: promptText,
            creator: msg.sender,
            price: price_in_wei,
            isActive: true,
            purchaseCount: 0
        });
        
        user_created_prompts[msg.sender].push(promptId);
        
        emit PromptCreated(promptId, msg.sender, title, price_in_wei);
    }
    
    // Buy a prompt
    function buy_prompt(uint promptId) external payable prompt_exists(promptId) prompt_is_active(promptId) {
        Prompt storage prompt = prompts[promptId];
        
        require(msg.sender != prompt.creator, "Cannot buy your own prompt");
        require(msg.value >= prompt.price, "Insufficient payment");
        require(!has_purchased[msg.sender][promptId], "Already purchased this prompt");
        
        // Mark as purchased
        has_purchased[msg.sender][promptId] = true;
        user_purchased_prompts[msg.sender].push(promptId);
        
        // Update prompt stats
        prompt.purchaseCount++;
        total_prompts_sold++;
        
        // Add earnings to creator
        user_earnings[prompt.creator] += prompt.price;
        
        // Refund excess payment
        if (msg.value > prompt.price) {
            payable(msg.sender).transfer(msg.value - prompt.price);
        }
        
        emit PromptPurchased(promptId, msg.sender, prompt.creator, prompt.price);
    }
    
    // Get prompt details (only if purchased or creator)
    function get_prompt_details(uint promptId) external view prompt_exists(promptId) returns (
        uint id,
        string memory title,
        string memory description,
        string memory category,
        string memory promptText,
        address creator,
        uint price,
        bool isActive,
        uint purchaseCount
    ) {
        Prompt memory prompt = prompts[promptId];
        
        // Allow creator to see full details
        if (msg.sender == prompt.creator) {
            return (
                prompt.promptId,
                prompt.title,
                prompt.description,
                prompt.category,
                prompt.promptText,
                prompt.creator,
                prompt.price,
                prompt.isActive,
                prompt.purchaseCount
            );
        }
        
        // Allow buyers to see full details if they purchased
        if (has_purchased[msg.sender][promptId]) {
            return (
                prompt.promptId,
                prompt.title,
                prompt.description,
                prompt.category,
                prompt.promptText,
                prompt.creator,
                prompt.price,
                prompt.isActive,
                prompt.purchaseCount
            );
        }
        
        // Others can only see basic info
        return (
            prompt.promptId,
            prompt.title,
            prompt.description,
            prompt.category,
            "Purchase to view prompt text",
            prompt.creator,
            prompt.price,
            prompt.isActive,
            prompt.purchaseCount
        );
    }
    
    // Get basic prompt info (public view)
    function get_prompt_preview(uint promptId) external view prompt_exists(promptId) returns (
        uint id,
        string memory title,
        string memory description,
        string memory category,
        address creator,
        uint price,
        bool isActive,
        uint purchaseCount
    ) {
        Prompt memory prompt = prompts[promptId];
        return (
            prompt.promptId,
            prompt.title,
            prompt.description,
            prompt.category,
            prompt.creator,
            prompt.price,
            prompt.isActive,
            prompt.purchaseCount
        );
    }
    
    // Deactivate prompt (creator only)
    function deactivate_prompt(uint promptId) external prompt_exists(promptId) only_creator(promptId) {
        prompts[promptId].isActive = false;
        emit PromptDeactivated(promptId, msg.sender);
    }
    
    // Reactivate prompt (creator only)
    function reactivate_prompt(uint promptId) external prompt_exists(promptId) only_creator(promptId) {
        prompts[promptId].isActive = true;
    }
    
    // Update prompt price (creator only)
    function update_prompt_price(uint promptId, uint new_price) external prompt_exists(promptId) only_creator(promptId) {
        require(new_price > 0, "Price must be greater than 0");
        prompts[promptId].price = new_price;
    }
    
    // Withdraw earnings
    function withdraw_earnings() external {
        uint earnings = user_earnings[msg.sender];
        require(earnings > 0, "No earnings to withdraw");
        
        user_earnings[msg.sender] = 0;
        payable(msg.sender).transfer(earnings);
        
        emit EarningsWithdrawn(msg.sender, earnings);
    }
    
    // Get user's created prompts
    function get_my_created_prompts() external view returns (uint[] memory) {
        return user_created_prompts[msg.sender];
    }
    
    // Get user's purchased prompts
    function get_my_purchased_prompts() external view returns (uint[] memory) {
        return user_purchased_prompts[msg.sender];
    }
    
    // Get user's earnings
    function get_my_earnings() external view returns (uint) {
        return user_earnings[msg.sender];
    }
    
    // Check if user has purchased a prompt
    function check_purchase_status(uint promptId) external view returns (bool) {
        return has_purchased[msg.sender][promptId];
    }
    
    // Get total number of prompts
    function get_total_prompts() external view returns (uint) {
        return next_prompt_id - 1;
    }
    
    // Get marketplace stats
    function get_marketplace_stats() external view returns (
        uint totalPrompts,
        uint totalSold,
        uint maxPrompts
    ) {
        return (next_prompt_id - 1, total_prompts_sold, max_prompts);
    }
}