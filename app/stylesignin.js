import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#009D71',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: "white",
    },
    input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      color: "lightgreen",
    },
    button: {
      backgroundColor: 'lightgrey',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: '#009D71',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linkText: {
      color: 'lightgreen',
      marginTop: 10,
    },
  });
  export default styles;