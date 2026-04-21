import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Kullanici, KayitliKullanici } from '../types';

interface AuthContextType {
  kullanici: Kullanici | null;
  girisYap: (email: string, sifre: string) => { basarili: boolean; mesaj: string };
  kayitOl: (adSoyad: string, email: string, sifre: string) => { basarili: boolean; mesaj: string };
  cikisYap: () => void;
  yukleniyor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KULLANICI_KEY = 'degerbic_kullanici';
const KULLANICILAR_KEY = 'degerbic_kullanicilar';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kullanicilar, setKullanicilar] = useState<KayitliKullanici[]>([]);

  // Uygulama açıldığında verileri yükle
  useEffect(() => {
    const yukle = async () => {
      try {
        const [kayitliKullanici, kayitliListe] = await Promise.all([
          AsyncStorage.getItem(KULLANICI_KEY),
          AsyncStorage.getItem(KULLANICILAR_KEY),
        ]);
        if (kayitliKullanici) {
          setKullanici(JSON.parse(kayitliKullanici));
        }
        if (kayitliListe) {
          setKullanicilar(JSON.parse(kayitliListe));
        }
      } catch (e) {
        console.error('Auth verisi yüklenemedi:', e);
      } finally {
        setYukleniyor(false);
      }
    };
    yukle();
  }, []);

  const kayitOl = (adSoyad: string, email: string, sifre: string) => {
    const zatenVar = kullanicilar.find(k => k.email === email);
    if (zatenVar) {
      return { basarili: false, mesaj: '⚠️ Bu e-posta adresi zaten kayıtlı!' };
    }

    const yeniKullanici: KayitliKullanici = {
      id: Date.now().toString(),
      adSoyad,
      email,
      sifre,
    };

    const guncelListe = [...kullanicilar, yeniKullanici];
    setKullanicilar(guncelListe);
    AsyncStorage.setItem(KULLANICILAR_KEY, JSON.stringify(guncelListe));

    const bilgi: Kullanici = { id: yeniKullanici.id, adSoyad, email };
    setKullanici(bilgi);
    AsyncStorage.setItem(KULLANICI_KEY, JSON.stringify(bilgi));

    return { basarili: true, mesaj: '✅ Kayıt başarılı!' };
  };

  const girisYap = (email: string, sifre: string) => {
    const bulunan = kullanicilar.find(k => k.email === email);
    if (!bulunan) {
      return { basarili: false, mesaj: '⚠️ Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı!' };
    }
    if (bulunan.sifre !== sifre) {
      return { basarili: false, mesaj: '⚠️ Şifre hatalı!' };
    }

    const bilgi: Kullanici = { id: bulunan.id, adSoyad: bulunan.adSoyad, email: bulunan.email };
    setKullanici(bilgi);
    AsyncStorage.setItem(KULLANICI_KEY, JSON.stringify(bilgi));

    return { basarili: true, mesaj: '✅ Giriş başarılı!' };
  };

  const cikisYap = async () => {
    setKullanici(null);
    await AsyncStorage.removeItem(KULLANICI_KEY);
  };

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, kayitOl, cikisYap, yukleniyor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır');
  }
  return context;
}
