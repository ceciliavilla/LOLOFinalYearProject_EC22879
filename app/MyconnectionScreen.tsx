import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function MyConnectionsScreen() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return;

      // Obtener conexiones donde el usuario elderly es el receptor
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
            id: userSnap.id,
            name: userData.name || 'Unknown',
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
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>Role: {item.userType}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2f5dc', // verde clarito para elderly
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00684a',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  role: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
});
