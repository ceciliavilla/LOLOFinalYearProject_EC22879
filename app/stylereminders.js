import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "90%",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 20,
        fontSize: 16,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: "90%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginTop: 10,
    },
});

export default styles;