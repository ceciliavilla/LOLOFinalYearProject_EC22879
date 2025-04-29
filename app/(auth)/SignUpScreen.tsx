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
  const [birthDate, setBirthDate] = useState<Date | null>(null); 
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Additional for healthcare
  const [speciality, setSpeciality] = useState('');

  let userData: {
    email: string | null;
    userType: string;
    createdAt: Date;
    name?: string;    
    lastName?: string;  
    birthDate?: string; // Added for Elderly
    speciality?: string; // Addeed for Healthcare
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
    // Check if Passwords match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    //Check if all fields are filled
    if (!name.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    //Check if Additional fields have been filled
    if (userType === "Elderly" && !birthDate) {
      Alert.alert("Error", "Please select your birth date.");
      return;
    }
    if (userType === "Healthcare" && !speciality) {
      Alert.alert("Error", "Please select your speciality.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      userData = {
        ...userData,
        name: name.trim(),
        lastName: lastName.trim(),
      };
      
  
      if (userType === "Elderly") {
        userData.birthDate = (birthDate ?? new Date()).toISOString().split('T')[0];
      }
      if (userType === "Healthcare") {
        userData.speciality = speciality.trim();
      }

      //Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      Alert.alert("Success", "Account created!");
      router.replace('/'); 
        } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        Alert.alert("Error", errorMessage);
        }

  };

  return (

    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        testID="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        testID="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        textContentType="oneTimeCode" 
        autoComplete="off"            
        importantForAutofill="no"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        testID="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        textContentType="oneTimeCode" 
        autoComplete="off"            
        importantForAutofill="no"
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        testID="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        testID="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      {userType === "Elderly" && ( //Additional fields for Elderly Users
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} testID='birthDateButton' style={styles.birthDateButton}>
            <Text style={styles.birthDateText}> {birthDate ? birthDate.toDateString() : "Select Birth Date"} </Text>
          </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
          value={birthDate || new Date()}  
          mode="date"
          testID='birthDatePicker'
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
      
      {userType === "Healthcare" && ( //Additional fields for Helthcare Users
        
        <TextInput 
        style={styles.input}
        placeholder="Speciality"
        testID="Speciality"
        value={speciality}
        onChangeText={setSpeciality}
        />)}

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

      <TouchableOpacity style={styles.button} onPress={handleSignUp} testID="signUpButton">
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/SignInScreen')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
