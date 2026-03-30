import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [adSoyad, setAdSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [hata, setHata] = useState('');
  const { kayitOl } = useAuth();
  const navigate = useNavigate();

  const formGonder = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    // Validasyon
    if (!adSoyad.trim() || !email.trim() || !sifre.trim() || !sifreTekrar.trim()) {
      setHata('⚠️ Lütfen tüm alanları doldurun!');
      return;
    }

    if (sifre.length < 6) {
      setHata('⚠️ Şifre en az 6 karakter olmalıdır!');
      return;
    }

    if (sifre !== sifreTekrar) {
      setHata('⚠️ Şifreler eşleşmiyor!');
      return;
    }

    const sonuc = kayitOl(adSoyad, email, sifre);
    if (sonuc.basarili) {
      navigate('/');
    } else {
      setHata(sonuc.mesaj);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>DeğerBiç 🔍</h1>
          <p>Koleksiyonunu yönetmek için hesap oluştur</p>
        </div>

        <form onSubmit={formGonder} className="auth-form">
          {hata && <div className="auth-error">{hata}</div>}

          <div className="auth-input-group">
            <label htmlFor="kayit-ad">Ad Soyad</label>
            <input
              id="kayit-ad"
              type="text"
              placeholder="Adınız Soyadınız"
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="kayit-email">E-posta</label>
            <input
              id="kayit-email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="kayit-sifre">Şifre</label>
            <input
              id="kayit-sifre"
              type="password"
              placeholder="En az 6 karakter"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="kayit-sifre-tekrar">Şifre Tekrar</label>
            <input
              id="kayit-sifre-tekrar"
              type="password"
              placeholder="Şifrenizi tekrar girin"
              value={sifreTekrar}
              onChange={(e) => setSifreTekrar(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Kayıt Ol
          </button>
        </form>

        <div className="auth-footer">
          <p>Zaten hesabın var mı? <Link to="/giris" className="auth-link">Giriş Yap</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
