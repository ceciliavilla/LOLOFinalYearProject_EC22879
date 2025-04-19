
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;
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
  height: 250,
  },
  name: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#b2f5dc',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#034d36',
    fontSize: 14,
    fontWeight: '600',
  },
});
export default styles;