import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 3000,
        // Proxy is only for local dev. Production uses VITE_API_URL.
        proxy: {
            '/api': {
                target: 'https://college-placement-management-production.up.railway.app',
                changeOrigin: true,
            },
        },
    },
})
