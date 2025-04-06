import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles/styleshome'; // Importamos los estilos desde un archivo separado



export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome RELATIVE</Text>
      <Text style={styles.subtitle}>Health and Wellness Platform for Elderly and Family Engagement</Text>
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Goback</Text>
      </TouchableOpacity>
    </View>
  );
}