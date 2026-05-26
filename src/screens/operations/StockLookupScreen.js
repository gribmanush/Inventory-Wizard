import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dbSearchProducts, dbGetProductByBarcode } from '../../database/database';
import BarcodeScannerModal from '../../components/BarcodeScannerModal';
import HelpModal from '../../components/HelpModal';
import useHelpModal from '../../hooks/useHelpModal';

export default function StockLookupScreen({ navigation, route }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [query, setQuery] = useState(route?.params?.prefill || '');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const { helpVisible, showHelp, hideHelp } = useHelpModal('StockLookup');

  useEffect(() => {
    if (route?.params?.prefill) {
      handleSearch(route.params.prefill);
    }
  }, [route?.params?.prefill]);

  const handleSearch = async (q) => {
    const term = (q !== undefined ? q : query).trim();
    if (!term) { setResults([]); setSearched(false); return; }
    setSearched(true);
    const found = await dbSearchProducts(term, user.user_id);
    setResults(found);
  };

  const s = makeStyles(colors);

  const renderItem = ({ item }) => {
    const isLow = item.low_stock_threshold > 0 && item.quantity <= item.low_stock_threshold;
    return (
      <TouchableOpacity
        style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.75}
      >
        {item.image_uri ? (
          <Image source={{ uri: item.image_uri }} style={s.cardImage} />
        ) : (
          <View style={[s.cardIcon, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="cube-outline" size={24} color={colors.primary} />
          </View>
        )}
        <View style={s.cardBody}>
          <Text style={[s.cardName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[s.cardSub, { color: colors.textSecondary }]}>
            {item.brand ? `${item.brand} · ` : ''}{item.barcode || 'No barcode'}
          </Text>
          {item.sku ? <Text style={[s.cardSub, { color: colors.textSecondary }]}>SKU: {item.sku}</Text> : null}
        </View>
        <View style={s.cardRight}>
          <Text style={[s.cardQty, { color: isLow ? colors.error : colors.success }]}>
            {item.quantity}
          </Text>
          <Text style={[s.cardQtyLabel, { color: colors.textSecondary }]}>in stock</Text>
          {isLow && (
            <View style={[s.lowBadge, { backgroundColor: colors.error + '18' }]}>
              <Text style={[s.lowBadgeText, { color: colors.error }]}>Low</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Stock Lookup</Text>
        <TouchableOpacity onPress={showHelp} style={{ width: 40, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={s.searchWrap}>
        <View style={[s.searchRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[s.searchInput, { color: colors.text }]}
            placeholder="Search by name, barcode, SKU..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={v => { setQuery(v); if (!v.trim()) { setResults([]); setSearched(false); } }}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setScannerVisible(true)}>
              <Ionicons name="barcode-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[s.searchBtn, { backgroundColor: colors.primary }]}
          onPress={() => handleSearch()}
        >
          <Ionicons name="search" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={item => String(item.product_id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          searched ? (
            <View style={s.empty}>
              <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
              <Text style={[s.emptyText, { color: colors.textSecondary }]}>
                No products found for "{query}"
              </Text>
            </View>
          ) : (
            <View style={s.empty}>
              <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
              <Text style={[s.emptyText, { color: colors.textSecondary }]}>
                Search by name, barcode or SKU
              </Text>
            </View>
          )
        }
      />

      <BarcodeScannerModal
        visible={scannerVisible}
        onScanned={data => { setScannerVisible(false); setQuery(data); handleSearch(data); }}
        onClose={() => setScannerVisible(false)}
      />
      <HelpModal visible={helpVisible} onClose={hideHelp} screenKey="StockLookup" />
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
    searchWrap: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: 12, paddingVertical: 10,
    },
    searchRow: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4,
    },
    searchInput: { flex: 1, fontSize: 14, paddingVertical: 9 },
    searchBtn: {
      width: 44, height: 44, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
    },
    list: { padding: 12, paddingBottom: 30 },
    card: {
      flexDirection: 'row', alignItems: 'center',
      borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1,
    },
    cardIcon: {
      width: 46, height: 46, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    cardImage: { width: 46, height: 46, borderRadius: 12, marginRight: 12 },
    cardBody: { flex: 1 },
    cardName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    cardSub: { fontSize: 12 },
    cardRight: { alignItems: 'center', minWidth: 50 },
    cardQty: { fontSize: 22, fontWeight: '700' },
    cardQtyLabel: { fontSize: 11, marginBottom: 4 },
    lowBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    lowBadgeText: { fontSize: 11, fontWeight: '600' },
    empty: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { fontSize: 14, textAlign: 'center' },
  });
}
