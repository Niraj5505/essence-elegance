document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userId = user.id || user._id;

    // Load Profile
    try {
        const profileRes = await fetch(`/api/users/${userId}`);

        if (!profileRes.ok) {
            throw new Error('Failed to fetch profile');
        }

        const profileData = await profileRes.json();

        if (profileData) {
            const profileInfoDiv = document.getElementById('profile-info');
            profileInfoDiv.innerHTML = `
                <h3>${profileData.username}</h3>
                <p><strong>Name:</strong> ${profileData.firstName} ${profileData.lastName}</p>
                <p><strong>Email:</strong> ${profileData.email}</p>
                <p><strong>Joined:</strong> ${new Date(profileData.createdAt).toLocaleDateString()}</p>
            `;
        }
    } catch (err) {
        console.error('Error loading profile:', err);
        document.getElementById('profile-info').innerHTML = '<p style="color:red">Error loading profile data.</p>';
    }

    // Load Orders
    try {
        const orderRes = await fetch(`/api/orders/user/${userId}`);
        const orders = await orderRes.json();

        const ordersListDiv = document.getElementById('orders-list');
        ordersListDiv.innerHTML = '';

        if (orders.length === 0) {
            ordersListDiv.innerHTML = '<p>No orders found.</p>';
        } else {
            orders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.classList.add('order-card');

                let statusClass = '';
                switch (order.status) {
                    case 'Pending': statusClass = 'status-pending'; break;
                    case 'Processing': statusClass = 'status-processing'; break;
                    case 'Shipped': statusClass = 'status-shipped'; break;
                    case 'Delivered': statusClass = 'status-delivered'; break;
                    case 'Cancelled': statusClass = 'status-cancelled'; break;
                }

                const date = new Date(order.createdAt).toLocaleDateString();

                let itemsHtml = '';
                // Check if items exist and is array because older orders might differ or schema changed
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        // Product name might be populated or stored. In our schema we store 'name' in item.
                        const itemName = item.name || (item.product && item.product.name) || 'Product';
                        itemsHtml += `<div class="order-item">
                            <span>${itemName} (x${item.quantity})</span>
                            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                        </div>`;
                    });
                }

                orderCard.innerHTML = `
                    <div class="order-header">
                        <div>
                            <strong>Order #${order._id.substring(0, 8)}...</strong><br>
                            <span style="font-size: 0.8rem; color: #888;">${date}</span>
                        </div>
                        <span class="status-badge ${statusClass}">${order.status}</span>
                    </div>
                    <div class="order-items">
                        ${itemsHtml}
                        <div class="order-item" style="border-top: 1px solid #eee; margin-top: 0.5rem; padding-top: 0.5rem; font-weight: 600;">
                            <span>Total</span>
                            <span>₹${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                `;
                ordersListDiv.appendChild(orderCard);
            });
        }
    } catch (err) {
        console.error('Error loading orders:', err);
        document.getElementById('orders-list').innerHTML = '<p style="color:red">Error loading orders.</p>';
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn-profile');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});
