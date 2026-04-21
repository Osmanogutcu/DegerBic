import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Esya, KategoriListesi } from '../types';

const KATEGORILER: KategoriListesi[] = ['Tümü', 'Koleksiyon Kartı', 'Antika', 'Ev Eşyası', 'Diğer'];

export default function HomeScreen() {
  const { items, esyaSil, toplam } = useData();
  const { colors } = useTheme();
  const [aramaSorgusu, setAramaSorgusu] = useState('');
  const [filtreKategori, setFiltreKategori] = useState<KategoriListesi>('Tümü');

  // Filtreleme
  const filtrelenmisEsyalar = items.filter((item) => {
    const aramaUyumu = item.isim.toLowerCase().includes(aramaSorgusu.toLowerCase());
    const kategoriUyumu = filtreKategori === 'Tümü' || item.kategori === filtreKategori;
    return aramaUyumu && kategoriUyumu;
  });

  const filtrelenmisToplamDeger = filtrelenmisEsyalar.reduce((sum, item) => {
    const rakam = parseInt(item.deger.replace(/[^0-9]/g, '')) || 0;
    return sum + rakam;
  }, 0);

  const silOnay = (id: number, isim: string) => {
    Alert.alert(
      'Eşyayı Sil',
      `"${isim}" adlı eşyayı silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => esyaSil(id) },
      ]
    );
  };

  const kondisyonRenk = (kondisyon: string) => {
    switch (kondisyon) {
      case 'Mükemmel': return '#10b981';
      case 'İyi': return '#3b82f6';
      case 'Orta': return '#f59e0b';
      case 'Kötü': return '#ef4444';
      default: return colors.textMuted;
    }
  };

  const renderEsya = ({ item }: { item: Esya }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
      {/* Fotoğraf (Hafta 9) */}
      {item.fotografUri ? (
        <Image source={{ uri: item.fotografUri }} style={styles.itemPhoto} />
      ) : (
        <View style={[styles.itemPhotoPlaceholder, { backgroundColor: colors.surface }]}>
          <Ionicons name="image-outline" size={32} color={colors.textMuted} />
        </View>
      )}

      <View style={styles.itemBody}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.isim}
          </Text>
          <Text style={[styles.itemValue, { color: colors.accent }]}>{item.deger}</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: colors.primaryGlow }]}>
            <Text style={[styles.badgeText, { color: colors.primaryLight }]}>{item.kategori}</Text>
          </View>
          {item.kondisyon && (
            <View style={[styles.badge, { backgroundColor: `${kondisyonRenk(item.kondisyon)}20` }]}>
              <Text style={[styles.badgeText, { color: kondisyonRenk(item.kondisyon) }]}>{item.kondisyon}</Text>
            </View>
          )}
        </View>

        {item.aciklama ? (
          <Text style={[styles.itemDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.aciklama}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: colors.dangerBg }]}
          onPress={() => silOnay(item.id, item.isim)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* TOPLAM DEĞER KARTI */}
      <View style={styles.totalCard}>
        <View style={styles.totalCardCircle1} />
        <View style={styles.totalCardCircle2} />
        <Text style={styles.totalLabel}>TOPLAM PORTFÖY DEĞERİ</Text>
        <Text style={styles.totalAmount}>{filtrelenmisToplamDeger.toLocaleString('tr-TR')} TL</Text>
        <Text style={styles.totalCount}>{items.length} eşya koleksiyonunuzda</Text>
      </View>

      {/* ARAMA */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Eşya Ara..."
          placeholderTextColor={colors.textMuted}
          value={aramaSorgusu}
          onChangeText={setAramaSorgusu}
        />
        {aramaSorgusu ? (
          <TouchableOpacity onPress={() => setAramaSorgusu('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* KATEGORİ FİLTRE */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={KATEGORILER}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
        renderItem={({ item: kat }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: filtreKategori === kat ? colors.primary : colors.surface,
                borderColor: filtreKategori === kat ? colors.primary : colors.surfaceBorder,
              },
            ]}
            onPress={() => setFiltreKategori(kat)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: filtreKategori === kat ? '#fff' : colors.textSecondary },
              ]}
            >
              {kat}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* BAŞLIK */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Koleksiyonum</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.primaryGlow, borderColor: 'rgba(59,130,246,0.2)' }]}>
          <Text style={[styles.countBadgeText, { color: colors.primaryLight }]}>
            {filtrelenmisEsyalar.length} Eşya
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Henüz eşya yok</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
        Koleksiyonuna ilk eşyayı eklemek için alt menüdeki "Ekle" butonuna tıkla!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <FlatList
        data={filtrelenmisEsyalar}
        renderItem={renderEsya}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },

  // Toplam Değer Kartı
  totalCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#10b981',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  totalCardCircle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -30,
  },
  totalCardCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -25,
    left: -20,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  totalCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 6,
  },

  // Arama
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  // Filtre
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Başlık
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Eşya Kartı
  itemCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  itemPhoto: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  itemPhotoPlaceholder: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBody: {
    padding: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  itemValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Boş durum
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
