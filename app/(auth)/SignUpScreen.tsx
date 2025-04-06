import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import DateTimePicker from '@react-native-community/datetimepicker'; 
import styles from '../styles/stylesignup';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Elderly');  // Default to Elderly

  // Aditional fields for elderly
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [birthDate, setBirthDate] = useState<Date | null>(null); // Set initial value to null
  const [showDatePicker, setShowDatePicker] = useState(false);

  let userData: {
    email: string | null;
    userType: string;
    createdAt: Date;
    name?: string;      // Added for Elderly
    lastName?: string;  // Added for Elderly
    birthDate?: string; // Added for Elderly
  } = {
    email: email,
    userType: userType,
    createdAt: new Date(),
  };

  const handleSignUp = async () => {
    // Check if all fields are filled
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Check if elderly users have filled additional fields
    if (userType === "Elderly" && (!name.trim() || !lastName.trim()|| !birthDate)) {
      Alert.alert("Error", "Please fill in all fields for Elderly users.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // If the user is Elderly, add extra fields
      if (userType === "Elderly") {
        userData = {
          ...userData,
          name: name.trim(),
          lastName: lastName.trim(),
          birthDate: (birthDate ?? new Date()).toISOString().split('T')[0],
        };
      }

      //Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      Alert.alert("Success", "Account created!");
      router.replace('/'); 
    } catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  Alert.alert("Error", errorMessage);
}

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

       {/* Confirm password */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Additional fields for Elderly users */}
      {userType === "Elderly" && (
        <>
          {/* Name input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          {/* Last name */}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Select date of birth */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}  style={styles.birthDateButton}>
            <Text style={styles.birthDateText}> {birthDate ? birthDate.toDateString() : "Select Birth Date"} </Text>
          </TouchableOpacity>

         {/* Show Datepicker */}
        {showDatePicker && (
          <DateTimePicker
          value={birthDate || new Date()}  
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
           if (selectedDate) {
             setBirthDate(selectedDate);
           }
          }}
          style={{ backgroundColor: 'transparent' }}
          />
        )}

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
