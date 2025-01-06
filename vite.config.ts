import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { patchCssModules } from 'vite-css-modules';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), patchCssModules()],
    server: {
        port: 3000, 
        host: 'localhost',
    },
});
