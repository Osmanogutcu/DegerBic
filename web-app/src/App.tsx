import { useState } from 'react';
import './App.css';

function App() {
  // Veritabanı simülasyonu (Örnek eşyalarımız)
  const [items] = useState([
    {
      id: 1,
      isim: 'Charizard Base Set',
      kategori: 'Koleksiyon Kartı',
      deger: '15.000 TL',
      renk: '#ef4444' // Kırmızı vurgu
    },
    {
      id: 2,
      isim: '50 Yıllık İran İpek Halı',
      kategori: 'Antika',
      deger: '45.000 TL',
      renk: '#eab308' // Sarı/Altın vurgu
    },
    {
      id: 3,
      isim: 'İşlemeli Bakır Tepsi',
      kategori: 'Ev Eşyası',
      deger: '3.500 TL',
      renk: '#f97316' // Bakır/Turuncu vurgu
    }
  ]);

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

        {/* Eşyaları listelediğimiz bölüm */}
        <div className="item-list">
          {items.map((item) => (
            <div key={item.id} className="item-card" style={{ borderLeftColor: item.renk }}>
              <div className="item-info">
                <h3>{item.isim}</h3>
                <span className="item-category">{item.kategori}</span>
              </div>
              <div className="item-value">
                {item.deger}
              </div>
            </div>
          ))}
        </div>

        {/* Yeni Ekle Butonu */}
        <button className="add-button">+ Yeni Eşya Ekle</button>
      </main>
    </div>
  );
}

export default App;