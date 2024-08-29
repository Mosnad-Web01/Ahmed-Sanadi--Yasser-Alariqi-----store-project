'use strict';

const CONTAINER = document.getElementById('cart-container');

// Helper function to render the cart items
const renderCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    CONTAINER.innerHTML = `<p class="text-center">Your cart is empty.</p>`;
    return;
  }

  let cartTable = `
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((item, index) => {
    cartTable += `
      <tr>
        <td>
          <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover;" class="me-2">
          ${item.title}
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary" data-action="decrease" data-index="${index}">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" data-action="increase" data-index="${index}">+</button>
        </td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-danger" data-action="remove" data-index="${index}">Remove</button>
        </td>
      </tr>
    `;
  });

  cartTable += `
      </tbody>
    </table>
  `;

  CONTAINER.innerHTML = cartTable;

  // Re-attach event listeners after rendering
  document.querySelectorAll('button[data-action]').forEach(button => {
    button.addEventListener('click', handleCartAction);
  });
};

// Handle cart actions (increase, decrease, remove)
const handleCartAction = (event) => {
  const button = event.target;
  const action = button.getAttribute('data-action');
  const index = parseInt(button.getAttribute('data-index'), 10);
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (action === 'increase') {
    cart[index].quantity += 1;
  } else if (action === 'decrease') {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else if (action === 'remove') {
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart(); // Re-render the cart after updating
};

// Update cart count in the navbar or elsewhere
const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');

  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
};

// Proceed to checkout (for now, just clear the cart and show a message)
const proceedToCheckout = () => {
  alert('Proceeding to checkout...');
  localStorage.removeItem('cart');
  updateCartCount();
  renderCart();
};

// Initialize the cart page
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  document.getElementById('checkout-btn').addEventListener('click', proceedToCheckout);
});
