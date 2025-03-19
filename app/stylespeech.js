import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen', // Color de fondo suave
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007BFF', // Azul moderno
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transcriptContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Sombra en Android
    width: '90%',
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  symptomsContainer: {
    backgroundColor: '#E3F2FD', // Azul clarito
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '90%',
  },
  symptomsText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  recommendationContainer: {
    backgroundColor: '#FFF3CD', // Amarillo claro
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '90%',
  },
  recommendationText: {
    fontSize: 16,
    color: '#856404',
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default styles;
