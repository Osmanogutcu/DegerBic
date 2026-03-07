import React, { useState, useEffect } from 'react';
import './App.css';

// TYPESCRIPT İÇİN KİMLİK KARTI (Interface)
// Bu kısım alttaki tüm kırmızı çizgileri (item.id, item.isim vb.) yok eder.
interface Esya {
  id: number;
  isim: string;
  kategori: string;
  deger: string;
  renk: string;
}

function App() {
  // 1. KALICI HAFIZA (Local Storage): Tarayıcıda kayıtlı veri varsa getir
  const [items, setItems] = useState<Esya[]>(() => {
    const kayitliVeri = localStorage.getItem('koleksiyonum');
    if (kayitliVeri) {
      return JSON.parse(kayitliVeri);
    }
    // Başlangıçta liste boş gelsin (Seninkileri sildiğin için)
    return [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isim, setIsim] = useState('');
  const [kategori, setKategori] = useState('Antika');
  const [deger, setDeger] = useState('');
  const [secilenFoto, setSecilenFoto] = useState<string | null>(null);

  // 2. HAFIZAYI GÜNCELLE: Liste her değiştiğinde tarayıcıya kaydet
  useEffect(() => {
    localStorage.setItem('koleksiyonum', JSON.stringify(items));
  }, [items]);

  // 3. TOPLAM DEĞER ALGORİTMASI: Dizideki fiyatları toplar
  // (toplam: number, item: Esya) belirteçleri kırmızı çizgileri çözer.
  const toplamDeger = items.reduce((toplam: number, item: Esya) => {
    const rakam = parseInt(item.deger.replace(/[^0-9]/g, '')) || 0;
    return toplam + rakam;
  }, 0);

  // Fotoğraf seçme simülasyonu
  const fotoSecildi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSecilenFoto(file.name);
    }
  };

  const esyaKaydet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isim || !deger) {
      alert("Lütfen isim ve değer alanlarını doldurun!");
      return;
    }
    const yeniEsya: Esya = {
      id: Date.now(),
      isim: isim,
      kategori: kategori,
      deger: deger + ' TL',
      renk: '#8b5cf6'
    };
    setItems([...items, yeniEsya]);

    // Formu temizle ve kapat
    setIsFormOpen(false);
    setIsim('');
    setDeger('');
    setSecilenFoto(null);
  };

  // Silme fonksiyonu
  const esyaSil = (silinecekId: number) => {
    const guncelListe = items.filter((item: Esya) => item.id !== silinecekId);
    setItems(guncelListe);
  };

  const formuKapat = () => {
    setIsFormOpen(false);
    setIsim('');
    setDeger('');
    setSecilenFoto(null);
  }

  return (
    <div className="mobile-app-container">
      <header className="app-header">
        <h1>DeğerBiç 🔍</h1>
        <p>Envanter ve Değerleme Asistanı</p>
      </header>

      <main className="app-content">
        {/* TOPLAM DEĞER KARTI */}
        <div className="total-value-card">
          <h3>Toplam Portföy Değeri</h3>
          <div className="amount">{toplamDeger.toLocaleString('tr-TR')} TL</div>
        </div>

        <div className="content-header">
          <h2>Koleksiyonum</h2>
          <span className="item-count">{items.length} Eşya</span>
        </div>

        <div className="item-list">
          {/* LİSTELEME: (item: Esya) yazısı kırmızı çizgileri çözer */}
          {items.map((item: Esya) => (
            <div key={item.id} className="item-card" style={{ borderLeftColor: item.renk }}>
              <div className="item-info">
                <h3>{item.isim}</h3>
                <span className="item-category">{item.kategori}</span>
              </div>
              <div className="item-actions">
                <div className="item-value">{item.deger}</div>
                <button className="delete-btn" onClick={() => esyaSil(item.id)}>Sil</button>
              </div>
            </div>
          ))}
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
                <label>Tahmini Değeri (TL)</label>
                <input type="number" placeholder="Örn: 2000" value={deger} onChange={(e) => setDeger(e.target.value)} />
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