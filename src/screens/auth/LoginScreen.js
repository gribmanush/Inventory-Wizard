import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogoFull } from '../../components/Logo';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.flex}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.logoArea}>
            <LogoFull width={260} dark={false} />
          </View>

          <Text style={s.heading}>Login to your Account</Text>

          <View style={s.inputGroup}>
            <TextInput
              style={[s.input, errors.email && s.inputError]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && <Text style={s.errorText}>{errors.email}</Text>}
          </View>

          <View style={s.inputGroup}>
            <View style={[s.inputRow, errors.password && s.inputError]}>
              <TextInput
                style={[s.input, s.inputFlex]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: undefined })); }}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(p => !p)} style={s.eyeBtn}>
                <Text style={[s.eyeText, { color: colors.primary }]}>{showPass ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity style={s.forgotBtn}>
            <Text style={[s.forgotText, { color: colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Login</Text>}
          </TouchableOpacity>

          <View style={s.switchRow}>
            <Text style={[s.switchText, { color: colors.textSecondary }]}>Don't Have an account yet? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[s.switchLink, { color: colors.primary }]}>Sign up</Text>
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
    scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    logoArea: { alignItems: 'center', marginBottom: 32 },
    heading: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 24 },
    inputGroup: { marginBottom: 14 },
    input: {
      backgroundColor: colors.inputBg,
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputFlex: { flex: 1, borderWidth: 0 },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBg,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingRight: 12,
    },
    inputError: { borderColor: colors.error },
    errorText: { color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4 },
    eyeBtn: { padding: 4 },
    eyeText: { fontSize: 13, fontWeight: '600' },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
    forgotText: { fontSize: 13 },
    primaryBtn: {
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      marginBottom: 24,
    },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    switchRow: { flexDirection: 'row', justifyContent: 'center' },
    switchText: { fontSize: 14 },
    switchLink: { fontSize: 14, fontWeight: '600' },
  });
}
