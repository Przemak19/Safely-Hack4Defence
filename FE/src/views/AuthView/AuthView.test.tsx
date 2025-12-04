import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthView from './AuthView';
import { useSnackbar } from '../../hooks/useSnackbar';
import {BrowserRouter} from "react-router-dom";
import ApiClient from "../../api/ApiClient.ts";

vi.mock('../../config/apiService', () => ({
  ApiService: {
    post: vi.fn(),
  },
}));

vi.mock('../../hooks/useSnackbar', () => ({
  useSnackbar: vi.fn(),
}));

describe('AuthView', () => {
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSnackbar as any).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it('shows validation errors for login form', async () => {
    render(<AuthView />);

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('shows validation errors for register form', async () => {
    render(<AuthView />);

    await userEvent.click(screen.getByText('Dont have an account? Click to register!'));

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Password confirmation is required')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    (ApiClient.post as any).mockResolvedValueOnce({
      data: { token: 'fake-token' },
    });
    
    render(<AuthView />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(ApiClient.post).toHaveBeenCalledWith('/Auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');

    expect(mockShowSuccess).toHaveBeenCalledWith('Successfully logged in');
  });

  it('handles failed login', async () => {
    (ApiClient.post as any).mockRejectedValueOnce(new Error('Login failed'));
    
    render(<AuthView />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(ApiClient.post).toHaveBeenCalledWith('/Auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockShowError).toHaveBeenCalledWith('Something went wrong');
  });

  it('handles failed registration', async () => {
    (ApiClient.post as any).mockRejectedValueOnce(new Error('Registration failed'));
    
    render(<AuthView />);

    await userEvent.click(screen.getByText('Dont have an account? Click to register!'));

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(ApiClient.post).toHaveBeenCalledWith('/Auth/register', {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    expect(mockShowError).toHaveBeenCalledWith('Something went wrong');
  });

  it('switches to register form and validates empty inputs', async () => {
    render(
        <BrowserRouter>
          <AuthView />
        </BrowserRouter>
    );

    await userEvent.click(screen.getByText(/Dont have an account/i));
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Password confirmation is required')).toBeInTheDocument();
    });
  });

  it('shows error on failed login', async () => {
    (ApiClient.post as any).mockRejectedValueOnce(new Error('Login failed'));

    render(
        <BrowserRouter>
          <AuthView />
        </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Something went wrong');
    });
  });
});