/*import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { db } from "../firebaseConfig"; // Firestore de Firebase
import { collection, getDocs } from "firebase/firestore";
import { Calendar } from "react-native-calendars";
import styles from "./stylescalendar";

const CalendarScreen = () => {
  const [markDates, setmarkDates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reminders"));
        let marked = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.datetime.split("T")[0]; 

          if (!marked[date]) {
            marked[date] = { marked: true, dots: [{ color: "blue" }] }; 

            marked[date].dots.push({ color: "red" }); // more than one reminder red button
          }
        });

        setmarkDates(marked);
      } catch (error) {
        console.error("ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Calendar
          markedDates={markDates}
          markingType={"multi-dot"} 
          theme={{
            todayTextColor: "#ff6347",
            selectedDayBackgroundColor: "#007bff",
            arrowColor: "#007bff",
            dotColor: "blue",
          }}
        />
      )}
    </View>
  );
};*/


import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { db } from "../firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore";
import { Calendar } from "react-native-calendars";
import styles from "./stylescalendar"; 

const CalendarScreen = () => {
  const [markDates, setmarkDates] = useState({});
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reminders"));
        let marked = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.datetime.split("T")[0]; // formato YYYY-MM-DD

          if (!marked[date]) {
            marked[date] = { marked: true, dots: [{ color: "blue" }] };
          }

          // Por si hay más de un recordatorio
          marked[date].dots.push({ color: "red" });
        });

        setmarkDates(marked);
      } catch (error) {
        console.error("ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Calendar
          markedDates={markDates}
          markingType="multi-dot"
          theme={{
            todayTextColor: "#ff6347",
            selectedDayBackgroundColor: "#007bff",
            arrowColor: "#007bff",
            dotColor: "blue",
          }}
        />
      )}
    </View>
  );
};

export default CalendarScreen;
