
/*const styles = StyleSheet.create({
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

export default styles;*/



import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#009D71',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'lightgreen',
    textAlign: 'center',
  },
  remindersContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  noRemindersText: {
    fontSize: 16,
    color: 'lightgrey',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  reminderItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  reminderText: {
    fontSize: 16,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardDone: {
    backgroundColor: 'lightgrey',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardTitleDone: {
    textDecorationLine: 'line-through',
    color: 'grey',
  },
  cardTime: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  doneButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffcccc',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;

