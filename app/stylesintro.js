import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'green',
      padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'lightgreen',
        marginBottom: 20,
        textAlign: 'center',
      },
    gobackbuttonText: {
        color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
    },
    userbuttonText: {
        color: 'black',
      fontSize: 15,
      fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginBottom: 20,

      },
   gobackButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'grey',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    },
    elderlyButton: {
        backgroundColor: 'pink',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
      },
    familyButton: {
        backgroundColor: 'lightgreen',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
      }
    
    
  
  });

  export default styles;