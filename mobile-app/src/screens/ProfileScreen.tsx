import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { kullanici, cikisYap } = useAuth();
  const { items, toplam } = useData();
  const { colors, isDark, temaDegistir } = useTheme();

  // İstatistikler
  const kategoriDagilimi = items.reduce((acc, item) => {
    acc[item.kategori] = (acc[item.kategori] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const kondisyonDagilimi = items.reduce((acc, item) => {
    if (item.kondisyon) {
      acc[item.kondisyon] = (acc[item.kondisyon] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const enDegerli = items.length > 0
    ? items.reduce((max, item) => {
        const maxVal = parseInt(max.deger.replace(/[^0-9]/g, '')) || 0;
        const itemVal = parseInt(item.deger.replace(/[^0-9]/g, '')) || 0;
        return itemVal > maxVal ? item : max;
      })
    : null;

  const cikisOnay = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: cikisYap },
      ]
    );
  };

  const kategoriIkon = (kat: string) => {
    switch (kat) {
      case 'Koleksiyon Kartı': return '🃏';
      case 'Antika': return '🏺';
      case 'Ev Eşyası': return '🏠';
      default: return '📦';
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* PROFİL KARTI */}
      <View style={styles.profileHeader}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {kullanici?.adSoyad?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={[styles.userName, { color: colors.textPrimary }]}>
          {kullanici?.adSoyad}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {kullanici?.email}
        </Text>
      </View>

      {/* İSTATİSTİK KARTLARI */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          <Ionicons name="cube" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{items.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Toplam Eşya</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          <Ionicons name="cash" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {toplam.toLocaleString('tr-TR')}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Toplam Değer (TL)</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          <Ionicons name="layers" size={24} color="#8b5cf6" />
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {Object.keys(kategoriDagilimi).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Kategori</Text>
        </View>
      </View>

      {/* EN DEĞERLİ EŞYA */}
      {enDegerli && (
        <View style={[styles.highlightCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          <View style={styles.highlightHeader}>
            <Ionicons name="trophy" size={20} color="#f59e0b" />
            <Text style={[styles.highlightTitle, { color: colors.textPrimary }]}>En Değerli Eşya</Text>
          </View>
          <Text style={[styles.highlightName, { color: colors.primaryLight }]}>{enDegerli.isim}</Text>
          <Text style={[styles.highlightValue, { color: colors.accent }]}>{enDegerli.deger}</Text>
        </View>
      )}

      {/* KATEGORİ DAĞILIMI */}
      {Object.keys(kategoriDagilimi).length > 0 && (
        <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Kategori Dağılımı</Text>
          {Object.entries(kategoriDagilimi).map(([kat, sayi]) => (
            <View key={kat} style={[styles.distRow, { borderBottomColor: colors.surfaceBorder }]}>
              <View style={styles.distLeft}>
                <Text style={styles.distIcon}>{kategoriIkon(kat)}</Text>
                <Text style={[styles.distName, { color: colors.textPrimary }]}>{kat}</Text>
              </View>
              <View style={[styles.distBadge, { backgroundColor: colors.primaryGlow }]}>
                <Text style={[styles.distCount, { color: colors.primaryLight }]}>{sayi}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* KONDİSYON DAĞILIMI */}
      {Object.keys(kondisyonDagilimi).length > 0 && (
        <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Kondisyon Dağılımı</Text>
          {Object.entries(kondisyonDagilimi).map(([kon, sayi]) => {
            const renk = kon === 'Mükemmel' ? '#10b981' : kon === 'İyi' ? '#3b82f6' : kon === 'Orta' ? '#f59e0b' : '#ef4444';
            return (
              <View key={kon} style={[styles.distRow, { borderBottomColor: colors.surfaceBorder }]}>
                <View style={styles.distLeft}>
                  <View style={[styles.kondisyonDot, { backgroundColor: renk }]} />
                  <Text style={[styles.distName, { color: colors.textPrimary }]}>{kon}</Text>
                </View>
                <View style={[styles.distBadge, { backgroundColor: `${renk}20` }]}>
                  <Text style={[styles.distCount, { color: renk }]}>{sayi}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* AYARLAR */}
      <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Ayarlar</Text>

        <TouchableOpacity
          style={[styles.settingsRow, { borderBottomColor: colors.surfaceBorder }]}
          onPress={temaDegistir}
          activeOpacity={0.7}
        >
          <View style={styles.settingsLeft}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.primary} />
            <Text style={[styles.settingsText, { color: colors.textPrimary }]}>
              {isDark ? 'Koyu Tema' : 'Açık Tema'}
            </Text>
          </View>
          <View style={[styles.themeToggle, { backgroundColor: isDark ? colors.primary : colors.surface }]}>
            <View style={[styles.themeToggleDot, { transform: [{ translateX: isDark ? 20 : 2 }] }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={cikisOnay}
          activeOpacity={0.7}
        >
          <View style={styles.settingsLeft}>
            <Ionicons name="log-out" size={20} color={colors.danger} />
            <Text style={[styles.settingsText, { color: colors.danger }]}>Çıkış Yap</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={[styles.footer, { color: colors.textMuted }]}>
        © 2026 DeğerBiç — Envanter ve Değerleme Asistanı
      </Text>
    </ScrollView>
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

  // Profil Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },

  // İstatistik
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },

  // En Değerli
  highlightCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  highlightName: {
    fontSize: 18,
    fontWeight: '700',
  },
  highlightValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },

  // Bölüm Kartı
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  // Dağılım Satırı
  distRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  distLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  distIcon: {
    fontSize: 20,
  },
  distName: {
    fontSize: 14,
    fontWeight: '500',
  },
  distBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  distCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  kondisyonDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Ayarlar
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsText: {
    fontSize: 15,
    fontWeight: '500',
  },
  themeToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  themeToggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },
});
