import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL } from '../config';

interface Rate {
  currency: string;
  code: string;
  mid: number;
}

export default function HistoricalRatesScreen() {
  const [date, setDate] = useState(new Date());
  const [rates, setRates] = useState<Rate[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchHistoricalRates = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/api/transactions/rates/historical/${formattedDate}`);
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching historical rates:', error);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      fetchHistoricalRates(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Historical Exchange Rates</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}

      <ScrollView>
        {rates.map((rate) => (
          <View key={rate.code} style={styles.rateItem}>
            <View style={styles.rateInfo}>
              <Text style={styles.currencyCode}>{rate.code}</Text>
              <Text style={styles.currencyName}>{rate.currency}</Text>
            </View>
            <Text style={styles.rateValue}>{(1 / rate.mid).toFixed(4)} PLN</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
