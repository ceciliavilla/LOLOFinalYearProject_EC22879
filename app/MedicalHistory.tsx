import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import moment from "moment";
import styles from "./styles/stylessymptoms";

const TrackedSymptoms = () => {
  const { elderlyId } = useLocalSearchParams();
  const [symptomLogs, setSymptomLogs] = useState<any[]>([]);
  const db = getFirestore(firebaseApp);
  const [elderlyName, setElderlyName] = useState("");

  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        const snapshot = await getDocs(collection(db, `users/${elderlyId}/trackedsymptoms`));
        const logs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSymptomLogs(logs);
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      }
    };

    if (elderlyId) {
      loadSymptoms();
    }
  }, [elderlyId]);

  const fetchElderlyName = async () => {
    try {
      const userDocRef = collection(db, "users");
      const userDoc = await getDocs(userDocRef);
      const user = userDoc.docs.find(doc => doc.id === elderlyId);
      if (user) {
        const data = user.data();
        setElderlyName(data.name || "Unknown");
      }
    } catch (error) {
      console.error("Error fetching elderly name:", error);
    }
  };
  
 
      fetchElderlyName();

  

  

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
        
<Text style={styles.title}>Symptoms Detected for {elderlyName}</Text>
<TouchableOpacity
  style={styles.button}
  onPress={() => router.push({ pathname: "/HealthcarePosts", params: { elderlyId } })}
>
  <Text style={styles.buttonText}>📩 Send a message to this patient</Text>
</TouchableOpacity>
{symptomLogs.length === 0 ? (
        <Text style={styles.noData}>No symptoms detected yet.</Text>
      ) : (
        symptomLogs.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <Text style={styles.date}>
              {entry.createdAt?.toDate
                ? moment(entry.createdAt.toDate()).format("LLL")
                : "Unknown Date"}
            </Text>
            
            {entry.flaggedDisease?.length > 0 && (
              <>
                <Text style={styles.subtitle}>Possible Diseases:</Text>
                {entry.flaggedDisease.map((d: string) => (
                  <Text key={d} style={styles.disease}> {d}</Text>
                ))}
              </>
            )}
            <Text style={styles.subtitle}>Symptoms:</Text>
            {entry.symptoms?.map((s: string) => (
              <Text key={s} style={styles.symptom}>
                - {s} ({entry.severity[s]})
              </Text>       
            ))}
          </View>
        ))
      )}
   

    </ScrollView>
    
  );
};

export default TrackedSymptoms; 
