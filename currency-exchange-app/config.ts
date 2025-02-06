// API URL configuration
import { Platform } from 'react-native';

const DEV_API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5050'  // Android Emulator
  : 'http://localhost:5050'; // iOS Simulator or dev device

export const API_URL = DEV_API_URL;
export const NBP_API_URL = 'http://api.nbp.pl/api';
