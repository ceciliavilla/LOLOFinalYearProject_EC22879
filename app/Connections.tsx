import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDocs, query, where, setDoc } from 'firebase/firestore';
import styles from './styles/stylesconnections';

export default function SendConnectionRequest() {
  const [elderlyEmail, setElderlyEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingConnections, setPendingConnections] = useState<String[]>([])

  const handleSendRequest = async () => {
    if (!elderlyEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }
  
    try {
      setLoading(true);
  
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', elderlyEmail), where('userType', '==', 'Elderly'));
      const result = await getDocs(q);
  
      if (result.empty) {
        Alert.alert('Error', 'No elderly user found with that email.');
        setLoading(false);
        return;
      }
  
      const elderlyDoc = result.docs[0];
      const elderlyId = elderlyDoc.id;
      const elderlyData = elderlyDoc.data();
  
      const currentUser = auth.currentUser;
      const currentUserId = currentUser?.uid;
      const currentUserEmail = currentUser?.email;
  
      if (!currentUserId || !currentUserEmail) {
        Alert.alert('Error', 'User not authenticated.');
        setLoading(false);
        return;
      }
  
      // 🔒 Check if a connection request already exists (pending or accepted)
      const existingRequestQuery = query(
        collection(db, 'connectionRequests'),
        where('fromUserId', '==', currentUserId),
        where('toUserId', '==', elderlyId),
      );
  
      const existingRequestSnapshot = await getDocs(existingRequestQuery);
  
      if (!existingRequestSnapshot.empty) {
        const status = existingRequestSnapshot.docs[0].data().status;
        if (status === 'pending') {
          Alert.alert('Request Already Sent', 'You already sent a connection request. Wait for it to be accepted.');
        } else if (status === 'accepted') {
          Alert.alert('Already Connected', 'You are already connected to this user.');
        setLoading(false);
        return;
      }
    }
  
      const requestId = `${currentUserId}_${elderlyId}`;
  
      await setDoc(doc(db, 'connectionRequests', requestId), {
        fromUserId: currentUserId,
        fromUserEmail: currentUserEmail,
        toUserId: elderlyId,
        toUserEmail: elderlyData.email || '',
        elderlyName: elderlyData.name || '',
        elderlyLastName: elderlyData.lastName || '',
        elderlyEmail: elderlyData.email || '',
        status: 'pending',
        createdAt: new Date(),
      });
  
      Alert.alert('Success', 'Connection request sent!');
      setElderlyEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      const pendingQuery = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", currentUserId),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(pendingQuery);
      const pendingList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return `${data.elderlyName || "Unknown"} ${data.elderlyLastName || ""} (${data.elderlyEmail})`;
      });

      if (pendingList.length === 0) {
        Alert.alert("No Pending Requests", "You have no pending requests.");
      } else {
        Alert.alert("Pending Requests", pendingList.join("\n"));
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not fetch pending requests.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect with Elderly User</Text>

      <TextInput
        placeholder="Elderly's email"
        value={elderlyEmail}
        onChangeText={setElderlyEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendRequest} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send request'}</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.buttonPending ]}
        onPress={fetchPendingRequests}
        disabled={loading}
      >
        <Text style={styles.buttonPendingText}>
          {loading ? 'Loading...' : 'View Pending Requests'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

