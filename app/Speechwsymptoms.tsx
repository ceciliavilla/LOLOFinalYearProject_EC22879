import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { Audio } from 'expo-av';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from '../firebaseConfig'; 
import styles from './styles/stylespeech';

const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";

interface Disease {
  id: string;
  name: string;
  symptoms: string[];
}

export default function SpeechScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [diseasesList, setDiseasesList] = useState<Disease[]>([]);
  const db = getFirestore(firebaseApp);
  

  // Load Diseases 
  useEffect(() => {
    const fetchDiseases = async () => {
      const querySnapshot = await getDocs(collection(db, "diseases_database"));
      const diseases: Disease[] = [];
      querySnapshot.forEach((doc) => {
        diseases.push({ ...(doc.data() as Disease), id: doc.id });
      });
      console.log('Diseases loaded:', diseases); 
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
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  // STOP RECORDING AND TRANSCRIBE
  async function stopRecording() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Audio saved at:', uri);
    if (uri){
      setRecording(null);
      await processAudio(uri);
    }
    
  }

  // UPLOAD AUDIO AND REQUEST TRANSCRIPTION FROM ASSEMBLYAI
  const processAudio = async (audioUri: string) => {
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

      console.log('Transcript:', transcribedText);
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
  function detectSymptoms(text : string): string[] {
    const detectedSymptoms: string[] = [];
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

    console.log('Detected symptoms:', detectedSymptoms);
    return [...new Set(detectedSymptoms)];
  }


  function findMostProbableDiseases(detectedSymptoms : string []): {name : string; matchedSymptoms : string[]} []{
    let maxMatched = 0;
    let bestMatches = [] as any[];

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

  {loading && <Text style={styles.transcriptText}>Transcribing...</Text>}

  {transcript && (
    <>
      <Text style={styles.transcriptText}>Transcript: {transcript}</Text>
      <Text style={styles.recommendationText}>Recommendation: {recommendation}</Text>
    </>
  )}
</View>
  );
}
