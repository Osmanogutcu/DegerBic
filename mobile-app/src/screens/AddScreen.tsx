import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, Image, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { KategoriListesi, KondisyonListesi } from '../types';

// ============================================
// HAFTA 10: Gelişmiş Eşya Ekleme Ekranı
// Fotoğraf çek → bilgileri gir → veritabanına kaydet
// ============================================

const KATEGORILER: Exclude<KategoriListesi, 'Tümü'>[] = ['Koleksiyon Kartı', 'Antika', 'Ev Eşyası', 'Diğer'];
const KONDISYONLAR: KondisyonListesi[] = ['Mükemmel', 'İyi', 'Orta', 'Kötü'];

const KATEGORI_IKONLARI: Record<string, string> = {
  'Koleksiyon Kartı': '🃏',
  'Antika': '🏺',
  'Ev Eşyası': '🏠',
  'Diğer': '📦',
};

export default function AddScreen() {
  const { esyaEkle } = useData();
  const { colors } = useTheme();

  const [isim, setIsim] = useState('');
  const [kategori, setKategori] = useState<Exclude<KategoriListesi, 'Tümü'>>('Antika');
  const [deger, setDeger] = useState('');
  const [kondisyon, setKondisyon] = useState<KondisyonListesi>('İyi');
  const [aciklama, setAciklama] = useState('');
  const [fotografUri, setFotografUri] = useState<string | null>(null);
  const [adim, setAdim] = useState<1 | 2>(1); // Adım 1: Fotoğraf, Adım 2: Bilgiler
  const [kaydediliyor, setKaydediliyor] = useState(false);

  // Fotoğraf seçim menüsü
  const fotografSec = () => {
    Alert.alert('Fotoğraf Ekle', 'Nasıl eklemek istersiniz?', [
      { text: '📸 Kamera', onPress: kameradanCek },
      { text: '🖼️ Galeri', onPress: galerdenSec },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  const kameradanCek = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Kamera izni gereklidir.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setFotografUri(result.assets[0].uri);
      setAdim(2); // Fotoğraf çekildi → bilgi girişine geç
    }
  };

  const galerdenSec = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeri izni gereklidir.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setFotografUri(result.assets[0].uri);
      setAdim(2);
    }
  };

  const formuTemizle = () => {
    setIsim(''); setDeger(''); setAciklama('');
    setKondisyon('İyi'); setKategori('Antika');
    setFotografUri(null); setAdim(1);
  };

  // HAFTA 10: Veritabanına kaydetme
  const kaydet = async () => {
    if (!isim.trim()) {
      Alert.alert('Uyarı', '⚠️ Lütfen eşya adını girin!');
      return;
    }
    if (!deger || Number(deger) <= 0) {
      Alert.alert('Uyarı', '⚠️ Lütfen geçerli bir değer girin!');
      return;
    }

    setKaydediliyor(true);
    try {
      esyaEkle({
        isim: isim.trim(),
        kategori,
        deger: deger + ' TL',
        aciklama: aciklama.trim(),
        kondisyon,
        fotografUri: fotografUri || undefined,
      });
      Alert.alert(
        'Başarılı ✅',
        `"${isim.trim()}" koleksiyonunuza eklendi!\nTahmini Değer: ${Number(deger).toLocaleString('tr-TR')} TL`,
        [{ text: 'Tamam', onPress: formuTemizle }]
      );
    } catch (e) {
      Alert.alert('Hata', 'Eşya kaydedilirken bir sorun oluştu.');
    } finally {
      setKaydediliyor(false);
    }
  };

  // Adım göstergesi
  const renderAdimGostergesi = () => (
    <View style={styles.stepIndicator}>
      <View style={[styles.stepDot, { backgroundColor: colors.primary }]}>
        <Text style={styles.stepDotText}>1</Text>
      </View>
      <View style={[styles.stepLine, { backgroundColor: adim === 2 ? colors.primary : colors.surfaceBorder }]} />
      <View style={[styles.stepDot, { backgroundColor: adim === 2 ? colors.primary : colors.surfaceBorder }]}>
        <Text style={[styles.stepDotText, adim < 2 && { color: colors.textMuted }]}>2</Text>
      </View>
      <View style={[styles.stepLine, { backgroundColor: colors.surfaceBorder }]} />
      <View style={[styles.stepDot, { backgroundColor: colors.surfaceBorder }]}>
        <Text style={[styles.stepDotText, { color: colors.textMuted }]}>✓</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BAŞLIK */}
        <View style={styles.headerSection}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>
            {adim === 1 ? '📸 Fotoğraf Çek' : '✍️ Bilgileri Gir'}
          </Text>
          <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>
            {adim === 1
              ? 'Eşyanın fotoğrafını çekerek başlayın'
              : 'Fotoğrafın altına eşya bilgilerini girin'}
          </Text>
          {renderAdimGostergesi()}
        </View>

        {/* FOTOĞRAF ALANI */}
        <TouchableOpacity
          style={[styles.photoArea, {
            borderColor: fotografUri ? colors.accent : colors.primary,
            backgroundColor: fotografUri ? 'transparent' : colors.primaryGlow,
          }]}
          onPress={fotografSec}
          activeOpacity={0.7}
        >
          {fotografUri ? (
            <View style={styles.photoPreviewWrapper}>
              <Image source={{ uri: fotografUri }} style={styles.photoPreview} />
              <View style={styles.photoOverlay}>
                <TouchableOpacity style={styles.photoChangeBtn} onPress={fotografSec}>
                  <Ionicons name="camera" size={16} color="#fff" />
                  <Text style={styles.photoChangeBtnText}>Değiştir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => { setFotografUri(null); setAdim(1); }}>
                  <Ionicons name="close-circle" size={28} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <View style={[styles.cameraIconCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={32} color="#fff" />
              </View>
              <Text style={[styles.photoLabel, { color: colors.primaryLight }]}>
                Fotoğraf Çek veya Seç
              </Text>
              <Text style={[styles.photoHint, { color: colors.textMuted }]}>
                Kameradan çekin veya galeriden seçin
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* FOTOĞRAF OLMADAN DA DEVAM EDEBİLİR */}
        {adim === 1 && (
          <TouchableOpacity
            style={[styles.skipBtn, { borderColor: colors.surfaceBorder }]}
            onPress={() => setAdim(2)}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipBtnText, { color: colors.textSecondary }]}>
              Fotoğrafsız devam et →
            </Text>
          </TouchableOpacity>
        )}

        {/* ADIM 2: BİLGİ GİRİŞ FORMU */}
        {adim === 2 && (
          <>
            <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
              {/* Eşya Adı */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>EŞYA ADI *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.textPrimary }]}
                placeholder="Örn: 50 Yıllık İpek Halı"
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
                    style={[styles.chip, {
                      backgroundColor: kategori === kat ? colors.primary : colors.surface,
                      borderColor: kategori === kat ? colors.primary : colors.surfaceBorder,
                    }]}
                    onPress={() => setKategori(kat)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipIcon}>{KATEGORI_IKONLARI[kat]}</Text>
                    <Text style={[styles.chipText, { color: kategori === kat ? '#fff' : colors.textSecondary }]}>
                      {kat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tahmini Değer */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>TAHMİNİ DEĞER (TL) *</Text>
              <View style={[styles.valueInputWrapper, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                <Ionicons name="cash-outline" size={18} color={colors.accent} style={{ marginLeft: 12 }} />
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
                      style={[styles.chip, {
                        backgroundColor: kondisyon === kon ? renk : colors.surface,
                        borderColor: kondisyon === kon ? renk : colors.surfaceBorder,
                      }]}
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

            {/* ÖZET KART */}
            {isim.trim() && deger ? (
              <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.accent + '40' }]}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="document-text" size={18} color={colors.accent} />
                  <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Kayıt Özeti</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Eşya:</Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{isim.trim()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Değer:</Text>
                  <Text style={[styles.summaryValue, { color: colors.accent }]}>
                    {Number(deger).toLocaleString('tr-TR')} TL
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Kategori:</Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{kategori}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Fotoğraf:</Text>
                  <Text style={[styles.summaryValue, { color: fotografUri ? colors.accent : colors.textMuted }]}>
                    {fotografUri ? '✅ Eklendi' : '❌ Yok'}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* BUTONLAR */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                onPress={formuTemizle}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh" size={16} color={colors.textSecondary} />
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Sıfırla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, kaydediliyor && { opacity: 0.7 }]}
                onPress={kaydet}
                activeOpacity={0.8}
                disabled={kaydediliyor}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>
                  {kaydediliyor ? 'Kaydediliyor...' : 'Veritabanına Kaydet'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  headerSection: { marginBottom: 20, marginTop: 8 },
  screenTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  screenSubtitle: { fontSize: 14, marginBottom: 12 },

  // Adım Göstergesi
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  stepDot: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  stepDotText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepLine: { width: 40, height: 3, borderRadius: 2 },

  // Fotoğraf
  photoArea: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  photoPlaceholder: { alignItems: 'center', padding: 32 },
  cameraIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  photoLabel: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  photoHint: { fontSize: 12, marginTop: 4 },
  photoPreviewWrapper: { position: 'relative' },
  photoPreview: { width: '100%', height: 220, resizeMode: 'cover' },
  photoOverlay: { position: 'absolute', top: 0, right: 0, left: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10 },
  photoChangeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  photoChangeBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  photoRemoveBtn: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14 },

  // Fotoğrafsız devam
  skipBtn: { borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 8 },
  skipBtnText: { fontSize: 14, fontWeight: '600' },

  // Form
  formCard: { borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15 },
  valueInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingRight: 14 },
  valueInput: { flex: 1, padding: 14, fontSize: 15 },
  valueSuffix: { fontSize: 15, fontWeight: '600' },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, minHeight: 80 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, gap: 4 },
  chipIcon: { fontSize: 14 },
  chipText: { fontSize: 13, fontWeight: '600' },

  // Özet
  summaryCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  summaryTitle: { fontSize: 15, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13, fontWeight: '600' },

  // Butonlar
  buttonRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, gap: 6 },
  cancelBtnText: { fontSize: 15, fontWeight: '700' },
  saveBtn: { flex: 2, flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#10b981', shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
