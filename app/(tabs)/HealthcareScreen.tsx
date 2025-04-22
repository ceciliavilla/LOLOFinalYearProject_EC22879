import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, } from "firebase/firestore";
import { useRouter, useFocusEffect } from "expo-router";
import ConnectedUserCarousel from "../ConnectedCarrousel";
import styles from "../styles/stylesfamily";

const HealthcareScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [connectedElderly, setConnectedElderly] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const loadUserInfo = async () => {
    const user = auth.currentUser;
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
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    try {
      const q = query(
        collection(db, "connectionRequests"),
        where("toUserId", "==", currentUserId),
        where("status", "==", "accepted")
      );

      const acceptedConnections = await getDocs(q);
      const elderlyList: any[] = [];

      for (const connectionDoc of acceptedConnections.docs) {
        const data = connectionDoc.data();
        const elderlyId = data.fromUserId;

        const elderlyDoc = await getDoc(doc(db, "users", elderlyId));
        if (elderlyDoc.exists()) {
          elderlyList.push({
            id: elderlyDoc.id,
            ...elderlyDoc.data(),
          });
        }
      }

      setConnectedElderly(elderlyList);
    } catch (error) {
      console.error("Error loading connections:", error);
    }
  };

  const loadPendingCount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "connectionRequests"),
        where("toUserId", "==", user.uid),
        where("status", "==", "pending")
      );
      const snapshot = await getDocs(q);
      setPendingCount(snapshot.size);
    } catch (error) {
      console.error("Error loading pending count:", error);
    }
  };

  const disconnectElderly = async (elderlyId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

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

  // Auto-refresh when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
      loadConnectedElderly();
      loadPendingCount();
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

      <TouchableOpacity style={styles.button} onPress={() => router.push("/ManageConnections")}>
        <Text style={styles.buttonText}>
          📩 {pendingCount} pending connection{pendingCount !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default HealthcareScreen;
