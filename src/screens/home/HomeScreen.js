import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Modal, FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useDrawer } from '../../contexts/DrawerContext';
import { LogoIcon } from '../../components/Logo';
import BarcodeScannerModal from '../../components/BarcodeScannerModal';
import { dbGetLowStockProducts, dbGetNewOrdersCount, dbSearchProducts } from '../../database/database';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { openDrawer } = useDrawer();

  const [lowStockCount, setLowStockCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setLowStockCount(dbGetLowStockProducts(user.user_id).length);
        setNewOrdersCount(dbGetNewOrdersCount(user.user_id));
      }
    }, [user])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim().length > 0 && user) {
      setSearchResults(dbSearchProducts(text.trim(), user.user_id));
    } else {
      setSearchResults([]);
    }
  };

  const s = makeStyles(colors);

  const features = [
    { label: 'Stock Lookup', icon: 'search-outline', screen: 'StockLookup', color: '#3B82F6' },
    { label: 'Stocktake', icon: 'clipboard-outline', screen: 'Stocktake', color: '#8B5CF6' },
    { label: 'Pack Order', icon: 'cube-outline', screen: 'PackOrder', color: '#F59E0B' },
    { label: 'Add Product', icon: 'add-circle-outline', screen: 'AddProduct', color: '#10B981' },
    { label: 'Add Order', icon: 'cart-outline', screen: 'AddOrder', color: '#EF4444' },
    { label: 'Orders', icon: 'list-outline', screen: 'Orders', color: '#6366F1' },
    { label: 'Products', icon: 'layers-outline', screen: 'Products', color: '#14B8A6' },
  ];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={openDrawer} style={s.headerBtn}>
          <Ionicons name="menu" size={26} color={colors.text} />
        </TouchableOpacity>

        <LogoIcon size={36} />

        <View style={[s.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => setScannerVisible(true)} style={{ marginRight: 6 }}>
            <Ionicons name="barcode-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={[s.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setSearchVisible(true)}
            onBlur={() => setTimeout(() => setSearchVisible(false), 150)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => setProfileMenuVisible(true)} style={s.headerBtn}>
          {user?.avatar_uri ? (
            <Image source={{ uri: user.avatar_uri }} style={s.avatarSmall} />
          ) : (
            <View style={[s.avatarSmall, { backgroundColor: colors.primary }]}>
              <Text style={s.avatarSmallText}>
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search dropdown */}
      {searchVisible && searchQuery.length > 0 && (
        <View style={[s.searchDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {searchResults.length === 0 ? (
            <Text style={[s.searchNoResult, { color: colors.textSecondary }]}>No products found</Text>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={i => String(i.product_id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.searchItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setSearchVisible(false);
                    setSearchQuery('');
                    navigation.navigate('StockLookup', { prefill: item.barcode || item.name });
                  }}
                >
                  <Text style={[s.searchItemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[s.searchItemSub, { color: colors.textSecondary }]}>
                    {item.brand ? `${item.brand} · ` : ''}{item.barcode || 'No barcode'} · Qty: {item.quantity}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Banners */}
        {lowStockCount > 0 && (
          <TouchableOpacity
            style={[s.banner, { backgroundColor: colors.bannerYellowBg }]}
            onPress={() => navigation.navigate('Products')}
          >
            <Ionicons name="warning-outline" size={18} color={colors.bannerYellowText} />
            <Text style={[s.bannerText, { color: colors.bannerYellowText }]}>
              Low Stock Alert! {lowStockCount} product{lowStockCount !== 1 ? 's' : ''} below threshold
            </Text>
          </TouchableOpacity>
        )}

        {newOrdersCount > 0 && (
          <TouchableOpacity
            style={[s.banner, { backgroundColor: colors.bannerBlueBg }]}
            onPress={() => navigation.navigate('Orders')}
          >
            <Ionicons name="notifications-outline" size={18} color={colors.bannerBlueText} />
            <Text style={[s.bannerText, { color: colors.bannerBlueText }]}>
              {newOrdersCount} New Order{newOrdersCount !== 1 ? 's' : ''} pending
            </Text>
          </TouchableOpacity>
        )}

        {lowStockCount === 0 && newOrdersCount === 0 && (
          <View style={[s.banner, { backgroundColor: colors.bannerBlueBg }]}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.bannerBlueText} />
            <Text style={[s.bannerText, { color: colors.bannerBlueText }]}>
              Everything looks good!
            </Text>
          </View>
        )}

        {/* Feature buttons */}
        <View style={s.grid}>
          {features.map(f => (
            <TouchableOpacity
              key={f.label}
              style={[s.featureBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate(f.screen)}
            >
              <View style={[s.featureIcon, { backgroundColor: f.color + '18' }]}>
                <Ionicons name={f.icon} size={28} color={f.color} />
              </View>
              <Text style={[s.featureLabel, { color: colors.text }]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Profile dropdown modal */}
      <Modal transparent visible={profileMenuVisible} animationType="fade" onRequestClose={() => setProfileMenuVisible(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setProfileMenuVisible(false)}>
          <View style={[s.profileMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {[
              { label: 'Account', icon: 'person-outline', screen: 'Profile', section: 'account' },
              { label: 'Premium Status', icon: 'star-outline', screen: 'Profile', section: 'premium' },
              { label: 'Change Details', icon: 'create-outline', screen: 'Profile', section: 'edit' },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                style={[s.profileMenuItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setProfileMenuVisible(false);
                  navigation.navigate('Profile', { section: item.section });
                }}
              >
                <Ionicons name={item.icon} size={18} color={colors.primary} style={{ marginRight: 10 }} />
                <Text style={[s.profileMenuText, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <BarcodeScannerModal
        visible={scannerVisible}
        onScanned={data => {
          setScannerVisible(false);
          handleSearch(data);
          setSearchVisible(true);
        }}
        onClose={() => setScannerVisible(false)}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    safe: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      gap: 8,
    },
    headerBtn: { padding: 4 },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
    },
    searchInput: { flex: 1, fontSize: 14, padding: 0 },
    avatarSmall: {
      width: 34, height: 34, borderRadius: 17,
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarSmallText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    searchDropdown: {
      position: 'absolute',
      top: 70,
      left: 56,
      right: 56,
      zIndex: 100,
      borderRadius: 10,
      borderWidth: 1,
      maxHeight: 220,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    searchNoResult: { padding: 14, textAlign: 'center', fontSize: 13 },
    searchItem: { padding: 12, borderBottomWidth: 1 },
    searchItemName: { fontSize: 14, fontWeight: '500' },
    searchItemSub: { fontSize: 12, marginTop: 2 },
    scroll: { padding: 14, paddingBottom: 30 },
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      gap: 8,
    },
    bannerText: { fontSize: 13, fontWeight: '500', flex: 1 },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 6,
    },
    featureBtn: {
      width: '47%',
      borderRadius: 14,
      padding: 18,
      alignItems: 'center',
      borderWidth: 1,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    featureIcon: {
      width: 52, height: 52, borderRadius: 14,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 10,
    },
    featureLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: 60,
      paddingRight: 12,
    },
    profileMenu: {
      borderRadius: 12,
      borderWidth: 1,
      minWidth: 200,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    profileMenuItem: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 13,
      borderBottomWidth: 1,
    },
    profileMenuText: { fontSize: 14 },
  });
}
