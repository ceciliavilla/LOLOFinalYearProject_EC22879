

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { db } from "../firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore";
import { Calendar } from "react-native-calendars";
import styles from "./styles/stylescalendar"; 

const CalendarScreen = () => {
  const [markDates, setmarkDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allReminders, setAllReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reminders"));
        let remindersList = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.datetime.split("T")[0];

          if (!remindersList[date]) {
            remindersList[date] = [];
          }
          remindersList[date].push({ ...data, id: doc.id });
        });

        // Crear marcas para el calendario
        let formattedMarks = {};
        Object.keys(remindersList).forEach((date) => {
          const color = remindersList[date].length === 1 ? "blue" : "red";
          const dots = [{ color }];          
          formattedMarks[date] = { marked: true, dots };
        });

        const all = Object.values(remindersList).flat();
        setAllReminders(all);
        setmarkDates(formattedMarks);
      } catch (error) {
        console.error("ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);

    const filteredReminders = allReminders
      .filter((reminder) => reminder.datetime.split("T")[0] === day.dateString)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    setReminders(filteredReminders);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Calendar
            markedDates={{
              ...markDates,
              [selectedDate]: {
                ...(markDates[selectedDate] || {}),
                selected: true,
                selectedColor: "#007bff",
              },
            }}
            markingType="multi-dot"
            theme={{
              todayTextColor: "#ff6347",
              selectedDayBackgroundColor: "#007bff",
              arrowColor: "#007bff",
              dotColor: "blue",
            }}
            onDayPress={handleDayPress}
          />

          {selectedDate && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.title}>Reminders for {selectedDate}</Text>
              {reminders.length === 0 ? (
                <Text>No reminders</Text>
              ) : (
                <FlatList
                  data={reminders}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const dateObj = new Date(item.datetime);
                    const hours = dateObj.getHours().toString().padStart(2, "0");
                    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
                    const time = `${hours}:${minutes}`;

                    return (
                      <View style={{ marginVertical: 5 }}>
                        <Text>- {item.title || "No title"} - {time}</Text>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default CalendarScreen;
