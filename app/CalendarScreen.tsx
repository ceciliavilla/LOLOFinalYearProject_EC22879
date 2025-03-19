import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { db } from "../firebaseConfig"; // Firestore de Firebase
import { collection, getDocs } from "firebase/firestore";
import { Calendar } from "react-native-calendars";

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
          const date = data.datetime.split("T")[0]; // Extrae solo la fecha YYYY-MM-DD

          if (!marked[date]) {
            marked[date] = { marked: true, dots: [{ color: "blue" }] }; // Punto azul en cada fecha
          } else {
            marked[date].dots.push({ color: "red" }); // Si hay varios recordatorios, otro punto rojo
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
          markingType={"multi-dot"} // Permite varios puntos en un día
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

// **Estilos en el mismo archivo**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default CalendarScreen;
