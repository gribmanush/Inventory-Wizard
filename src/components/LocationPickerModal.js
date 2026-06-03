import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_REGION = {
  latitude: -33.8688,
  longitude: 151.2093,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function LocationPickerModal({ visible, onClose, onLocationSelected }) {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [initialRegion, setInitialRegion] = useState(DEFAULT_REGION);
  const [locLoading, setLocLoading] = useState(true);
  const [reverseLoading, setReverseLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelectedCoords(null);
      setAddress('');
      return;
    }
    setLocLoading(true);
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setInitialRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch {}
      setLocLoading(false);
    })();
  }, [visible]);

  const handleMapPress = async ({ nativeEvent }) => {
    const coords = nativeEvent.coordinate;
    setSelectedCoords(coords);
    setAddress('');
    setReverseLoading(true);
    try {
      const results = await Location.reverseGeocodeAsync(coords);
      if (results.length > 0) {
        const r = results[0];
        const parts = [
          r.streetNumber,
          r.street,
          r.suburb || r.district,
          r.city,
          r.region,
          r.postalCode,
          r.country,
        ].filter(Boolean);
        setAddress(parts.join(', '));
      }
    } catch {
      setAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
    }
    setReverseLoading(false);
  };

  const handleConfirm = () => {
    if (!selectedCoords) return;
    const finalAddress = address || `${selectedCoords.latitude.toFixed(6)}, ${selectedCoords.longitude.toFixed(6)}`;
    onLocationSelected(finalAddress);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.headerBtn}>
            <Ionicons name="close" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Pick Delivery Location</Text>
          <View style={s.headerBtn} />
        </View>

        {locLoading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={s.loadingText}>Getting your location…</Text>
          </View>
        ) : (
          <MapView
            style={s.map}
            initialRegion={initialRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton
          >
            {selectedCoords && (
              <Marker coordinate={selectedCoords} pinColor="#6366F1" />
            )}
          </MapView>
        )}

        <View style={s.bottomPanel}>
          {selectedCoords ? (
            <>
              <View style={s.addressRow}>
                <Ionicons name="location" size={18} color="#6366F1" style={{ marginTop: 2 }} />
                {reverseLoading ? (
                  <ActivityIndicator size="small" color="#6366F1" style={{ marginLeft: 10 }} />
                ) : (
                  <Text style={s.addressText} numberOfLines={3}>{address || 'Location selected'}</Text>
                )}
              </View>
              <TouchableOpacity
                style={[s.confirmBtn, reverseLoading && { opacity: 0.6 }]}
                onPress={handleConfirm}
                disabled={reverseLoading}
              >
                <Text style={s.confirmBtnText}>Confirm Location</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={s.hintText}>Tap anywhere on the map to set the delivery location</Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  headerBtn: { width: 40 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111' },
  map: { flex: 1 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6B7280' },
  bottomPanel: {
    padding: 20,
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    minHeight: 100,
  },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  addressText: { flex: 1, fontSize: 14, color: '#111', lineHeight: 20 },
  confirmBtn: {
    backgroundColor: '#6366F1', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  hintText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});
