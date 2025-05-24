import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    console.log('Vite config - Loading env vars:', { 
      GEMINI_API_KEY: env.GEMINI_API_KEY ? 'Present' : 'Missing',
      VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing'
    });
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
