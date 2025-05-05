import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009D71",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "lightgreen",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#009D71",
    borderWidth: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009D71",
  },
  specialityText: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
    marginBottom: 6,
  },
  emailText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: "#009D71",
    padding: 10,
    borderRadius: 8,
  },
  pendingButton: {
    backgroundColor: "#b2b2b2",
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;
