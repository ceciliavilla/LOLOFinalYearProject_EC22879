/*import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import styles from "./styles/styleappointments";
import moment from "moment";
import { useLocalSearchParams } from "expo-router";


export default function BookAppointmentScreen() {
  const [connectedHealthcare, setConnectedHealthcare] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<Record<string, Date>>({});
  const [showPickerId, setShowPickerId] = useState<string | null>(null);
  const { elderlyId } = useLocalSearchParams();
  const realElderlyId = Array.isArray(elderlyId) ? elderlyId[0] : elderlyId || auth.currentUser?.uid;



  const user = auth.currentUser;

  useEffect(() => {
    const fetchConnections = async () => {
      if (!realElderlyId) return;

      const q = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", realElderlyId),
        where("status", "==", "accepted")
      );

      const snapshot = await getDocs(q);
      const connections: React.SetStateAction<any[]> = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const userSnap = await getDocs(
          query(collection(db, "users"), where("__name__", "==", data.toUserId), where("userType", "==", "Healthcare"))
        );

        userSnap.forEach((healthcareDoc) => {
          connections.push({ id: healthcareDoc.id, ...healthcareDoc.data() });
        });
      }

      setConnectedHealthcare(connections);
    };

    fetchConnections();
  }, [user]);

  const handleDateChange = (event: any, selectedDate: Date | undefined, id: string) => {
    if (selectedDate) {
      setSelectedDates((prev) => ({ ...prev, [id]: selectedDate }));
    }
    setShowPickerId(null);
  };

  const handleRequest = async (healthcareId: string) => {
    const date = selectedDates[healthcareId];
    if (!date) {
      Alert.alert("Select a date first");
      return;
    }
  
    try {
      const existingQuery = query(
        collection(db, "appointments"),
        where("fromUserId", "==", realElderlyId),
        where("toUserId", "==", healthcareId),
        where("status", "in", ["pending", "accepted"])
      );
  
      const existingSnapshot = await getDocs(existingQuery);
      const dateOnly = date.toISOString().split("T")[0]; // Solo la fecha, no la hora
  
      const alreadyExists = existingSnapshot.docs.some(doc => {
        const appointmentDate = doc.data().date?.toDate?.() || doc.data().date;
        const appointmentDateOnly = new Date(appointmentDate).toISOString().split("T")[0];
        return appointmentDateOnly === dateOnly;
      });
  
      if (alreadyExists) {
        Alert.alert("Error", "You already have an appointment request for that day with this healthcare.");
        return;
      }
  
      await addDoc(collection(db, "appointments"), {
        fromUserId: realElderlyId,
        toUserId: healthcareId,
        date: date.toISOString(),
        status: "pending",
        createdAt: new Date(),
      });
  
      Alert.alert("Appointment requested!", `Your request for ${moment(date).format("LL")} has been sent.`);
    } catch (err) {
      console.error("Error sending appointment request", err);
      Alert.alert("Error", "Could not send appointment request.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book an Appointment </Text>

      {connectedHealthcare.map((hc) => (
        <View key={hc.id} style={styles.card}>
          <Text style={styles.name}>{hc.name} {hc.lastName}</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPickerId(hc.id)}
          >
            <Text style={styles.dateButtonText}>Select Date</Text>
          </TouchableOpacity>

          {selectedDates[hc.id] && (
            <Text style={styles.selectedDate}>
              {moment(selectedDates[hc.id]).format("LL")}
            </Text>
          )}

          {showPickerId === hc.id && (
            <DateTimePicker
              value={selectedDates[hc.id] || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, date) => handleDateChange(event, date, hc.id)}
            />
          )}
          

          <TouchableOpacity
            style={styles.appointmentButton}
            onPress={() => handleRequest(hc.id)}
          >
            <Text style={styles.appointmentButtonText}>
              Request Appointment{selectedDates[hc.id] ? ` on ${moment(selectedDates[hc.id]).format("LL")}` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}*/

