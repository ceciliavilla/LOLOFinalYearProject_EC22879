import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, Alert} from 'react-native';
import styles from './styles/stylesemergency'; 
import Constants from 'expo-constants';

const EMERGENCY_NUMBER = '+44 07709263463';
//const EMERGENCY_NUMBER = Constants.expoConfig?.extra?.emergencynumber;

const EmergencyScreen = () => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calling, setCalling] = useState(false);

  const startCountdown = (timeLeft: number) => {
    setCountdown(timeLeft);

    if (timeLeft <= 0) {
      handleCall();
      return;
    }

    setTimeout(() => {
      startCountdown(timeLeft - 1);
    }, 1000);
  };

  const handleCall = () => {
    setCalling(true);

    Alert.alert(
      'Emergency Call',
      `Do you want to call ${EMERGENCY_NUMBER}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
          },
        },
      ]
    );
  };


  useEffect(() => {
    startCountdown(10);
  }, []);

  return (
    <View style={styles.container}>
      {!calling ? (
        <Text style={styles.countdown}>Calling in {countdown} seconds...</Text>
      ) : (
        <Text style={styles.calling}>Opening call screen...</Text>
      )}
    </View>
  );
};

export default EmergencyScreen;

