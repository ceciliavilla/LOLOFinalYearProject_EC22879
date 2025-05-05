import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig"; 
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "./styles/stylereminders";
import * as Notifications from 'expo-notifications';

const Reminders = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [ChooseDate, setChooseDate] = useState(false);
  const [ChooseTime, setChooseTime] = useState(false);
  const [repeat, setRepeat] = useState("none");
  const [repeatInterval, setRepeatInterval] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const { elderlyId } = useLocalSearchParams();
  const realElderlyId = elderlyId || auth.currentUser?.uid;

  const DateElection = (selectedDate: Date) => {
    setDate(selectedDate);
    setChooseDate(false);
  };

  const TimeElection = (selectedTime: Date) => {
    setTime(selectedTime);
    setChooseTime(false);
  };

  const saveReminder = async () => {
    const user = auth.currentUser;
    if (!title || !date || !time || !user) {
      Alert.alert("Missing fields", "Fill all the sections");
      return;
    }
    const completedDate = new Date(date);
    completedDate.setHours(time.getHours(), time.getMinutes(), 0);

    if (completedDate.getTime() <= Date.now()) {
      Alert.alert("Invalid Date", "Please choose a future date and time.");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "reminders"), {
        title,
        datetime: completedDate.toISOString(),
        status: "pending",
        repeat,
        repeatInterval,
        createdBy: user.uid,
        elderlyId: realElderlyId,
      });

      const instancesRef = collection(db, "reminders", docRef.id, "instances");
      const repeatCount = repeat === "none" ? 1 : 10;

      for (let i = 0; i < repeatCount; i++) {
        const instanceDate = new Date(completedDate);
        if (repeat === "daily") instanceDate.setDate(instanceDate.getDate() + i * repeatInterval);
        if (repeat === "weekly") instanceDate.setDate(instanceDate.getDate() + i * 7 * repeatInterval);
        if (repeat === "monthly") instanceDate.setMonth(instanceDate.getMonth() + i * repeatInterval);

        const instanceId = `${docRef.id}-${i}`;
        await setDoc(doc(instancesRef, instanceId), {
          datetime: instanceDate.toISOString(),
          status: "pending",
          title,
        });

        await scheduleReminderNotification(title, instanceDate);
      }

      Alert.alert("Success", "Reminder created successfully!");
      router.back();
    } catch (error) {
      console.error("Error saving reminder:", error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleReminderNotification = async (reminderTitle: string, reminderDateInput: Date | string) => {
    try {
      const reminderDate = new Date(reminderDateInput);
      const secondsUntilReminder = Math.floor((reminderDate.getTime() - Date.now()) / 1000);

      if (isNaN(secondsUntilReminder) || secondsUntilReminder <= 0) {
        console.warn("Please choose a time in the future.");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: reminderTitle,
          sound: true,
        },
        trigger: reminderDate,
      });

      console.log("Notification scheduled for:", reminderDate.toISOString());
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications to receive reminders.');
      }
    };
    requestPermissions();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add reminder</Text>

      <TextInput
        placeholder="Reminder Title"
        value={title}
        onChangeText={setTitle}
        testID="Reminder Title"
        style={styles.input}
        accessibilityLabel="Reminder Title"
      />

      <TouchableOpacity onPress={() => setChooseDate(true)} style={styles.button}>
        <Text style={styles.buttonText}>{date ? date.toDateString() : "Choose Date"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setChooseTime(true)} style={styles.button}>
        <Text style={styles.buttonText}>{time ? time.toLocaleTimeString() : "Choose Time"}</Text>
      </TouchableOpacity>

      <Text style={styles.repeatLabel}>Repeat</Text>

      <View style={styles.repeatContainer}>
        {[
          { label: "Don't repeat", value: "none" },
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setRepeat(item.value)}
            style={[
              styles.repeatOption,
              repeat === item.value && styles.selectedRepeatOption,
            ]}
            accessibilityLabel={`Repeat ${item.label}`}
          >
            <Text style={[
              styles.repeatOptionText,
              repeat === item.value && styles.selectedRepeatOptionText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {repeat !== "none" && (
        <>
          <Text style={styles.repeatLabel}>
            Repeat every {repeatInterval} {repeat === "daily" ? "day(s)" : repeat === "weekly" ? "week(s)" : "month(s)"}
          </Text>

          <View style={styles.intervalContainer}>
            <TouchableOpacity
              style={styles.intervalButton}
              onPress={() => setRepeatInterval(Math.max(1, repeatInterval - 1))}
            >
              <Text style={styles.intervalButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.intervalValue}>{repeatInterval}</Text>

            <TouchableOpacity
              style={styles.intervalButton}
              onPress={() => setRepeatInterval(repeatInterval + 1)}
            >
              <Text style={styles.intervalButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity testID="SaveButton" onPress={saveReminder} style={styles.saveButton} accessibilityLabel="Save reminder">
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
        {loading && <ActivityIndicator size="small" color="#fff" />}
      </TouchableOpacity>

      <DateTimePickerModal testID="datePicker" isVisible={ChooseDate} mode="date" onConfirm={DateElection} onCancel={() => setChooseDate(false)} />
      <DateTimePickerModal testID="timePicker" isVisible={ChooseTime} mode="time" onConfirm={TimeElection} onCancel={() => setChooseTime(false)} />
    </ScrollView>
  );
};

export default Reminders;
