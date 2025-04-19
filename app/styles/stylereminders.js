import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#009D71",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "lightgreen",
  },
  input: {
    width: "90%",
    borderBottomWidth: 1,
    borderColor: "white",
    marginBottom: 20,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "lightgreen",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#009D71",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  repeatLabel: {
    marginTop: 20,
    fontWeight: "bold",
    color: "white",
  },
  repeatContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    justifyContent: "center",
  },
  repeatOption: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  selectedRepeatOption: {
    backgroundColor: "#007BFF",
  },
  repeatOptionText: {
    color: "#000",
  },
  selectedRepeatOptionText: {
    color: "#fff",
  },
  intervalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  intervalButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    color: 'black'
  },
  intervalButtonText: {
    fontSize: 18,
  },
  intervalValue: {
    fontSize: 16,
    color: "white",
  },
});

export default styles;
