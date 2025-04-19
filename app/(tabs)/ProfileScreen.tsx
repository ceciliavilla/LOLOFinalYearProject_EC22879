import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { getAuth, updatePassword, signOut, updateEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, Timestamp} from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig'; 
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import styles from '../styles/styleprofile'; 
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function ProfileScreen() {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const user = auth.currentUser;
  const [userType, setUserType] = useState('');


  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();

          if (data) {
            setEmail(data.email || '');
            setName(data.name || '');
            setLastName(data.lastName || '');
            setUserType(data.userType || '');
            setBirthDate(
              data.birthDate instanceof Timestamp ? data.birthDate.toDate() : new Date(data.birthDate));
          }
        }
      } catch (error) {
        console.error('ERROR', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      if (user) {
        if (!currentPassword) {
          Alert.alert('Please enter your current password to update your email.');
          return;
        }

        if (newPassword && newPassword.length < 6) {
          Alert.alert('No Valid Password');
          return;
        }

        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);

        const docRef = doc(db, 'users', user.uid);

        const updatedFields: any = {
          email,
          name,
          lastName,
        };
  
    
        if (userType === 'Elderly' && birthDate && !isNaN(birthDate.getTime?.())) {
          updatedFields.birthDate = birthDate;
        }
  

        if (email !== user.email) {
          await updateEmail(user, email);
        }
  
        await updateDoc(docRef, updatedFields);

        if (newPassword.length > 0) {
          if (newPassword !== confirmPassword) {
            Alert.alert('Passwords do not match');
            return;
          }

          await updatePassword(user, newPassword);
        }

        Alert.alert('Profile Updated');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const confirmSaveChanges = () => {
    Alert.alert('Are you sure?', 'Do you want to update your profile?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Update', onPress: () => handleSaveChanges() }
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('Are you sure?', 'You are going to log out.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            Alert.alert('Logged out');
            router.push('/');
          } catch (error: any) {
            Alert.alert('ERROR Logging Out', error.message);
          }
        }
      }
    ]);
  };

  const formatBirthDate = (birthDate: string | number | Date) => {
    if (!birthDate) return 'N/A';
    const date =
      birthDate instanceof Timestamp
        ? birthDate.toDate()
        : new Date(birthDate);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'long' });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      {userType === 'Elderly' && (
  <>
    <Text style={styles.label}>Birth Date</Text>
    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
      <Text style={styles.birthDateInput}>
        {birthDate ? formatBirthDate(birthDate) : "Select Birth Date"}
      </Text>
    </TouchableOpacity>

    {showDatePicker && (
      <DateTimePicker
        value={birthDate ? new Date(birthDate) : new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (event.type === 'set' && selectedDate) {
            setBirthDate(selectedDate);
          }
        }}
      />
    )}
  </>
)}
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        placeholder="Enter current password"
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="6 characters"
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Repeat new password"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={confirmSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



