/*import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    paddingHorizontal: 20,
    paddingTop: 90, 
    marginTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009D71',
    textAlign: 'left',
    alignSelf: 'flex-start', 
    marginBottom: 10,
  },
  userInfoContainer: {
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 8, 
  },
  buttonText: {
    color: 'lightgreen',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#009D71',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  
});

export default styles;*/
import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7fa', // azul suave
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60, // espacio seguro arriba
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007ea7', // azul elegante
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#009D71', // verde oscuro
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default styles;



