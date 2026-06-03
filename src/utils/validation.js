export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  return null;
}

export function validateLoginForm(email, password) {
  const errors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return { valid: Object.keys(errors).length === 0, errors };
}
