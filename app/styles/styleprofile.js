import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#009D71', // verde fondo
    paddingTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#b2f5dc', // versión más suave de lightgreen
    marginBottom: 24,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600',
    color: '#b2f5dc',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b2f5dc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  },
  birthDateInput: {
    borderWidth: 1,
    borderColor: '#b2f5dc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  saveButton: {
    backgroundColor: 'lightgreen', // verde clarito profesional
    paddingVertical: 14,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: '#005f4a', // verde oscuro elegante
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e63946', // rojo elegante
    paddingVertical: 14,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
