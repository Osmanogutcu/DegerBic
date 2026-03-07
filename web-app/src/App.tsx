import React, { useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([
    { id: 1, isim: 'Charizard Base Set', kategori: 'Koleksiyon Kartı', deger: '15.000 TL', renk: '#ef4444' },
    { id: 2, isim: '50 Yıllık İran İpek Halı', kategori: 'Antika', deger: '45.000 TL', renk: '#eab308' },
    { id: 3, isim: 'İşlemeli Bakır Tepsi', kategori: 'Ev Eşyası', deger: '3.500 TL', renk: '#f97316' }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isim, setIsim] = useState('');
  const [kategori, setKategori] = useState('Antika');
  const [deger, setDeger] = useState('');

  const esyaKaydet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isim || !deger) {
      alert("Lütfen isim ve değer alanlarını doldurun!");
      return;
    }
    const yeniEsya = {
      id: items.length + 1,
      isim: isim,
      kategori: kategori,
      deger: deger + ' TL',
      renk: '#8b5cf6'
    };
    setItems([...items, yeniEsya]);
    setIsFormOpen(false);
    setIsim('');
    setDeger('');
  };
  // Seçilen eşyayı ID'sine göre bulup listeden çıkaran filtreleme fonksiyonu
  const esyaSil = (silinecekId: number) => {
    const guncelListe = items.filter(item => item.id !== silinecekId);
    setItems(guncelListe);
  };
  return (
    <div className="mobile-app-container">
      <header className="app-header">
        <h1>DeğerBiç 🔍</h1>
        <p>Envanter ve Değerleme Asistanı</p>
      </header>

      <main className="app-content">
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
              {/* Değer ve Sil Butonu Yan Yana */}
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

            <form onSubmit={esyaKaydet}>
              <div className="input-group">
                <label>Eşya Adı</label>
                <input
                  type="text"
                  placeholder="Örn: 1. Nesil Pikachu"
                  value={isim}
                  onChange={(e) => setIsim(e.target.value)}
                />
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
                <input
                  type="number"
                  placeholder="Örn: 2000"
                  value={deger}
                  onChange={(e) => setDeger(e.target.value)}
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setIsFormOpen(false)}>İptal</button>
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