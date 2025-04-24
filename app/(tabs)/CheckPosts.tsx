import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebaseConfig";
import moment from "moment";
import { useRouter } from "expo-router";

const CheckPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      try {
        const snapshot = await getDocs(collection(db, `users/${user.uid}/healthcare_posts`));
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(results);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📩 Messages from your Healthcare Provider</Text>

      {/* ✅ Botón general para pedir cita */}
      <TouchableOpacity
        style={styles.generalAppointmentButton}
        onPress={() => router.push("/BookAppointment")}
      >
        <Text style={styles.generalAppointmentButtonText}>Book an Appointment</Text>
      </TouchableOpacity>

      {posts.length === 0 ? (
        <Text style={styles.noData}>No messages received yet.</Text>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <Text style={styles.date}>
              {post.createdAt?.toDate
                ? moment(post.createdAt.toDate()).format("LLL")
                : "Unknown Date"}
            </Text>
            <Text style={styles.from}>👨‍⚕️ {post.fromHealthcareName || "Healthcare"}</Text>
            <Text style={styles.message}>{post.message}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default CheckPosts;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#e0f7f7",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#00796b",
  },
  generalAppointmentButton: {
    backgroundColor: "#00b3b3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  generalAppointmentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#00bfa5",
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
