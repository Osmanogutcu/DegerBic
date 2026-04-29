import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Esya } from '../types';

// ============================================
// HAFTA 10: Geliştirilmiş DataContext
// Eşya ekleme, silme, güncelleme + veritabanı
// ============================================

interface DataContextType {
  items: Esya[];
  esyaEkle: (esya: Omit<Esya, 'id' | 'renk' | 'eklenmeTarihi'>) => void;
  esyaSil: (id: number) => void;
  esyaGuncelle: (id: number, guncellenmis: Partial<Omit<Esya, 'id'>>) => void;
  esyaGetir: (id: number) => Esya | undefined;
  toplam: number;
  yukleniyor: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const KOLEKSIYON_KEY = 'koleksiyonum';

// Kategori bazlı varsayılan renkler
const KATEGORI_RENKLERI: Record<string, string> = {
  'Koleksiyon Kartı': '#8b5cf6',
  'Antika': '#f59e0b',
  'Ev Eşyası': '#3b82f6',
  'Diğer': '#6b7280',
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Esya[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  // AsyncStorage'dan yükle
  useEffect(() => {
    const yukle = async () => {
      try {
        const veri = await AsyncStorage.getItem(KOLEKSIYON_KEY);
        if (veri) {
          const parsed: Esya[] = JSON.parse(veri);
          // Eski veriyle uyumluluk — eklenmeTarihi yoksa ekle
          const uyumlu = parsed.map(item => ({
            ...item,
            eklenmeTarihi: item.eklenmeTarihi || new Date().toISOString(),
          }));
          setItems(uyumlu);
        }
      } catch (e) {
        console.error('Koleksiyon verisi yüklenemedi:', e);
      } finally {
        setYukleniyor(false);
      }
    };
    yukle();
  }, []);

  // Değişiklik olduğunda kaydet (veritabanına yazma)
  useEffect(() => {
    if (!yukleniyor) {
      AsyncStorage.setItem(KOLEKSIYON_KEY, JSON.stringify(items)).catch(e =>
        console.error('Veri kaydedilemedi:', e)
      );
    }
  }, [items, yukleniyor]);

  // ========================================
  // HAFTA 10: Eşya Ekleme — Veritabanına Kayıt
  // ========================================
  const esyaEkle = (esya: Omit<Esya, 'id' | 'renk' | 'eklenmeTarihi'>) => {
    const yeniEsya: Esya = {
      ...esya,
      id: Date.now(),
      renk: KATEGORI_RENKLERI[esya.kategori] || '#3b82f6',
      eklenmeTarihi: new Date().toISOString(),
    };
    setItems(prev => [yeniEsya, ...prev]); // Yeni eşyalar başa eklensin
  };

  // Eşya Silme
  const esyaSil = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // ========================================
  // HAFTA 10: Eşya Güncelleme
  // ========================================
  const esyaGuncelle = (id: number, guncellenmis: Partial<Omit<Esya, 'id'>>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...guncellenmis } : item
      )
    );
  };

  // Tek eşya getirme
  const esyaGetir = (id: number): Esya | undefined => {
    return items.find(item => item.id === id);
  };

  const toplam = items.reduce((sum, item) => {
    const rakam = parseInt(item.deger.replace(/[^0-9]/g, '')) || 0;
    return sum + rakam;
  }, 0);

  return (
    <DataContext.Provider value={{ items, esyaEkle, esyaSil, esyaGuncelle, esyaGetir, toplam, yukleniyor }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData, DataProvider içinde kullanılmalıdır');
  }
  return context;
}
