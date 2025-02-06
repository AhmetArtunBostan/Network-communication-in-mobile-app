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

interface Balance {
  PLN: number;
  EUR: number;
  USD: number;
  GBP: number;
}

export default function DepositScreen({ navigation }: any) {
  const [currency, setCurrency] = useState('PLN');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<Balance>({ PLN: 0, EUR: 0, USD: 0, GBP: 0 });

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
    fetchBalance();
  }, []);

  const handleDeposit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/transactions/deposit`,
        {
          currency,
          amount: parseFloat(amount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert(
        'Success',
        'Deposit completed successfully',
        [{ text: 'OK', onPress: () => {
          setAmount('');
          fetchBalance();
        }}]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Deposit failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <View style={styles.balanceGrid}>
          {Object.entries(balance).map(([curr, amount]) => (
            <View key={curr} style={styles.balanceItem}>
              <Text style={styles.balanceCurrency}>{curr}</Text>
              <Text style={styles.balanceAmount}>{amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.depositContainer}>
        <Text style={styles.title}>Add Funds</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Currency</Text>
          <Picker
            selectedValue={currency}
            onValueChange={setCurrency}
            style={styles.picker}
          >
            <Picker.Item label="PLN" value="PLN" />
            <Picker.Item label="EUR" value="EUR" />
            <Picker.Item label="USD" value="USD" />
            <Picker.Item label="GBP" value="GBP" />
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleDeposit}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <Text style={styles.buttonText}>Add Funds</Text>
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
  depositContainer: {
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
