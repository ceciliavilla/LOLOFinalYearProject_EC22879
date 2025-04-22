import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4F1', // verde clarito elegante
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#00684a', // verde oscuro LOLO
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  email: {
    fontSize: 16,
    color: '#4A5568',
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: '#718096',
    marginTop: 6,
  },
  removeButton: {
    marginTop: 16,
    backgroundColor: '#e53e3e', // rojo suave
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00684a',
    marginTop: 20,
    marginBottom: 10,
  },
  
});

export default styles;
