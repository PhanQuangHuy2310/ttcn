import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ExamTaking from './ExamTaking';
import { examsService, questionsService, submissionsService } from '../../services/supabaseService';

// Mock Services
vi.mock('../../services/supabaseService', () => ({
  examsService: {
    getById: vi.fn(),
  },
  questionsService: {
    getByExam: vi.fn(),
  },
  submissionsService: {
    startExam: vi.fn(),
    saveProgress: vi.fn(),
    submitWithScore: vi.fn(),
  }
}));

// Mock Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams({ id: 'exam-123' })],
    useNavigate: () => vi.fn(),
  };
});

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

describe('ExamTaking Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render password gate if exam has password and not passed', async () => {
    examsService.getById.mockResolvedValue({
      data: { id: 'exam-123', has_password: true }
    });
    questionsService.getByExam.mockResolvedValue({ data: [] });
    submissionsService.startExam.mockResolvedValue({ data: {} });

    renderWithProviders(<ExamTaking />);

    await waitFor(() => {
      expect(screen.getByText('Phòng thi có mật khẩu')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Mật khẩu phòng thi')).toBeInTheDocument();
    });
  });

  it('should render questions after loading without password', async () => {
    examsService.getById.mockResolvedValue({
      data: { id: 'exam-123', title: 'Test Exam', duration: 60, has_password: false }
    });
    questionsService.getByExam.mockResolvedValue({
      data: [
        { id: 'q1', type: 'MCQ', content: 'What is 1+1?', options: ['1', '2', '3', '4'] }
      ]
    });
    submissionsService.startExam.mockResolvedValue({ data: {} });

    renderWithProviders(<ExamTaking />);

    await waitFor(() => {
      expect(screen.getByText('Test Exam')).toBeInTheDocument();
      expect(screen.getByText('What is 1+1?')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('should handle answer selection and trigger saveProgress', async () => {
    examsService.getById.mockResolvedValue({
      data: { id: 'exam-123', title: 'Test Exam', duration: 60, has_password: false }
    });
    questionsService.getByExam.mockResolvedValue({
      data: [
        { id: 'q1', type: 'MCQ', content: 'What is 1+1?', options: ['1', '2', '3', '4'] }
      ]
    });
    submissionsService.startExam.mockResolvedValue({ data: {} });
    submissionsService.saveProgress.mockResolvedValue({ error: null });

    renderWithProviders(<ExamTaking />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    const optionBtn = screen.getByText('2').closest('button');
    fireEvent.click(optionBtn);

    // After clicking, it should store locally and debounce save to server.
    // We just verify it becomes active/selected.
    expect(optionBtn).toHaveClass('border-primary');
    
    // Fast-forward or just check if saveProgress was eventually called
    await waitFor(() => {
      expect(submissionsService.saveProgress).toHaveBeenCalled();
    }, { timeout: 1500 });
  });

});
