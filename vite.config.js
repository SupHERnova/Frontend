import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 백엔드가 CORS 헤더를 안 보내서, 개발 중에는 이 프록시로 우회한다.
      // 배포 시엔 백엔드 CORS 허용 또는 동일한 프록시 설정이 필요하다.
      "/api": {
        target: "http://34.64.181.69",
        changeOrigin: true,
      },
    },
  },
})
