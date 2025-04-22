import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { auth, db } from "../../firebaseConfig"; 
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import styles from '../styles/styleselderly'; 
import { useRouter } from 'expo-router';
import { DocumentData } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { TouchableOpacity } from 'react-native';
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";





const ElderlyScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [missedReminders, setMissedReminders] = useState(0);


    useFocusEffect(
      useCallback(() => {
        const fetchUserData = async () => {
          const user = auth.currentUser;
          if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(data);
            } else {
              console.log("No such document!");
            }
          } else {
            console.log("No user is signed in.");
          }
        };
  
        fetchUserData();
      }, [])
    );

    useFocusEffect(
      useCallback(() => {
        const fetchSummaryData = async () => {
          const user = auth.currentUser;
          if (!user) return;
    
          // connections
          const connQuery = query(
            collection(db, 'connectionRequests'),
            where('toUserId', '==', user.uid),
            where('status', '==', 'pending')
          );
          const connSnap = await getDocs(connQuery);
          setPendingCount(connSnap.size);
    
          // reminders
          const remQuery = query(
            collection(db, 'reminders'),
            where('elderlyId', '==', user.uid),
            where('status', '==', 'Pending')
          );
          const remSnap = await getDocs(remQuery);
    
          const now = new Date();
          const missed = remSnap.docs.filter(doc => {
            const reminder = doc.data();
            if (!reminder.datetime) return false;
            const reminderTime = new Date(reminder.datetime);
            return reminderTime.getTime() + 30000 < now.getTime();
          });
    
          setMissedReminders(missed.length);
          
        }
    
    
        fetchSummaryData();
      }, [])
    );
    

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
              User: {userData.name|| "User"} {userData.lastName || "User"}
            </Text>
            <Text style={styles.info}>
              Birth Date: {formatBirthDate(userData.birthDate)}
            </Text>
          </View>
          <View style={styles.container}>
          <View style={styles.summaryContainer}>
            <TouchableOpacity style={styles.summaryCard} onPress={() => router.push("/ManageConnections")}>
              <Text style={styles.summaryText}>
                📩 {pendingCount} Pending Connection{pendingCount !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.summaryCard} onPress={() => router.push("/CalendarScreen")}>
              <Text style={styles.summaryText}>
                🔔 {missedReminders} Missed Reminder{missedReminders !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </View>
  <TouchableOpacity style={styles.button} onPress={() => router.push("/RemindersScreen")}>
    <Text style={styles.buttonText}>ADD REMINDERS</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => router.push("/CalendarScreen")}>
    <Text style={styles.buttonText}>CALENDAR</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => router.push("/Speechwsymptoms")}>
    <Text style={styles.buttonText}>SPEAK TO LOLO</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.myConnectionButton} onPress={() => router.push("/MyconnectionScreen")}>
    <Text style={styles.myConnectionButtonText}>MY CONTACTS</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.myConnectionButton} onPress={() => router.push("/findHealthcare")}>
    <Text style={styles.myConnectionButtonText}>CONNECT WITH HEALTHCARE</Text>
  </TouchableOpacity>
</View>
<View>
<TouchableOpacity style={styles.Emergencybutton} onPress={() => router.push("/emergencyScreen")}>
    <Text style={styles.EmergencyButtonText}>SOS</Text>
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