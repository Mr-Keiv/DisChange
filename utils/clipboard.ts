import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

export async function generateSms(phoneNumber: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  
  try {
    // For a real app, you would use expo-sms
    // import * as SMS from 'expo-sms';
    // const isAvailable = await SMS.isAvailableAsync();
    // if (isAvailable) {
    //   await SMS.sendSMSAsync(phoneNumber, message);
    //   return true;
    // }
    
    // For demo purposes, we'll just copy the message to clipboard
    await copyToClipboard(message);
    return true;
  } catch (error) {
    console.error('Error generating SMS:', error);
    return false;
  }
}