/*import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import moment from 'moment';
import styles from './styles/styleappointments';

export default function BookAppointmentScreen() {
  const [healthcareUsers, setHealthcareUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'users'), where('userType', '==', 'Healthcare'));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHealthcareUsers(users);
    };
    fetchUsers();
  }, []);

  const handleBook = async (hcId: any) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await addDoc(collection(db, 'appointments'), {
        fromUserId: user.uid,
        toUserId: hcId,
        date: selectedDate.toISOString(),
        status: 'pending',
      });
      Alert.alert('Success', 'Appointment requested');
    } catch (err) {
      Alert.alert('Error', 'Failed to request appointment');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={ styles.title}>Book Appointment</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>Select Date & Time</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Selected: {moment(selectedDate).format('LLL')}</Text>
      {showPicker && (
      <View style={{ backgroundColor: 'white', borderRadius: 10, marginTop: 10, marginBlock:10, }}>
      <DateTimePicker
          value={selectedDate}
          mode='datetime'
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(e, date) => {
        if (Platform.OS !== 'ios') setShowPicker(false);
        if (date) setSelectedDate(date);
      }}
    />
  </View>
)}



      {healthcareUsers.map(hc => (
        <View key={hc.id} style={styles.card}>
          <Text style={styles.name}>{hc.name} {hc.lastName}</Text>
          <TouchableOpacity onPress={() => handleBook(hc.id)} style={styles.appointmentButton}>
            <Text style={styles.appointmentButtonText}>Request Appointment</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}*/

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useLocalSearchParams } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import styles from "./styles/styleappointments";

export default function BookAppointmentScreen() {
  const [connectedHealthcare, setConnectedHealthcare] = useState<any[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [chooseDate, setChooseDate] = useState(false);
  const [chooseTime, setChooseTime] = useState(false);

  const { elderlyId } = useLocalSearchParams();
  const realElderlyId = Array.isArray(elderlyId) ? elderlyId[0] : elderlyId || auth.currentUser?.uid;

  useEffect(() => {
    const fetchConnections = async () => {
      if (!realElderlyId) return;

      const q = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", realElderlyId),
        where("status", "==", "accepted")
      );

      const snapshot = await getDocs(q);
      const connections: any[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const userSnap = await getDocs(
          query(collection(db, "users"), where("__name__", "==", data.toUserId), where("userType", "==", "Healthcare"))
        );
        userSnap.forEach((hcDoc) => {
          connections.push({ id: hcDoc.id, ...hcDoc.data() });
        });
      }

      setConnectedHealthcare(connections);
    };

    fetchConnections();
  }, [realElderlyId]);

  const handleRequest = async (healthcareId: string) => {
    if (!date || !time) {
      Alert.alert("Select both date and time.");
      return;
    }

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());
    combinedDateTime.setSeconds(0);
    combinedDateTime.setMilliseconds(0);

    try {
      const existingQuery = query(
        collection(db, "appointments"),
        where("fromUserId", "==", realElderlyId),
        where("toUserId", "==", healthcareId),
        where("status", "in", ["pending", "accepted"])
      );

      const existingSnapshot = await getDocs(existingQuery);
      const dateOnly = combinedDateTime.toISOString().split("T")[0];

      const alreadyExists = existingSnapshot.docs.some(doc => {
        const appointmentDate = doc.data().date?.toDate?.() || new Date(doc.data().date);
        return appointmentDate.toISOString().split("T")[0] === dateOnly;
      });

      if (alreadyExists) {
        Alert.alert("Error", "You already have an appointment request for that day with this healthcare.");
        return;
      }

      await addDoc(collection(db, "appointments"), {
        fromUserId: realElderlyId,
        toUserId: healthcareId,
        date: combinedDateTime.toISOString(),
        status: "pending",
        createdAt: new Date(),
      });

      Alert.alert("Appointment requested!", `Your request for ${moment(combinedDateTime).format("LLLL")} has been sent.`);
    } catch (err) {
      console.error("Error sending appointment request", err);
      Alert.alert("Error", "Could not send appointment request.");
    }
  };

  return (
    <View style={styles.container}>
    <ScrollView>
      <Text style={styles.title}>Book an Appointment</Text>

      <TouchableOpacity onPress={() => setChooseDate(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{date ? date.toDateString() : "Choose Date"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setChooseTime(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{time ? time.toLocaleTimeString() : "Choose Time"}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={chooseDate}
        mode="date"
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setChooseDate(false);
        }}
        onCancel={() => setChooseDate(false)}
      />

      <DateTimePickerModal
        isVisible={chooseTime}
        mode="time"
        onConfirm={(selectedTime) => {
          setTime(selectedTime);
          setChooseTime(false);
        }}
        onCancel={() => setChooseTime(false)}
      />

      {connectedHealthcare.map((hc) => (
        <View key={hc.id} style={styles.card}>
          <Text style={styles.name}>{hc.name} {hc.lastName}</Text>

          <TouchableOpacity
            style={styles.appointmentButton}
            onPress={() => handleRequest(hc.id)}
          >
            <Text style={styles.appointmentButtonText}>
              Request Appointment{date && time ? ` on ${moment(date).format("LL")} at ${moment(time).format("LT")}` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
      </View>
  );
}
