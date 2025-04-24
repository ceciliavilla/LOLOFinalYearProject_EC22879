import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import styles from "./styles/styleappointments";
import moment from "moment";

export default function BookAppointmentScreen() {
  const [connectedHealthcare, setConnectedHealthcare] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<Record<string, Date>>({});
  const [showPickerId, setShowPickerId] = useState<string | null>(null);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;

      const q = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", user.uid),
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
      await addDoc(collection(db, "appointments"), {
        fromUserId: user?.uid,
        toUserId: healthcareId,
        date: date,
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
      <Text style={styles.title}>📅 Book an Appointment</Text>

      {connectedHealthcare.map((hc) => (
        <View key={hc.id} style={styles.card}>
          <Text style={styles.name}>👩‍⚕️ {hc.name} {hc.lastName}</Text>

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
