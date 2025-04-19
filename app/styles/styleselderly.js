/*import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    paddingHorizontal: 20,
    paddingTop: 90, 
    marginTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009D71',
    textAlign: 'left',
    alignSelf: 'flex-start', 
    marginBottom: 10,
  },
  userInfoContainer: {
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 8, 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  
});

export default styles;*/
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2f5dc', // verde clarito (Elderly)
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00684a', // verde oscuro para contraste
    textAlign: 'left',
    marginBottom: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  info: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: '#009D71',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  connectionButton: {
    backgroundColor: '#009D71',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  connectionButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  myConnectionButton: {
    backgroundColor: '#ffffff',
    borderColor: '#009D71',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  myConnectionButtonText: {
    color: '#009D71',
    fontSize: 17,
    fontWeight: '600',
  },

});

export default styles;
