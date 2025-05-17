import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function Login() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.loginBox}>
        <Image
          source={{
            uri: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWE2czdjcDk3emgybGFpazF0bHZqcnQ2bmJmbHZ2bDdkZmZvcW9rNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VbnUQpnihPSIgIXuZv/giphy.gif',
          }}
          style={styles.gifLogo}
        />
        <Text style={styles.loginTitle}>Welcome Back</Text>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#d1d5db"
            style={styles.formInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#d1d5db"
            style={styles.formInput}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', // Note: RN does not support gradient directly here; will fix below
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loginBox: {
    backgroundColor: '#1f2937',
    padding: 24,
    borderRadius: 24,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  gifLogo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 24,
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#f3f4f6',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});
