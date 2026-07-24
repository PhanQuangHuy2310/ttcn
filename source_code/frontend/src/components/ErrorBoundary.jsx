// src/components/ErrorBoundary.jsx
/**
 * FILE: ErrorBoundary.jsx
 * MÔ TẢ: Bắt lỗi runtime trong cây React, hiển thị giao diện thân thiện thay vì màn hình trắng.
 * QUAN TRỌNG: Khi có lỗi, tự động xóa dữ liệu localStorage có khả năng bị corrupt
 *             để ngăn vòng lặp crash (crash loop) khi F5.
 */
import React from 'react';
import { logger } from '../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('react_render_error', error, { componentStack: errorInfo?.componentStack });
  }

  handleReset = () => {
    // Xóa tất cả dữ liệu bài thi bị corrupt trong localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('exam_answers_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Không thể xóa localStorage:', e);
    }
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    // Xóa cache bài thi rồi về trang chủ
    this.handleReset();
    window.location.href = '/student/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-slate-500 mb-2 text-sm">
              Ứng dụng gặp sự cố. Dữ liệu bài thi tạm thời có thể đã bị lỗi.
            </p>
            <p className="text-xs text-slate-400 mb-6 bg-slate-50 rounded-xl p-3 text-left font-mono break-all">
              {this.state.error?.message || 'Lỗi không xác định'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition text-sm"
              >
                Thử lại
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition text-sm"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
