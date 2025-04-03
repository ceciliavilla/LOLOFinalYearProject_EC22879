/*import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from '../firebaseConfig'; // Ajusta la ruta si hace falta

const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";

export default function SpeechScreen() {
  const [recording, setRecording] = useState(); 
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [diseasesList, setDiseasesList] = useState([]);
  const db = getFirestore(firebaseApp);

  // ✅ Load diseases and symptoms from Firestore on screen load
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "diseases_database"));
        if (querySnapshot.empty) {
          console.log("⚠️ No diseases found in 'diseases_database'. Check Firestore.");
        } else {
          const diseases = [];
          querySnapshot.forEach((doc) => {
            diseases.push({ id: doc.id, ...doc.data() });
          });
          console.log('✅ Diseases loaded:', JSON.stringify(diseases, null, 2));
          setDiseasesList(diseases);
        }
      } catch (error) {
        console.error("❌ Error fetching diseases:", error);
      }
    };
  
    fetchDiseases();
  }, []);
  

  // ✅ Start recording function
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }

  // ✅ Stop recording and start transcription
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('🎙️ Audio saved at:', uri);

    await uploadAndTranscribeAudio(uri);
  }

  // ✅ Upload audio to AssemblyAI and get transcription
  const uploadAndTranscribeAudio = async (audioUri) => {
    try {
      setLoading(true);
      const response = await fetch(audioUri);
      const audioBlob = await response.blob();

      const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: { 'authorization': ASSEMBLYAI_API_KEY },
        body: audioBlob
      });

      const { upload_url } = await uploadRes.json();

      const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: { 'authorization': ASSEMBLYAI_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ audio_url: upload_url, language_code: 'en' })
      });

      const { id } = await transcriptRes.json();

      let status = 'processing';
      let transcribedText = '';
      while (status === 'processing' || status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 4000));
        const polling = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: { 'authorization': ASSEMBLYAI_API_KEY }
        });
        const data = await polling.json();
        status = data.status;
        if (status === 'completed') transcribedText = data.text;
      }

      console.log('📝 Transcript:', transcribedText);
      setTranscript(transcribedText);

      // ✅ Detect symptoms and recommend diseases
      const detectedSymptoms = detectSymptoms(transcribedText);
      const matchedDiseases = findRelatedDiseases(detectedSymptoms);

      const recommendationText = matchedDiseases.length > 0
        ? matchedDiseases.map(d => `${d.name}: ${d.matchedSymptoms.join(', ')}`).join('\n')
        : "No disease detected. Please consult a doctor.";

      setRecommendation(recommendationText);

    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Detect symptoms based on Firestore data
  function detectSymptoms(text) {
    const detectedSymptoms = [];
    const normalizedText = text.toLowerCase();

    diseasesList.forEach(disease => {
      disease.symptoms.forEach(symptom => {
        const normalizedSymptom = symptom.toLowerCase().replace(/_/g, ' ');
        const regex = new RegExp(`\\b${normalizedSymptom}\\b`, 'i');
        if (regex.test(normalizedText)) {
          detectedSymptoms.push(symptom); // Keep original symptom
        }
      });
    });

    console.log('🔍 Detected symptoms:', detectedSymptoms);
    return [...new Set(detectedSymptoms)];
  }

  // ✅ Find diseases matching detected symptoms
  function findRelatedDiseases(detectedSymptoms) {
    const matchedDiseases = [];

    diseasesList.forEach(disease => {
      const matchingSymptoms = disease.symptoms.filter(symptom =>
        detectedSymptoms.includes(symptom)
      );
      if (matchingSymptoms.length > 0) {
        matchedDiseases.push({
          name: disease.name,
          matchedSymptoms: matchingSymptoms
        });
      }
    });

    console.log('💡 Matched diseases:', matchedDiseases);
    return matchedDiseases;
  }

  // ✅ Render component
  return (
    <View style={{ padding: 20 }}>
      <Button title={recording ? "Stop recording" : "Start recording"} onPress={recording ? stopRecording : startRecording} />
      {loading && <Text>Transcribing...</Text>}
      {transcript && (
        <>
          <Text style={{ marginTop: 10 }}>📝 Transcript: {transcript}</Text>
          <Text style={{ marginTop: 10 }}>💡 Recommendation: {recommendation}</Text>
        </>
      )}
    </View>
  );
}*/

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { Audio } from 'expo-av';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from '../firebaseConfig'; // Ajusta la ruta según sea necesario
import styles from './stylespeech.js';

const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";

