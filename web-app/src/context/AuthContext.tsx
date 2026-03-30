import React, { createContext, useContext, useState, useEffect } from 'react';

// Kullanıcı veri tipi
interface Kullanici {
  id: string;
  adSoyad: string;
  email: string;
}

// Kayıtlı kullanıcı (şifre dahil)
interface KayitliKullanici extends Kullanici {
  sifre: string;
}

// Context veri tipi
interface AuthContextType {
  kullanici: Kullanici | null;
  girisYap: (email: string, sifre: string) => { basarili: boolean; mesaj: string };
  kayitOl: (adSoyad: string, email: string, sifre: string) => { basarili: boolean; mesaj: string };
  cikisYap: () => void;
  yukleniyor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// localStorage key'leri
const KULLANICI_KEY = 'degerbic_kullanici';
const KULLANICILAR_KEY = 'degerbic_kullanicilar';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  // Sayfa ilk açıldığında localStorage'dan kullanıcıyı yükle
  useEffect(() => {
    const kayitli = localStorage.getItem(KULLANICI_KEY);
    if (kayitli) {
      setKullanici(JSON.parse(kayitli));
    }
    setYukleniyor(false);
  }, []);

  // Kayıtlı kullanıcıları getir
  const kullanicilariGetir = (): KayitliKullanici[] => {
    const veri = localStorage.getItem(KULLANICILAR_KEY);
    return veri ? JSON.parse(veri) : [];
  };

  // Kayıt Ol
  const kayitOl = (adSoyad: string, email: string, sifre: string) => {
    const mevcutKullanicilar = kullanicilariGetir();

    // E-posta kontrolü
    const zatenVar = mevcutKullanicilar.find(k => k.email === email);
    if (zatenVar) {
      return { basarili: false, mesaj: '⚠️ Bu e-posta adresi zaten kayıtlı!' };
    }

    // Yeni kullanıcı oluştur
    const yeniKullanici: KayitliKullanici = {
      id: Date.now().toString(),
      adSoyad,
      email,
      sifre
    };

    // Kayıtlı kullanıcılar listesine ekle
    mevcutKullanicilar.push(yeniKullanici);
    localStorage.setItem(KULLANICILAR_KEY, JSON.stringify(mevcutKullanicilar));

    // Otomatik giriş yap
    const kullaniciBilgisi: Kullanici = { id: yeniKullanici.id, adSoyad, email };
    setKullanici(kullaniciBilgisi);
    localStorage.setItem(KULLANICI_KEY, JSON.stringify(kullaniciBilgisi));

    return { basarili: true, mesaj: '✅ Kayıt başarılı!' };
  };

  // Giriş Yap
  const girisYap = (email: string, sifre: string) => {
    const mevcutKullanicilar = kullanicilariGetir();

    const bulunan = mevcutKullanicilar.find(k => k.email === email);
    if (!bulunan) {
      return { basarili: false, mesaj: '⚠️ Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı!' };
    }

    if (bulunan.sifre !== sifre) {
      return { basarili: false, mesaj: '⚠️ Şifre hatalı!' };
    }

    const kullaniciBilgisi: Kullanici = { id: bulunan.id, adSoyad: bulunan.adSoyad, email: bulunan.email };
    setKullanici(kullaniciBilgisi);
    localStorage.setItem(KULLANICI_KEY, JSON.stringify(kullaniciBilgisi));

    return { basarili: true, mesaj: '✅ Giriş başarılı!' };
  };

  // Çıkış Yap
  const cikisYap = () => {
    setKullanici(null);
    localStorage.removeItem(KULLANICI_KEY);
  };

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, kayitOl, cikisYap, yukleniyor }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır');
  }
  return context;
}
