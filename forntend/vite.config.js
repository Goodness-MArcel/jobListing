import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://joblisting-backend-m2wa.onrender.com',
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite: (path) => path.replace(/^\/api/, '/api') // Keep '/api' prefix
  //     },
  //     // '/socket.io': {
  //     //   target: 'http://localhost:3000',
  //     //   ws: true
  //     // }
  //   }
  // }
});
