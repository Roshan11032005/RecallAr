import { useEffect, useState, useRef } from 'react';
import { Platform, StyleSheet, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [locationGranted, setLocationGranted] = useState(false);
  const initialLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const [hasAlerted, setHasAlerted] = useState(false);
  const alertCountRef = useRef(0); // Keep track of number of alerts sent

  useEffect(() => {
    const watchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      setLocationGranted(true);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const current = { latitude, longitude };

          if (!initialLocationRef.current) {
            initialLocationRef.current = current;
            return;
          }

          const distanceMoved = haversineDistance(current, initialLocationRef.current);

          if (distanceMoved > 10 && !hasAlerted && alertCountRef.current < 5) {
            sendAlertToBackend(current);
            setHasAlerted(true);
            alertCountRef.current += 1;
            initialLocationRef.current = current;
          } else if (distanceMoved <= 10) {
            setHasAlerted(false);
          }
        }
      );

      return () => subscription.remove();
    };

    watchLocation();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to RecallAR!
      </ThemedText>
      <Text style={styles.subtitle}>Helping Alzheimer's patients with AR support</Text>
      <HelloWave />
    </ThemedView>
  );
}

function haversineDistance(coords1: { latitude: number; longitude: number }, coords2: { latitude: number; longitude: number }) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function sendAlertToBackend(location: { latitude: number; longitude: number }) {
  try {
    await fetch('https://2114-2402-e280-212e-e5-5982-15cb-9f5c-f4b1.ngrok-free.app/mobile/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'USER_123',
        location,
      }),
    });
    Alert.alert('Alert Sent', 'Caretaker has been notified.');
  } catch (error) {
    console.error('Failed to send alert', error);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});
