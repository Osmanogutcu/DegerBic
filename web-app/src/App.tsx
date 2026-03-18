import React, { useState, useEffect } from 'react';
import './App.css'; // Orijinal CSS dosyanız

// --- 1. TİP TANIMLAMALARI (TypeScript Sihri) ---
// Sistemdeki bir "Eşyanın" neye benzeyeceğini TypeScript'e öğretiyoruz.
interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
}

function App() {
  // --- 2. STATE YÖNETİMİ ---
  // items state'inin "Item" tipinde bir dizi (<Item[]>) olduğunu belirtiyoruz.
  const [items, setItems] = useState<Item[]>(() => {
    const savedItems = localStorage.getItem('degerbic_items');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Elektronik');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tümü');

  const categories = ['Elektronik', 'Antika', 'Koleksiyon', 'Giyim', 'Diğer'];

  useEffect(() => {
    localStorage.setItem('degerbic_items', JSON.stringify(items));
  }, [items]);

  // --- 3. EŞYA EKLEME ---
  // 'e'nin bir Form Etkinliği (React.FormEvent) olduğunu belirttik (Kırmızı çizgi gitti!)
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('⚠️ Lütfen geçerli bir eşya adı girin!');
      return;
    }
    if (!price || Number(price) <= 0) {
      alert('⚠️ Fiyat 0 veya negatif olamaz!');
      return;
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      name: name.trim(),
      price: parseFloat(price),
      category: category
    };

    setItems([...items, newItem]);

    setName('');
    setPrice('');
    setCategory('Elektronik');
  };

  // --- 4. EŞYA SİLME ---
  // 'id'nin bir metin (string) olduğunu belirttik (Kırmızı çizgi gitti!)
  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // --- 5. FİLTRELEME VE ARAMA ---
  // Eşyalarımızın tipi belli olduğu için buradaki 'item' kelimelerinin de altı çizilmeyecek.
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'Tümü' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = filteredItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="app-container">
      <header>
        <h1>DeğerBiç 💎</h1>
        <p>Kişisel Envanter ve Değer Takip Sistemi</p>
      </header>

      <main>
        {/* ARAMA VE FİLTRELEME ÇUBUĞU */}
        <section className="filter-section" style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="🔍 Eşya Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="Tümü">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </section>

        {/* EŞYA EKLEME FORMU */}
        <section className="add-item-section" style={{ marginBottom: '30px' }}>
          <form onSubmit={addItem} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Eşya Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1, padding: '10px' }}
            />
            <input
              type="number"
              placeholder="Değeri (₺)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: '120px', padding: '10px' }}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '10px' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Ekle
            </button>
          </form>
        </section>

        {/* ENVANTER LİSTESİ */}
        <section className="inventory-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2>Envanteriniz ({filteredItems.length} Eşya)</h2>
            <div style={{ fontSize: '1.2rem', color: '#16a34a' }}>
              Toplam: <strong>{totalValue.toLocaleString('tr-TR')} ₺</strong>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>Bu kriterlere uygun eşya bulunamadı.</p>
            ) : (
              filteredItems.map(item => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'white', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#3730a3', padding: '3px 8px', borderRadius: '12px', marginTop: '5px', display: 'inline-block' }}>
                      {item.category || 'Diğer'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: 'bold' }}>{item.price.toLocaleString('tr-TR')} ₺</span>
                    <button onClick={() => deleteItem(item.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                      Sil
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;