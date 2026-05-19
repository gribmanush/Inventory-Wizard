import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function TermsScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>Terms and Conditions</Text>
        <Text style={[styles.updated, { color: colors.textSecondary }]}>Last updated: 24th March 2026</Text>

        {[
          { title: '1. Free Period', body: 'Inventory Wizard is free to use for the first two years from your account sign-up date. After this period, a subscription fee may apply to continue accessing premium features.' },
          { title: '2. Data Storage', body: 'All inventory data is stored locally on your device. You are responsible for backing up your data. We are not liable for any data loss due to device failure or app uninstallation.' },
          { title: '3. Acceptable Use', body: 'You agree to use Inventory Wizard for lawful business purposes only. Abuse of the platform, including entering offensive or inappropriate content, will result in account termination.' },
          { title: '4. Privacy', body: 'We do not collect or transmit your personal or business data to any third party. All data remains on your device unless you choose to enable cloud sync in a future update.' },
          { title: '5. Limitation of Liability', body: 'Inventory Wizard is provided "as is". We make no warranties regarding accuracy or fitness for a particular purpose. We are not liable for business losses arising from use of the app.' },
          { title: '6. Changes to Terms', body: 'We reserve the right to update these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.' },
        ].map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40 },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  updated: { fontSize: 12, marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  body: { fontSize: 13, lineHeight: 21 },
});
