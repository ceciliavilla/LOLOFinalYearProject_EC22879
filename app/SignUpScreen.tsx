import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import styles from './stylesignup';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Elderly'); 

  // Datos adicionales solo para Elderly
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Si el usuario es Elderly, validamos que ingrese sus datos
    if (userType === "Elderly" && (!name.trim() || !age )) {
      Alert.alert("Error", "Please fill in all fields for Elderly users.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userData = {
        email: user.email,
        userType: userType, // Elderly, Family o Healthcare
        createdAt: new Date(),
      };

      if (userType === "Elderly") {
        userData = {
          ...userData,
          name: name.trim() ,
          age: parseInt(age),
        };
      }


      await setDoc(doc(db, "users", user.uid), userData);

      Alert.alert("Success", "Account created!");
      router.replace('/'); 
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {userType === "Elderly" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

        </>
      )}

      <Text style={styles.label}>Select User Type:</Text>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Elderly' && styles.selectedButton]}
          onPress={() => setUserType('Elderly')}
        >
          <Text style={styles.buttonuserText}>Elderly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Family' && styles.selectedButton]}
          onPress={() => setUserType('Family')}
        >
          <Text style={styles.buttonuserText}>Family</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Healthcare' && styles.selectedButton]}
          onPress={() => setUserType('Healthcare')}
        >
          <Text style={styles.buttonuserText}>Healthcare</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/SignInScreen')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
