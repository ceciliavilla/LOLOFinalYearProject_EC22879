import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e6f9f4",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#014d4e",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
  },
  date: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
    marginBottom: 12,
  },
  status: {
    fontSize: 15,
    marginBottom: 10,
    color: "#666",
  },
  dateButton: {
    backgroundColor: "#028090",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedDate: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
    color: "#444",
  },
  appointmentButton: {
    backgroundColor: "#02c39a",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  appointmentButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
