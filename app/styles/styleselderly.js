import { StyleSheet } from 'react-native';

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

export default styles;
