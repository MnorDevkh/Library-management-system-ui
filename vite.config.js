import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: "0.0.0.0"
    },
    proxy: {
      '/api': {
        target: 'http://157.230.33.25:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
    css: {
        preprocessorOptions: {
          less: {
            modifyVars: {
              'font-family': "'Kantumruy', 'KoHo', sans-serif",
            },
            javascriptEnabled: true,
          },
        },
      },
})
