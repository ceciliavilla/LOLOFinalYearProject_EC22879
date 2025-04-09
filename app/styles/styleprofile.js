import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#009D71',
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'lightgreen',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    color: 'lightgreen',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  },
  birthDateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: 'lightgreen',
    padding: 5,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#009D71',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
