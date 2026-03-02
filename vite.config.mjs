import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5005',
                changeOrigin: true,
                secure: false,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, res) => {
                        console.error('proxy error', err);
                        if (!res.headersSent) {
                            res.writeHead(502, {
                                'Content-Type': 'application/json',
                            });
                        }
                        res.end(JSON.stringify({
                            msg: 'Backend server not responding. Make sure your server is running on port 5000.',
                            error: err.message
                        }));
                    });
                },
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
    }
});
