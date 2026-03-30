import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const { girisYap } = useAuth();
  const navigate = useNavigate();

  const formGonder = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    if (!email.trim() || !sifre.trim()) {
      setHata('⚠️ Lütfen tüm alanları doldurun!');
      return;
    }

    const sonuc = girisYap(email, sifre);
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
          <p>Koleksiyonuna erişmek için giriş yap</p>
        </div>

        <form onSubmit={formGonder} className="auth-form">
          {hata && <div className="auth-error">{hata}</div>}

          <div className="auth-input-group">
            <label htmlFor="login-email">E-posta</label>
            <input
              id="login-email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="login-sifre">Şifre</label>
            <input
              id="login-sifre"
              type="password"
              placeholder="Şifrenizi girin"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Giriş Yap
          </button>
        </form>

        <div className="auth-footer">
          <p>Hesabın yok mu? <Link to="/kayit" className="auth-link">Kayıt Ol</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
