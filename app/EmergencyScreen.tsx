import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styles from './styles/stylesemergency'; 

const EmergencyScreen = () => {
  const [countdown, setCountdown] = useState<number>(10);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setCalling(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {!calling ? (
        <Text style={styles.countdown}>Calling in {countdown} seconds...</Text>
      ) : (
        <Text style={styles.calling}>Calling 911</Text>
      )}
    </View>
  );
};

export default EmergencyScreen;


