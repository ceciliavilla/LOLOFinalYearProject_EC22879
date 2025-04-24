import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "#e6f2f2",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
      color: "#004d4d",
    },
    noData: {
      textAlign: "center",
      fontSize: 16,
      marginTop: 20,
      color: "#666",
      fontStyle: "italic",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      borderLeftWidth: 6,
      borderLeftColor: "#00b3b3",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 3,
    },
    date: {
      fontSize: 13,
      color: "#666",
      marginBottom: 10,
      fontStyle: "italic",
    },
    subtitle: {
      fontWeight: "600",
      marginTop: 10,
      marginBottom: 6,
      fontSize: 16,
      color: "#004d4d",
    },
    symptom: {
      fontSize: 15,
      color: "#222",
      paddingVertical: 1,
    },
    disease: {
      fontSize: 15,
      color: "#cc3300",
      fontWeight: "600",
      paddingLeft: 4,
      paddingVertical: 2,
    },
    button: {
      backgroundColor: "#00b3b3",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 40
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16
    },
    
  });
  export default styles;
