import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // உங்கள் போர்ட் எண் (எ.கா: 5173 அல்லது 3000)
    historyApiFallback: true, // 👈 இதுதான் மிக முக்கியமானது: ரவுட்டிங் எரர் வராமல் தடுக்க உதவும்
  },
})