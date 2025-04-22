import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './styles/stylesemergency'; 


const EmergencyScreen = () => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calling, setCalling] = useState(false);

  const startCountdown = (timeLeft: number) => {
    setCountdown(timeLeft);

    if (timeLeft <= 0) {
      setCalling(true);
      return;
    }

    setTimeout(() => {
      startCountdown(timeLeft - 1);
    }, 1000);
  };

  useEffect(() => {
    startCountdown(10);
  }, []);

  return (
    <View style={styles.container}>
      {!calling ? (
        <Text style={styles.countdown}>Calling in {countdown} seconds...</Text>
      ) : (
        <Text style={styles.calling}>CALLING 911 </Text>
      )}
    </View>
  );
};

export default EmergencyScreen;

