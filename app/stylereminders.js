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
});

export default styles;