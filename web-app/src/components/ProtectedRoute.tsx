import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Giriş yapmamış kullanıcıları login sayfasına yönlendirir
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { kullanici, yukleniyor } = useAuth();

  if (yukleniyor) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!kullanici) {
    return <Navigate to="/giris" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
