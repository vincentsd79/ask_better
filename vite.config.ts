import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    console.log('Vite config - Loading env vars:', { 
      VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing'
    });
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '~': path.resolve(__dirname, '.'),
        }
      }
    };
});
