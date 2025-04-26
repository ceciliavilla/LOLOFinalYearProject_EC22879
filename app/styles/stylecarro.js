
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const SPACING = 10;

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    marginRight: SPACING,
    backgroundColor: '#419a78',
    borderRadius: 16,
    padding: 14,
  alignItems: 'center',
  justifyContent: 'center',
  height: 350,
  },
  name: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight:'bold',
  },
  button: {
    backgroundColor: '#b2f5dc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 6,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#1a202c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  disconnectButton: {
    backgroundColor: '#e63946',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 10,
    position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 1,
  },
  disconnectText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonText: {
    color: 'darkgreen',
    fontSize: 14,
    fontWeight: '600',
  },
});
export default styles;