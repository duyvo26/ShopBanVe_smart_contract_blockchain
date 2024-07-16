pragma solidity ^0.8.0;

contract QuanLySanPham {
    uint256 public nextProductId = 1;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address owner;
    }

    uint256 constant MAX_PRODUCTS = 100;
    mapping(uint256 => Product) public products; // Use a mapping instead of an array
    uint256[] public productIds; // Maintain a list of product IDs

    event ProductAdded(uint256 productId, string name, uint256 price);
    event ProductPurchased(uint256 productId, address buyer);

    function addProduct(string memory _name, uint256 _price) external {
        require(nextProductId <= MAX_PRODUCTS, "Maximum number of products reached");
        products[nextProductId] = Product(nextProductId, _name, _price, address(0));
        productIds.push(nextProductId); // Add the new product ID to the list
        emit ProductAdded(nextProductId, _name, _price);
        nextProductId++;
    }

    function buyProduct(uint256 _productId) external payable {
        require(_productId > 0 && _productId < nextProductId, "Invalid product ID");
        Product storage product = products[_productId];
        require(product.owner == address(0), "Product is already owned");
        require(msg.value >= product.price, "Insufficient funds");

        product.owner = msg.sender;
        emit ProductPurchased(_productId, msg.sender);
    }

    function getProduct(uint256 _productId) external view returns (uint256 id, string memory name, uint256 price, address owner) {
        require(_productId > 0 && _productId < nextProductId, "Invalid product ID");
        Product storage product = products[_productId];
        return (product.id, product.name, product.price, product.owner);
    }

    function getAllProducts() external view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productIds.length);
        for (uint256 i = 0; i < productIds.length; i++) {
            allProducts[i] = products[productIds[i]];
        }
        return allProducts;
    }
}
