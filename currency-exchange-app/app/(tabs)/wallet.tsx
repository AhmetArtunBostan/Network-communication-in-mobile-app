import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useBalanceStore } from '../../store/balanceStore';
import { useAuthStore } from '../../store/authStore';
import Colors from '../../constants/Colors';

export default function WalletScreen() {
  const { balances, loading, error, fetchBalances, addFunds } = useBalanceStore();
  const { user } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('PLN');

  useEffect(() => {
    fetchBalances();
  }, []);

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await addFunds(selectedCurrency, Number(amount));
      setAmount('');
      Alert.alert('Success', 'Funds added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add funds');
    }
  };

  const currencies = ['PLN', 'USD', 'EUR', 'GBP'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.title}>Your Balances</Text>
        {balances.map((balance) => (
          <View key={balance.currency} style={styles.balanceItem}>
            <Text style={styles.currency}>{balance.currency}</Text>
            <Text style={styles.amount}>{balance.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.addFundsContainer}>
        <Text style={styles.subtitle}>Add Funds</Text>
        
        <View style={styles.currencySelector}>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                styles.currencyButton,
                selectedCurrency === currency && styles.selectedCurrency,
              ]}
              onPress={() => setSelectedCurrency(currency)}
            >
              <Text style={[
                styles.currencyButtonText,
                selectedCurrency === currency && styles.selectedCurrencyText,
              ]}>
                {currency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFunds}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Funds'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  balanceContainer: {
    marginBottom: 30,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currency: {
    fontSize: 18,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addFundsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currencyButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    width: 70,
    alignItems: 'center',
  },
  selectedCurrency: {
    backgroundColor: Colors.primary,
  },
  currencyButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  selectedCurrencyText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
