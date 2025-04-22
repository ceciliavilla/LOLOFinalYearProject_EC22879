import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import styles from "./styles/stylesfindhealthcare";

interface HealthcareUser {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  speciality: string;
}

const FindHealthcareScreen = () => {
  const [healthcareUsers, setHealthcareUsers] = useState<HealthcareUser[]>([]);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [connectedHealthcareIds, setConnectedHealthcareIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchHealthcareUsers = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Fetch all healthcare professionals
      const q = query(collection(db, "users"), where("userType", "==", "Healthcare"));
      const querySnapshot = await getDocs(q);

      const users: HealthcareUser[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          speciality: data.speciality,
        };
      });

      setHealthcareUsers(users);

      // Check accepted connections
      const connectionsQuery = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", currentUser.uid),
        where("status", "==", "accepted")
      );
      const connectionSnap = await getDocs(connectionsQuery);
      const connectedIds = new Set<string>();
      connectionSnap.forEach(doc => connectedIds.add(doc.data().toUserId));
      setConnectedHealthcareIds(connectedIds);

      // Check sent requests
      const pendingQuery = query(
        collection(db, "connectionRequests"),
        where("fromUserId", "==", currentUser.uid),
        where("status", "in", ["pending", "accepted"])
      );
      const pendingSnap = await getDocs(pendingQuery);
      const sentIds = new Set<string>();
      pendingSnap.forEach(doc => sentIds.add(doc.data().toUserId));
      setSentRequests(sentIds);
    };

    fetchHealthcareUsers();
  }, []);

  const sendConnectionRequest = async (healthcareUser: HealthcareUser) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to send a request.");
      return;
    }

    const currentUserId = currentUser.uid;
    const healthcareId = healthcareUser.id;
    const requestId = `${currentUserId}_${healthcareId}`;

    try {
      await setDoc(doc(db, "connectionRequests", requestId), {
        fromUserId: currentUserId,
        fromUserEmail: currentUser.email || "",
        toUserId: healthcareId,
        toUserEmail: healthcareUser.email || "",
        healthcareName: healthcareUser.name || "",
        healthcareLastName: healthcareUser.lastName || "",
        healthcareSpeciality: healthcareUser.speciality || "",
        status: "pending",
        createdAt: new Date(),
      });

      Alert.alert("Request Sent", "Your request has been sent.");
      setSentRequests(prev => new Set(prev).add(healthcareId));
    } catch (error) {
      console.error("Error sending request:", error);
      Alert.alert("Error", "Could not send the request.");
    }
  };

  const renderItem = ({ item }: { item: HealthcareUser }) => {
    if (connectedHealthcareIds.has(item.id)) return null; // Oculta si ya está conectado
    const alreadySent = sentRequests.has(item.id);

    return (
      <View style={styles.card}>
        <Text style={styles.nameText}>{item.name} {item.lastName || ""}</Text>
        {item.speciality && <Text style={styles.specialityText}>Role: {item.speciality}</Text>}
        <Text style={styles.emailText}>{item.email}</Text>

        <TouchableOpacity
          style={[
            styles.requestButton,
            alreadySent && styles.pendingButton,
          ]}
          onPress={() => sendConnectionRequest(item)}
          disabled={alreadySent}
        >
          <Text style={styles.requestButtonText}>
            {alreadySent ? "Pending" : "Request Connection"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find a Healthcare Professional</Text>
      <FlatList
        data={healthcareUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default FindHealthcareScreen;
