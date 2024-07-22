const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () =>
  container.classList.add('right-panel-active')
);

signInButton.addEventListener('click', () =>
  container.classList.remove('right-panel-active')
);
// Homepage JS
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});
let next = document.querySelector('.slider-next');
let prev = document.querySelector('.slider-prev');
let sliderWrapper = document.querySelector('.slider-wrapper');
let slideItems = document.querySelectorAll('.slide-item');

function nextSlide() {
  sliderWrapper.appendChild(slideItems[0]);
  slideItems = document.querySelectorAll('.slide-item'); // Update the list of slide items
}

function prevSlide() {
  sliderWrapper.prepend(slideItems[slideItems.length - 1]);
  slideItems = document.querySelectorAll('.slide-item'); // Update the list of slide items
}

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

// Automatic sliding every 4 seconds
setInterval(nextSlide, 3000);

// Cart Scripts
// Cart
function updatePrice() {
  const cartItems = document.querySelectorAll('.cart-item');
  let subtotal = 0;
  
  cartItems.forEach(item => {
      const price = parseFloat(item.dataset.price);
      const quantity = parseInt(item.querySelector('.item-quantity').value);
      const priceValue = item.querySelector('.price-value');
      
      const itemTotal = price * quantity;
      priceValue.textContent = itemTotal.toFixed(2);
      
      subtotal += itemTotal;
  });
  
  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function () {
  const itemStatusElements = document.querySelectorAll('.item-status');
  itemStatusElements.forEach(element => {
      if (element.textContent.trim().toLowerCase() === 'in stock') {
          element.style.color = 'green';
      } else {
          element.style.color = 'red';
      }
  });

  updatePrice();  // Initialize price calculation
});

// Search
document.getElementById('searchButton').addEventListener('click', async function() {
  const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  const productContainer = document.getElementById('productContainer');

  try {
      const response = await fetch(`/search?q=${searchQuery}`); // Fetch data from server
      const products = await response.json(); // Parse JSON response

      // Clear previous product cards
      productContainer.innerHTML = '';

      // Create and append new product cards based on filtered products
      products.forEach(product => {
          const card = createProductCard(product); // Create a function to create product cards
          productContainer.appendChild(card);
      });
  } catch (err) {
      console.error(err);
      // Handle error if fetch fails
  }
});

// Nusring Care Slider
const slider = document.getElementById('slider');
let currentIndex = 0;

function updateSlider() {
    const slideWidth = slider.querySelector('.card').clientWidth + 32; // 32 is the gap between cards
    slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function nextSlide() {
    if (currentIndex < slider.querySelectorAll('.card').length - 4) {
        currentIndex++;
        updateSlider();
    }
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
}

updateSlider();
