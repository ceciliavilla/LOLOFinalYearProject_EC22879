import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { query, orderBy } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";



const CheckPosts = () => {
  const { elderlyId } = useLocalSearchParams();
  const auth = getAuth();
  const realElderlyId = Array.isArray(elderlyId) ? elderlyId[0] : elderlyId || auth.currentUser?.uid;

  const [posts, setPosts] = useState<any[]>([]);
  const db = getFirestore(firebaseApp);
  
  const user = auth.currentUser;
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        if (!realElderlyId) return;
  
        try {
          const postsQuery = query(
            collection(db, `users/${realElderlyId}/healthcare_posts`),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(postsQuery);
  
          const results = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              message: data.message || "No message",
              Name: data.fromHealthcareName || "",
              LastName: data.fromHealthcareLastName || "",
              Role: data.fromHealthcareuserType || "Undefined Usertype",
              createdAt: data.createdAt?.toDate?.() || new Date(),
            };
          });
  
          setPosts(results);
        } catch (error) {
          console.error("Error loading posts:", error);
        }
      };
  
      fetchPosts();
    }, [realElderlyId])
  );
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Received Messages </Text>

      <TouchableOpacity
        style={styles.generalAppointmentButton}
        onPress={() => router.push("/BookAppointment")}
      >
        <Text style={styles.generalAppointmentButtonText}>Book an Appointment</Text>
      </TouchableOpacity>

      {posts.length === 0 ? (
        <Text style={styles.noData}>No messages received</Text>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <Text style={styles.date}>
            {post.createdAt.toLocaleString()}
            </Text>
            <Text style={styles.from}>{post.Name} {post.LastName}</Text>
            <Text style={styles.date}>{post.Role} </Text>
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