export default function SpeechScreen() {
  const [recording, setRecording] = useState(); 
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [diseasesList, setDiseasesList] = useState([]);
  const db = getFirestore(firebaseApp);

  // Load Diseases 
  useEffect(() => {
    const fetchDiseases = async () => {
      const querySnapshot = await getDocs(collection(db, "diseases_database"));
      const diseases = [];
      querySnapshot.forEach((doc) => {
        diseases.push({ id: doc.id, ...doc.data() });
      });
      console.log('✅ Diseases loaded:', diseases); // Debug
      setDiseasesList(diseases);
    };

    fetchDiseases();
  }, []);

  // START RECORDING
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }

  // STOP RECORDING AND TRANSCRIBE
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('🎙️ Audio saved at:', uri);

    await uploadAndTranscribeAudio(uri);
  }

  // UPLOAD AUDIO AND REQUEST TRANSCRIPTION FROM ASSEMBLYAI
  const uploadAndTranscribeAudio = async (audioUri) => {
    try {
      setLoading(true);
      const response = await fetch(audioUri);
      const audioBlob = await response.blob();

      const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: { 'authorization': ASSEMBLYAI_API_KEY },
        body: audioBlob
      });

      const { upload_url } = await uploadRes.json();

      const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: { 'authorization': ASSEMBLYAI_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ audio_url: upload_url, language_code: 'en' })
      });

      const { id } = await transcriptRes.json();

      let status = 'processing';
      let transcribedText = '';
      while (status === 'processing' || status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 4000));
        const polling = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: { 'authorization': ASSEMBLYAI_API_KEY }
        });
        const data = await polling.json();
        status = data.status;
        if (status === 'completed') transcribedText = data.text;
      }

      console.log('📝 Transcript:', transcribedText);
      setTranscript(transcribedText);

      // DETECT SYMPTOMS AND CHECK WHICH ONE IS MORE PROBABLE
      const detectedSymptoms = detectSymptoms(transcribedText);
      const mostProbableDiseases = findMostProbableDiseases(detectedSymptoms);

    const recommendationText = mostProbableDiseases.length > 0
      ? `Your symptoms are matched with the following, consult the doctor :\n${mostProbableDiseases.map(d => `${d.name} (Matched Symptoms: ${d.matchedSymptoms.join(', ')})`).join('\n')}`
      : "No disease detected. Please consult a doctor.";

    setRecommendation(recommendationText);
    } catch (error) {
     console.error('Transcription error:', error);
    } finally {
      setLoading(false);
    }
    };


  // DETECT SYMPTOMS WITH FIREBASE
  function detectSymptoms(text) {
    const detectedSymptoms = [];
    const normalizedText = text.toLowerCase();

    diseasesList.forEach(disease => {
      disease.symptoms.forEach(symptom => {
        const normalizedSymptom = symptom.toLowerCase().replace(/_/g, ' ');
        const regex = new RegExp(`\\b${normalizedSymptom}\\b`, 'i');
        if (regex.test(normalizedText)) {
          detectedSymptoms.push(symptom); 
        }
      });
    });

    console.log('🔍 Detected symptoms:', detectedSymptoms);
    return [...new Set(detectedSymptoms)];
  }

  // ✅ Encontrar la enfermedad con más síntomas coincidentes
  /*function findMostProbableDisease(detectedSymptoms) {
    let bestMatch = null;
    let maxMatched = 0;

    diseasesList.forEach(disease => {
      const matchingSymptoms = disease.symptoms.filter(symptom =>
        detectedSymptoms.includes(symptom)
      );

      if (matchingSymptoms.length > maxMatched) {
        maxMatched = matchingSymptoms.length;
        bestMatch = {
          name: disease.name,
          matchedSymptoms: matchingSymptoms
        };
      }
    });

    console.log('💡 Most probable disease:', bestMatch);
    return bestMatch;
  }*/

  function findMostProbableDiseases(detectedSymptoms) {
    let maxMatched = 0;
    let bestMatches = [];

    diseasesList.forEach(disease => {
        const matchingSymptoms = disease.symptoms.filter(symptom =>
            detectedSymptoms.includes(symptom)
        );

        if (matchingSymptoms.length > maxMatched) {
            maxMatched = matchingSymptoms.length;
            bestMatches = [{ name: disease.name, matchedSymptoms: matchingSymptoms }];
        } else if (matchingSymptoms.length === maxMatched && maxMatched > 0) {
            bestMatches.push({ name: disease.name, matchedSymptoms: matchingSymptoms });
        }
    });

    console.log('Most probable diseases:', bestMatches);
    return bestMatches;
}


  return (
    <View style={styles.container}>
  <TouchableOpacity style={styles.button} onPress={recording ? stopRecording : startRecording}>
    <Text style={styles.buttonText}>
      {recording ? "STOP RECORDING" : "START RECORDING"}
    </Text>
  </TouchableOpacity>

  {loading && <Text style={styles.transcript}>Transcribing...</Text>}

  {transcript && (
    <>
      <Text style={styles.transcript}>Transcript: {transcript}</Text>
      <Text style={styles.recommendation}>Recommendation: {recommendation}</Text>
    </>
  )}
</View>
  );
}
