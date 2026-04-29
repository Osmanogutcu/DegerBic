// ============================================
// DeğerBiç — Ortak TypeScript Tipleri
// Web ile aynı veri yapısı
// ============================================

export interface Esya {
  id: number;
  isim: string;
  kategori: string;
  deger: string;
  renk: string;
  aciklama: string;
  kondisyon: string;
  fotografUri?: string; // Hafta 9: Fotoğraf desteği
  eklenmeTarihi: string; // Hafta 10: Tarih kaydı
}

export interface Kullanici {
  id: string;
  adSoyad: string;
  email: string;
}

export interface KayitliKullanici extends Kullanici {
  sifre: string;
}

export type KategoriListesi = 'Tümü' | 'Koleksiyon Kartı' | 'Antika' | 'Ev Eşyası' | 'Diğer';
export type KondisyonListesi = 'Mükemmel' | 'İyi' | 'Orta' | 'Kötü';
