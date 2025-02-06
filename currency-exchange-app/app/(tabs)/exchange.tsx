import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRatesStore } from '../../store/ratesStore';

export default function RatesScreen() {
  const { currentRates, loading, fetchCurrentRates } = useRatesStore();

  useEffect(() => {
    fetchCurrentRates();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Exchange Rates</Text>
      <Text style={styles.subtitle}>Base Currency: PLN</Text>

      <ScrollView style={styles.ratesList}>
        {currentRates.map((rate) => (
          <View key={rate.code} style={styles.rateItem}>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyCode}>{rate.code}</Text>
              <Text style={styles.currencyName}>{rate.currency}</Text>
            </View>
            <View style={styles.rateInfo}>
              <Text style={styles.rateValue}>{rate.mid.toFixed(4)}</Text>
              <Text style={styles.rateChange}>
                {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}%
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a237e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  ratesList: {
    flex: 1,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rateInfo: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  rateChange: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
});
