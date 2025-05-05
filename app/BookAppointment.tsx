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
    const loadConnections = async () => {
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

    loadConnections();
  }, [realElderlyId]);

  const ManageRequest = async (healthcareId: string) => {
    if (!date || !time) {
      Alert.alert("Select date and time.");
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
        Alert.alert("Error", "You already request an appointment with this healthcare for that day");
        return;
      }

      await addDoc(collection(db, "appointments"), {
        fromUserId: realElderlyId,
        toUserId: healthcareId,
        date: combinedDateTime.toISOString(),
        status: "pending",
        createdAt: new Date(),
      });

      Alert.alert("Appointment requested!", `Your request has been sent`);
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
            onPress={() => ManageRequest(hc.id)}
          >
            <Text style={styles.appointmentButtonText}>
              Request Appointment
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
      </View>
  );
}
