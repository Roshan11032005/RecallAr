import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

// Interface for reminder data matching backend structure
interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  recurring: string;
  createdAt: string;
  updatedAt: string;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const RemindersScreen: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Request notification permissions
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Notification permissions are required');
      return false;
    }
    return true;
  };

  // Schedule a notification for a reminder
  const scheduleNotification = async (reminder: Reminder) => {
    const [year, month, day] = reminder.date.split('-').map(Number);
    const [hour, minute] = reminder.time.split(':').map(Number);

    const trigger = new Date(year, month - 1, day, hour, minute);
    
    // Skip if the reminder is in the past
    if (trigger < new Date()) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.description || 'Reminder!',
        data: { reminderId: reminder.id },
      },
      trigger,
    });
  };

  // Fetch reminders from backend
  const fetchReminders = async () => {
    try {
      const response = await axios.post('https://2114-2402-e280-212e-e5-5982-15cb-9f5c-f4b1.ngrok-free.app/web/caregiver/reminder-get');
      const fetchedReminders: Reminder[] = response.data;
      setReminders(fetchedReminders);

      // Schedule notifications for each reminder
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        fetchedReminders.forEach((reminder) => {
          scheduleNotification(reminder);
        });
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      Alert.alert('Error', 'Failed to fetch reminders');
    }
  };

  // Fetch reminders on component mount
  useEffect(() => {
    fetchReminders();

    // Set up notification listener
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const reminderId = notification.request.content.data.reminderId;
      console.log('Notification received for reminder:', reminderId);
    });

    return () => subscription.remove();
  }, []);

  // Render individual reminder item
  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderTitle}>{item.title}</Text>
      <Text style={styles.reminderDescription}>{item.description}</Text>
      <Text style={styles.reminderDateTime}>
        {item.date} at {item.time}
      </Text>
      {item.recurring !== 'none' && (
        <Text style={styles.reminderRecurring}>Recurring: {item.recurring}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Reminders</Text>
      <FlatList
        data={reminders}
        renderItem={renderReminderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No reminders found</Text>}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reminderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  reminderDateTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  reminderRecurring: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RemindersScreen;