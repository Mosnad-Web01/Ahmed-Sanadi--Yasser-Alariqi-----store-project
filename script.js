'use strict';

const STORE_BASE_URL = 'https://fakestoreapi.com';
const CONTAINER = document.querySelector('.container');

document.body.style = 'background-color: #f8f9fa';

let navbar = `
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-transparent px-5 py-3 border-bottom border-black">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="index.html" id="home-link">MOSNAD</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="about.html" id="about-link">About</a>
          </li>
          <li class="nav-item dropdown" id="categories-dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Categories
            </a>
            <ul class="dropdown-menu" id="categoryDropdown">
              <li><a class="dropdown-item" href="#" data-category="all">All</a></li>
              <li><a class="dropdown-item" href="#" data-category="electronics">Electronics</a></li>
              <li><a class="dropdown-item" href="#" data-category="jewelery">Jewelery</a></li>
              <li><a class="dropdown-item" href="#" data-category="men's clothing">Men's clothing</a></li>
              <li><a class="dropdown-item" href="#" data-category="women's clothing">Women's clothing</a></li>
            </ul>
          </li>
        </ul>
        <div class="d-flex justify-content-end w-100">
          <i role="button" class="fa-solid fa-cart-shopping" style="font-size: 35px;"></i>
          <span id="cart-count" style="font-size: 16px; background-color: red; color: white; border-radius: 50%; width:30px; height: 30px; display: flex; justify-content: center; align-items: center;">0</span>
        </div>
      </div>
    </div>
  </nav>
</div>
`;

let HeaderText = `
<h1 class="text-left container py-4 text-center">All Products</h1>
`;

// Helper function to update cart count in the UI
const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById('cart-count').textContent = cartCount;
};

// Add item to the cart and save to localStorage
const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
};

// Don't touch this function please
const autorun = async () => {
  const products = await fetchProducts();
  renderProducts(products);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${STORE_BASE_URL}/${path}`;
};

// This function is to fetch products. You may need to add it or change some part in it in order to apply some of the features.
const fetchProducts = async () => {
  const url = constructUrl(`products`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one product.
const fetchProduct = async (productId) => {
  const url = constructUrl(`products/${productId}`);
  const res = await fetch(url);
  return res.json();
};

// You may need to add to this function, definitely don't delete it.
const productDetails = async (product) => {
  const res = await fetchProduct(product.id);
  renderProduct(res);
};

// You'll need to play with this function in order to add features and enhance the style.
const renderProducts = (products, category = 'all') => {
  // Update the header text based on the selected category
  const categoryText = category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1);
  HeaderText = `<h1 class="text-left container py-4 text-center">${categoryText}</h1>`;

  CONTAINER.innerHTML = navbar + HeaderText;
  
  const productsContainer = document.createElement('div');
  productsContainer.classList.add('row', 'justify-content-center', 'row-cols-1', 'px-3', 'row-cols-md-2', 'row-cols-lg-3', 'row-cols-xl-4');

  // Show the categories dropdown when rendering products
  document.getElementById('categories-dropdown').style.display = 'block';

  // Filter products if a category is selected
  const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);

  filteredProducts.map((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('col', 'mb-5', 'border', 'p-4', 'bg-white', 'm-3', 'rounded-4', 'shadow');
    productDiv.innerHTML = `
         <div class="card h-100 border-0">
          <img 
            class="card-img-top w-100 p-3 rounded-4 card-img-top zoom-image" 
            style="height: 270px; object-fit: contain;" 
            src="${product.image}" 
            alt="${product.title} poster"
          >
          <div class="card-body">
            <h3 class="fs-5 lh-md mt-3">${product.title}</h3>
            <p class="text-muted">${product.category}</p>
            <p class="fw-bold">$${product.price}</p>
          </div>
          <button class="btn btn-primary py-3 add-to-cart-btn"> Add to cart </button> 
    </div>
          `;

    // Attach event listener to the "Add to cart" button
    productDiv.querySelector('.add-to-cart-btn').addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent triggering the productDetails
      addToCart(product);
      alert('Product added to cart!');
    });

    productDiv.addEventListener('click', () => {
      productDetails(product);
    });

    productsContainer.appendChild(productDiv);
    CONTAINER.appendChild(productsContainer);
  });

  // Re-setup category filter to keep it working after rendering
  setupCategoryFilter();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderProduct = (product) => {
  CONTAINER.innerHTML = `
      <div class="row">
          ${product.title}
      </div>`;
};

// Handle Navigation between pages
// Add event listener for category dropdown
const setupCategoryFilter = async () => {
  const products = await fetchProducts();
  const categoryDropdown = document.getElementById('categoryDropdown');

  // Use event delegation for dropdown items
  categoryDropdown.addEventListener('click', (event) => {
    if (event.target.classList.contains('dropdown-item')) {
      event.preventDefault();
      const category = event.target.getAttribute('data-category');
      renderProducts(products, category);
    }
  });
};

// Ensure the event listener is added only once
document.addEventListener('DOMContentLoaded', async () => {
  await autorun();
  setupCategoryFilter();
  updateCartCount(); // Initialize cart count on page load
});
