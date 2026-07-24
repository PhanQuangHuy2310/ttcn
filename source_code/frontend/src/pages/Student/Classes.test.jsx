import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import StudentClasses from './Classes';
import { classesService } from '../../services/supabaseService';

// Mock Supabase service
vi.mock('../../services/supabaseService', () => ({
  classesService: {
    getEnrolledByStudent: vi.fn(),
    joinByCode: vi.fn(),
  }
}));

// Mock AppLayout to avoid rendering sidebar/header complexity
vi.mock('../../components/AppLayout', () => ({
  default: ({ children }) => <div data-testid="app-layout">{children}</div>
}));

const mockReducer = (state = { profile: { id: 'student-123' } }, action) => state;

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: {
      auth: mockReducer,
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('StudentClasses Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    // Return a promise that doesn't resolve immediately to keep it in loading state
    classesService.getEnrolledByStudent.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<StudentClasses />);
    
    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
  });

  it('should render empty state when no classes', async () => {
    classesService.getEnrolledByStudent.mockResolvedValue({ data: [], error: null });
    
    renderWithProviders(<StudentClasses />);
    
    await waitFor(() => {
      expect(screen.getByText('Bạn chưa đăng ký lớp học nào')).toBeInTheDocument();
    });
  });

  it('should render class cards when enrollments exist', async () => {
    const mockEnrollments = [
      {
        id: 1,
        classes: {
          id: 'cls-1',
          name: 'Toán cao cấp A1',
          code: 'TOAN01',
          courses: { subject: 'Toán học', semester: '1', users: { full_name: 'Nguyễn Văn A' } }
        }
      },
      {
        id: 2,
        classes: {
          id: 'cls-2',
          name: 'Lập trình C++',
          code: 'IT01',
          courses: { subject: 'CNTT', semester: '2', users: { full_name: 'Trần Văn B' } }
        }
      }
    ];
    
    classesService.getEnrolledByStudent.mockResolvedValue({ data: mockEnrollments, error: null });
    
    renderWithProviders(<StudentClasses />);
    
    await waitFor(() => {
      expect(screen.getByText('Toán cao cấp A1')).toBeInTheDocument();
      expect(screen.getByText('Lập trình C++')).toBeInTheDocument();
      expect(screen.getByText('GV: Nguyễn Văn A')).toBeInTheDocument();
    });
  });
});
