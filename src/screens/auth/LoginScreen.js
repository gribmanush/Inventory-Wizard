import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogoFull } from '../../components/Logo';
import { auth } from '../../config/firebase';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = '44479201802-2f6bnafdebk5b84685te6mtgr0v8lr71.apps.googleusercontent.com';
// auth.expo.io proxy URI — must be registered in Google Cloud Console OAuth client
const EXPO_PROXY_REDIRECT_URI = 'https://auth.expo.io/@gribmanush/InventoryWizard';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri: EXPO_PROXY_REDIRECT_URI,
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const idToken = response.params?.id_token;
      if (!idToken) {
        setGoogleLoading(false);
        Alert.alert('Google Sign-In Failed', 'Could not retrieve ID token.');
        return;
      }
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential).catch(e => {
        setGoogleLoading(false);
        Alert.alert('Google Sign-In Failed', e.message);
      });
    } else if (response.type === 'error') {
      setGoogleLoading(false);
      Alert.alert('Google Sign-In Failed', response.error?.message || 'Something went wrong.');
    } else {
      setGoogleLoading(false);
    }
  }, [response]);

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await promptAsync();
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

          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading || googleLoading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Login</Text>}
          </TouchableOpacity>

          <View style={s.dividerRow}>
            <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[s.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            style={[s.googleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleGoogleSignIn}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#4285F4" />
            ) : (
              <>
                <GoogleLogo />
                <Text style={[s.googleBtnText, { color: colors.text }]}>Continue with Google</Text>
              </>
            )}
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

function GoogleLogo() {
  return (
    <View style={googleLogoStyles.container}>
      <Text style={googleLogoStyles.g}>G</Text>
    </View>
  );
}

const googleLogoStyles = StyleSheet.create({
  container: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 1, elevation: 1,
  },
  g: { fontSize: 14, fontWeight: '700', color: '#4285F4' },
});

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
      marginBottom: 20,
    },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    dividerRow: {
      flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10,
    },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { fontSize: 13 },
    googleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 14,
      marginBottom: 24,
    },
    googleBtnText: { fontSize: 15, fontWeight: '600' },
    switchRow: { flexDirection: 'row', justifyContent: 'center' },
    switchText: { fontSize: 14 },
    switchLink: { fontSize: 14, fontWeight: '600' },
  });
}
