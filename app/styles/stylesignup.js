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
      color: 'white'
    },
    input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      color: 'lightgreen'
    },
    birthDateButton: {
      backgroundColor: 'transparent', // Keeps it clean
      paddingHorizontal: 10,
      borderRadius: 8,
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: '#fff', // White border
      justifyContent: 'center',
      marginBottom: 10,
    },
    birthDateText: {
      color: 'lightgreen', // Makes the text white
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      color: 'white'
    },
    userTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
      marginVertical: 10,
    },
    userTypeButton: {
      flex: 1,
      backgroundColor: 'darkgreen',
      paddingVertical: 10,
      marginHorizontal: 5,
      borderRadius: 5,
      alignItems: 'center',
      color: 'white',
    },
    selectedButton: {
      backgroundColor: 'lightgreen',
      color: 'darkgreen'
      
    },
    button: {
      backgroundColor: 'lightgrey',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#009D71'
    },
    linkText: {
      color: 'white',
      marginTop: 10,
    },
    buttonuserText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    
  });

export default styles;

  