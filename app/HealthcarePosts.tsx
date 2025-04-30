import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter, SearchParams } from "expo-router";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import { useSearchParams } from "expo-router/build/hooks";

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
  
      // 🎉 ALERTA DE ÉXITO
      Alert.alert("✅ Sent", "Your message was sent successfully.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error sending post:", error);
      Alert.alert("❌ Error", "Could not send message.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 New Message for Patient</Text>
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

const styles = StyleSheet.create({
    container: {
    Top: 90,
      flex: 1,
      backgroundColor: "#e0f7f7",
      padding: 20,
      justifyContent: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 12,
      marginBottom: 24,
      textAlign: "center",
      color: "#00796b",
    },
    input: {
      borderColor: "#009999",
      borderWidth: 1,
      borderRadius: 10,
      padding: 14,
      fontSize: 16,
      backgroundColor: "#fff",
      minHeight: 100,
      textAlignVertical: "top",
    },
    button: {
      marginTop: 20,
      backgroundColor: "#00b3b3",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });
  