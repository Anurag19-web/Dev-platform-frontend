import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store.jsx';
import "./i18n";
import { SavedPostsProvider } from './context/SavedPosts.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SavedPostsProvider>
        <App />
      </SavedPostsProvider>
    </Provider>
  </StrictMode>,
)
