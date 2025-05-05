import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#009D71",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "lightgreen",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    width: "100%",
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#009D71",
  },
  email: {
    fontSize: 14,
    color: "grey",
    marginBottom: 6,
  },
  date: {
    fontSize: 15,
    fontWeight: "500",
    color: "grey",
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  noDataText: {
    fontSize: 16,
    color: "#777",
    fontStyle: "italic",
    marginTop: 30,
    textAlign: "center",
  },
});

export default styles;
