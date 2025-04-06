import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Calendar } from "react-native-calendars";
import styles from "./styles/stylescalendar";

const Calendar2 = () => {
  const [markDates, setmarkDates] = useState<Record<string, MarkedDate>>({});
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  
  type Reminder = {
    id: string;
    title: string;
    datetime: string;
    repeat?: string;
    repeatInterval?: number;
    status?: string;
  };
  
  type MarkedDate = {
    marked?: boolean;
    dots?: { color: string }[];
    selected?: boolean;
    selectedColor?: string;
  };
  
  

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const remindersfromDB = await getDocs(collection(db, "reminders"));
        let remindersList: Record<string, Reminder[]> = {};
        let expandedReminders: Reminder[] = [];

        remindersfromDB.forEach((doc) => {
          const data = doc.data();
          const initialDate = new Date(data.datetime);
          const repeat = data.repeat || "none";
          const interval = data.repeatInterval || 1;
          const occurrences = 10; 

          for (let i = 0; i < (repeat === "none" ? 1 : occurrences); i++) {
            let newDate = new Date(initialDate);

            if (repeat === "daily") newDate.setDate(newDate.getDate() + i * interval);
            if (repeat === "weekly") newDate.setDate(newDate.getDate() + i * 7 * interval);
            if (repeat === "monthly") newDate.setMonth(newDate.getMonth() + i * interval);

            const dateStr = newDate.toISOString().split("T")[0];

            if (!remindersList[dateStr]) {
              remindersList[dateStr] = [];
            }

            const reminder = {
                id: `${doc.id}-${i}`,
                datetime: newDate.toISOString(),
                title: data.title, 
                repeat: data.repeat,
                repeatInterval: data.repeatInterval,
                status: data.status,
            };


            remindersList[dateStr].push(reminder);
            expandedReminders.push(reminder);
          }
        });

            let calendarMarks: { [key: string]: { marked: boolean; dots: { color: string }[] } } = {};

        
            Object.keys(remindersList).forEach((date) => {
            const color = remindersList[date].length === 1 ? "green" : "red";
            calendarMarks[date] = { marked: true, dots: [{ color }] };
        });

            setAllReminders(expandedReminders);
            setmarkDates(calendarMarks);

        } catch (error) {
            console.error("ERROR", error);
        } finally {
            setLoading(false);
        }
     };

        loadReminders();
    }, []);

        const handleDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);

        const filteredReminders = allReminders
        .filter((reminder) => reminder.datetime.split("T")[0] === day.dateString)
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

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
                ...(selectedDate
                  ? {
                      [selectedDate]: {
                        ...(markDates[selectedDate] || {}),
                        selected: true,
                        selectedColor: "#009D71",
                      },
                    }
                  : {}),
              }}
              
            markingType="multi-dot"
            theme={{
              todayTextColor: "red",
              selectedDayBackgroundColor: "blue",
              arrowColor: "#009D71",
            }}
            onDayPress={handleDayPress}
          />

          {selectedDate && (
            <View style={styles.remindersContainer}>
              <Text style={styles.title}>Reminders for {selectedDate}</Text>
              {reminders.length === 0 ? (
                <Text style={styles.noRemindersText} >No reminders</Text>
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
                      <View style={styles.reminderItem}>
                        <Text style={styles.reminderText}> {item.title || "No title"} - {time}</Text>
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

export default Calendar2;
