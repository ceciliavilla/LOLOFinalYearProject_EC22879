import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import {collection,query,where,getDocs,doc,getDoc,updateDoc,} from 'firebase/firestore';
import styles from './styles/stylesmanageappoint';
import moment from 'moment';

export default function ManageAppointmentsScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return;

      try {
        const q = query(
          collection(db, 'appointments'),
          where('toUserId', '==', currentUserId),
          where('status', '==', 'pending')
        );

        const snapshot = await getDocs(q);
        const results: any[] = [];

        for (const apptDoc of snapshot.docs) {
          const data = apptDoc.data();
          const fromUserSnap = await getDoc(doc(db, 'users', data.fromUserId));

          if (fromUserSnap.exists()) {
            const userData = fromUserSnap.data();
            results.push({
              id: apptDoc.id,
              date: data.date,
              elderlyName: `${userData.name} ${userData.lastName || ''}`,
              elderlyEmail: userData.email || '',
              fromUserId: data.fromUserId,
            });
          }
        }

        setAppointments(results);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    loadAppointments();
  }, []);

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const updateData: any = { status };

      if (status === 'accepted') {
        updateData.addedToElderlyCalendar = true;
        updateData.addedToHealthcareCalendar = true;
      }

      await updateDoc(doc(db, 'appointments', id), updateData);

      setAppointments(prev => prev.filter(appt => appt.id !== id));

      Alert.alert(
        "Updated",
        `Appointment ${status}. ${
          status === 'accepted' ? 'Added in both calendars.' : ''
        }`
      );
    } catch (err) {
      console.error("Error updating appointment status:", err);
      Alert.alert("Error", "Could not update appointment.");
    }
  };

  const renderAppointment = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.elderlyName}</Text>
      <Text style={styles.email}>{item.elderlyEmail}</Text>
      <Text style={styles.date}>
        Requested Date: {moment(item.date.toDate?.() ?? item.date).format('LL')}
      </Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'green' }]}
          onPress={() => updateStatus(item.id, 'accepted')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => updateStatus(item.id, 'rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Appointments</Text>

      {loading ? (
        <Text >Loading appointments...</Text>
      ) : appointments.length === 0 ? (
        <Text >No pending appointments</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
        />
      )}
    </View>
  );
}
