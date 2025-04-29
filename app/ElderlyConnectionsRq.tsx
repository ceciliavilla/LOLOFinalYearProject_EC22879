import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDocs, query, where, setDoc } from 'firebase/firestore';
import styles from './styles/stylesconnections';

export default function SendConnectionRequest() {
  const [elderlyEmail, setElderlyEmail] = useState('');
  const [loading, setLoading] = useState(false);
  //const [pendingConnections, setPendingConnections] = useState<String[]>([])

  const ManageSendRequest = async () => {

    //Check that the email is valid
    if (!elderlyEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }
  
    try {
      setLoading(true);
  
      const users = collection(db, 'users');
      const q = query(users, where('email', '==', elderlyEmail), where('userType', '==', 'Elderly')); // The email needs to be linked to an elderly user
      const result = await getDocs(q);
  
      if (result.empty) {
        Alert.alert('Error', 'No elderly user found with that email.'); // Error message if user is not found
        setLoading(false);
        return;
      }
      
      // If the user id found the data are obtained
      const elderlyDoc = result.docs[0];
      const elderlyId = elderlyDoc.id;
      const elderlyData = elderlyDoc.data();
  
      const currentUser = auth.currentUser;
      const currentUserId = currentUser?.uid;
      const currentUserEmail = currentUser?.email;
      
      //Check if the actual user is authenticated 
      if (!currentUserId || !currentUserEmail) {
        Alert.alert('Error', 'User not authenticated.');
        setLoading(false);
        return;
      }
  
      // Check if a connection request already exists
      const existingRequest = query(
        collection(db, 'connectionRequests'),
        where('fromUserId', '==', currentUserId), // Request is from family user (current user) to elderly user
        where('toUserId', '==', elderlyId),
      );
      
      //If the conection exists different alerts are display depending on the connection status 
      const existingRequestSnapshot = await getDocs(existingRequest);
  
      if (!existingRequestSnapshot.empty) {
        const status = existingRequestSnapshot.docs[0].data().status;
        if (status === 'pending') {
          Alert.alert('Request Already Sent', 'You already sent a connection request. Wait for it to be accepted.');
          setLoading(false);
          return;
        } else if (status === 'accepted') {
          Alert.alert('Already Connected', 'You are already connected to this user.');
        setLoading(false);
        return;
      }
    }
      //If the conection does not exists, a new one is created
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
      
      //Alerts are displayed inditcating if the request is successful or not
      Alert.alert('Success', 'Connection request sent');
      setElderlyEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

      // User has the possibility to check pending requests
      const CheckPendingRequests = async () => {
        try {
        setLoading(true);
      const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) {
          Alert.alert("Error", "User not authenticated.");
        return;
        }

      // The status is obtained from the database
      const pendingQuery = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", currentUserId),
        where("status", "==", "pending")
      );


      const snapshot = await getDocs(pendingQuery);
      const pendingList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return `· ${data.elderlyName || "Unknown"} ${data.elderlyLastName || ""} (${data.elderlyEmail})`;
      });

      // Alerts are displayed if there are pending requests or not
      if (pendingList.length === 0) {
        Alert.alert("No Pending Requests", "You have no pending requests.");
      } else {
        Alert.alert("Pending Requests", pendingList.join("\n"));
      }
      } catch (error: any) {
        Alert.alert("Error", error.message || "Could not check pending requests."); 
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
      />

      <TouchableOpacity style={styles.button} onPress={ManageSendRequest} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send request'}</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.buttonPending ]}
        onPress={CheckPendingRequests}
        disabled={loading}
      >
        <Text style={styles.buttonPendingText}>
          {loading ? 'Loading...' : 'View Pending Requests'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

