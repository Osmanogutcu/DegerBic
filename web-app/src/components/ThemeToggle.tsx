import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [tema, setTema] = useState(() => {
    const kayitli = localStorage.getItem('degerbic_tema');
    return kayitli || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('degerbic_tema', tema);
  }, [tema]);

  const temaDegistir = () => {
    setTema(onceki => onceki === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={temaDegistir}
      aria-label="Tema değiştir"
      title={tema === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      {tema === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
