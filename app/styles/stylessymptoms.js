import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "#009D71",
      flex:1,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
      color: "lightgreen",
    },
    noData: {
      textAlign: "center",
      fontSize: 16,
      marginTop: 20,
      color: "white",
      fontStyle: "italic",
    },
    card: {
      backgroundColor: "white",
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      borderLeftWidth: 6,
      borderLeftColor: "lightgreen",
     
      elevation: 3,
    },
    date: {
      fontSize: 13,
      color: "grey",
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
      color: "black",
      paddingVertical: 1,
    },
    disease: {
      fontSize: 15,
      color: "red",
      fontWeight: "600",
      paddingLeft: 4,
      paddingVertical: 2,
    },
    button: {
      backgroundColor: "lightgreen",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 40
    },
    buttonText: {
      color: "#009D71",
      fontWeight: "bold",
      fontSize: 16
    },
    
  });
  export default styles;
