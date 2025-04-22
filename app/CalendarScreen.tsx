/*import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Calendar } from "react-native-calendars";
import { useLocalSearchParams } from 'expo-router';
import styles from "./styles/stylescalendar";




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

const Calendar2 = () => {
  const [markDates, setMarkDates] = useState<Record<string, MarkedDate>>({});
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  const [elderlyName, setElderlyName] = useState("");
  const { elderlyId } = useLocalSearchParams();
  const realElderlyId = elderlyId || auth.currentUser?.uid;



  // 🔹 Obtener nombre del usuario elderly
  useEffect(() => {
    const fetchName = async () => {
      const user = auth.currentUser;
      if (!realElderlyId) return;


      const docSnap = await getDoc(doc(db, "users", realElderlyId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setElderlyName(`${data.name} ${data.lastName}`);
      }
    };

    fetchName();
  }, []);

  // 🔹 Cargar recordatorios del usuario elderly logueado
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const remindersRef = collection(db, "reminders");
        const remindersQuery = query(
          remindersRef,
          where("elderlyId", "==", realElderlyId)
        );
        const remindersfromDB = await getDocs(remindersQuery);

        let remindersList: Record<string, Reminder[]> = {};
        let expandedReminders: Reminder[] = [];

        remindersfromDB.forEach((reminderdoc) => {
          const data = reminderdoc.data();
          const initialDate = new Date(data.datetime);
          const repeat = data.repeat || "none";
          const interval = data.repeatInterval || 1;
          const occurrences = 10;

          for (let i = 0; i < (repeat === "none" ? 1 : occurrences); i++) {
            let newDate = new Date(initialDate);

            if (repeat === "daily")
              newDate.setDate(newDate.getDate() + i * interval);
            if (repeat === "weekly")
              newDate.setDate(newDate.getDate() + i * 7 * interval);
            if (repeat === "monthly")
              newDate.setMonth(newDate.getMonth() + i * interval);

            const dateStr = newDate.toISOString().split("T")[0];

            if (!remindersList[dateStr]) {
              remindersList[dateStr] = [];
            }

            const reminder: Reminder = {
              id: `${reminderdoc.id}-${i}`,
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

        let calendarMarks: {
          [key: string]: { marked: boolean; dots: { color: string }[] };
        } = {};

        Object.keys(remindersList).forEach((date) => {
          const color = remindersList[date].length === 1 ? "green" : "red";
          calendarMarks[date] = { marked: true, dots: [{ color }] };
        });

        setAllReminders(expandedReminders);
        setMarkDates(calendarMarks);
      } catch (error) {
        console.error("ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  // 🔹 Al hacer click en un día
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);

    const filteredReminders = allReminders
      .filter((reminder) => reminder.datetime.split("T")[0] === day.dateString)
      .sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );

    setReminders(filteredReminders);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar for {elderlyName || "..."}</Text>

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
                <Text style={styles.noRemindersText}>No reminders</Text>
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
                        <Text style={styles.reminderText}>
                          {item.title || "No title"} - {time}
                        </Text>
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

export default Calendar2;*/

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert, } from "react-native";
import { Calendar } from "react-native-calendars";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import styles from "./styles/stylescalendar";
import { setDoc } from "firebase/firestore";


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
  dots?: { color: string }[]
  selected?: boolean;
  selectedColor?: string;
};

