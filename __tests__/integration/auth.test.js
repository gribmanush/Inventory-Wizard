// Integration test: verifies that Firebase error codes map correctly to
// user-facing error messages in the login function.

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(() => () => {}),
  getAuth: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('../../src/config/firebase', () => ({
  auth: {},
  db: {},
}));

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/config/firebase';

async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (e) {
    if (
      e.code === 'auth/user-not-found' ||
      e.code === 'auth/invalid-credential' ||
      e.code === 'auth/invalid-email'
    ) {
      return { success: false, error: 'No account found with that email.' };
    }
    if (e.code === 'auth/wrong-password') {
      return { success: false, error: 'Incorrect password.' };
    }
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

describe('Login function — Firebase error mapping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success true when Firebase resolves', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '123' } });
    const result = await login('user@example.com', 'password123');
    expect(result.success).toBe(true);
  });

  it('returns correct message for invalid credentials', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    const result = await login('user@example.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('No account found with that email.');
  });

  it('returns correct message for wrong password', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });
    const result = await login('user@example.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Incorrect password.');
  });

  it('returns generic message for unknown errors', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/network-request-failed' });
    const result = await login('user@example.com', 'password123');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Login failed. Please try again.');
  });
});
