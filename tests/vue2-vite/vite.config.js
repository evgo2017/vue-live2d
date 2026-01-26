import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 8158,
        host: true
    }
})
