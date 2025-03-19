/*import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styleshome'; 



export default function ElderlyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome ELDERLY</Text>
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Goback</Text>
      </TouchableOpacity>
    </View>
  );
}*/

import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig"; // Importa Firebase
import { doc, getDoc } from "firebase/firestore";
import styles from './styleselderly'; 

const ElderlyScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome! {userData ? userData.name ||"User" : "Loading"}</Text>
      {userData ? (
        <>
      <View style={styles.userInfoContainer}>
            <Text style={styles.info}>Name: {userData ? userData.name || "User" : "Loading..."}</Text>
            <Text style={styles.info}>Age: {userData ? ` ${userData.age || "N/A"}` : ""}</Text>
      </View>
      <View style={styles.RemindContainer}>
          <Button title="View Reminders" onPress={() => navigation.navigate("Reminders")} />
          <Button title="Speech Recognition" onPress={() => navigation.navigate("Speechwsymptoms")} />
          <Button title="Calendar" onPress={() => navigation.navigate("CalendarScreen")} />

          </View>
        </>
    
      ) : (
        <Text>Loading user data...</Text>
      )}
    </ScrollView>
  );
};



export default ElderlyScreen;
