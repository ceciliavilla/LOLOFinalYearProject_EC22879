/*import React, { useEffect, useState } from "react";
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
import * as Notifications from 'expo-notifications';

const scheduleLocalNotificationsForReminders = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  // 🔑 Solo sus reminders
  const remindersQ = query(
    collection(db, "reminders"),
    where("elderlyId", "==", userId)
  );
  const remindersSnap = await getDocs(remindersQ);

  for (const rem of remindersSnap.docs) {
    const instQ = collection(db, "reminders", rem.id, "instances");
    const instSnap = await getDocs(instQ);

    for (const inst of instSnap.docs) {
      const { datetime, title } = inst.data();
      const when = new Date(datetime);

      if (when.getTime() > Date.now()) {
        await Notifications.scheduleNotificationAsync({
          content: { title: "Reminder", body: title, sound: true },
          trigger: when,
        });
      }
    }
  }
};

// Llamas a esta función en un useEffect cuando se abra la pantalla del Elderly
useEffect(() => { scheduleLocalNotificationsForReminders(); }, []);



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
<TouchableOpacity style={styles.Emergencybutton} onPress={() => router.push("/EmergencyScreen")}>
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

export default ElderlyScreen;*/
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import styles from "../styles/styleselderly";
import { useRouter, useFocusEffect } from "expo-router";
import { DocumentData, Timestamp } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const scheduleLocalNotificationsForReminders = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  try {
    const lastScheduled = await AsyncStorage.getItem("lastScheduled");
    const now = Date.now();

    if (lastScheduled && now - parseInt(lastScheduled) < 24 * 60 * 60 * 1000) {
      console.log("Notifications were already scheduled recently. Skipping...");
      return;
    }

    const remindersQ = query(
      collection(db, "reminders"),
      where("elderlyId", "==", userId)
    );
    const remindersSnap = await getDocs(remindersQ);

    for (const rem of remindersSnap.docs) {
      const instQ = collection(db, "reminders", rem.id, "instances");
      const instSnap = await getDocs(instQ);

      for (const inst of instSnap.docs) {
        const { datetime, title } = inst.data();
        const when = new Date(datetime);

        if (when.getTime() > now) {
          await Notifications.scheduleNotificationAsync({
            content: { title: "Reminder", body: title, sound: true },
            trigger: when,
          });
        }
      }
    }

    await AsyncStorage.setItem("lastScheduled", now.toString());
    console.log("Reminders scheduled and timestamp saved.");
  } catch (error) {
    console.error("Error scheduling reminders:", error);
  }
};

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
            setUserData(docSnap.data());
          }
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

        const connQuery = query(
          collection(db, "connectionRequests"),
          where("toUserId", "==", user.uid),
          where("status", "==", "pending")
        );
        const connSnap = await getDocs(connQuery);
        setPendingCount(connSnap.size);

        const remQuery = query(
          collection(db, "reminders"),
          where("elderlyId", "==", user.uid),
          where("status", "==", "pending")
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
      };
      fetchSummaryData();
    }, [])
  );

  useEffect(() => {
    scheduleLocalNotificationsForReminders();
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
              User: {userData.name || "User"} {userData.lastName || ""}
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

            <TouchableOpacity style={styles.Emergencybutton} onPress={() => router.push("/EmergencyScreen")}>
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
