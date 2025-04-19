import React, { useState } from "react";
import { db, auth } from "../firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert} from "react-native";
import { useRouter } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useLocalSearchParams } from 'expo-router';
import styles from "./styles/stylereminders";

const Reminders = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);
    const [ChooseDate, setChooseDate] = useState(false);
    const [ChooseTime, setChooseTime] = useState(false);
    const [repeat, setRepeat] = useState("none");
    const [repeatInterval, setRepeatInterval] = useState<number>(1);
    const { elderlyId } = useLocalSearchParams();
    const realElderlyId = elderlyId || auth.currentUser?.uid;
  
    // Choose Date
    const DateElection = (selectedDate: Date) => {
        setDate(selectedDate);
        setChooseDate(false);
      };      
    
    // Choose Time
    const TimeElection = (selectedTime: Date) => {
        setTime(selectedTime);
        setChooseTime(false);
      };

    // Save to Firestore 
    const saveReminder = async () => {
        const user = auth.currentUser;
        if (!title || !date || !time|| !auth.currentUser) {
            alert("Fill all the sections");
            return;
        }
    
        const completedDate = new Date(date);
        completedDate.setHours(time.getHours(), time.getMinutes(), 0);
    
        try {
           await addDoc(collection(db, "reminders"), {
            title,
            datetime: completedDate.toISOString(),
            status: "Pending",
            repeat,
            repeatInterval,
            createdBy: auth.currentUser?.uid,
            elderlyId: realElderlyId, 
          });
              

            Alert.alert("Success", "Reminder created successfully!");
            router.back();
        } catch (error) {
            console.error("Error", error);
        }
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
      Repeat every {repeatInterval}{" "} {repeat === "daily" ? "day(s)" : repeat === "weekly" ? "week(s)": repeat === "monthly" ? "month(s)" : ""}
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
            <TouchableOpacity onPress={saveReminder} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

           
            <DateTimePickerModal isVisible={ChooseDate} mode="date" onConfirm={DateElection} onCancel={() => setChooseDate(false)} />
            <DateTimePickerModal isVisible={ChooseTime} mode="time" onConfirm={TimeElection} onCancel={() => setChooseTime(false)} />
        </ScrollView>
    );
};

export default Reminders;

