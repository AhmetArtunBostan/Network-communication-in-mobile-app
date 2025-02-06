import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';

export default function HomeScreen() {
  const { user, token, isLoading } = useAuthStore();

  useEffect(() => {
    if (!token && !isLoading) {
      router.replace('/(auth)/login');
    }
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        <Text style={styles.balanceText}>
          Your main balance: {user.balance?.PLN?.toFixed(2) || '0.00'} PLN
        </Text>
      </View>

      <Text style={styles.title}>Currency Exchange Dashboard</Text>
      <Text style={styles.subtitle}>Your one-stop solution for currency exchange</Text>
      
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Live Rates</Text>
          <Text style={styles.featureDescription}>Get real-time exchange rates from reliable sources</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Quick Exchange</Text>
          <Text style={styles.featureDescription}>Convert currencies with just a few taps</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Secure Transactions</Text>
          <Text style={styles.featureDescription}>Your transactions are protected and secure</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Transaction History</Text>
          <Text style={styles.featureDescription}>Keep track of all your exchanges</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    padding: 20,
  },
  featureItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
