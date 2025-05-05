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
  type: "reminder" | "appointment"; 
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
  const isHealthcare = userData?.userType === "Healthcare";

  //Load User Data 
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) setUserData(docSnap.data());
    };
    loadUserData();
  }, []);

  // Load Elderly User
  useEffect(() => {
    const loadElderlyName = async () => {
      if (!realElderlyId) return;
      const docSnap = await getDoc(doc(db, "users", realElderlyId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setElderlyName(`${data.name} ${data.lastName}`);
      }
    };
    loadElderlyName();
  }, []);

  // Load Reminders
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

  // Load Appointments 
  useEffect(() => {
    const loadAppointments = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
  
      const q = query(
        collection(db, "appointments"),
        where("status", "in", ["accepted", "attended"]),
        where("fromUserId", "==", realElderlyId)
      );
  
      const q2 = query(
        collection(db, "appointments"),
        where("status", "in", ["accepted", "attended"]),
        where("toUserId", "==", currentUser.uid)
      );
  
      const [fromSnapshot, toSnapshot] = await Promise.all([getDocs(q), getDocs(q2)]);
      const allDocs = [...fromSnapshot.docs, ...toSnapshot.docs];
  
      const uniqueAppointments: Record<string, Reminder> = {};
  
      for (const docSnap of allDocs) {
        const data = docSnap.data();
        const dateObj = new Date(data.date?.toDate?.() || data.date);
  
        let elderlyName = "Elderly";
        let healthcareName = "Healthcare";
  
        const elderlySnap = await getDoc(doc(db, "users", data.fromUserId));
        if (elderlySnap.exists()) {
          const edata = elderlySnap.data();
          elderlyName = `${edata.name || ""} ${edata.lastName || ""}`.trim();
        }
  
        const healthcareSnap = await getDoc(doc(db, "users", data.toUserId));
        if (healthcareSnap.exists()) {
          const hdata = healthcareSnap.data();
          healthcareName = `${hdata.name || ""} ${hdata.lastName || ""}`.trim();
        }
  
        const title = `Appointment: ${elderlyName} with ${healthcareName}`;
  
        uniqueAppointments[docSnap.id] = {
          id: docSnap.id,
          title,
          datetime: dateObj.toISOString(),
          status: data.status,
          type: "appointment", 
        };
      }
  
      const uniqueAppointmentsList = Object.values(uniqueAppointments);
  
      setAllReminders((prev) => [...prev, ...uniqueAppointmentsList]);
    };
  
    loadAppointments();
  }, []);
  

  useEffect(() => {
    if (!allReminders.length) return;
  
    const mergedMarks: Record<string, MarkedDate> = {};
    const typeByDate: Record<string, Set<string>> = {};
  
    allReminders.forEach((item) => {
      const date = item.datetime.split("T")[0];
      if (!typeByDate[date]) typeByDate[date] = new Set();
      typeByDate[date].add(item.type);
    });
  
    Object.entries(typeByDate).forEach(([date, types]) => {
      const dots = [];
  
      if (types.has("reminder")) {
        dots.push({ key: "reminder", color: "green" }); 
      }
  
      if (types.has("appointment")) {
        dots.push({ key: "appointment", color: "orange" }); 
      }
  
      mergedMarks[date] = {
        marked: true,
        dots,
      };
    });
  
    setMarkDates(mergedMarks);
  }, [allReminders]);
  
  
  useEffect(() => {
    const loadCompletedInstances = async () => {
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

    loadCompletedInstances();
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
        type: "reminder",
      });
    }

    return list;
  };

  const manageDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const filtered = allReminders
      .filter((r) => r.datetime.split("T")[0] === day.dateString)
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    setReminders(filtered);
  };

  const displayReminder = ({ item }: { item: Reminder }) => {
    const time = new Date(item.datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const reminderId = item.id.split("-")[0];
    const instanceId = item.id;
    const isDone =
    item.status === "attended" ||
    (item.status !== "appointment" && completedInstanceIds.includes(instanceId));
  

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
    const markAppointmentAsAttended = async (appointmentId: string) => {
      try {
        await updateDoc(doc(db, "appointments", appointmentId), {
          status: "attended",
        });
    
        setReminders((prev) =>
          prev.map((r) =>
            r.id === appointmentId ? { ...r, status: "attended" } : r
          )
        );
        setAllReminders((prev) =>
          prev.map((r) =>
            r.id === appointmentId ? { ...r, status: "attended" } : r
          )
        );
      } catch (error) {
        console.error("Error marking appointment as attended:", error);
        Alert.alert("Error", "Could not mark appointment as attended.");
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
    const cancelAppointment = (appointmentId: string) => {
      Alert.alert(
        "Cancel Appointment?",
        "Are you sure you want to cancel this appointment?",
        [
          {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
              try {
                // Delete Appointment
                await deleteDoc(doc(db, "appointments", appointmentId));
    
                // Refresh screen
                setReminders((prev) => prev.filter((r) => r.id !== appointmentId));
                setAllReminders((prev) => prev.filter((r) => r.id !== appointmentId));
              } catch (error) {
                console.error("Error deleting appointment:", error);
                Alert.alert("Error", "Could not cancel appointment.");
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

        {!isDone && isElderly && item.type !== "appointment" && (
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.doneButton} onPress={markDone}>
      <Text style={styles.buttonText}>DONE</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.deleteButton} onPress={removeReminder}>
      <Text style={styles.buttonText}>DELETE</Text>
    </TouchableOpacity>
  </View>
)}
 
 {item.type === "appointment" && userData?.userType !== "Healthcare" && (
  <View style={styles.buttonRow}>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => cancelAppointment(item.id)} 
    >
      <Text style={styles.buttonText}>CANCEL</Text>
    </TouchableOpacity>
    
  </View>
)}

        {item.type === "appointment" && userData?.userType === "Healthcare" && (
  <View style={styles.buttonRow}>
    <TouchableOpacity
  style={styles.doneButton}
  onPress={() => markAppointmentAsAttended(item.id)}
>
  <Text style={styles.buttonText}>ATTENDED</Text>
</TouchableOpacity>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => cancelAppointment(item.id)} 
    >
      <Text style={styles.buttonText}>CANCEL</Text>
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
              markingType="multi-dot"
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
         
            theme={{ todayTextColor: "red", arrowColor: "#009D71" }}
            onDayPress={manageDayPress}
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
                  renderItem={displayReminder}
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
