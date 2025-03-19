import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styleshome'; // Importamos los estilos desde un archivo separado



export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to LOLO!</Text>
      <Text style={styles.subtitle}>Health and Wellness Platform for Elderly and Family Engagement</Text>
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/SignInScreen')}>
        <Text style={styles.buttonText}>START</Text>
      </TouchableOpacity>
    </View>
  );
}

