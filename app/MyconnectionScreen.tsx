import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './styles/stylesmyconnections';


export default function MyConnectionsScreen() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return;

      const q = query(
        collection(db, 'connectionRequests'),
        where('toUserId', '==', currentUserId),
        where('status', '==', 'accepted')
      );

      const connectionSnapshot = await getDocs(q);
      const connectedUsers: any[] = [];

      for (const requestDoc of connectionSnapshot.docs) {
        const requestData = requestDoc.data();
        const userSnap = await getDoc(doc(db, 'users', requestData.fromUserId));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          connectedUsers.push({
            id: requestDoc.id, // ID del documento de la solicitud
            name: userData.name || 'N/A',
            lastName: userData.lastName || '',
            email: userData.email || '',
            userType: userData.userType || '',
          });
        }
      }

      setConnections(connectedUsers);
      setLoading(false);
    };

    fetchConnections();
  }, []);

  const confirmRemove = (requestId: string) => {
    Alert.alert(
      'Are you sure?',
      'This will remove the connection.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => handleRemove(requestId),
        },
      ]
    );
  };

  const handleRemove = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'connectionRequests', requestId), {
        status: 'removed',
      });
      setConnections(prev => prev.filter(conn => conn.id !== requestId));
      Alert.alert('Connection removed.');
    } catch (error) {
      console.error('Error removing connection:', error);
      Alert.alert('Error', 'Could not remove connection.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Connections</Text>

      {loading ? (
        <Text style={styles.subtitle}>Loading connections...</Text>
      ) : connections.length === 0 ? (
        <Text style={styles.subtitle}>You are not connected to anyone yet.</Text>
      ) : (
        <FlatList
          data={connections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name} {item.lastName}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>Role: {item.userType}</Text>
              <TouchableOpacity
                onPress={() => confirmRemove(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

