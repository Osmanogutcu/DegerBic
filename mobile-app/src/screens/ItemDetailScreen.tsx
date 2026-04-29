import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Esya } from '../types';

// ============================================
// HAFTA 10: Eşya Detay & Düzenleme Ekranı
// ============================================

interface Props {
  esya: Esya;
  onGeriDon: () => void;
}

export default function ItemDetailScreen({ esya, onGeriDon }: Props) {
  const { esyaGuncelle, esyaSil } = useData();
  const { colors } = useTheme();
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);

  const [isim, setIsim] = useState(esya.isim);
  const [deger, setDeger] = useState(esya.deger.replace(/[^0-9]/g, ''));
  const [aciklama, setAciklama] = useState(esya.aciklama);

  const tarihFormatla = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return '-'; }
  };

  const kondisyonRenk = (k: string) => {
    switch (k) {
      case 'Mükemmel': return '#10b981';
      case 'İyi': return '#3b82f6';
      case 'Orta': return '#f59e0b';
      case 'Kötü': return '#ef4444';
      default: return colors.textMuted;
    }
  };

  const kaydet = () => {
    if (!isim.trim()) { Alert.alert('Uyarı', 'Eşya adı boş olamaz!'); return; }
    esyaGuncelle(esya.id, {
      isim: isim.trim(),
      deger: deger + ' TL',
      aciklama: aciklama.trim(),
    });
    setDuzenlemeModu(false);
    Alert.alert('Güncellendi ✅', 'Eşya bilgileri başarıyla güncellendi.');
  };

  const silOnay = () => {
    Alert.alert('Eşyayı Sil', `"${esya.isim}" silinecek. Emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => { esyaSil(esya.id); onGeriDon(); } },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgPrimary }]} contentContainerStyle={styles.content}>
      {/* Geri butonu */}
      <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface }]} onPress={onGeriDon}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        <Text style={[styles.backBtnText, { color: colors.textPrimary }]}>Geri</Text>
      </TouchableOpacity>

      {/* Fotoğraf */}
      {esya.fotografUri ? (
        <Image source={{ uri: esya.fotografUri }} style={styles.photo} />
      ) : (
        <View style={[styles.photoPlaceholder, { backgroundColor: colors.surface }]}>
          <Ionicons name="image-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.noPhotoText, { color: colors.textMuted }]}>Fotoğraf Yok</Text>
        </View>
      )}

      {/* Bilgiler */}
      <View style={[styles.infoCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
        <View style={styles.infoHeader}>
          <View style={{ flex: 1 }}>
            {duzenlemeModu ? (
              <TextInput
                style={[styles.editInput, { color: colors.textPrimary, borderColor: colors.surfaceBorder }]}
                value={isim} onChangeText={setIsim}
              />
            ) : (
              <Text style={[styles.itemName, { color: colors.textPrimary }]}>{esya.isim}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => duzenlemeModu ? kaydet() : setDuzenlemeModu(true)}>
            <Ionicons name={duzenlemeModu ? 'checkmark-circle' : 'create-outline'} size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Badge'ler */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: colors.primaryGlow }]}>
            <Text style={[styles.badgeText, { color: colors.primaryLight }]}>{esya.kategori}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: `${kondisyonRenk(esya.kondisyon)}20` }]}>
            <Text style={[styles.badgeText, { color: kondisyonRenk(esya.kondisyon) }]}>{esya.kondisyon}</Text>
          </View>
        </View>

        {/* Detay satırları */}
        <View style={[styles.detailRow, { borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Tahmini Değer</Text>
          {duzenlemeModu ? (
            <TextInput
              style={[styles.editInputSmall, { color: colors.accent, borderColor: colors.surfaceBorder }]}
              value={deger} onChangeText={setDeger} keyboardType="numeric"
            />
          ) : (
            <Text style={[styles.detailValue, { color: colors.accent }]}>{esya.deger}</Text>
          )}
        </View>

        <View style={[styles.detailRow, { borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Eklenme Tarihi</Text>
          <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{tarihFormatla(esya.eklenmeTarihi)}</Text>
        </View>

        {/* Açıklama */}
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.detailLabel, { color: colors.textMuted, marginBottom: 8 }]}>Açıklama</Text>
          {duzenlemeModu ? (
            <TextInput
              style={[styles.editTextArea, { color: colors.textPrimary, borderColor: colors.surfaceBorder, backgroundColor: colors.surface }]}
              value={aciklama} onChangeText={setAciklama} multiline numberOfLines={3} textAlignVertical="top"
            />
          ) : (
            <Text style={[styles.descText, { color: colors.textSecondary }]}>
              {esya.aciklama || 'Açıklama eklenmemiş.'}
            </Text>
          )}
        </View>
      </View>

      {/* Sil butonu */}
      <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.dangerBg }]} onPress={silOnay}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
        <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Eşyayı Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', margin: 16, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  backBtnText: { fontSize: 14, fontWeight: '600' },
  photo: { width: '100%', height: 260, resizeMode: 'cover' },
  photoPlaceholder: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center', gap: 8 },
  noPhotoText: { fontSize: 14 },
  infoCard: { margin: 16, borderRadius: 20, borderWidth: 1, padding: 20 },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 16, fontWeight: '700' },
  descText: { fontSize: 14, lineHeight: 22 },
  editInput: { fontSize: 20, fontWeight: '700', borderBottomWidth: 1, paddingBottom: 4 },
  editInputSmall: { fontSize: 16, fontWeight: '700', borderBottomWidth: 1, paddingBottom: 2, minWidth: 80, textAlign: 'right' },
  editTextArea: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, minHeight: 70 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, padding: 16, borderRadius: 12 },
  deleteBtnText: { fontSize: 15, fontWeight: '700' },
});
