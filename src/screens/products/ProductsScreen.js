import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, TextInput, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { dbGetProductsByUser, dbSearchProducts, dbGetLowStockProducts } from '../../database/database';

export default function ProductsScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [user])
  );

  const loadProducts = async () => {
    if (!user) return;
    setProducts(await dbGetProductsByUser(user.user_id));
    setShowLowStockOnly(false);
    setQuery('');
  };

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.trim()) {
      setProducts(await dbSearchProducts(text.trim(), user.user_id));
    } else {
      setProducts(await dbGetProductsByUser(user.user_id));
    }
  };

  const toggleLowStock = async () => {
    if (!showLowStockOnly) {
      setProducts(await dbGetLowStockProducts(user.user_id));
      setShowLowStockOnly(true);
      setQuery('');
    } else {
      setProducts(await dbGetProductsByUser(user.user_id));
      setShowLowStockOnly(false);
    }
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
        <Text style={[s.title, { color: colors.text }]}>Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={s.addBtn}>
          <Ionicons name="add" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={s.filterBar}>
        <View style={[s.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <TextInput
            style={[s.searchInput, { color: colors.text }]}
            placeholder="Search by name, SKU, barcode..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={[s.filterBtn, { backgroundColor: showLowStockOnly ? colors.error : colors.surface, borderColor: colors.border }]}
          onPress={toggleLowStock}
        >
          <Ionicons name="warning-outline" size={18} color={showLowStockOnly ? '#fff' : colors.error} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => String(item.product_id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
            <Text style={[s.emptyText, { color: colors.textSecondary }]}>
              {query || showLowStockOnly ? 'No products match your search.' : 'No products yet.\nTap + to add your first product.'}
            </Text>
          </View>
        }
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
    title: { fontSize: 18, fontWeight: '700' },
    addBtn: { width: 40, alignItems: 'flex-end' },
    filterBar: {
      flexDirection: 'row', gap: 8, padding: 12,
    },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1,
    },
    searchInput: { flex: 1, fontSize: 14, padding: 0 },
    filterBtn: {
      width: 42, height: 42, borderRadius: 10, alignItems: 'center',
      justifyContent: 'center', borderWidth: 1,
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
    cardImage: {
      width: 46, height: 46, borderRadius: 12, marginRight: 12,
    },
    cardBody: { flex: 1 },
    cardName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    cardSub: { fontSize: 12 },
    cardRight: { alignItems: 'center', minWidth: 50 },
    cardQty: { fontSize: 22, fontWeight: '700' },
    cardQtyLabel: { fontSize: 11, marginBottom: 4 },
    lowBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    lowBadgeText: { fontSize: 11, fontWeight: '600' },
    empty: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  });
}
