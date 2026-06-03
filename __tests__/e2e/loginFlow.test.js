// E2E test: simulates a real user filling in the login form and submitting it.
// Uses React Native Testing Library to render the screen and fire user events.

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(() => () => {}),
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: { credential: jest.fn() },
  signInWithCredential: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  setDoc: jest.fn(),
}));

jest.mock('../../src/config/firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useIdTokenAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(() => Promise.resolve({ success: true })),
    user: null,
    loading: false,
  }),
}));

jest.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff', surface: '#f9f9f9', primary: '#6366F1',
      text: '#111', textSecondary: '#666', border: '#ddd',
      inputBg: '#f5f5f5', error: '#ef4444',
    },
  }),
}));

jest.mock('../../src/components/Logo', () => ({
  LogoFull: () => null,
}));

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/auth/LoginScreen';

const mockNavigation = { navigate: jest.fn() };

describe('Login Screen — E2E Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input, password input, and login button', () => {
    const { getByTestId, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    expect(getByTestId('login-email')).toBeTruthy();
    expect(getByTestId('login-password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('shows validation error when login is attempted with empty fields', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(getByText('Email is required.')).toBeTruthy();
    });
  });

  it('shows email format error for invalid email', async () => {
    const { getByTestId, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    fireEvent.changeText(getByTestId('login-email'), 'notanemail');
    fireEvent.changeText(getByTestId('login-password'), 'password123');
    fireEvent.press(getByText('Login'));
    await waitFor(() => {
      expect(getByText('Enter a valid email address.')).toBeTruthy();
    });
  });

  it('navigates to Signup when Sign up link is pressed', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    fireEvent.press(getByText('Sign up'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Signup');
  });
});
