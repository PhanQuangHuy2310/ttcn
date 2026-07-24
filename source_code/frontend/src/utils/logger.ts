/**
 * FILE: logger.ts
 * MÔ TẢ: Tiện ích ghi log có cấu trúc (Structured Logging) cho dự án.
 * Đóng vai trò là trung tâm theo dõi lỗi ở Frontend.
 * Tuân thủ nguyên tắc Observability & Instrumentation: In ra JSON có cấu trúc
 * với correlation_id để dễ truy vết thay vì dùng console.log thông thường.
 */

// Tạo hoặc lấy request ID / session ID ngẫu nhiên cho phiên làm việc này
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('log_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('log_session_id', sessionId);
  }
  return sessionId;
};

// Định dạng log chuẩn
const formatLog = (level: string, event: string, payload: any, error?: Error) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    session_id: getSessionId(),
    url: window.location.href,
    payload,
    error: error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : undefined
  });
};

export const logger = {
  info: (event: string, payload: any = {}) => {
    console.info(formatLog('info', event, payload));
  },
  
  warn: (event: string, payload: any = {}) => {
    console.warn(formatLog('warn', event, payload));
  },
  
  error: (event: string, error: Error | any, payload: any = {}) => {
    // Trong môi trường Production (chạy thực tế), bạn có thể thêm logic 
    // gửi log này về Backend hoặc hệ thống tracking như Sentry, LogRocket tại đây.
    
    const formattedLog = formatLog('error', event, payload, error instanceof Error ? error : new Error(String(error)));
    console.error(formattedLog);
    
    // Ví dụ: fetch('/api/logs', { method: 'POST', body: formattedLog })
  }
};
