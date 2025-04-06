import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { auth, db } from "../../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import styles from '../styles/styleselderly'; 
import { useRouter } from 'expo-router';
import { DocumentData } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { TouchableOpacity } from 'react-native';



const ElderlyScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data); 
          setUserData(data);
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    };

    fetchUserData();
  }, []);

  const formatBirthDate = (birthDate: string | number | Date) => {
    if (!birthDate) return "N/A";
    const date = birthDate instanceof Timestamp ? birthDate.toDate() : new Date(birthDate);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'long' });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Welcome! {userData ? userData.name || "User" : "Loading"}
      </Text>
      {userData ? (
        <>
          <View style={styles.userInfoContainer}>
            <Text style={styles.info}>
              Name: {userData.name || "User"}
            </Text>
            <Text style={styles.info}>
              Birth Date: {formatBirthDate(userData.birthDate)}
            </Text>
          </View>
          <View style={styles.container}>
  <TouchableOpacity style={styles.button} onPress={() => router.push("/RemindersScreen")}>
    <Text style={styles.buttonText}>Add Reminders</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => router.push("/Speechwsymptoms")}>
    <Text style={styles.buttonText}>Speech Recognition</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => router.push("/Calendar2")}>
    <Text style={styles.buttonText}>Calendar</Text>
  </TouchableOpacity>
</View>
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </ScrollView>
  );
};

export default ElderlyScreen;

