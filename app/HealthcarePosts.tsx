import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter, SearchParams } from "expo-router";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import { useSearchParams } from "expo-router/build/hooks";
import styles from "./styles/styleshealthposts";

const CreateHealthcarePost = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const elderlyId = params.get("elderlyId");
  
  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  


  const handleSend = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !elderlyId) return;
  
    if (message.trim().length < 5) {
      Alert.alert("Message too short", "Please write a longer message.");
      return;
    }
  
    try {
      const userDoc = await getDocs(collection(db, "users"));
    const docSnap = userDoc.docs.find(doc => doc.id === currentUser.uid);
    const userData = docSnap?.data();
      await addDoc(collection(db, `users/${elderlyId}/healthcare_posts`), {
        message,
        createdAt: serverTimestamp(),
      fromHealthcareId: currentUser.uid,
      fromHealthcareName: userData?.name || "Healthcare",
      fromHealthcareLastName: userData?.lastName || "",
      fromHealthcareuserType: userData?.userType || "",

      });
  
      Alert.alert("Sent", "Your message was sent successfully.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error sending post:", error);
      Alert.alert("Error", "Could not send message.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Message</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your message here..."
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateHealthcarePost;

