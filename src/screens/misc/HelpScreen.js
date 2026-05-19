import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function HelpScreen({ navigation }) {
  const { colors } = useTheme();

  const faqs = [
    { q: 'How do I add a product?', a: 'Tap "Add Product" on the home screen and fill in the product details.' },
    { q: 'How do I update stock?', a: 'Use the Stocktake feature. Enter the product barcode and the current count to update.' },
    { q: 'What is Stock Lookup?', a: 'Search for a product by barcode or name to view its current details and stock level.' },
    { q: 'How does Pack Order work?', a: 'Enter an SO number, then scan each product barcode and enter the packed amount.' },
    { q: 'How do I export my data?', a: 'Data export functionality will be available in a future update.' },
    { q: 'What is the free period?', a: 'All features are free for 2 years from your sign-up date.' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Help</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
        {faqs.map((item, i) => (
          <View key={i} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.question, { color: colors.primary }]}>{item.q}</Text>
            <Text style={[styles.answer, { color: colors.textSecondary }]}>{item.a}</Text>
          </View>
        ))}
        <View style={styles.contact}>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            Need more help? Contact us at support@inventorywizard.app
          </Text>
        </View>
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
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  card: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  question: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  answer: { fontSize: 13, lineHeight: 20 },
  contact: { marginTop: 8, alignItems: 'center', padding: 16 },
  contactText: { fontSize: 13, textAlign: 'center' },
});
