import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';

import TabNavigator from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Ana içerik bileşeni (auth state'e göre yönlendirme)
function AppContent() {
  const { kullanici, yukleniyor } = useAuth();
  const { colors, isDark } = useTheme();
  const [authSayfa, setAuthSayfa] = useState<'login' | 'register'>('login');

  if (yukleniyor) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bgPrimary }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Giriş yapmamış → Auth ekranları
  if (!kullanici) {
    if (authSayfa === 'login') {
      return <LoginScreen onNavigateToRegister={() => setAuthSayfa('register')} />;
    }
    return <RegisterScreen onNavigateToLogin={() => setAuthSayfa('login')} />;
  }

  // Giriş yapmış → Tab navigasyonu
  return (
    <DataProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </DataProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
