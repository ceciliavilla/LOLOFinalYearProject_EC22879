import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#009D71",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "lightgreen",
  },
  generalAppointmentButton: {
    backgroundColor: "lightblue",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  generalAppointmentButtonText: {
    color: "darkblue",
    fontSize: 18,
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "lightgrey",
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
    fontStyle: "italic",
  },
  from: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});
export default styles;