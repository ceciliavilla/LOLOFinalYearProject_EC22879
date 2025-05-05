import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { query, orderBy } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import styles from "./styles/stylesposts";



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
      const loadPosts = async () => {
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
  
      loadPosts();
    }, [realElderlyId])
  );
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Received Messages </Text>

      <TouchableOpacity
        style={styles.generalAppointmentButton}
        onPress={() => router.push({ pathname: "/BookAppointment", params: { elderlyId: realElderlyId } })}
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

