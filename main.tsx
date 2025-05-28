import { createRoot } from 'react-dom/client';
import App from './src/App';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './src/contexts/LanguageContext';

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  );
} else {
  console.error('Root container not found');
}
