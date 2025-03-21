import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Check if .env file exists
  const envPath = path.resolve(process.cwd(), '.env');
  const envExists = fs.existsSync(envPath);
  
  console.log('----------------------------------------');
  console.log('Vite Environment Setup:');
  console.log(`- Current Mode: ${mode}`);
  console.log(`- .env file exists: ${envExists}`);
  console.log(`- .env file path: ${envPath}`);
  console.log('- Environment variables with VITE_ prefix:');
  Object.keys(env).forEach(key => {
    if (key.startsWith('VITE_')) {
      console.log(`  - ${key}: ${key.includes('KEY') ? '[SECRET]' : env[key]}`);
    }
  });
  console.log('----------------------------------------');
  
  return {
    plugins: [react()],
    base: './', // Set base path for GitHub Pages
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Avoid clearing the output directory
      emptyOutDir: true,
      // Generate relative paths in the build output
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    define: {
      // Make the VITE_OPENAI_API_KEY explicitly available
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY || ''),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
    }
  }
})
