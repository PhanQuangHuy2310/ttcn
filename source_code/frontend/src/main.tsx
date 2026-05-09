// src/main.tsx
/**
 * FILE: main.tsx
 * MÔ TẢ: Điểm đầu vào (Entry point) của ứng dụng React.
 * CHỨC NĂNG: Khởi tạo React DOM, cấu hình Redux Store và gắn ứng dụng vào file index.html.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { restoreSessionThunk } from './features/authentication/authenticationSlice';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

// Restore Supabase session before rendering
store.dispatch(restoreSessionThunk()).finally(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <Toaster position="top-right" />
        <App />
      </Provider>
    </React.StrictMode>
  );
});
