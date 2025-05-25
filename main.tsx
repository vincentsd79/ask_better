import { createRoot } from 'react-dom/client';
import App from './src/App';
import { BrowserRouter } from 'react-router-dom';

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  console.error('Root container not found');
}
