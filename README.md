# DegerBic
Kullanıcıların nadir ve değerli eşyalarını (örneğin 50 yıllık ipek halılar, el işlemesi bakır tepsiler veya koleksiyonluk oyun kartları) dijital bir envanterde güvenle saklayabildiği, güncel piyasa değerlerini takip edebildiği çapraz platform (Cross-Platform) bir koleksiyon yönetim sistemidir.
# Proje İş Akışı
# Faz 1 : Planlama ve Tasarım(Hafta 1-3)
1.Hafta:Proje İhtiyaç Analizi ve Kurulumlar
- Proje gereksinimlerinin belirlenmesi.
- GitHub reposunun kurulması.
-Web (React/Vite) ve Mobil (React Native/Expo) proje klasör mimarisinin oluşturulması.
# 2. Hafta: Veritabanı (Veri) Modellemesi
- Eşyaların hangi özelliklerinin (isim, yıl, kondisyon, değer, fotoğraf) tutulacağının belirlenmesi.
- Supabase (veya Firebase) üzerinde projenin açılması ve tabloların oluşturulması.
# 3. Hafta: UI/UX Tasarımı (Wireframe)
- Web Dashboard'u ve Mobil uygulama ekranlarının (giriş, eşya ekleme, listeleme) Figma veya kağıt üzerinde taslak olarak çizilmesi.
Faz 2: Web Arayüzü ve Backend Entegrasyonu (Hafta 4-7)
# 4. Hafta: Web - Temel İskelet ve Yönlendirmeler
- React tarafında sayfaların (Ana Sayfa, Eşyalarım, Değerleme Forumu) oluşturulması.
- React Router ile sayfalar arası geçişlerin sağlanması.
# 5. Hafta: Web - Veritabanı Bağlantısı
- Supabase/Firebase entegrasyonu.
- Veritabanından sahte (mock) eşya verilerinin çekilip web sayfasında listelenmesi.
# 6. Hafta: Web - Kullanıcı Girişi (Auth) ve Formlar
- Kayıt ol/Giriş yap sayfalarının kodlanması.
- Web üzerinden manuel olarak eşya ekleme formunun yapılması.
# 7. Hafta: Web - Stil ve CSS
- Tailwind CSS veya normal CSS ile web arayüzünün modern bir görünüme kavuşturulması (Görsellerin grid şeklinde dizilmesi vb.).
Faz 3: Mobil Uygulama Geliştirme (Hafta 8-11)
# 8. Hafta: Mobil - Temel Kurulum ve Navigasyon
- React Native / Expo kurulumu.
- Alt bar navigasyonunun (Home, Ekle, Profil) oluşturulması.
# 9. Hafta: Mobil - Kamera ve Fotoğraf Yükleme
- Telefon kamerasını açma yetkisinin alınması.
- Çekilen fotoğrafı uygulamanın içine alma ve veritabanına yükleme (Storage) işlemlerinin yapılması.
# 10. Hafta: Mobil - Eşya Ekleme Ekranı
- Çekilen fotoğrafın altına isim, açıklama ve tahmini fiyat yazılarak veritabanına kaydedilmesi.
# 11. Hafta: Mobil - Arayüz ve Web ile Senkronizasyon
- Mobilden eklenen eşyaların web'de, web'den eklenenlerin mobilde anında göründüğünün (Cross-Platform) test edilmesi ve arayüzün düzenlenmesi.
Faz 4: Test, Hata Giderme ve Teslim (Hafta 12-14)
# 12. Hafta: Değerleme (Appraisal) Modülünün Eklenmesi
- Hem web hem mobilde kullanıcıların eşyalara yorum/fiyat tahmini yapabileceği basit bir sosyal alanın kodlanması.
# 13. Hafta: Test ve Hata Giderme 
- Lighthouse ile web tarafının erişilebilirlik ve hız testlerinin yapılması.
- Mobil uygulamada çökmelerin (crash) kontrolü ve çözülmesi.
# 14. Hafta: Yayına Alma (Deployment) ve Sunum Hazırlığı
- Web sitesinin Vercel veya Netlify'da ücretsiz yayına alınması.
- Projenin README dosyasının son haline getirilmesi ve hocaya sunum/rapor hazırlığı.
