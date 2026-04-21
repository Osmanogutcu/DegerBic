import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const [adSoyad, setAdSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [hata, setHata] = useState('');
  const { kayitOl } = useAuth();
  const { colors } = useTheme();

  const formGonder = () => {
    setHata('');
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
    if (!sonuc.basarili) {
      setHata(sonuc.mesaj);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.primaryDark }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.decorCircle1, { backgroundColor: colors.primaryGlow }]} />
        <View style={[styles.decorCircle2, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]} />

        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>DeğerBiç 🔍</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Koleksiyonunu yönetmek için hesap oluştur
          </Text>

          {hata ? (
            <View style={[styles.errorBox, { backgroundColor: colors.dangerBg, borderColor: 'rgba(239,68,68,0.25)' }]}>
              <Text style={[styles.errorText, { color: colors.dangerLight }]}>{hata}</Text>
            </View>
          ) : null}

          <Text style={[styles.label, { color: colors.textSecondary }]}>AD SOYAD</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.textPrimary }]}
            placeholder="Adınız Soyadınız"
            placeholderTextColor={colors.textMuted}
            value={adSoyad}
            onChangeText={setAdSoyad}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>E-POSTA</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.textPrimary }]}
            placeholder="ornek@email.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>ŞİFRE</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.textPrimary }]}
            placeholder="En az 6 karakter"
            placeholderTextColor={colors.textMuted}
            value={sifre}
            onChangeText={setSifre}
            secureTextEntry
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>ŞİFRE TEKRAR</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, color: colors.textPrimary }]}
            placeholder="Şifrenizi tekrar girin"
            placeholderTextColor={colors.textMuted}
            value={sifreTekrar}
            onChangeText={setSifreTekrar}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={formGonder}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Kayıt Ol</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={[styles.linkText, { color: colors.primaryLight }]}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  decorCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -80,
    right: -80,
  },
  decorCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: -60,
    left: -60,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 8,
  },
  submitBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
