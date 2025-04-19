import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'expo-router';
import styles from '../styles/stylesignin'; 
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../../firebaseConfig';


export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
  
      if (!userDoc.exists()) {
        Alert.alert("Error", "User not found in database.");
        return;
      }
  
      const userType = userDoc.data().userType; // Getting type of user

      if (userType === "Elderly") {
        router.replace("/(tabs)/ElderlyScreen");
      } else if (userType === "Family") {
        router.replace('/(tabs)/FamilyScreen');
        } else if (userType === "Healthcare") {
          router.replace('/(tabs)/HealthcareScreen');
      } else {
        Alert.alert("Error", "User type not recognized.");
      }
  
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
