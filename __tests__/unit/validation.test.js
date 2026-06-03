import { validateEmail, validatePassword, validateLoginForm } from '../../src/utils/validation';

// ─── Unit Tests: Email Validation ─────────────────────────────────────────────

describe('validateEmail', () => {
  it('returns an error when email is empty', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('returns an error when email has no @ symbol', () => {
    expect(validateEmail('notanemail')).toBe('Enter a valid email address.');
  });

  it('returns an error when email has no domain extension', () => {
    expect(validateEmail('user@domain')).toBe('Enter a valid email address.');
  });

  it('returns null for a valid email address', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });

  it('returns null for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBeNull();
  });
});

// ─── Unit Tests: Password Validation ──────────────────────────────────────────

describe('validatePassword', () => {
  it('returns an error when password is empty', () => {
    expect(validatePassword('')).toBe('Password is required.');
  });

  it('returns an error when password is null', () => {
    expect(validatePassword(null)).toBe('Password is required.');
  });

  it('returns null for a non-empty password', () => {
    expect(validatePassword('mypassword123')).toBeNull();
  });
});

// ─── Unit Tests: Full Form Validation ─────────────────────────────────────────

describe('validateLoginForm', () => {
  it('returns valid false when both fields are empty', () => {
    const result = validateLoginForm('', '');
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });

  it('returns valid true when both fields are correct', () => {
    const result = validateLoginForm('user@example.com', 'password123');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns only email error when password is provided but email is invalid', () => {
    const result = validateLoginForm('bademail', 'password123');
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeUndefined();
  });
});
