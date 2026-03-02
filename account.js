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

        let profileData;
        const contentType = profileRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            profileData = await profileRes.json();
        } else {
            const text = await profileRes.text();
            throw new Error(`Server error (${profileRes.status})`);
        }

        if (!profileRes.ok) {
            throw new Error(profileData.msg || profileData.message || 'Failed to fetch profile');
        }

        if (profileData) {
            const profileInfoDiv = document.getElementById('profile-info');
            profileInfoDiv.innerHTML = `
                <h3>${profileData.username || 'User'}</h3>
                <p><strong>Name:</strong> ${profileData.firstName || ''} ${profileData.lastName || ''}</p>
                <p><strong>Email:</strong> ${profileData.email || ''}</p>
                <p><strong>Joined:</strong> ${profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}</p>
            `;
        }
    } catch (err) {
        console.error('Error loading profile:', err);
        document.getElementById('profile-info').innerHTML = `<p style="color:red; background:#fff5f5; padding:10px; border-radius:4px; border:1px solid #feb2b2;">${err.message}</p>`;
    }

    // Load Orders
    try {
        const orderRes = await fetch(`/api/orders/user/${userId}`);

        let orders;
        const contentType = orderRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            orders = await orderRes.json();
        } else {
            throw new Error(`Server error (${orderRes.status})`);
        }

        if (!orderRes.ok) {
            throw new Error(orders.msg || orders.message || 'Failed to fetch orders');
        }

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
