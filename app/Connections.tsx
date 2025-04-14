/*import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import styles from './styles/stylesconnections';


export default function SendConnectionRequest() {
  const [elderlyEmail, setElderlyEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendRequest = async () => {
    if (!elderlyEmail.trim()) {
      Alert.alert('ERROR', 'INTRODUCE AN EMAIL');
      return;
    }

    try {
      setLoading(true);

      // Search the elderly user based on the email
      const users = collection(db, 'users');
      const email = query(users, where('email', '==', elderlyEmail), where('userType', '==', 'Elderly'));
      const result = await getDocs(email);

      if (result.empty) {
        Alert.alert('ERROR', 'No elderly user found with that email');
        setLoading(false);
        return;
      }

      const elderlyDoc = result.docs[0];
      const elderlyUserId = elderlyDoc.id;
      const currentUserId = auth.currentUser?.uid;

      if (!currentUserId) {
        Alert.alert('ERROR', 'Actual user not found.');
        setLoading(false);
        return;
      }

      const requestId = `${currentUserId}_${elderlyUserId}`; 

      await setDoc(doc(db, 'connectionRequests', requestId), {
        currentUserId,
        elderlyUserId,
        status: 'pending',
        createdAt: new Date(),
      });

      Alert.alert('Connection request has been sent', 'Wait for the approval');
      setElderlyEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect with Elderly User</Text>

      <TextInput
        placeholder="Elderly User Email"
        value={elderlyEmail}
        onChangeText={setElderlyEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendRequest} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending' : 'Sent request'}</Text>
      </TouchableOpacity>
    </View>
  );
};*/

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDocs, query, where, setDoc } from 'firebase/firestore';
import styles from './styles/stylesconnections';

export default function SendConnectionRequest() {
  const [elderlyEmail, setElderlyEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!elderlyEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }

    try {
      setLoading(true);

      console.log('🔎 Looking for elderly user with email:', elderlyEmail);

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', elderlyEmail), where('userType', '==', 'Elderly'));
      const result = await getDocs(q);

      if (result.empty) {
        Alert.alert('Error', 'No elderly user found with that email.');
        setLoading(false);
        return;
      }

      const elderlyId = result.docs[0].id;
      const currentUserId = auth.currentUser?.uid;

      if (!currentUserId) {
        Alert.alert('Error', 'User not authenticated.');
        setLoading(false);
        return;
      }

      console.log('👤 currentUserId:', currentUserId);
      console.log('👵 elderlyUserId:', elderlyId);

      const requestId = `${currentUserId}_${elderlyId}`;

      await setDoc(doc(db, 'connectionRequests', requestId), {
        fromUserId: currentUserId,
        toUserId: elderlyId,
        status: 'pending',
        createdAt: new Date(),
      });

      console.log('✅ Request saved to Firestore');

      Alert.alert('Success', 'Connection request sent!');
      setElderlyEmail('');
    } catch (error: any) {
      console.log('❌ Firestore error:', error);
      Alert.alert('Error', error.message || 'Something went wrong.');
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
    </View>
  );
}

