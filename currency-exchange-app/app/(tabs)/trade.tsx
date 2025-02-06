import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuthStore } from '../../store/authStore';
import Colors from '../../constants/Colors';

const CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP'];

export default function TradeScreen() {
  const [fromCurrency, setFromCurrency] = useState('PLN');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { token, user } = useAuthStore();

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalances(response.data);
    } catch (error) {
      console.error('Error fetching balances:', error);
      Alert.alert('Error', 'Failed to fetch balances');
    }
  };

  const handleExchange = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      Alert.alert('Error', 'Please select different currencies');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!balances[fromCurrency] || balances[fromCurrency] < numericAmount) {
      Alert.alert('Error', `Insufficient ${fromCurrency} balance. Current balance: ${balances[fromCurrency] || 0}`);
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    try {
      const response = await axios.post(
        `${API_URL}/api/transactions/exchange`,
        {
          fromCurrency,
          toCurrency,
          fromAmount: numericAmount
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBalances(response.data.newBalance);
      const exchangedAmount = response.data.transaction.toAmount.toFixed(2);
      setSuccessMessage(`Successfully exchanged ${numericAmount} ${fromCurrency} to ${exchangedAmount} ${toCurrency}`);
      setAmount('');
    } catch (error: any) {
      console.error('Exchange error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to complete exchange'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCurrencyButtons = (selectedCurrency: string, onSelect: (currency: string) => void) => (
    <View style={styles.currencyGrid}>
      {CURRENCIES.map((currency) => (
        <TouchableOpacity
          key={currency}
          style={[
            styles.currencyButton,
            currency === selectedCurrency && styles.selectedCurrency
          ]}
          onPress={() => onSelect(currency)}
        >
          <Text
            style={[
              styles.currencyButtonText,
              currency === selectedCurrency && styles.selectedCurrencyText
            ]}
          >
            {currency}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Balances</Text>
      <View style={styles.balancesContainer}>
        {Object.entries(balances).map(([currency, balance]) => (
          <Text key={currency} style={styles.balance}>
            {currency}: {balance.toFixed(2)}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Exchange Currency</Text>
      
      <View style={styles.exchangeContainer}>
        <View style={styles.currencySection}>
          <Text style={styles.label}>From</Text>
          {renderCurrencyButtons(fromCurrency, setFromCurrency)}
        </View>

        <View style={styles.currencySection}>
          <Text style={styles.label}>To</Text>
          {renderCurrencyButtons(toCurrency, setToCurrency)}
        </View>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor="#666"
        />

        {successMessage ? (
          <View style={styles.successContainer}>
            <Text style={styles.successMessage}>{successMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.exchangeButton, loading && styles.disabledButton]}
          onPress={handleExchange}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.exchangeButtonText}>Exchange</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  balancesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  balance: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  exchangeContainer: {
    gap: 16,
  },
  currencySection: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyButton: {
    flex: 1,
    minWidth: '23%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  selectedCurrency: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  currencyButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedCurrencyText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  exchangeButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  exchangeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  successMessage: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
  },
});
