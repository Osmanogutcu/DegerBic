import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { KategoriListesi, KondisyonListesi } from '../types';

const KATEGORILER: Exclude<KategoriListesi, 'Tümü'>[] = ['Koleksiyon Kartı', 'Antika', 'Ev Eşyası', 'Diğer'];
const KONDISYONLAR: KondisyonListesi[] = ['Mükemmel', 'İyi', 'Orta', 'Kötü'];

export default function AddScreen() {
  const { esyaEkle } = useData();
  const { colors } = useTheme();

  const [isim, setIsim] = useState('');
  const [kategori, setKategori] = useState<Exclude<KategoriListesi, 'Tümü'>>('Antika');
  const [deger, setDeger] = useState('');
  const [kondisyon, setKondisyon] = useState<KondisyonListesi>('İyi');
  const [aciklama, setAciklama] = useState('');
  const [fotografUri, setFotografUri] = useState<string | null>(null);

  // ========================================
  // HAFTA 9: Kamera ve Galeri Fotoğraf Seçimi
  // ========================================

  const fotografSec = () => {
    Alert.alert(
      'Fotoğraf Ekle',
      'Nasıl eklemek istersiniz?',
      [
        {
          text: '📸 Kamera',
          onPress: kameradanCek,
        },
        {
          text: '🖼️ Galeri',
          onPress: galerdenSec,
        },
        {
          text: 'İptal',
          style: 'cancel',
        },
      ]
    );
  };

  const kameradanCek = async () => {
    // Kamera izni iste
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera izni gereklidir.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setFotografUri(result.assets[0].uri);
    }
  };

  const galerdenSec = async () => {
    // Galeri izni iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri izni gereklidir.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setFotografUri(result.assets[0].uri);
    }
  };

  const formuTemizle = () => {
    setIsim('');
    setDeger('');
    setAciklama('');
    setKondisyon('İyi');
    setKategori('Antika');
    setFotografUri(null);
  };

  const kaydet = () => {
    if (!isim.trim()) {
      Alert.alert('Uyarı', '⚠️ Lütfen eşya adını girin!');
      return;
    }
    if (!deger || Number(deger) <= 0) {
      Alert.alert('Uyarı', '⚠️ Lütfen geçerli bir değer girin!');
      return;
    }

    esyaEkle({
      isim: isim.trim(),
      kategori,
      deger: deger + ' TL',
      aciklama: aciklama.trim(),
      kondisyon,
      fotografUri: fotografUri || undefined,
    });

    Alert.alert('Başarılı ✅', `"${isim.trim()}" koleksiyonunuza eklendi!`);
    formuTemizle();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BAŞLIK */}
        <View style={styles.headerSection}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Yeni Eşya Ekle</Text>
          <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
            Koleksiyonuna yeni bir değerli eşya ekle
          </Text>
        </View>

        {/* FOTOĞRAF ALANI - HAFTA 9 */}
        <TouchableOpacity
          style={[styles.photoArea, { borderColor: colors.primary, backgroundColor: colors.primaryGlow }]}
          onPress={fotografSec}
          activeOpacity={0.7}
        >
          {fotografUri ? (
            <View style={styles.photoPreviewWrapper}>
              <Image source={{ uri: fotografUri }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.photoRemoveBtn}
                onPress={() => setFotografUri(null)}
              >
                <Ionicons name="close-circle" size={28} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={36} color={colors.primaryLight} />
              <Text style={[styles.photoLabel, { color: colors.primaryLight }]}>
                Fotoğraf Çek veya Seç
              </Text>
              <Text style={[styles.photoHint, { color: colors.textMuted }]}>
                Kamera veya galeriden fotoğraf ekleyebilirsiniz
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* FORM */}
        <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          {/* Eşya Adı */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>EŞYA ADI</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.textPrimary }]}
            placeholder="Örn: 50 Yıllık Halı"
            placeholderTextColor={colors.textMuted}
            value={isim}
            onChangeText={setIsim}
          />

          {/* Kategori */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>KATEGORİ</Text>
          <View style={styles.chipGroup}>
            {KATEGORILER.map((kat) => (
              <TouchableOpacity
                key={kat}
                style={[
                  styles.chip,
                  {
                    backgroundColor: kategori === kat ? colors.primary : colors.surface,
                    borderColor: kategori === kat ? colors.primary : colors.surfaceBorder,
                  },
                ]}
                onPress={() => setKategori(kat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, { color: kategori === kat ? '#fff' : colors.textSecondary }]}>
                  {kat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tahmini Değer */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>TAHMİNİ DEĞER (TL)</Text>
          <View style={[styles.valueInputWrapper, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <TextInput
              style={[styles.valueInput, { color: colors.textPrimary }]}
              placeholder="Örn: 5000"
              placeholderTextColor={colors.textMuted}
              value={deger}
              onChangeText={setDeger}
              keyboardType="numeric"
            />
            <Text style={[styles.valueSuffix, { color: colors.textMuted }]}>TL</Text>
          </View>

          {/* Kondisyon */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>KONDİSYON</Text>
          <View style={styles.chipGroup}>
            {KONDISYONLAR.map((kon) => {
              const renk = kon === 'Mükemmel' ? '#10b981' : kon === 'İyi' ? '#3b82f6' : kon === 'Orta' ? '#f59e0b' : '#ef4444';
              return (
                <TouchableOpacity
                  key={kon}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: kondisyon === kon ? renk : colors.surface,
                      borderColor: kondisyon === kon ? renk : colors.surfaceBorder,
                    },
                  ]}
                  onPress={() => setKondisyon(kon)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, { color: kondisyon === kon ? '#fff' : colors.textSecondary }]}>
                    {kon}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Açıklama */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>AÇIKLAMA</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.textPrimary }]}
            placeholder="Eşya hakkında kısa bir açıklama yazın..."
            placeholderTextColor={colors.textMuted}
            value={aciklama}
            onChangeText={setAciklama}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* BUTONLAR */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
            onPress={formuTemizle}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Temizle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={kaydet}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Header
  headerSection: {
    marginBottom: 20,
    marginTop: 8,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
  },

  // Fotoğraf Alanı
  photoArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    alignItems: 'center',
    padding: 28,
  },
  photoLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  photoHint: {
    fontSize: 12,
    marginTop: 4,
  },
  photoPreviewWrapper: {
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
  },

  // Form Card
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  valueInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: 14,
  },
  valueInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
  },
  valueSuffix: {
    fontSize: 15,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
  },

  // Chip Seçiciler
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Butonlar
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
