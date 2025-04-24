import { StyleSheet } from 'react-native';

const styles =  StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e0f7f7',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00695c',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
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
    fontWeight: '600',
    color: '#00796b',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#00b3b3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedDate: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  appointmentButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default styles;  