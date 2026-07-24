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
import toast, { Toaster } from 'react-hot-toast';
import { logger } from './utils/logger';

// --- GLOBAL ERROR HANDLING CHO MÔI TRƯỜNG THỰC TẾ ---
// Bắt các lỗi runtime chưa được xử lý
window.addEventListener('error', (event) => {
  logger.error('uncaught_exception', event.error, { 
    message: event.message, 
    filename: event.filename, 
    lineno: event.lineno 
  });
  // Hiển thị lỗi ngay trên UI cho người dùng (có thể tắt đi nếu không muốn phơi bày chi tiết)
  toast.error(`Sự cố: ${event.message}`, { duration: 5000, id: 'global-error' });
});

// Bắt các lỗi Promise chưa được xử lý (thường là API calls)
window.addEventListener('unhandledrejection', (event) => {
  logger.error('unhandled_promise_rejection', event.reason);
  const msg = event.reason?.message || 'Đã xảy ra lỗi khi xử lý dữ liệu';
  toast.error(`Lỗi xử lý: ${msg}`, { duration: 5000, id: 'global-promise-error' });
});
// ----------------------------------------------------

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
