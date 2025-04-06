import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#009D71",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "lightgreen",
  },
  remindersContainer: {
    marginTop: 20,
  },
  reminderItem: {
    marginVertical: 5,
  },
  noRemindersText: {
    color: "lightgrey", 
    fontStyle: "italic",
  },
  reminderText: {
    color: "white",
  }  
});

export default styles;