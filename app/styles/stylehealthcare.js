import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#045d75',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 50,
    letterSpacing: 0.8,
  },

  connectionText: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    color: '#034d36',
    marginBottom: 24,
  },

  // 🔹 Botones principales
  button: {
    backgroundColor: '#009D71',
    paddingVertical: 14,
    borderRadius: 14,
    marginVertical: 6,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // 🔹 Tarjeta profesional
  card: {
    backgroundColor: '#419a78',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },

  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 18,
    textAlign: 'center',
  },

  // 🔹 Botones internos
  innerButton: {
    backgroundColor: '#b2f5dc',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 20,
    marginVertical: 4,
    width: 160,
    alignItems: 'center',
  },
  innerButtonText: {
    color: '#034d36',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
