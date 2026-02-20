// Product Management
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    // ... existing product creation logic mostly ...
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const originalPrice = document.getElementById('originalPrice').value;
    const image = document.getElementById('image').value;
    const category = document.getElementById('category').value;
    const stock = document.getElementById('stock').value;
    const isSale = document.getElementById('isSale').checked;

    const product = {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        image,
        category,
        stock: parseInt(stock),
        isSale
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('Product added successfully!');
            form.reset();
            document.getElementById('image-preview').style.display = 'none';
        } else {
            const errorData = await response.json();
            alert('Error adding product: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error, please try again.');
    }
});

// User Management
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        const tbody = document.querySelector('#users-table tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user._id.substring(0, 8)}...</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('User deleted');
            loadUsers();
        } else {
            alert('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Order Management
async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();

        const tbody = document.querySelector('#orders-table tbody');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            let statusClass = '';

            switch (order.status) {
                case 'Pending': statusClass = 'status-pending'; break;
                case 'Processing': statusClass = 'status-processing'; break;
                case 'Shipped': statusClass = 'status-shipped'; break;
                case 'Delivered': statusClass = 'status-delivered'; break;
                case 'Cancelled': statusClass = 'status-cancelled'; break;
            }

            row.innerHTML = `
                <td>${order._id.substring(0, 8)}...</td>
                <td>${order.user ? order.user.username : 'Unknown'}</td>
                <td>₹${order.totalAmount.toFixed(2)}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                    ${order.status === 'Pending' ? `<button class="action-btn approve-btn" onclick="updateOrderStatus('${order._id}', 'Processing')">Approve</button>` : ''}
                    ${order.status === 'Processing' ? `<button class="action-btn approve-btn" onclick="updateOrderStatus('${order._id}', 'Shipped')">Ship</button>` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function updateOrderStatus(id, status) {
    try {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            alert(`Order status updated to ${status}`);
            loadOrders();
        } else {
            alert('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

// Re-expose functions to window so inline onclick handlers work
window.deleteUser = deleteUser;
window.updateOrderStatus = updateOrderStatus;
window.loadUsers = loadUsers;
window.loadOrders = loadOrders;
