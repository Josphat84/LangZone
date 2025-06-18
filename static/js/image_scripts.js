// This script handles the scrolling functionality for the product gallery

const scrollContainer = document.getElementById('productGallery');

function scrollGallery(direction) {
  const scrollAmount = 300;
  scrollContainer.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
}

// Auto-scroll every 4 seconds
setInterval(() => {
  scrollGallery('right');
}, 4000);
