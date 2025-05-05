import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, collection, query,where, getDocs,deleteDoc, DocumentData,Timestamp, } from "firebase/firestore";
import { useRouter, useFocusEffect } from "expo-router";
import ConnectedUserCarousel from "../ConnectedCarrousel"; 
import styles from "../styles/stylesfamily";
          
const RelativesScreen = () => {
const router = useRouter();
const [userData, setUserData] = useState<DocumentData | null>(null);
const [connectedElderly, setConnectedElderly] = useState<any[]>([]);
          
// Load info from the user
const loadUserInfo = async () => {
const user = auth.currentUser;
if (user) {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
   setUserData(docSnap.data());
  }
  }
  };
          
// Load connected users
const loadConnectedElderly = async () => {
const currentUserId = auth.currentUser?.uid;
if (!currentUserId) return;
          
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
          
  // Disconnect Elderly users
  const disconnectElderly = async (elderlyId: string) => {
   try {
     const user = auth.currentUser;
      if (!user) return;
          
      const q = query(
      collection(db, "connectionRequests"),
      where("fromUserId", "==", user.uid),
      where("toUserId", "==", elderlyId),
      where("status", "==", "accepted")
      );
          
  const querySnapshot = await getDocs(q);
          
  if (querySnapshot.empty) {
  Alert.alert("Error");
  return;
  }
          
  for (const docSnap of querySnapshot.docs) {
    await deleteDoc(doc(db, "connectionRequests", docSnap.id));
   }
          
    Alert.alert("Disconnected", "You have disconnected from this elderly user.");
     loadConnectedElderly(); // Load carrousel again
    } catch (error) {
      console.error("Error disconnecting:", error);
     }
    };
          
    useFocusEffect(
    useCallback(() => {
    loadUserInfo();
    loadConnectedElderly();
    }, [])
   );
          
    const formatBirthDate = (birthDate: string | number | Date) => {
    if (!birthDate) return "N/A";
    const date = birthDate instanceof Timestamp ? birthDate.toDate() : new Date(birthDate);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "long" });
    }; // Not included at the end
          
  return (
  <ScrollView contentContainerStyle={styles.container}>
  <Text style={styles.title}>Welcome, {userData ? userData.name || "User" : "Loading"} </Text>
          
  {connectedElderly.length > 0 ? (
     <>
      <Text style={styles.connectionText}>You are connected to:</Text>
      <View style={{ marginBottom: 32 }}>
      <ConnectedUserCarousel
       data={connectedElderly}
       
       onPrimaryAction={(id) => router.push({ pathname: "/RemindersScreen", params: { elderlyId: id } })
        }
      primaryLabel="Add Reminders"
                    
      onSecondaryAction={(id) => router.push({ pathname: "/CalendarScreen", params: { elderlyId: id } })
        }
      secondaryLabel="Calendar"
                    
      onTertiaryAction={(id) => router.push({ pathname: "/MedicalHistory", params: { elderlyId: id } })
        }
      tertiaryLabel="Medical History"
                    
      onFourthAction={(id) => router.push({ pathname: "/BookAppointment", params: { elderlyId: id } })
        }
      fourthLabel="Book Appointment"
                      
      onFifthAction={(id) => router.push({ pathname: "/CheckPosts", params: { elderlyId: id } })
        }
      fifthLabel="View Posts"
                      
                    
                    
      onDisconnect={disconnectElderly}
      showDisconnect={true}
      />


    </View>
    </>
      ) : (
      <Text style={styles.connectionText}> You are not connected to anyone </Text>
      )}
          
      {userData && (
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/ElderlyConnectionsRq")}>
      <Text style={styles.buttonText}>Request Elderly Connection</Text>
      </TouchableOpacity>
      </View>
      )}
      </ScrollView>
      );
  };
          
export default RelativesScreen;
          