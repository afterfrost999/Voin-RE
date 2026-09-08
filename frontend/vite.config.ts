// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  appType: 'spa',
  server: {
    host: true,        // ← localhost 대신 true로 (127.0.0.1/::1 모두 수용)
    port: 5174,        // ← 임시로 다른 포트 사용해 SW/충돌 영향 제거
    strictPort: true,
    // https: false,    // ← 명시해도 OK(기본 false)
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
      '/signup/profile-image': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    svgr(),
    mkcert(),                // server.https=true일 때만 실제로 동작
    isProd && VitePWA({      // dev에서는 SW 완전 비활성화
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      workbox: {
        // 서버로 가야 하는 경로(카카오 로그인/콜백, API, 이미지, 웹소켓)는
        // 서비스워커의 SPA 폴백(index.html)에서 제외해 네트워크로 통과시킴
        navigateFallbackDenylist: [/^\/api/, /^\/ws/, /^\/images/],
      },
      manifest: {
        name: 'Voin', short_name: 'Voin', display: 'standalone',
        theme_color: '#ffffff', lang: 'ko-KR',
        icons: [
          { src: 'icons/192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ].filter(Boolean),
})
