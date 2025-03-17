// _layout.tsx
import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#faf8ef" />
      <LinearGradient
        colors={['#faf8ef', '#eee4da']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef', // This ensures even areas outside SafeAreaView have the right color
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default Layout;