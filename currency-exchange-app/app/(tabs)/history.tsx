import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuthStore } from '../../store/authStore';
import Colors from '../../constants/Colors';

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuthStore();

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return Colors.success;
      case 'WITHDRAWAL':
        return Colors.error;
      case 'EXCHANGE':
        return Colors.primary;
      default:
        return Colors.text;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noTransactions}>No transactions yet</Text>
      ) : (
        transactions.map((transaction: any) => (
          <View key={transaction._id} style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <Text style={[styles.transactionType, { color: getTransactionColor(transaction.type) }]}>
                {transaction.type}
              </Text>
              <Text style={styles.transactionDate}>{formatDate(transaction.createdAt)}</Text>
            </View>
            
            <View style={styles.transactionDetails}>
              {transaction.type === 'EXCHANGE' ? (
                <>
                  <Text style={styles.amount}>
                    From: {transaction.fromAmount} {transaction.fromCurrency}
                  </Text>
                  <Text style={styles.amount}>
                    To: {transaction.toAmount.toFixed(2)} {transaction.toCurrency}
                  </Text>
                  <Text style={styles.rate}>
                    Rate: {transaction.rate.toFixed(4)}
                  </Text>
                </>
              ) : (
                <Text style={styles.amount}>
                  {transaction.type === 'DEPOSIT' ? '+' : '-'}
                  {transaction.fromAmount} {transaction.fromCurrency}
                </Text>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  noTransactions: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 16,
    marginTop: 20,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.gray,
  },
  transactionDetails: {
    marginTop: 8,
  },
  amount: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  rate: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
});
