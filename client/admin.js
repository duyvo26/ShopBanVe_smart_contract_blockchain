import Web3 from 'web3';
import configuration from '../build/contracts/QuanLySanPham.json';
import 'bootstrap/dist/css/bootstrap.css';
import ticketImage from './images/ticket.png';

const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
const productContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let account;

const addProduct = async (name, price) => {
    const accounts = await web3.eth.getAccounts();
    await productContract.methods.addProduct(name, price).send({ from: account, gas: '3000000' });

    console.log('Product added successfully');
    displayProducts();
}

const buyProduct = async (productId, price) => {
  try{
        // const accounts = await web3.eth.getAccounts();
    await productContract.methods.buyProduct(productId).send({ from: account, value: price });
    console.log('Product purchased successfully');
    displayProducts();
  }catch (error) {
    alert("Có lỗi xảy ra");
  }

}
function buyProductButtonClicked(event) {
    const productId = event.target.getAttribute('data-id');
    const price = event.target.getAttribute('data-price');
    buyProduct(productId, price);
    // After buying the product, refresh the displayed products
   
}

async function displayProducts() {
    try {
        const productList = await productContract.methods.getAllProducts().call();
        const productListDiv = document.getElementById('productList');
        productListDiv.innerHTML = '';

        const row = document.createElement('div');
        row.classList.add('row');

        productList.forEach(product => {
            const productDiv = createProductCard(product);
            row.appendChild(productDiv);
        });

        productListDiv.appendChild(row);

        // Add click event listeners to the "Buy" buttons
        const buyButtons = document.getElementsByClassName('buy-button');
        for (let i = 0; i < buyButtons.length; i++) {
            buyButtons[i].addEventListener('click', buyProductButtonClicked);
        }
    } catch (error) {
        console.error("Error displaying products:", error);
    }
}

function createProductCard(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('col-lg-3', 'col-md-6', 'mb-4');

    const html = `
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-text product-price">${web3.utils.fromWei(product.price, 'ether')} ETH</p>
                ${
                    product.owner === '0x0000000000000000000000000000000000000000'
                        ? `<button class="btn btn-primary buy-button" data-id="${product.id}" data-price="${product.price}">Buy</button>`
                        : `<h2 class="sold-label">Đã bán</h2>`
                }
                <button class="btn btn-secondary show-info-button" data-price="${product.price}">Show Info</button>
                <div class="info-details" style="display: none;">
                    <p class="converted-price"></p>
                </div>
            </div>
        </div>
    `;
    productDiv.innerHTML = html;

    const showInfoButton = productDiv.querySelector('.show-info-button');
    const infoDetails = productDiv.querySelector('.info-details');
    const convertedPrice = productDiv.querySelector('.converted-price');

    showInfoButton.addEventListener('click', () => {

        convertedPrice.textContent = "ID Mua:\n"+product.owner;
        infoDetails.style.display = 'block';
    });

    return productDiv;
}



function buyProductButtonClicked(event) {
    const productId = event.target.getAttribute('data-id');
    const price = event.target.getAttribute('data-price');
    buyProduct(productId, price);
}

async function getAllProducts() {
    const products = await productContract.methods.getAllProducts().call();
    console.log('All products:', products);
}


    const adSPtButton = document.getElementById("addSPButton");
    
    adSPtButton.addEventListener("click", function() {
        const tenSanPhamInput = document.getElementById("addTenSanPham");
        const giaSanPhamInput = document.getElementById("addGiaSanPham");
        
        const tenSanPham = tenSanPhamInput.value;
        const giaSanPham = giaSanPhamInput.value;
        
        // Gọi hàm addProduct với thông tin sản phẩm
        addProduct(tenSanPham, web3.utils.toWei(giaSanPham, 'ether'));
        
        // Xóa dữ liệu sau khi thêm sản phẩm thành công
        // tenSanPhamInput.value = "";
        // giaSanPhamInput.value = "";
    });


const accountEl = document.getElementById("account");

const main = async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];
    accountEl.innerText = `Tài khoản: ${account}`;
  
    await getAllProducts();
    await displayProducts();

    // addProduct('sp3', web3.utils.toWei('4', 'ether'));
};

// Ensure that you've added the event listener when the page has finished loading.
window.addEventListener('DOMContentLoaded', main);






