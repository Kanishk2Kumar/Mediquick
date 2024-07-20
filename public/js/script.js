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