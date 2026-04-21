import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Esya } from '../types';

interface DataContextType {
  items: Esya[];
  esyaEkle: (esya: Omit<Esya, 'id' | 'renk'>) => void;
  esyaSil: (id: number) => void;
  toplam: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const KOLEKSIYON_KEY = 'koleksiyonum';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Esya[]>([]);

  // AsyncStorage'dan yükle
  useEffect(() => {
    const yukle = async () => {
      try {
        const veri = await AsyncStorage.getItem(KOLEKSIYON_KEY);
        if (veri) {
          setItems(JSON.parse(veri));
        }
      } catch (e) {
        console.error('Koleksiyon verisi yüklenemedi:', e);
      }
    };
    yukle();
  }, []);

  // Değişiklik olduğunda kaydet
  useEffect(() => {
    AsyncStorage.setItem(KOLEKSIYON_KEY, JSON.stringify(items));
  }, [items]);

  const esyaEkle = (esya: Omit<Esya, 'id' | 'renk'>) => {
    const yeniEsya: Esya = {
      ...esya,
      id: Date.now(),
      renk: '#3b82f6',
    };
    setItems(prev => [...prev, yeniEsya]);
  };

  const esyaSil = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toplam = items.reduce((sum, item) => {
    const rakam = parseInt(item.deger.replace(/[^0-9]/g, '')) || 0;
    return sum + rakam;
  }, 0);

  return (
    <DataContext.Provider value={{ items, esyaEkle, esyaSil, toplam }}>
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
