import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009D71', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: 'lightgreen', 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#009D71',
    fontSize: 16,
    fontWeight: 'bold',
    shadowColor: 'blue',
    shadowOpacity: 0.1,
    borderRadius: 12,
    width: '48%',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
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
    elevation: 3, 
    width: '90%',
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  symptomsContainer: {
    backgroundColor: '#E3F2FD', 
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
    backgroundColor: '#FFF3CD', 
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
