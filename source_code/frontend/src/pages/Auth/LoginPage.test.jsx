import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from './LoginPage';

// Mock slice reducer
const mockReducer = (state = { user: null, loading: false, error: null }, action) => state;

const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: {
      auth: mockReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

// We mock the dispatch to verify if loginThunk was called
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe('LoginPage Form Validation', () => {
  
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('should show error when email does not contain @', () => {
    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('email@truong.edu.vn');
    
    // Type invalid email and blur
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
  });

  it('should show error when password is less than 6 characters', () => {
    renderWithProviders(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    // Type short password and blur
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);
    
    expect(screen.getByText('Mật khẩu quá ngắn')).toBeInTheDocument();
  });

  it('should not submit and show errors if form is invalid on submit', () => {
    renderWithProviders(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: /đăng nhập/i });
    
    // Submit empty form
    fireEvent.click(submitBtn);
    
    expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
    expect(screen.getByText('Mật khẩu quá ngắn')).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch login action when form is valid', () => {
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('email@truong.edu.vn');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /đăng nhập/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitBtn);
    
    expect(screen.queryByText('Email không hợp lệ')).not.toBeInTheDocument();
    expect(screen.queryByText('Mật khẩu quá ngắn')).not.toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalled();
  });
});
