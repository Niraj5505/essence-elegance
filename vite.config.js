const { defineConfig } = require('vite');
const { resolve } = require('path');

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                shop: resolve(__dirname, 'shop.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html'),
                account: resolve(__dirname, 'account.html'),
                admin: resolve(__dirname, 'admin.html'),
                cart: resolve(__dirname, 'cart.html'),
                'reset-password': resolve(__dirname, 'reset-password.html'),
            },
        },
    },
});
