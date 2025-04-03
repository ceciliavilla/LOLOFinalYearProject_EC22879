import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    paddingHorizontal: 20,
    paddingTop: 40, // Espacio en la parte superior
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009D71',
    textAlign: 'left',
    alignSelf: 'flex-start', // Asegura que esté a la izquierda
    marginBottom: 10,
  },
  userInfoContainer: {
    flexDirection: "row", // Hace que los elementos estén en la misma línea
    justifyContent: "center", // Centra el contenido horizontalmente
    alignItems: "center", // Alinea verticalmente
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 10, // Espacio entre el nombre y la edad
  },
  startButton: {
    backgroundColor: 'lightgreen',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#009D71',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
