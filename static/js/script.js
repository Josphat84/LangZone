/**
 * ShopEase Enhanced JavaScript
 * This file contains advanced functionality for the ShopEase e-commerce website
 * 
 * Features:
 * - Sticky navigation
 * - Product quick view
 * - Image zoom effect
 * - Dynamic product filtering
 * - Animated counters
 * - Custom notifications
 * - Smart search suggestions
 * - Recently viewed products
 * - Product comparison
 * - Smooth scrolling
 * - Lazy loading images
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initStickyNavigation();
    initProductQuickView();
    initImageZoomEffect();
    initDynamicFiltering();
    initAnimatedCounters();
    initCustomNotifications();
    initSmartSearch();
    initRecentlyViewed();
    initProductComparison();
    initSmoothScrolling();
    initLazyLoading();
    initMegaMenu();
    initColorThemeSwitcher();
    initCurrencySwitcher();
    initBackToTop();
});

/**
 * Sticky Navigation
 * Makes the navigation bar stick to the top when scrolling down
 */
function initStickyNavigation() {
    const nav = document.querySelector('nav');
    const navTop = nav.offsetTop;
    
    function handleScroll() {
        if (window.scrollY >= navTop) {
            document.body.classList.add('sticky-nav');
            nav.classList.add('fixed');
        } else {
            document.body.classList.remove('sticky-nav');
            nav.classList.remove('fixed');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        .fixed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            animation: slideDown 0.3s ease-out;
        }
        
        .sticky-nav {
            padding-top: ${nav.offsetHeight}px;
        }
        
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Product Quick View
 * Shows a modal with product details when "Quick View" is clicked
 */
function initProductQuickView() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-modal">&times;</button>
            <div class="quick-view-body">
                <div class="product-images">
                    <div class="main-image">
                        <img src="" alt="Product Image">
                    </div>
                    <div class="thumbnail-images"></div>
                </div>
                <div class="product-details">
                    <h2 class="product-title"></h2>
                    <div class="product-price"></div>
                    <div class="product-rating"></div>
                    <p class="product-description"></p>
                    <div class="product-variations">
                        <div class="size-variation">
                            <label>Size:</label>
                            <div class="size-options"></div>
                        </div>
                        <div class="color-variation">
                            <label>Color:</label>
                            <div class="color-options"></div>
                        </div>
                    </div>
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button class="quantity-decrease">-</button>
                            <input type="number" value="1" min="1" max="99">
                            <button class="quantity-increase">+</button>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart-modal">Add to Cart</button>
                        <button class="add-to-wishlist">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add Quick View button to all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.textContent = 'Quick View';
        card.querySelector('.product-image').appendChild(quickViewBtn);
        
        // Quick View click handler
        quickViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openQuickView(card);
        });
    });
    
    // Close modal on close button click
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('open');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
    
    // Quantity control
    const quantityDecrease = modal.querySelector('.quantity-decrease');
    const quantityIncrease = modal.querySelector('.quantity-increase');
    const quantityInput = modal.querySelector('.quantity-controls input');
    
    quantityDecrease.addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    quantityIncrease.addEventListener('click', () => {
        if (quantityInput.value < 99) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });
    
    // Add to cart from modal
    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        const productTitle = modal.querySelector('.product-title').textContent;
        const quantity = parseInt(modal.querySelector('.quantity-controls input').value);
        
        // Update cart count
        let cartCount = parseInt(document.querySelector('.header-actions a:nth-child(3) span').textContent.match(/\d+/)[0]);
        cartCount += quantity;
        document.querySelector('.header-actions a:nth-child(3) span').textContent = `Cart (${cartCount})`;
        
        // Show notification
        showNotification(`${quantity} x ${productTitle} added to cart!`, 'success');
        
        // Close modal
        modal.classList.remove('open');
    });
    
    // Add to wishlist
    modal.querySelector('.add-to-wishlist').addEventListener('click', () => {
        const productTitle = modal.querySelector('.product-title').textContent;
        showNotification(`${productTitle} added to wishlist!`, 'info');
    });
    
    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.9);
            color: #333;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .product-image {
            position: relative;
        }
        
        .product-image:hover .quick-view-btn {
            opacity: 1;
        }
        
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }
        
        .quick-view-modal.open {
            opacity: 1;
            visibility: visible;
        }
        
        .quick-view-content {
            background-color: #fff;
            border-radius: 10px;
            width: 90%;
            max-width: 1000px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            transform: translateY(20px);
            transition: transform 0.3s;
        }
        
        .quick-view-modal.open .quick-view-content {
            transform: translateY(0);
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 1;
        }
        
        .quick-view-body {
            display: flex;
            padding: 30px;
        }
        
        .product-images {
            flex: 1;
            margin-right: 30px;
        }
        
        .main-image {
            margin-bottom: 15px;
            border: 1px solid #eee;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .main-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .thumbnail-images {
            display: flex;
            gap: 10px;
        }
        
        .thumbnail-images img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border: 1px solid #eee;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .thumbnail-images img.active {
            border-color: #4a90e2;
        }
        
        .product-details {
            flex: 1;
        }
        
        .product-title {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .product-price {
            font-size: 24px;
            color: #4a90e2;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .product-description {
            margin: 20px 0;
            color: #666;
            line-height: 1.6;
        }
        
        .product-variations {
            margin-bottom: 20px;
        }
        
        .size-variation, .color-variation {
            margin-bottom: 15px;
        }
        
        .size-options, .color-options {
            display: flex;
            gap: 10px;
            margin-top: 5px;
        }
        
        .size-option {
            width: 40px;
            height: 40px;
            border: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 5px;
        }
        
        .size-option.selected {
            border-color: #4a90e2;
            color: #4a90e2;
            font-weight: 600;
        }
        
        .color-option {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
        }
        
        .color-option.selected:after {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 2px solid #4a90e2;
            border-radius: 50%;
        }
        
        .quantity-selector {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .quantity-selector label {
            margin-right: 15px;
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .quantity-controls button {
            width: 40px;
            height: 40px;
            background: #f5f5f5;
            border: none;
            font-size: 18px;
            cursor: pointer;
        }
        
        .quantity-controls input {
            width: 60px;
            height: 40px;
            border: none;
            text-align: center;
            font-size: 16px;
        }
        
        .product-actions {
            display: flex;
            gap: 15px;
        }
        
        .add-to-cart-modal {
            flex: 1;
            padding: 12px 20px;
            background-color: #4a90e2;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .add-to-cart-modal:hover {
            background-color: #3a7bc8;
        }
        
        .add-to-wishlist {
            padding: 12px 20px;
            background-color: transparent;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .add-to-wishlist:hover {
            background-color: #f5f5f5;
        }
        
        @media screen and (max-width: 768px) {
            .quick-view-body {
                flex-direction: column;
                padding: 15px;
            }
            
            .product-images {
                margin-right: 0;
                margin-bottom: 20px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Function to open quick view modal
    function openQuickView(productCard) {
        const modal = document.querySelector('.quick-view-modal');
        
        // Get product info from the card
        const productImage = productCard.querySelector('.product-image img').src;
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productRating = productCard.querySelector('.product-rating').innerHTML;
        
        // Sample description and variations (would come from database in real app)
        const productDescription = "This premium product is made from high-quality materials designed to last. Perfect for everyday use with a sleek, modern design that matches any style.";
        
        // Fill modal with product info
        modal.querySelector('.main-image img').src = productImage;
        modal.querySelector('.product-title').textContent = productTitle;
        modal.querySelector('.product-price').textContent = productPrice;
        modal.querySelector('.product-rating').innerHTML = productRating;
        modal.querySelector('.product-description').textContent = productDescription;
        
        // Reset quantity
        modal.querySelector('.quantity-controls input').value = 1;
        
        // Sample thumbnails (would be actual product images in real app)
        const thumbnailContainer = modal.querySelector('.thumbnail-images');
        thumbnailContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const thumb = document.createElement('img');
            thumb.src = productImage;
            thumb.alt = 'Product Thumbnail';
            if (i === 0) thumb.classList.add('active');
            thumbnailContainer.appendChild(thumb);
            
            // Thumbnail click handler
            thumb.addEventListener('click', () => {
                modal.querySelectorAll('.thumbnail-images img').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                modal.querySelector('.main-image img').src = thumb.src;
            });
        }
        
        // Sample size options
        const sizeOptions = modal.querySelector('.size-options');
        sizeOptions.innerHTML = '';
        ['S', 'M', 'L', 'XL'].forEach(size => {
            const sizeOption = document.createElement('div');
            sizeOption.className = 'size-option';
            if (size === 'M') sizeOption.classList.add('selected');
            sizeOption.textContent = size;
            sizeOptions.appendChild(sizeOption);
            
            // Size option click handler
            sizeOption.addEventListener('click', () => {
                modal.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                sizeOption.classList.add('selected');
            });
        });
        
        // Sample color options
        const colorOptions = modal.querySelector('.color-options');
        colorOptions.innerHTML = '';
        [
            {name: 'Black', color: '#000'}, 
            {name: 'White', color: '#fff'}, 
            {name: 'Blue', color: '#4a90e2'}, 
            {name: 'Red', color: '#e24a4a'}
        ].forEach(colorOpt => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = colorOpt.color;
            colorOption.title = colorOpt.name;
            if (colorOpt.name === 'Blue') colorOption.classList.add('selected');
            colorOptions.appendChild(colorOption);
            
            // Color option click handler
            colorOption.addEventListener('click', () => {
                modal.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                colorOption.classList.add('selected');
            });
        });
        
        // Open modal
        modal.classList.add('open');
    }
}

/**
 * Image Zoom Effect
 * Adds zoom effect to product images on hover
 */
function initImageZoomEffect() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(container => {
        const img = container.querySelector('img');
        
        container.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.5s ease';
        });
        
        container.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

/**
 * Dynamic Product Filtering
 * Adds the ability to filter products by category, price, etc.
 */
function initDynamicFiltering() {
    // Create filter controls (would be in the sidebar in a real app)
    const filterControls = document.createElement('div');
    filterControls.className = 'product-filters';
    filterControls.innerHTML = `
        <h3>Filter Products</h3>
        <div class="filter-group">
            <h4>Categories</h4>
            <div class="filter-options">
                <label><input type="checkbox" data-filter="category" value="all" checked> All</label>
                <label><input type="checkbox" data-filter="category" value="electronics"> Electronics</label>
                <label><input type="checkbox" data-filter="category" value="fashion"> Fashion</label>
                <label><input type="checkbox" data-filter="category" value="home"> Home & Decor</label>
            </div>
        </div>
        <div class="filter-group">
            <h4>Price Range</h4>
            <div class="price-slider">
                <input type="range" min="0" max="200" value="200" class="price-range" id="price-range">
                <div class="price-value">$0 - $<span id="price-value">200</span></div>
            </div>
        </div>
        <div class="filter-group">
            <h4>Rating</h4>
            <div class="filter-options">
                <label><input type="checkbox" data-filter="rating" value="5"> 5 Star</label>
                <label><input type="checkbox" data-filter="rating" value="4"> 4+ Star</label>
                <label><input type="checkbox" data-filter="rating" value="3"> 3+ Star</label>
            </div>
        </div>
    `;
    
    // Append filter controls to the featured products section
    const featuredProductsSection = document.querySelector('.featured-products');
    if (featuredProductsSection) {
        const productsContainer = document.createElement('div');
        productsContainer.className = 'products-container';
        
        // Move existing products to the new container
        const productsGrid = featuredProductsSection.querySelector('.products-grid');
        productsContainer.appendChild(productsGrid);
        
        // Create a new wrapper for filters and products
        const filtersAndProducts = document.createElement('div');
        filtersAndProducts.className = 'filters-and-products';
        filtersAndProducts.appendChild(filterControls);
        filtersAndProducts.appendChild(productsContainer);
        
        // Insert after the section title
        const sectionTitle = featuredProductsSection.querySelector('.section-title');
        featuredProductsSection.insertBefore(filtersAndProducts, sectionTitle.nextSibling);
    }
    
    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        .filters-and-products {
            display: flex;
            margin-top: 30px;
        }
        
        .product-filters {
            width: 250px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            margin-right: 30px;
        }
        
        .product-filters h3 {
            font-size: 18px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
        }
        
        .filter-group {
            margin-bottom: 20px;
        }
        
        .filter-group h4 {
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .filter-options label {
            display: block;
            margin-bottom: 8px;
            cursor: pointer;
        }
        
        .filter-options input[type="checkbox"] {
            margin-right: 8px;
        }
        
        .price-slider {
            padding: 0 5px;
        }
        
        .price-range {
            width: 100%;
            margin-bottom: 10px;
        }
        
        .price-value {
            font-size: 14px;
            color: #666;
        }
        
        .products-container {
            flex: 1;
        }
        
        @media screen and (max-width: 768px) {
            .filters-and-products {
                flex-direction: column;
            }
            
            .product-filters {
                width: 100%;
                margin-right: 0;
                margin-bottom: 20px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Filter functionality
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const categoryFilters = document.querySelectorAll('input[data-filter="category"]');
    const ratingFilters = document.querySelectorAll('input[data-filter="rating"]');
    
    // Price range handler
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = priceRange.value;
            applyFilters();
        });
    }
    
    // Category filter handler
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            if (filter.value === 'all' && filter.checked) {
                // When "All" is checked, uncheck others
                categoryFilters.forEach(f => {
                    if (f.value !== 'all') f.checked = false;
                });
            } else if (filter.checked) {
                // When any specific category is checked, uncheck "All"
                categoryFilters.forEach(f => {
                    if (f.value === 'all') f.checked = false;
                });
            }
            
            // If no filter is selected, select "All"
            if ([...categoryFilters].every(f => !f.checked)) {
                categoryFilters.forEach(f => {
                    if (f.value === 'all') f.checked = true;
                });
            }
            
            applyFilters();
        });
    });
    
    // Rating filter handler
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            applyFilters();
        });
    });
    
    // Apply all filters
    function applyFilters() {
        const maxPrice = parseInt(priceRange.value);
        const selectedCategories = [...categoryFilters]
            .filter(f => f.checked)
            .map(f => f.value);
        const selectedRatings = [...ratingFilters]
            .filter(f => f.checked)
            .map(f => parseInt(f.value));
        
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            // Get product data
            const price = parseInt(product.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
            
            // In a real application, these would be data attributes on the product
            const category = product.getAttribute('data-category') || 
                             product.querySelector('.product-title').textContent.toLowerCase().includes('headphones') ? 'electronics' : 
                             product.querySelector('.product-title').textContent.toLowerCase().includes('watch') ? 'electronics' : 
                             product.querySelector('.product-title').textContent.toLowerCase().includes('bag') ? 'fashion' : 'home';
            
            const rating = product.querySelector('.product-rating').querySelectorAll('.fa-star').length;
            
            // Apply filters
            const matchesPrice = price <= maxPrice;
            const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(category);
            const matchesRating = selectedRatings.length === 0 || selectedRatings.some(r => rating >= r);
            
            // Show/hide product
            if (matchesPrice && matchesCategory && matchesRating) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    }
}

