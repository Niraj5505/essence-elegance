document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Products from API
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = ''; // Clear hardcoded

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Handle sale badge
            const saleBadge = product.isSale ? '<span class="sale-badge">Sale!</span>' : '';

            // Handle pricing
            let priceHtml = `<p class="price">₹${product.price.toFixed(2)}</p>`;
            if (product.originalPrice && product.price < product.originalPrice) {
                priceHtml = `<p class="price"><del>₹${product.originalPrice.toFixed(2)}</del> <ins>₹${product.price.toFixed(2)}</ins></p>`;
            }

            productCard.innerHTML = `
                ${saleBadge}
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                ${priceHtml}
                <button class="add-to-cart" data-id="${product._id}">Add to cart</button>
            `;

            productGrid.appendChild(productCard);
        });

        // 2. Attach Event Listeners for "Add to Cart"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });

    } catch (error) {
        console.error('Error fetching products:', error);
    }
});

async function addToCart(e) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    const productId = e.target.getAttribute('data-id');

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id || user._id, // Handle both id formats if inconsistent
                productId: productId,
                quantity: 1
            })
        });

        if (response.ok) {
            alert('Item added to cart!');
            // Optional: Update cart count in header
        } else {
            console.error('Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}
