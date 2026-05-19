import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { containsProfanity } from '../../utils/profanity';
import { LogoFull } from '../../components/Logo';

// Defined at module level to prevent remount on every re-render (fixes Android keyboard dismissal)
function SignupField({ label, keyboard, secure, showState, setShow, value, onChangeText, error, colors, ...rest }) {
  const s = signupFieldStyles;
  return (
    <View style={s.inputGroup}>
      <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>
      {secure ? (
        <View style={[s.inputRow, { backgroundColor: colors.inputBg, borderColor: error ? colors.error : colors.border }]}>
          <TextInput
            style={[s.input, s.inputFlex, { color: colors.text }]}
            placeholder={label}
            placeholderTextColor={colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!showState}
            {...rest}
          />
          <TouchableOpacity onPress={() => setShow(p => !p)} style={s.eyeBtn}>
            <Text style={[s.eyeText, { color: colors.primary }]}>{showState ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={[s.input, { backgroundColor: colors.inputBg, borderColor: error ? colors.error : colors.border, color: colors.text }]}
          placeholder={label}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboard || 'default'}
          {...rest}
        />
      )}
      {error ? <Text style={[s.errorText, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const signupFieldStyles = StyleSheet.create({
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  inputFlex: { flex: 1, borderWidth: 0 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingRight: 12,
  },
  errorText: { fontSize: 12, marginTop: 4, marginLeft: 4 },
  eyeBtn: { padding: 4 },
  eyeText: { fontSize: 13, fontWeight: '600' },
});

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    fullName: '', email: '', businessName: '', password: '', confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const s = useMemo(() => makeStyles(colors), [colors]);

  const set = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) {
      e.fullName = 'Full name is required.';
    } else if (containsProfanity(form.fullName)) {
      e.fullName = 'Name contains inappropriate language.';
    }
    if (!form.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (form.businessName && containsProfanity(form.businessName)) {
      e.businessName = 'Business name contains inappropriate language.';
    }
    if (!form.password) {
      e.password = 'Password is required.';
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    }
    if (!form.confirmPassword) {
      e.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match.';
    }
    if (!termsAccepted) {
      e.terms = 'You must accept the Terms & Conditions.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await signup({
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      businessName: form.businessName.trim() || undefined,
    });
    setLoading(false);
    if (!result.success) {
      Alert.alert('Sign Up Failed', result.error);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.flex}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.logoArea}>
            <LogoFull width={260} dark={false} />
          </View>

          <Text style={s.heading}>Create a new account</Text>

          <SignupField
            label="Full Name"
            value={form.fullName}
            onChangeText={v => set('fullName', v)}
            error={errors.fullName}
            colors={colors}
            autoCapitalize="words"
          />
          <SignupField
            label="Email"
            value={form.email}
            onChangeText={v => set('email', v)}
            error={errors.email}
            colors={colors}
            keyboard="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <SignupField
            label="Business Name (Optional)"
            value={form.businessName}
            onChangeText={v => set('businessName', v)}
            error={errors.businessName}
            colors={colors}
            autoCapitalize="words"
          />
          <SignupField
            label="Password"
            value={form.password}
            onChangeText={v => set('password', v)}
            error={errors.password}
            colors={colors}
            secure
            showState={showPass}
            setShow={setShowPass}
          />
          <SignupField
            label="Repeat Password"
            value={form.confirmPassword}
            onChangeText={v => set('confirmPassword', v)}
            error={errors.confirmPassword}
            colors={colors}
            secure
            showState={showConfirm}
            setShow={setShowConfirm}
          />

          <TouchableOpacity
            style={s.termsRow}
            onPress={() => { setTermsAccepted(p => !p); setErrors(e => ({ ...e, terms: undefined })); }}
          >
            <View style={[s.checkbox, { borderColor: colors.primary }, termsAccepted && { backgroundColor: colors.primary }]}>
              {termsAccepted && <Text style={s.checkmark}>✓</Text>}
            </View>
            <View style={s.termsTextWrap}>
              <Text style={[s.termsText, { color: colors.textSecondary }]}>I agree to the </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={[s.termsLink, { color: colors.primary }]}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {errors.terms && <Text style={[s.errorText, { marginBottom: 8 }]}>{errors.terms}</Text>}

          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Create Account</Text>}
          </TouchableOpacity>

          <View style={s.switchRow}>
            <Text style={[s.switchText, { color: colors.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[s.switchLink, { color: colors.primary }]}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, padding: 24 },
    logoArea: { alignItems: 'center', marginBottom: 16, marginTop: 12 },
    heading: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 20 },
    errorText: { color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
    termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, marginTop: 4 },
    checkbox: {
      width: 22, height: 22, borderRadius: 6, borderWidth: 2,
      alignItems: 'center', justifyContent: 'center', marginRight: 10,
    },
    checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
    termsTextWrap: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
    termsText: { fontSize: 13 },
    termsLink: { fontSize: 13, fontWeight: '600' },
    primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 16, marginBottom: 20 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    switchRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
    switchText: { fontSize: 14 },
    switchLink: { fontSize: 14, fontWeight: '600' },
  });
}