const CalendarScreen = () => {
  const [markDates, setMarkDates] = useState<Record<string, MarkedDate>>({});
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [elderlyName, setElderlyName] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [completedInstanceIds, setCompletedInstanceIds] = useState<string[]>([]);

  const { elderlyId } = useLocalSearchParams();
  const realElderlyId = Array.isArray(elderlyId) ? elderlyId[0] : elderlyId || auth.currentUser?.uid;
  const isElderly = userData?.userType === "Elderly";
  const isFamily = userData?.userType === "Family";

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) setUserData(docSnap.data());
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchElderlyName = async () => {
      if (!realElderlyId) return;
      const docSnap = await getDoc(doc(db, "users", realElderlyId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setElderlyName(`${data.name} ${data.lastName}`);
      }
    };
    fetchElderlyName();
  }, []);

  useEffect(() => {
    const loadReminders = async () => {
      if (!realElderlyId) return;
      const q = query(collection(db, "reminders"), where("elderlyId", "==", realElderlyId));
      const snapshot = await getDocs(q);

      const remindersList: Record<string, Reminder[]> = {};
      const expanded: Reminder[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const reminderId = docSnap.id;
        const instances = generateRepeats(data, reminderId);

        instances.forEach((r) => {
          const date = r.datetime.split("T")[0];
          if (!remindersList[date]) remindersList[date] = [];
          remindersList[date].push(r);
          expanded.push(r);
        });
      });

      const calendarMarks: Record<string, MarkedDate> = {};
      Object.keys(remindersList).forEach((date) => {
        const color = remindersList[date].length === 1 ? "green" : "red";
        calendarMarks[date] = { marked: true, dots: [{ color }] };
      });

      setAllReminders(expanded);
      setMarkDates(calendarMarks);
      setLoading(false);
    };

    loadReminders();
  }, []);

  useEffect(() => {
    const fetchCompletedInstances = async () => {
      if (!realElderlyId) return;

      const q = query(collection(db, "reminders"), where("elderlyId", "==", realElderlyId));
      const snapshot = await getDocs(q);
      const doneIds: string[] = [];

      for (const docSnap of snapshot.docs) {
        const reminderId = docSnap.id;
        const instancesRef = collection(db, "reminders", reminderId, "instances");
        const instancesSnap = await getDocs(instancesRef);

        instancesSnap.forEach((instance) => {
          if (instance.data().status === "done") {
            doneIds.push(instance.id);
          }
        });
      }

      setCompletedInstanceIds(doneIds);
    };

    fetchCompletedInstances();
  }, []);

  const generateRepeats = (data: any, originalId: string): Reminder[] => {
    const repeat = data.repeat || "none";
    const interval = data.repeatInterval || 1;
    const start = new Date(data.datetime);
    const list: Reminder[] = [];

    for (let i = 0; i < (repeat === "none" ? 1 : 10); i++) {
      const date = new Date(start);
      if (repeat === "daily") date.setDate(date.getDate() + i * interval);
      if (repeat === "weekly") date.setDate(date.getDate() + i * 7 * interval);
      if (repeat === "monthly") date.setMonth(date.getMonth() + i * interval);

      list.push({
        id: `${originalId}-${i}`,
        datetime: date.toISOString(),
        title: data.title,
        repeat,
        repeatInterval: interval,
        status: data.status,
      });
    }

    return list;
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const filtered = allReminders
      .filter((r) => r.datetime.split("T")[0] === day.dateString)
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    setReminders(filtered);
  };

  const renderReminder = ({ item }: { item: Reminder }) => {
    const time = new Date(item.datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const reminderId = item.id.split("-")[0];
    const instanceId = item.id;
    const isDone = completedInstanceIds.includes(instanceId);

    const markDone = async () => {
      try {
        // Mark as done
        const instanceRef = doc(db, "reminders", reminderId, "instances", instanceId);
        await setDoc(instanceRef, { status: "done" }, { merge: true });
    
        // Mark principal doc as done
        const mainRef = doc(db, "reminders", reminderId);
        await updateDoc(mainRef, { status: "done" });
    
        // Update Status
        setCompletedInstanceIds((prev) => [...prev, instanceId]);
      } catch (error) {
        console.error("Error marking as done:", error);
        Alert.alert("Error", "Could not mark as done.");
      }
    };
    
    
    const removeReminder = () => {
      Alert.alert(
        "Delete reminder?",
        "Do you want to delete only this instance or the entire series?",
        [
          {
            text: "Only this instance",
            onPress: async () => {
              try {
                const instanceRef = doc(db, "reminders", reminderId, "instances", instanceId);
                await deleteDoc(instanceRef); // Delete instance selected
    
                // Update Screen
                setReminders((prev) =>
                  prev.filter((r) => r.id !== item.id)
                );
                setAllReminders((prev) =>
                  prev.filter((r) => r.id !== item.id)
                );
              } catch (error) {
                console.error("Error deleting instance:", error);
                Alert.alert("Error", "Could not delete instance.");
              }
            },
          },
          {
            text: "All",
            style: "destructive",
            onPress: async () => {
              try {
                // Delete main document
                await deleteDoc(doc(db, "reminders", reminderId));
    
                
                const instancesRef = collection(db, "reminders", reminderId, "instances");
                const snapshot = await getDocs(instancesRef);
                const batchDeletes = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
                await Promise.all(batchDeletes);
    
                // Update the Screen
                setReminders((prev) =>
                  prev.filter((r) => !r.id.startsWith(reminderId))
                );
                setAllReminders((prev) =>
                  prev.filter((r) => !r.id.startsWith(reminderId))
                );
              } catch (error) {
                console.error("Error deleting all instances:", error);
                Alert.alert("Error", "Could not delete all reminders.");
              }
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    };    

    return (
      <View style={[styles.card, isDone && styles.cardDone]}>
      <Text style={[styles.cardTitle, isDone && styles.cardTitleDone]}>
      
          {item.title}
        </Text>
        <Text style={styles.cardTime}>{time}</Text>

        {!isDone && isElderly && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.doneButton} onPress={markDone}>
              <Text style={styles.buttonText}>DONE</Text>
            </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={removeReminder}>
                <Text style={styles.buttonText}>DELETE</Text>
              </TouchableOpacity>
            
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar of {elderlyName || "..."}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Calendar
            markedDates={{
              ...markDates,
              ...(selectedDate && {
                [selectedDate]: {
                  ...(markDates[selectedDate] || {}),
                  selected: true,
                  selectedColor: "#009D71",
                },
              }),
            }}
            markingType="multi-dot"
            theme={{ todayTextColor: "red", arrowColor: "#009D71" }}
            onDayPress={handleDayPress}
          />

          {selectedDate && (
            <View style={styles.remindersContainer}>
              <Text style={styles.title}>Reminders for {selectedDate}</Text>

              {reminders.length === 0 ? (
                <Text style={styles.noRemindersText}>No reminders</Text>
              ) : (
                <FlatList
                  data={reminders}
                  keyExtractor={(item) => item.id}
                  renderItem={renderReminder}
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
