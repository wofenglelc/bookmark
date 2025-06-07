import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // ⚠️ 要根据你的仓库名填写
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

