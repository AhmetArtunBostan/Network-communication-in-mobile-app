import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

interface Rate {
  currency: string;
  code: string;
  mid: number;
}

export default function RatesScreen() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions/rates`);
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRates();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Current Exchange Rates</Text>
        <Text style={styles.subheaderText}>1 PLN equals:</Text>
      </View>
      {rates.map((rate) => (
        <View key={rate.code} style={styles.rateItem}>
          <View style={styles.rateInfo}>
            <Text style={styles.currencyCode}>{rate.code}</Text>
            <Text style={styles.currencyName}>{rate.currency}</Text>
          </View>
          <Text style={styles.rateValue}>{(1 / rate.mid).toFixed(4)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subheaderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rateInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2196F3',
  },
});
