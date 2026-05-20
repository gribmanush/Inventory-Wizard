import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dbGetProductByBarcodeOrName } from '../../database/database';
import BarcodeScannerModal from '../../components/BarcodeScannerModal';

export default function StockLookupScreen({ navigation, route }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [query, setQuery] = useState(route?.params?.prefill || '');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    if (route?.params?.prefill) {
      handleSearch(route.params.prefill);
    }
  }, []);

  const handleSearch = (q) => {
    const term = (q || query).trim();
    setError('');
    setSearched(true);
    if (!term) { setError('Enter a barcode or product name.'); return; }
    const found = dbGetProductByBarcodeOrName(term, user.user_id);
    if (!found) {
      setProduct(null);
      setError(`No product found for "${term}".`);
    } else {
      setProduct(found);
    }
  };

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Stock Lookup</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={[s.searchRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <TextInput
            style={[s.searchInput, { color: colors.text }]}
            placeholder="Enter Product Barcode or Name"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={v => { setQuery(v); setSearched(false); setProduct(null); setError(''); }}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => { setQuery(''); setProduct(null); setError(''); setSearched(false); }}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setScannerVisible(true)}>
              <Ionicons name="barcode-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={s.btnRow}>
          <TouchableOpacity style={[s.searchBtn, { backgroundColor: colors.primary }]} onPress={() => handleSearch()}>
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={s.searchBtnText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.closeBtn, { borderColor: colors.border }]} onPress={() => navigation.goBack()}>
            <Text style={[s.closeBtnText, { color: colors.textSecondary }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={[s.errorCard, { backgroundColor: colors.error + '12', borderColor: colors.error }]}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
            <Text style={[s.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}

        {product && (
          <View style={[s.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[s.photoPlaceholder, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="cube-outline" size={48} color={colors.primary} />
              <Text style={[s.photoLabel, { color: colors.textSecondary }]}>photo</Text>
            </View>

            {[
              { label: 'Product Name', value: product.name },
              { label: 'Product Brand', value: product.brand || '—' },
              { label: 'Product Barcode', value: product.barcode || '—' },
              { label: 'SKU', value: product.sku || '—' },
              { label: 'Stock In Hand', value: String(product.quantity) },
              { label: 'Low Stock Threshold', value: product.low_stock_threshold > 0 ? String(product.low_stock_threshold) : '—' },
              { label: 'Location', value: product.location || '—' },
              { label: 'Cost Price', value: product.cost_price != null ? `$${Number(product.cost_price).toFixed(2)}` : '—' },
              { label: 'Selling Price', value: product.selling_price != null ? `$${Number(product.selling_price).toFixed(2)}` : '—' },
            ].map(row => (
              <View key={row.label} style={[s.detailRow, { borderBottomColor: colors.divider }]}>
                <Text style={[s.detailLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                <Text style={[s.detailValue, { color: colors.text }]}>{row.value}</Text>
              </View>
            ))}

            {product.low_stock_threshold > 0 && product.quantity <= product.low_stock_threshold && (
              <View style={[s.lowAlert, { backgroundColor: colors.warning + '18' }]}>
                <Ionicons name="warning-outline" size={16} color={colors.warning} />
                <Text style={[s.lowAlertText, { color: colors.warning }]}>Stock is below threshold!</Text>
              </View>
            )}

            <TouchableOpacity style={[s.okBtn, { backgroundColor: colors.primary }]} onPress={() => { setProduct(null); setQuery(''); setSearched(false); }}>
              <Text style={s.okBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <BarcodeScannerModal
        visible={scannerVisible}
        onScanned={data => { setScannerVisible(false); setQuery(data); handleSearch(data); }}
        onClose={() => setScannerVisible(false)}
      />
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
    scroll: { padding: 16, paddingBottom: 40 },
    searchRow: {
      flexDirection: 'row', alignItems: 'center',
      borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 12,
    },
    searchInput: { flex: 1, fontSize: 14, paddingVertical: 10 },
    btnRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    searchBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10 },
    searchBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    closeBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { fontSize: 14 },
    errorCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 12 },
    errorText: { fontSize: 13 },
    resultCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
    photoPlaceholder: { height: 120, alignItems: 'center', justifyContent: 'center' },
    photoLabel: { fontSize: 12, marginTop: 4 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 1 },
    detailLabel: { fontSize: 13, flex: 1 },
    detailValue: { fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' },
    lowAlert: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, margin: 12, borderRadius: 8 },
    lowAlertText: { fontSize: 13, fontWeight: '500' },
    okBtn: { margin: 16, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    okBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