/**
 * Animated Counters
 * Adds animated number counters for statistics
 */
function initAnimatedCounters() {
    // Create statistics section
    const statsSection = document.createElement('section');
    statsSection.className = 'stats-section';
    statsSection.innerHTML = `
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-number" data-count="5000">0</div>
                <div class="stat-title">Happy Customers</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-box"></i></div>
                <div class="stat-number" data-count="8500">0</div>
                <div class="stat-title">Products Available</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-truck"></i></div>
                <div class="stat-number" data-count="2450">0</div>
                <div class="stat-title">Orders Delivered</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-globe"></i></div>
                <div class="stat-number" data-count="50">0</div>
                <div class="stat-title">Countries Served</div>
            </div>
        </div>
    `;
    
    // Insert before the testimonials section
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        document.body.insertBefore(statsSection, testimonialsSection);
    }
    
    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        .stats-section {
            background-color: #4a90e2;
            color: #fff;
            padding: 60px 5%;
            text-align: center;
        }
        
        .stats-container {
            display: flex;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .stat-item {
            flex: 1;
            padding: 0 20px;
        }
        
        .stat-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .stat-title {
            font-size: 18px;
            opacity: 0.9;
        }
        
        @media screen and (max-width: 768px) {
            .stats-container {
                flex-wrap: wrap;
            }
            
            .stat-item {
                flex: 0 0 50%;
                margin-bottom: 30px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Animation function
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 2000; // Animation duration in milliseconds
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const increment = target / speed * 10; // Update every 10ms
            
            let currentCount = 0;
            const updateCount = () => {
                currentCount += increment;
                if (currentCount < target) {
                    counter.textContent = Math.ceil(currentCount);
                    setTimeout(updateCount, 10);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCount();
        });
    }
    
    // Animate when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(statsSection);
}