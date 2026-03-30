import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import './App.css';

// TYPESCRIPT İÇİN KİMLİK KARTI (Interface)
interface Esya {
  id: number;
  isim: string;
  kategori: string;
  deger: string;
  renk: string;
  aciklama: string;
  kondisyon: string;
}

function App() {
  const { kullanici, cikisYap } = useAuth();

  // 1. KALICI HAFIZA (Local Storage)
  const [items, setItems] = useState<Esya[]>(() => {
    const kayitliVeri = localStorage.getItem('koleksiyonum');
    if (kayitliVeri) {
      return JSON.parse(kayitliVeri);
    }
    return [];
  });

  // Orijinal State'lerin
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isim, setIsim] = useState('');
  const [kategori, setKategori] = useState('Antika');
  const [deger, setDeger] = useState('');
  const [secilenFoto, setSecilenFoto] = useState<string | null>(null);
  const [aciklama, setAciklama] = useState('');
  const [kondisyon, setKondisyon] = useState('İyi');

  // YENİ: Arama ve Filtreleme State'leri (5. Hafta)
  const [aramaSorgusu, setAramaSorgusu] = useState('');
  const [filtreKategori, setFiltreKategori] = useState('Tümü');

  useEffect(() => {
    localStorage.setItem('koleksiyonum', JSON.stringify(items));
  }, [items]);

  // YENİ: FİLTRELEME MOTORU
  // Ekranda sadece arama ve kategoriye uyan eşyaları gösterir
  const filtrelenmisEsyalar = items.filter((item) => {
    const aramaUyumu = item.isim.toLowerCase().includes(aramaSorgusu.toLowerCase());
    const kategoriUyumu = filtreKategori === 'Tümü' || item.kategori === filtreKategori;
    return aramaUyumu && kategoriUyumu;
  });

  // GÜNCELLEME: Toplam değer artık sadece "filtrelenmiş" (ekranda görünen) eşyaları hesaplar
  const toplamDeger = filtrelenmisEsyalar.reduce((toplam: number, item: Esya) => {
    const rakam = parseInt(item.deger.replace(/[^0-9]/g, '')) || 0;
    return toplam + rakam;
  }, 0);

  const fotoSecildi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSecilenFoto(file.name);
    }
  };

  const esyaKaydet = (e: React.FormEvent) => {
    e.preventDefault();

    // HATA KONTROLÜ (Form Validasyonu)
    if (!isim.trim() || !deger) {
      alert("⚠️ Lütfen isim ve değer alanlarını doldurun!");
      return;
    }
    if (Number(deger) <= 0) {
      alert("⚠️ Eşyanın tahmini değeri 0 veya negatif olamaz!");
      return;
    }

    const yeniEsya: Esya = {
      id: Date.now(),
      isim: isim.trim(),
      kategori: kategori,
      deger: deger + ' TL',
      renk: '#8b5cf6',
      aciklama: aciklama.trim(),
      kondisyon: kondisyon
    };

    setItems([...items, yeniEsya]);

    // Formu temizle ve kapat
    setIsFormOpen(false);
    setIsim('');
    setDeger('');
    setSecilenFoto(null);
    setAciklama('');
    setKondisyon('İyi');
  };

  const esyaSil = (silinecekId: number) => {
    const guncelListe = items.filter((item: Esya) => item.id !== silinecekId);
    setItems(guncelListe);
  };

  const formuKapat = () => {
    setIsFormOpen(false);
    setIsim('');
    setDeger('');
    setSecilenFoto(null);
    setAciklama('');
    setKondisyon('İyi');
  }

  return (
    <div className="mobile-app-container">
      <header className="app-header">
        <div className="header-top">
          <div className="header-user-info">
            <span className="user-avatar">👤</span>
            <span className="user-name">{kullanici?.adSoyad}</span>
          </div>
          <button className="logout-btn" onClick={cikisYap}>
            Çıkış Yap
          </button>
        </div>
        <h1>DeğerBiç 🔍</h1>
        <p>Envanter ve Değerleme Asistanı</p>
      </header>

      <main className="app-content">
        {/* TOPLAM DEĞER KARTI */}
        <div className="total-value-card">
          <h3>Toplam Portföy Değeri</h3>
          <div className="amount">{toplamDeger.toLocaleString('tr-TR')} TL</div>
        </div>

        {/* ARAMA VE FİLTRELEME ÇUBUĞU */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '10px' }}>
          <input
            type="text"
            placeholder="🔍 Eşya Ara..."
            value={aramaSorgusu}
            onChange={(e) => setAramaSorgusu(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          />
          <select
            value={filtreKategori}
            onChange={(e) => setFiltreKategori(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: 'white', color: 'black' }}
          >
            <option value="Tümü">Tüm Kategoriler</option>
            <option value="Koleksiyon Kartı">Koleksiyon Kartı</option>
            <option value="Antika">Antika</option>
            <option value="Ev Eşyası">Ev Eşyası</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        <div className="content-header">
          <h2>Koleksiyonum</h2>
          <span className="item-count">{filtrelenmisEsyalar.length} Eşya</span>
        </div>

        <div className="item-list">
          {filtrelenmisEsyalar.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>Bu kriterlere uygun eşya bulunamadı.</p>
          ) : (
            filtrelenmisEsyalar.map((item: Esya) => (
              <div key={item.id} className="item-card" style={{ borderLeftColor: item.renk }}>
                <div className="item-info">
                  <h3>{item.isim}</h3>
                  <span className="item-category">{item.kategori}</span>
                  {item.kondisyon && <span className="item-kondisyon">Kondisyon: {item.kondisyon}</span>}
                  {item.aciklama && <p className="item-description">{item.aciklama}</p>}
                </div>
                <div className="item-actions">
                  <div className="item-value">{item.deger}</div>
                  <button className="delete-btn" onClick={() => esyaSil(item.id)}>Sil</button>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="add-button" onClick={() => setIsFormOpen(true)}>
          + Yeni Eşya Ekle
        </button>
      </main>

      {/* MODAL FORM */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Yeni Eşya Ekle</h2>

            <div className="upload-area">
              <input type="file" accept="image/*" onChange={fotoSecildi} />
              <div className="upload-content">
                <span className="camera-icon">📸</span>
                {secilenFoto ? (
                  <p className="success-text">✅ {secilenFoto}</p>
                ) : (
                  <>
                    <p><strong>Eşyanın Fotoğrafını Yükle</strong></p>
                    <p className="small-text">(Yapay zeka analizi ilerleyen sürümlerde eklenecektir)</p>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={esyaKaydet}>
              <div className="input-group">
                <label>Eşya Adı</label>
                <input type="text" placeholder="Örn: 50 Yıllık Halı" value={isim} onChange={(e) => setIsim(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Kategori</label>
                <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                  <option value="Koleksiyon Kartı">Koleksiyon Kartı</option>
                  <option value="Antika">Antika</option>
                  <option value="Ev Eşyası">Ev Eşyası</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div className="input-group">
                <label>Tahmini Değer (TL)</label>
                <input type="number" placeholder="Örn: 5000" value={deger} onChange={(e) => setDeger(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Kondisyon</label>
                <select value={kondisyon} onChange={(e) => setKondisyon(e.target.value)}>
                  <option value="Mükemmel">Mükemmel</option>
                  <option value="İyi">İyi</option>
                  <option value="Orta">Orta</option>
                  <option value="Kötü">Kötü</option>
                </select>
              </div>

              <div className="input-group">
                <label>Açıklama</label>
                <textarea
                  placeholder="Eşya hakkında kısa bir açıklama yazın..."
                  value={aciklama}
                  onChange={(e) => setAciklama(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '15px', backgroundColor: '#f9fafb', color: '#000', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={formuKapat}>İptal</button>
                <button type="submit" className="save-btn">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;