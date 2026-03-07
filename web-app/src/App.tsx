import React, { useState, useEffect } from 'react';
import './App.css';

interface Esya {
  id: number;
  isim: string;
  kategori: string;
  deger: string;
  renk: string;
}

function App() {
  const [items, setItems] = useState<Esya[]>(() => {
    const kayitliVeri = localStorage.getItem('koleksiyonum');
    if (kayitliVeri) {
      return JSON.parse(kayitliVeri);
    }
    return [
      { id: 1, isim: 'Charizard Base Set', kategori: 'Koleksiyon Kartı', deger: '15000 TL', renk: '#ef4444' },
      { id: 2, isim: '50 Yıllık İran İpek Halı', kategori: 'Antika', deger: '45000 TL', renk: '#eab308' },
      { id: 3, isim: 'İşlemeli Bakır Tepsi', kategori: 'Ev Eşyası', deger: '3500 TL', renk: '#f97316' }
    ];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isim, setIsim] = useState('');
  const [kategori, setKategori] = useState('Antika');
  const [deger, setDeger] = useState('');

  // YENİ: Sadece görsel olarak fotoğrafın seçildiğini göstermek için
  const [secilenFoto, setSecilenFoto] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('koleksiyonum', JSON.stringify(items));
  }, [items]);

  const toplamDeger = items.reduce((toplam, item) => {
    const rakam = parseInt(item.deger.replace(/[^0-9]/g, '')) || 0;
    return toplam + rakam;
  }, 0);

  // Fotoğraf seçildiğinde sadece adını ekranda gösterir (API yok)
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

    // Formu temizle
    setIsFormOpen(false);
    setIsim('');
    setDeger('');
    setSecilenFoto(null);
  };

  const esyaSil = (silinecekId: number) => {
    const guncelListe = items.filter(item => item.id !== silinecekId);
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
        <div className="total-value-card">
          <h3>Toplam Portföy Değeri</h3>
          <div className="amount">{toplamDeger.toLocaleString('tr-TR')} TL</div>
        </div>

        <div className="content-header">
          <h2>Koleksiyonum</h2>
          <span className="item-count">{items.length} Eşya</span>
        </div>

        <div className="item-list">
          {items.map((item) => (
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

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Yeni Eşya Ekle</h2>

            {/* VİZYON İÇİN FOTOĞRAF YÜKLEME ALANI (SAHTE ANİMASYON YOK) */}
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