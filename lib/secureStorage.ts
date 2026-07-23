import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'prestamosya_auth_token';

export const secureStorage = {
  getToken: async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(TOKEN_KEY);
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error reading token:', error);
      return null;
    }
  },
  setToken: async (token: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') return localStorage.setItem(TOKEN_KEY, token);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },
  deleteToken: async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') return localStorage.removeItem(TOKEN_KEY);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  },
};
