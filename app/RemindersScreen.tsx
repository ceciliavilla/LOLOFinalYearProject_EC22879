import React, { useState } from "react";
import { db } from "../firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";
import { View, Text, TextInput, TouchableOpacity, ScrollView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "./stylereminders";
import { Alert } from "react-native";



const Reminders = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);
    const [ChooseDate, setChooseDate] = useState(false);
    const [ChooseTime, setChooseTime] = useState(false);
    const [repeat, setRepeat] = useState("none");
    const [repeatInterval, setRepeatInterval] = useState<number>(1);
  
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
        if (!title || !date || !time) {
            alert("Fill all the sections");
            return;
        }
    
        const CompletedDate = new Date(date);
        CompletedDate.setHours(time.getHours(), time.getMinutes(), 0);
    
        try {
            const reminderRef = await addDoc(collection(db, "reminders"), {
                title,
                datetime: CompletedDate.toISOString(),
                status: "Pending", 
                repeat,
                repeatInterval,
              });
              

            Alert.alert("Success", "Reminder created successfully!");
            navigation.goBack();
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
                <Text style={styles.buttonText}>{date ? ` ${date.toDateString()}` : "Choose Date"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setChooseTime(true)} style={styles.button}>
                <Text style={styles.buttonText}>{time ? ` ${time.toLocaleTimeString()}` : "Choose Time"}</Text>
            </TouchableOpacity>

            <Text style={{ marginTop: 20, fontWeight: "bold" }}>Repeat</Text>

<View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 15 }}>
  {[
    { label: "Don't repeat", value: "none" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ].map((item) => (
    <TouchableOpacity
      key={item.value}
      onPress={() => setRepeat(item.value)}
      style={{
        backgroundColor: repeat === item.value ? "#007BFF" : "#eee",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
        marginTop:20,
      }}
    >
      <Text style={{ color: repeat === item.value ? "#fff" : "#000" }}>{item.label}</Text>
    </TouchableOpacity>
  ))}
</View>

{repeat !== "none" && (
  <>
    <Text style={{ marginTop: 20, fontWeight: "bold" }}>
      Repeat every {repeatInterval}{" "}
      {repeat === "daily"
        ? "day(s)"
        : repeat === "weekly"
        ? "week(s)"
        : repeat === "monthly"
        ? "month(s)"
        : ""}
    </Text>

    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#ddd",
          padding: 10,
          borderRadius: 5,
          marginRight: 10,
        }}
        onPress={() => setRepeatInterval(Math.max(1, repeatInterval - 1))}
      >
        <Text style={{ fontSize: 18 }}>-</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 16 }}>{repeatInterval}</Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#ddd",
          padding: 10,
          borderRadius: 5,
          marginLeft: 10,
        }}
        onPress={() => setRepeatInterval(repeatInterval + 1)}
      >
        <Text style={{ fontSize: 18 }}>+</Text>
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

