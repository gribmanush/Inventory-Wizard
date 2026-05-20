import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function BarcodeScannerModal({ visible, onScanned, onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  useEffect(() => {
    if (visible) scannedRef.current = false;
  }, [visible]);

  const handleScanned = ({ data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    onScanned(data);
    onClose();
  };

  if (!visible) return null;

  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={s.permContainer}>
          <Ionicons name="camera-outline" size={64} color="#6366F1" />
          <Text style={s.permTitle}>Camera Access Required</Text>
          <Text style={s.permSub}>Allow camera access to scan barcodes.</Text>
          <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
            <Text style={s.permBtnText}>Allow Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
            <Text style={s.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93', 'qr'],
          }}
          onBarcodeScanned={handleScanned}
        />

        {/* Dimmed overlay with viewfinder cutout effect */}
        <View style={s.overlay} pointerEvents="none">
          <View style={s.dimTop} />
          <View style={s.middleRow}>
            <View style={s.dimSide} />
            <View style={s.viewfinder}>
              <View style={[s.corner, s.cornerTL]} />
              <View style={[s.corner, s.cornerTR]} />
              <View style={[s.corner, s.cornerBL]} />
              <View style={[s.corner, s.cornerBR]} />
            </View>
            <View style={s.dimSide} />
          </View>
          <View style={s.dimBottom}>
            <Text style={s.hint}>Align barcode within the frame</Text>
          </View>
        </View>

        <TouchableOpacity style={s.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const VIEWFINDER = 240;
const DIM = 'rgba(0,0,0,0.62)';
const CORNER_COLOR = '#fff';
const CORNER_SIZE = 22;
const CORNER_THICK = 3;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  overlay: { ...StyleSheet.absoluteFillObject },
  dimTop: { flex: 1, backgroundColor: DIM },
  middleRow: { flexDirection: 'row', height: VIEWFINDER },
  dimSide: { flex: 1, backgroundColor: DIM },
  dimBottom: { flex: 1, backgroundColor: DIM, alignItems: 'center', paddingTop: 20 },

  viewfinder: {
    width: VIEWFINDER,
    height: VIEWFINDER,
    backgroundColor: 'transparent',
  },

  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: CORNER_COLOR },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_THICK, borderRightWidth: CORNER_THICK },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICK, borderRightWidth: CORNER_THICK },

  hint: { color: '#fff', fontSize: 14, fontWeight: '500', opacity: 0.9 },

  closeBtn: {
    position: 'absolute', top: 52, right: 20,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },

  permContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
  permTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 10 },
  permSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 32, lineHeight: 20 },
  permBtn: { backgroundColor: '#6366F1', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 12 },
  permBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { paddingVertical: 12 },
  cancelBtnText: { color: '#6B7280', fontSize: 14 },
});
