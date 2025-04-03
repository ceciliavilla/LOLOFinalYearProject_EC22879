import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { auth, db } from "../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import styles from './styleselderly'; 
import { useRouter } from 'expo-router';
import CalendarScreen from "./CalendarScreen";

const ElderlyScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data); // Verify the data
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
    const date = birthDate.toDate ? birthDate.toDate() : new Date(birthDate);
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
          <View>
          <Button title="View Reminders" onPress={() => router.push("/RemindersScreen")} />
            <Button title="Speech Recognition" onPress={() => router.push("/Speechwsymptoms")} />
            <Button title="Calendar " onPress={() => router.push("/CalendarScreen")} />
          </View>
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </ScrollView>
  );
};

export default ElderlyScreen;
