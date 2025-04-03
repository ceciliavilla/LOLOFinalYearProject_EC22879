import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig"; // Firestore importado
import { collection, addDoc } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import styles from "./stylereminders";

const Reminders = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [ChooseDate, setChooseDate] = useState(false);
    const [ChooseTime, setChooseTime] = useState(false);
  
    // Choose Date
    const DateElection = (selectedDate: React.SetStateAction<null>) => {
        setDate(selectedDate);
        setChooseDate(false);
      };
    
    // Choose Time
    const TimeElection = (selectedTime) => {
        setTime(selectedTime);
        setChooseTime(false);
    };

    // Save to Firestore and Set Notification
    const saveReminder = async () => {
        if (!title || !date || !time) {
            alert("Fill all the sections!");
            return;
        }
    
        const CompletedDate = new Date(date);
        CompletedDate.setHours(time.getHours(), time.getMinutes(), 0);
    
        try {
            const reminderRef = await addDoc(collection(db, "reminders"), {
                title,
                datetime: CompletedDate.toISOString(),
                status: "Pending",
            });

            console.log("Saved with ID:", reminderRef.id);
            scheduleNotification(title, CompletedDate);
            navigation.goBack();
        } catch (error) {
            console.error("Error", error);
        }
    };
      
    // Set Notification
    const scheduleNotification = async (title, CompletedDate) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Reminder",
                body: `${title} - ${CompletedDate.toLocaleString()}`,
                sound: true,
            },
            trigger: CompletedDate,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add reminder</Text>

            <TextInput
                placeholder="Reminder Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <TouchableOpacity onPress={() => setChooseDate(true)} style={styles.button}>
                <Text style={styles.buttonText}>{date ? ` ${date.toDateString()}` : "Choose Date"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setChooseTime(true)} style={styles.button}>
                <Text style={styles.buttonText}>{time ? ` ${time.toLocaleTimeString()}` : "Choose Time"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={saveReminder} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

           
            <DateTimePickerModal isVisible={ChooseDate} mode="date" onConfirm={DateElection} onCancel={() => setChooseDate(false)} />
            <DateTimePickerModal isVisible={ChooseTime} mode="time" onConfirm={TimeElection} onCancel={() => setChooseTime(false)} />
        </ScrollView>
    );
};

export default Reminders;

