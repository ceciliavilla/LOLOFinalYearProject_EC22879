import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { useRouter, useFocusEffect } from "expo-router";
import ConnectedUserCarousel from "../ConnectedCarrousel";
import styles from "../styles/stylehealthcare";

const HealthcareScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [connectedElderly, setConnectedElderly] = useState<any[]>([]);
  const [pendingConnections, setPendingConnections] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);

  const user = auth.currentUser;

  const loadUserInfo = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    }
  };

  const loadConnectedElderly = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "connectionRequests"),
        where("toUserId", "==", user.uid),
        where("status", "==", "accepted")
      );

      const acceptedConnections = await getDocs(q);
      const elderlyList: any[] = [];

      for (const connectionDoc of acceptedConnections.docs) {
        const data = connectionDoc.data();
        const elderlyId = data.fromUserId;

        const elderlyDoc = await getDoc(doc(db, "users", elderlyId));
        if (elderlyDoc.exists()) {
          elderlyList.push({ id: elderlyDoc.id, ...elderlyDoc.data() });
        }
      }

      setConnectedElderly(elderlyList);
    } catch (error) {
      console.error("Error loading connections:", error);
    }
  };

  const loadPendingCounts = async () => {
    if (!user) return;

    try {
      // Pending connections
      const connectionQuery = query(
        collection(db, "connectionRequests"),
        where("toUserId", "==", user.uid),
        where("status", "==", "pending")
      );
      const connectionSnapshot = await getDocs(connectionQuery);
      setPendingConnections(connectionSnapshot.size);

      // Pending appointments
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("toUserId", "==", user.uid),
        where("status", "==", "pending")
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      setPendingAppointments(appointmentsSnapshot.size);
    } catch (error) {
      console.error("Error loading pending counts:", error);
    }
  };

  const disconnectElderly = async (elderlyId: string) => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", elderlyId),
        where("toUserId", "==", user.uid),
        where("status", "==", "accepted")
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        Alert.alert("Not Found", "No connection found with this user.");
        return;
      }

      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, "connectionRequests", docSnap.id));
      }

      Alert.alert("Disconnected", "You have disconnected.");
      loadConnectedElderly();
    } catch (error) {
      console.error("Error disconnecting:", error);
      Alert.alert("Error", "Could not disconnect.");
    }
  };

  // Auto-refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
      loadConnectedElderly();
      loadPendingCounts();
    }, [])
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Welcome, {userData ? userData.name || "Healthcare" : "Loading"}
        </Text>

        {connectedElderly.length > 0 ? (
          <>
            <Text style={styles.connectionText}>Connected Elderly Users:</Text>
            <ConnectedUserCarousel
              data={connectedElderly}
              onPrimaryAction={(id: any) =>
                router.push({ pathname: "/CalendarScreen", params: { elderlyId: id } })
              }
              primaryLabel="Calendar"
              onSecondaryAction={(id: any) =>
                router.push({ pathname: "/TrackedSymptoms", params: { elderlyId: id } })
              }
              secondaryLabel="Symptoms"
              onTertiaryAction={(id: any) =>
                router.push({ pathname: "/MedicalHistory", params: { elderlyId: id } })
              }
              tertiaryLabel="Medical History"
              showDisconnect={true}
              onDisconnect={disconnectElderly}
            />
          </>
        ) : (
          <Text style={styles.connectionText}>
            You are not connected to any elderly users yet.
          </Text>
        )}
      </ScrollView>
          {/* Botón: gestionar conexiones */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/CalendarScreen")}>
        <Text style={styles.buttonText}>My Calendar</Text>
      </TouchableOpacity>
      {/* Botón: gestionar citas */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/ManageAppointments")}>
        <Text style={styles.buttonText}>
          {pendingAppointments} pending appointment{pendingAppointments !== 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>

      {/* Botón: gestionar conexiones */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/ManageConnections")}>
        <Text style={styles.buttonText}>
          {pendingConnections} pending connection{pendingConnections !== 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default HealthcareScreen;
