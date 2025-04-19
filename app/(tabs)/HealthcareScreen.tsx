import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, collection, query, where,getDocs,DocumentData, Timestamp} from "firebase/firestore";
import { useRouter, useFocusEffect } from "expo-router";
import ConnectedElderlyCarousel from '../ConnectedCarrousel';
import styles from "../styles/stylesfamily";

const RelativesScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [connectedElderly, setConnectedElderly] = useState<any[]>([]);

  // Actual user details
  const loaduserInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    }
  };

  const loadconnectedElderly = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    // Search all the accepted connections that have been made from the family user
    const q = query(
      collection(db, "connectionRequests"),
      where("fromUserId", "==", currentUserId),
      where("status", "==", "accepted")
    );

    const acceptedConnections = await getDocs(q); 
    const elderlyList: any[] = [];

    for (const connectionDoc of acceptedConnections.docs) {
      const data = connectionDoc.data();
      const elderlyId = data.toUserId;

      const elderlyDoc = await getDoc(doc(db, "users", elderlyId));
      if (elderlyDoc.exists()) {
        elderlyList.push({
          id: elderlyDoc.id,
          ...elderlyDoc.data(),
        });
      }
    }

    setConnectedElderly(elderlyList);
  };

 
  useFocusEffect(
    useCallback(() => {
      loaduserInfo();
      loadconnectedElderly();
    }, [])
  );

  const formatBirthDate = (birthDate: string | number | Date) => {
    if (!birthDate) return "N/A";
    const date =
      birthDate instanceof Timestamp ? birthDate.toDate() : new Date(birthDate);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "long" });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Welcome to healthcarescreen, {userData ? userData.name || "User" : "Loading"}
      </Text>

      {connectedElderly.length > 0 ? (
        <>
          <Text style={styles.connectionText}>You are connected to:</Text>
          <View style={{ marginBottom: 32 }}>
          <ConnectedElderlyCarousel data={connectedElderly} />
          </View>

        </>
      ) : (
        <Text style={styles.connectionText}>
          You are not connected to anyone yet.
        </Text>
      )}

      {userData && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/RemindersScreen")}
          >
            <Text style={styles.buttonText}>Add Reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Calendar2")}
          >
            <Text style={styles.buttonText}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Connections")}
          >
            <Text style={styles.buttonText}>Request Connection</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </ScrollView>
  );
};

export default RelativesScreen;


