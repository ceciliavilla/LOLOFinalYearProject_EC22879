import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles/styleshome'; // Import styles from a separate document
import { Image } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
    <Image
  source={require('../assets/images/LOGOLOLO.png')}
  style={{ width: 200, height: 200, marginBottom: 20 }}
  resizeMode="contain"
    />
      <Text style={styles.welcomeText}>Welcome to LOLO!</Text>
      <Text style={styles.subtitle}>Health and Wellness Platform for Elderly and Family Engagement</Text>
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/SignInScreen')}> 
        <Text style={styles.buttonText}>START</Text>
      </TouchableOpacity>
    </View>
  );
}

