import { StyleSheet } from 'react-native';

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#009D71',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'lightgreen',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009D71',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  dateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDate: {
    fontSize: 14,
    color: 'white',
    marginBottom: 10,
  },
  appointmentButton: {
    backgroundColor: 'lightgreen',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: '#009D71',
    fontWeight: 'bold',
  },
});
export default styles;  