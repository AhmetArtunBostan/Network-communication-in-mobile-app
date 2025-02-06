import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Rate {
  currency: string;
  code: string;
  mid: number;
}

interface Balance {
  PLN: number;
  EUR: number;
  USD: number;
  GBP: number;
}

export default function ExchangeScreen({ navigation }: any) {
  const [fromCurrency, setFromCurrency] = useState('PLN');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [rates, setRates] = useState<Rate[]>([]);
  const [balance, setBalance] = useState<Balance>({ PLN: 0, EUR: 0, USD: 0, GBP: 0 });

  const fetchRates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions/rates`);
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchBalance();
  }, []);

  const handleExchange = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/transactions/exchange`,
        {
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert(
        'Success',
        'Exchange completed successfully',
        [{ text: 'OK', onPress: () => {
          setAmount('');
          fetchBalance();
        }}]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Exchange failed');
    }
  };

  const calculateExchangeRate = () => {
    const fromRate = fromCurrency === 'PLN' ? 1 : rates.find(r => r.code === fromCurrency)?.mid;
    const toRate = toCurrency === 'PLN' ? 1 : rates.find(r => r.code === toCurrency)?.mid;
    
    if (!fromRate || !toRate) return 0;
    return (toRate / fromRate).toFixed(4);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Your Balance</Text>
        <View style={styles.balanceGrid}>
          {Object.entries(balance).map(([currency, amount]) => (
            <View key={currency} style={styles.balanceItem}>
              <Text style={styles.balanceCurrency}>{currency}</Text>
              <Text style={styles.balanceAmount}>{amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.exchangeContainer}>
        <Text style={styles.title}>Exchange Currency</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>From</Text>
          <Picker
            selectedValue={fromCurrency}
            onValueChange={setFromCurrency}
            style={styles.picker}
          >
            <Picker.Item label="PLN" value="PLN" />
            {rates.map(rate => (
              <Picker.Item key={rate.code} label={rate.code} value={rate.code} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>To</Text>
          <Picker
            selectedValue={toCurrency}
            onValueChange={setToCurrency}
            style={styles.picker}
          >
            <Picker.Item label="PLN" value="PLN" />
            {rates.map(rate => (
              <Picker.Item key={rate.code} label={rate.code} value={rate.code} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
          />
        </View>

        <View style={styles.rateContainer}>
          <Text style={styles.rateText}>
            Exchange Rate: 1 {fromCurrency} = {calculateExchangeRate()} {toCurrency}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleExchange}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <Text style={styles.buttonText}>Exchange</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  balanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  balanceItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  balanceCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  balanceAmount: {
    fontSize: 18,
    color: '#2196F3',
    marginTop: 5,
  },
  exchangeContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  picker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  rateContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  rateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
