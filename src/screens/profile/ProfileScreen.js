import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dbUpdateUser } from '../../database/database';

export default function ProfileScreen({ navigation, route }) {
  const { user, logout, refreshUser } = useAuth();
  const { colors } = useTheme();

  const initialSection = route?.params?.section || 'account';
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (route?.params?.section) setActiveSection(route.params.section);
  }, [route?.params?.section]);

  const [editForm, setEditForm] = useState({
    fullName: user?.full_name || '',
    businessName: user?.business_name || '',
  });
  const [editLoading, setEditLoading] = useState(false);

  const freePeriodEnd = user?.free_period_end ? new Date(user.free_period_end) : null;
  const now = new Date();
  const daysLeft = freePeriodEnd ? Math.max(0, Math.ceil((freePeriodEnd - now) / (1000 * 60 * 60 * 24))) : 0;
  const totalDays = 730;
  const progress = freePeriodEnd ? Math.min(1, Math.max(0, 1 - (freePeriodEnd - now) / (totalDays * 24 * 60 * 60 * 1000))) : 1;

  const handleSaveDetails = () => {
    if (!editForm.fullName.trim()) { Alert.alert('Error', 'Full name cannot be empty.'); return; }
    setEditLoading(true);
    try {
      dbUpdateUser(user.user_id, { fullName: editForm.fullName.trim(), businessName: editForm.businessName.trim() });
      refreshUser();
      Alert.alert('Success', 'Details updated successfully.');
    } catch {
      Alert.alert('Error', 'Failed to update details.');
    } finally {
      setEditLoading(false);
    }
  };

  const s = makeStyles(colors);

  const tabs = [
    { key: 'account', label: 'Account', icon: 'person-outline' },
    { key: 'premium', label: 'Premium', icon: 'star-outline' },
    { key: 'edit', label: 'Edit', icon: 'create-outline' },
  ];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar + name */}
      <View style={[s.heroSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[s.avatar, { backgroundColor: colors.primary }]}>
          <Text style={s.avatarText}>{user?.full_name?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={[s.heroName, { color: colors.text }]}>{user?.full_name || 'User'}</Text>
        {user?.business_name ? <Text style={[s.heroBusiness, { color: colors.textSecondary }]}>{user.business_name}</Text> : null}
        <Text style={[s.heroEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
      </View>

      {/* Tab bar */}
      <View style={[s.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[s.tab, activeSection === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 }]}
            onPress={() => setActiveSection(tab.key)}
          >
            <Ionicons name={tab.icon} size={18} color={activeSection === tab.key ? colors.primary : colors.textSecondary} />
            <Text style={[s.tabLabel, { color: activeSection === tab.key ? colors.primary : colors.textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Account section */}
        {activeSection === 'account' && (
          <View>
            {[
              { label: 'Full Name', value: user?.full_name },
              { label: 'Email', value: user?.email },
              { label: 'Business Name', value: user?.business_name || '—' },
              { label: 'Member Since', value: user?.signup_date ? new Date(user.signup_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              { label: 'Subscription', value: user?.subscription_status === 'free' ? 'Free Period' : 'Premium' },
            ].map(row => (
              <View key={row.label} style={[s.infoRow, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
                <Text style={[s.infoLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                <Text style={[s.infoValue, { color: colors.text }]}>{row.value || '—'}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={[s.dangerBtn, { borderColor: colors.error, marginTop: 24 }]}
              onPress={() => Alert.alert('Log Out', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout },
              ])}
            >
              <Ionicons name="log-out-outline" size={18} color={colors.error} />
              <Text style={[s.dangerBtnText, { color: colors.error }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Premium section */}
        {activeSection === 'premium' && (
          <View>
            <View style={[s.premiumCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[s.premiumIcon, { backgroundColor: colors.warning + '20' }]}>
                <Ionicons name="star" size={36} color={colors.warning} />
              </View>
              <Text style={[s.premiumTitle, { color: colors.text }]}>Free Period Active</Text>
              <Text style={[s.premiumSub, { color: colors.textSecondary }]}>
                {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining of your 2-year free period
              </Text>

              <View style={[s.progressBar, { backgroundColor: colors.border }]}>
                <View style={[s.progressFill, { width: `${progress * 100}%`, backgroundColor: progress > 0.8 ? colors.error : colors.primary }]} />
              </View>

              <Text style={[s.premiumExpiry, { color: colors.textSecondary }]}>
                Free until: {freePeriodEnd?.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) || '—'}
              </Text>
            </View>

            <View style={[s.featureList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[s.featureListTitle, { color: colors.text }]}>What's included</Text>
              {[
                'Unlimited products',
                'Order management',
                'Stocktake & Stock lookup',
                'Low stock alerts',
                'Local data storage',
                'Light & dark mode',
              ].map(f => (
                <View key={f} style={s.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={[s.featureItemText, { color: colors.text }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Edit Details section */}
        {activeSection === 'edit' && (
          <View>
            <View style={s.fieldGroup}>
              <Text style={[s.label, { color: colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[s.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={editForm.fullName}
                onChangeText={v => setEditForm(p => ({ ...p, fullName: v }))}
                placeholder="Your full name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={s.fieldGroup}>
              <Text style={[s.label, { color: colors.textSecondary }]}>Business Name</Text>
              <TextInput
                style={[s.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={editForm.businessName}
                onChangeText={v => setEditForm(p => ({ ...p, businessName: v }))}
                placeholder="Your business name (optional)"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={[s.infoRow, { borderBottomColor: colors.border, backgroundColor: colors.surface, marginBottom: 20 }]}>
              <Text style={[s.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[s.infoValue, { color: colors.textSecondary }]}>{user?.email} (cannot change)</Text>
            </View>

            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: colors.primary }]}
              onPress={handleSaveDetails}
              disabled={editLoading}
            >
              {editLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    safe: { flex: 1 },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
    },
    backBtn: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    heroSection: {
      alignItems: 'center', padding: 24, paddingBottom: 20, borderBottomWidth: 1,
    },
    avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { color: '#fff', fontSize: 30, fontWeight: '700' },
    heroName: { fontSize: 20, fontWeight: '700', marginBottom: 2 },
    heroBusiness: { fontSize: 14, marginBottom: 2 },
    heroEmail: { fontSize: 13 },
    tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
    tabLabel: { fontSize: 13, fontWeight: '600' },
    scroll: { padding: 16, paddingBottom: 40 },
    infoRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1,
    },
    infoLabel: { fontSize: 13 },
    infoValue: { fontSize: 13, fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 16 },
    dangerBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, paddingVertical: 13, borderRadius: 12, borderWidth: 1.5,
    },
    dangerBtnText: { fontSize: 15, fontWeight: '600' },
    premiumCard: { borderRadius: 14, borderWidth: 1, padding: 20, marginBottom: 16, alignItems: 'center' },
    premiumIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    premiumTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
    premiumSub: { fontSize: 13, textAlign: 'center', marginBottom: 16, lineHeight: 20 },
    progressBar: { height: 8, borderRadius: 4, width: '100%', marginBottom: 10, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
    premiumExpiry: { fontSize: 12 },
    featureList: { borderRadius: 14, borderWidth: 1, padding: 16 },
    featureListTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    featureItemText: { fontSize: 13 },
    fieldGroup: { marginBottom: 14 },
    label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, borderWidth: 1 },
    primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  });
}
