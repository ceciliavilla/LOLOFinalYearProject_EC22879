import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#009D71',
  },
  input: {
    borderWidth: 1,
    borderColor: '#009D71',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    color: 'black',
  },
  button: {
    backgroundColor: '#009D71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPending: {
    marginTop: 10,
    backgroundColor: 'white',         
    borderColor: 'blue',        
    borderWidth: 2,                   
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonPendingText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default styles;
