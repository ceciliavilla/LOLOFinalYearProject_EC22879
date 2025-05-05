import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { auth, db } from '../firebaseConfig';
import {collection,getDocs,doc,updateDoc,query,where,getDoc,} from 'firebase/firestore';
import styles from './styles/stylesmanageconnections';


export default function ManageConnectionsScreen() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const loadRequests = async () => {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return;

      const q = query(
        collection(db, 'connectionRequests'),
        where('toUserId', '==', currentUserId),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);

      const requestsWithUserData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const fromUserRef = doc(db, 'users', data.fromUserId);
          const fromUserSnap = await getDoc(fromUserRef);
          const fromUserData = fromUserSnap.exists() ? fromUserSnap.data() : {};
          return {
            id: docSnap.id,
            ...data,
            fromUserEmail: fromUserData.email || '',
            fromUserName: fromUserData.name || '',
            fromUserlastName: fromUserData.lastName || '',
          };
        })
      );

      setRequests(requestsWithUserData);
    };

    loadRequests();
  }, []);

  const manageAccept = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'connectionRequests', requestId), {
        status: 'accepted',
      });
      Alert.alert('Success', 'Connection accepted!');
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pending Requests</Text>
      {requests.map((req) => (
        <View key={req.id} style={styles.requestBox}>
          <Text style={styles.requestText}>
            From: {req.fromUserName} {req.fromUserlastName} ({req.fromUserEmail})
          </Text>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => manageAccept(req.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
