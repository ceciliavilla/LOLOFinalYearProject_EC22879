import React, { useEffect, useState } from "react";
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
      // 🔥 Nuevo: Comprobar si ya existe una cita para ese Healthcare y esa fecha
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
  
      // 🔹 Si no existe, crear la cita
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
}
