import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles/stylesintro'; // Import Styles 


export default function IntroScreen({ navigation } : any) {
  const router = useRouter();
  return (
    <View style = {styles.container}>
      <Text style={styles.title}>WHO ARE YOU?</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.elderlyButton} onPress={() => router.push('/')}>
          <Text style={styles.userbuttonText}>ELDERLY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.familyButton} onPress={() => router.push('/')}>
          <Text style={styles.userbuttonText}>FAMILY</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.gobackButton} onPress={() => router.push('/')}>
        <Text style={styles.gobackbuttonText}>Go Back</Text>
      </TouchableOpacity>
     
    </View>
  );
}


