import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/styleselderly'; // Import styles from a separate document
import { Image } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
  
      <Text style={styles.container}>Welcome to LOLO!</Text>
      <Text style={styles.info}>Health and Wellness Platform for Elderly and Family Engagement</Text>

    </View>
  );
}

