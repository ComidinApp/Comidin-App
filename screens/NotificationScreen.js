import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationScreen() {
  const { notification } = useNotification();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (notification) {
      setNotifications(prev => [
        {
          id: Date.now(),
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
          timestamp: new Date().toISOString(),
        },
        ...prev
      ]);
    }
  }, [notification]);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
}); 