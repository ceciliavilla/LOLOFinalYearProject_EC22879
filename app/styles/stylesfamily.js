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
  connectionText: {
    fontSize: 16,
    color: '#0a4d5e',
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#419a78',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 180,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  innerButton: {
    backgroundColor: '#b2f5dc',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  innerButtonAlt: {
    backgroundColor: '#7ccfbf',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  innerButtonText: {
    color: '#034d36',
    fontSize: 12,
    fontWeight: '600',
  },
  
  
});

export default styles;



