// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { restoreSessionThunk } from './features/authentication/authenticationSlice';
import App from './App';
import './index.css';

// Restore Supabase session before rendering
store.dispatch(restoreSessionThunk()).finally(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
});
