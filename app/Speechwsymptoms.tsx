/*import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { Audio } from 'expo-av';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from '../firebaseConfig'; 
import styles from './styles/stylespeech';


interface Disease {
  id: string;
  name: string;
  symptoms: string[];
}

interface DiseaseMatch {
  name: string;
  matchedSymptoms: string[];
}

export default function SpeechScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [diseasesList, setDiseasesList] = useState<Disease[]>([]);
  
  const db = getFirestore(firebaseApp);
  const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";
  

  // Load Diseases 
  useEffect(() => {
    const loadDiseases = async () => {
    
        const snapshot = await getDocs(collection(db, "diseases_database"));
        const diseases: Disease[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const disease: Disease = {
            id: doc.id,
            name: data.name,
            symptoms: data.symptoms,
          };
          diseases.push(disease);
        });
  
        setDiseasesList(diseases);
     
    };
  
    loadDiseases();
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
  /*async function stopRecording() {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Audio saved at:', uri);
    if (uri){
      setRecording(null);
      await processAudio(uri);
    }
    
  }*
    const stopRecording = async () => {
      if (!recording) return;
  
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) await processAudio(uri);
    };


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
    let bestMatches : DiseaseMatch[] = [];

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
}*/

/*import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseApp } from '../firebaseConfig'; 
import styles from './styles/stylespeech';
import { useEffect, useState } from 'react';

interface Disease {
  id: string;
  name: string;
  symptoms: string[];
}

interface DiseaseMatch {
  name: string;
  matchedSymptoms: string[];
}

export default function SpeechScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [diseasesList, setDiseasesList] = useState<Disease[]>([]);

  const db = getFirestore(firebaseApp);
  const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";

  useEffect(() => {
    const loadDiseases = async () => {
      const snapshot = await getDocs(collection(db, "diseases_database"));
      const diseases: Disease[] = [];
      snapshot.forEach((doc) => {
        diseases.push({ ...(doc.data() as Disease), id: doc.id });
      });
      setDiseasesList(diseases);
    };

    loadDiseases();
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
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
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    if (uri) {
      await processAudio(uri);
    }
  };

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

      setTranscript(transcribedText);
      const detectedSymptoms = detectSymptoms(transcribedText);

      const severityPromises = detectedSymptoms.map(async (symptom) => {
        try {
          const docRef = doc(db, 'classified_symptoms', symptom.toLowerCase());
          const snapshot = await getDoc(docRef);
          return snapshot.exists() ? snapshot.data().severity : 'moderate';
        } catch (err) {
          console.error('Error fetching severity for:', symptom, err);
          return 'moderate';
        }
      });

      const severityLevels = await Promise.all(severityPromises);
      const numHigh = severityLevels.filter(s => s === 'high').length;
      const numLow = severityLevels.filter(s => s === 'mild').length;
      const numModerate = severityLevels.filter(s => s === 'moderate').length;

      const mostProbableDiseases = findMostProbableDiseases(detectedSymptoms);
      const elderlyId = 'elderly123'; // Replace with actual logged user ID

      if (numHigh > 0) {
        await addDoc(collection(db, `users/${elderlyId}/symptoms_detected`), {
          transcript: transcribedText,
          symptoms: detectedSymptoms,
          severity: severityLevels,
          diseases: mostProbableDiseases.map(d => d.name),
          createdAt: serverTimestamp()
        });

        setRecommendation("Some symptoms appear critical. Your data has been sent to your healthcare provider.");
      } else if (numLow >= (numModerate + numHigh)) {
        const recommendationText =
  mostProbableDiseases.length > 0
    ? `Your symptoms are matched with the following, consult the doctor:\n${mostProbableDiseases
        .map(d =>
          `${d.name} (Matched Symptoms: ${d.matchedSymptoms.join(', ')})`
        )
        .join('\n')}`
    : "No disease detected. Please consult a doctor.";

setRecommendation(recommendationText);

      } else {
        setRecommendation("Your symptoms will be reviewed by a healthcare provider.");
      }
    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setLoading(false);
    }
  };

  function detectSymptoms(text: string): string[] {
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

    return [...new Set(detectedSymptoms)];
  }

  function findMostProbableDiseases(detectedSymptoms: string[]): DiseaseMatch[] {
    let maxMatched = 0;
    let result: DiseaseMatch[] = [];
  
    diseasesList.forEach(disease => {
      const matchingSymptoms = disease.symptoms.filter(symptom =>
        detectedSymptoms.includes(symptom)
      );
  
      if (matchingSymptoms.length > maxMatched) {
        maxMatched = matchingSymptoms.length;
        result = [{
          name: disease.name,
          matchedSymptoms: matchingSymptoms
        }];
      } else if (matchingSymptoms.length === maxMatched && maxMatched > 0) {
        result.push({
          name: disease.name,
          matchedSymptoms: matchingSymptoms
        });
      }
    });
  
    return result;
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
}*/
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../firebaseConfig'; 
import styles from './styles/stylespeech';

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
  const [severityMap, setSeverityMap] = useState<Record<string, string>>({});

  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";
  console.log("USER ID:", userId);

  const SYMPTOM_KEYWORDS: Record<string, string[]> = {
    fatigue: ['tired', 'exhausted', 'low energy'],
    dizziness: ['dizzy', 'off balance'],
    belly_pain: ['stomach hurts', 'belly pain', 'my tummy hurts', 'pain in my stomach', 'belly hurts'],
    headache: ['head hurts', 'pressure in my head'],
    nausea: ['feel sick'],
    vomiting: ['threw up', 'vomited', 'i was sick', 'cannot keep food down'],
    joint_pain: ['my knees hurt', 'pain in my joints', 'my bones hurt'],
    breathlessness: ['hard to breathe', 'short of breath', 'cannot catch my breath', 'breathing is difficult'],
    cough: ['coughing', 'have a cough', ' stop coughing', 'dry cough', 'wet cough'],
    diarrhoea: ['going to bathroom a lot'],
    high_fever: ['high temperature', 'burning up', 'very hot', 'strong fever'],
    mild_fever: ['slightly warm', 'a bit of a temperature', 'low fever'],
    chest_pain: ['tight chest', 'pressure in chest', 'pain in chest', 'chest hurts'],
    loss_of_balance: ['keep falling', 'cannot keep balance', 'unstable when walking'],
    blurred_and_distorted_vision: ['vision is blurry', 'cannot see clearly', 'fuzzy vision'],
    itching: ['skin is itchy', 'feeling itchy'],
    depression: ['i feel down', 'sad all the time', 'no motivation'],
    anxiety: ['nervous','anxious','feel anxious', 'panic attacks', 'feel panicky'],
    irritability: ['annoyed easily'],
    pus_filled_pimples: ['pimples with pus','pimples'],
    continuous_sneezing:['sneezing', 'sneez'],
    watering_from_eyes:['eyes watering'],
  };


  //Load Diseases from Database
  useEffect(() => {
    const loadDiseases = async () => {
      const snapshot = await getDocs(collection(db, "diseases_database"));
      const diseases: Disease[] = [];
      snapshot.forEach((doc) => {
        diseases.push({ ...(doc.data() as Disease), id: doc.id });
      });
      setDiseasesList(diseases);
    };
    loadDiseases();
  }, []);

  // Start Recording
  const startRecording = async () => {
    try {
      setTranscript('');
      setSeverityMap({});
      setRecommendation('');
      const permission = await Audio.requestPermissionsAsync(); // Ask for permision
      if (permission.status === "granted") { // Check if permission is granted 
        await Audio.setAudioModeAsync({ // Set Configuration to record on IOS
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY); // Start Recording and save it in record variable
        setRecording(recording); // Update State to indicate there is an active recording
      }
    } catch (error) {
      console.error('Error starting recording:', error); // If there is an error this message appears
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recording) return; // If there is non active recording, return
    await recording.stopAndUnloadAsync(); // Stop Recording
    const uri = recording.getURI(); // Get audio archive 
    setRecording(null); // Set State to Null since there is non active recording
    if (uri) await processAudio(uri); // If audio archive obtained, process audio
  };

  // Process de Audio trasncripting it
  const processAudio = async (audioUri: string) => { 
    try {
      setLoading(true); // Activate Loading to show "Transcribing" on the screen
      const response = await fetch(audioUri); // Download audioUri
      const audioData = await response.blob(); // Change the format of the archive

      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', { //Upload Audio to Assembly
        method: 'POST',
        headers: { 'authorization': ASSEMBLYAI_API_KEY },
        body: audioData
      });
      
      const { upload_url } = await uploadResponse.json(); // Returns specific URL for the audio

      const transcription = await fetch('https://api.assemblyai.com/v2/transcript', { // Ask Assembly to Transcript the audio
        method: 'POST',
        headers: {
          'authorization': ASSEMBLYAI_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ audio_url: upload_url, language_code: 'en' })
      });

      const { id } = await transcription.json(); // ID of the audio to follow the process and wait 

      let status = 'processing'; // Create a variable with status "processing"
      let transcribedText = ''; // Empty Text, once we receive the transcription it will be filled
      while (status === 'processing' || status === 'queued') { // The process is repeated with the status are processing or queued
        await new Promise(resolve => setTimeout(resolve, 4000)); // Checks the status every 4 seconds
        const checkTranscript = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: { 'authorization': ASSEMBLYAI_API_KEY }
        });
        const transcriptData = await checkTranscript.json();
        status = transcriptData.status; // If the transcript is "completed" it finish the loop otherwise it waits 4 more seconds
        if (status === 'completed') transcribedText = transcriptData.text; // Store the transcribedText in the variable when it "completed"
      }

      setTranscript(transcribedText); 

      // Detected Symptoms 
      const detectedSymptoms = detectSymptoms(transcribedText); //Use detectSymptoms function 
      if (detectedSymptoms.length < 2) { // At least 2 sympstoms need to be tracked to give a recommendation
        setRecommendation("At least 2 symptoms are required to give a possible recommendation.");
        return;
      }
      
      // Symptoms classification
      const symptomSeverities: Record<string, string> = {}; // Object is created to get the severity of every symptom detected 
      await Promise.all(detectedSymptoms.map(async (symptom) => { // Gets all severity symptoms and once is done it continuous
        const docRef = doc(db, 'severity_symptoms', symptom.toLowerCase()); // Checks in Firebase the symptoms in the collection
        const snap = await getDoc(docRef);
        symptomSeverities[symptom] = snap.exists() ? snap.data().severity : ''; //If the document exists, severity is stored, otherwise "" is the value
      }));
      setSeverityMap({ ...symptomSeverities }); // Copies the object into severitymap


      // All the symptoms are stored in the voice_detected_symptoms collection
      console.log("Saving tracked symptoms to Firestore...");
      await addDoc(collection(db, `users/${userId}/trackedsymptoms`), { // All symptoms tracked are stored in a collection
        transcript: transcribedText,
        symptoms: detectedSymptoms,
        severity: symptomSeverities,
        type: "voice",
        createdAt: serverTimestamp(),
        userEmail: auth.currentUser?.email || "unknown"
      });
      
      // Check is any tracked symptom is classifies as "high"
      const HighSymptom = Object.values(symptomSeverities).includes("high");
      
      const allDiseases = await Promise.all(diseasesList.map(async (disease) => { //Analise each diseases to check how it matches with the tracked symptoms
        const matched = disease.symptoms.filter(sym => detectedSymptoms.includes(sym)); // matched symptoms between the diseases and tracked ones. 
        const hasHighInDefinition = await Promise.all( // Check if this disease includes any symptom classified as "high" severity
          disease.symptoms.map(async (sym) => {
            const ref = doc(db, 'severity_symptoms', sym.toLowerCase());
            const snap = await getDoc(ref);
            return snap.exists() ? snap.data().severity === 'high' : false;
          })
        ).then(results => results.includes(true));
      
        return {
          name: disease.name,
          matchedSymptoms: matched,
          matchScore: matched.length,
          hasHighInDefinition
        };
      }));
      
      const maxScore = Math.max(...allDiseases.map(d => d.matchScore)); // Calculate the diseases with max coindicence symptoms with the ones detected
      const bestMatches = allDiseases.filter(d => d.matchScore === maxScore && d.matchScore >= 2); //Gets the diseases with the most matched symptoms (at least 2)
      if (bestMatches.length === 0) {
        setRecommendation("No matching condition found. Please consult a healthcare professional.");
        return;
      }      
      const safeMatches = bestMatches.filter(disease => !disease.hasHighInDefinition); // It stores the bestMatches that have non high symptoms

      // The user tracked a "high" symptom nothing is recommender
      if (Object.values(symptomSeverities).includes("high") && userId) {
      await addDoc(collection(db, `users/${userId}/symptoms_detected`), { 
        transcript: transcribedText,
        symptoms: detectedSymptoms,
        severity: symptomSeverities,
        flaggedDisease: [], // aquí no se recomienda ninguna enfermedad
        createdAt: serverTimestamp()
      });

      setRecommendation("For Safety Reasons Your symptoms have been forwarded to a healthcare provider.");
      return;
    }

      //All coincident diseases have an "high" symptom in their description
      const allCandidatesAreDangerous = bestMatches.every(disease => disease.hasHighInDefinition);

      if (allCandidatesAreDangerous && userId) {
      await addDoc(collection(db, `users/${userId}/symptoms_detected`), {
        transcript: transcribedText,
        symptoms: detectedSymptoms,
        severity: symptomSeverities,
        flaggedDisease: bestMatches.map(d => d.name),
        createdAt: serverTimestamp()
      });

      setRecommendation("Healthcare profile has been notified due to safety reasons");
      return;
    }

    // If there is safety coindident diseases, they are shown as recommendations
      if (safeMatches.length > 0) {
      const possibleRecommendation = safeMatches.map(d => ` · ${d.name} \n\n(Matched: ${d.matchedSymptoms.join(', ')})`
      ).join('\n');

      setRecommendation(`Your symptoms may match with:\n${possibleRecommendation}\n\nPlease consult a healthcare profesional to confirm.`);
      return;
    }

    // If there is non coincidences
    setRecommendation("No matching condition found. Please consult a healthcare professional.");

    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setLoading(false);
    }
  };

    // Detects Symptoms
    function detectSymptoms(text: string): string[] {
    const detectedSymptoms: string[] = []; // Creating an empty array to same the tracked symptoms
    const normalizedText = text.toLowerCase().replace(/[.,!?]/g, ''); // Converts the text to lowercase and cleans the text
  
    // Detect symptoms and phrases defined in the dictionary 
    for (const [symptom, phrases] of Object.entries(SYMPTOM_KEYWORDS)) {
      for (const phrase of phrases) {
        if (normalizedText.includes(phrase)) { // If there is a coincidence...
          detectedSymptoms.push(symptom); // Add symptom to the detectdSymptom arrays 
          break;
        }
      }
    }
  
    // Detect exact coincidences with the symptoms of the databases 
    diseasesList.forEach(disease => {
      disease.symptoms.forEach(symptom => {
        const regularexpression = new RegExp(`\\b${symptom.replace(/_/g, ' ')}\\b`, 'i');
        if (regularexpression.test(normalizedText)) { //Checks if the text contains symptoms
          detectedSymptoms.push(symptom);
        }
      });
    });
  
    return [...new Set(detectedSymptoms)]; //New set deletes duplicates 
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: recording ? 'red' : 'lightgreen' }]}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "STOP RECORDING" : "START RECORDING"}
        </Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loadingText}>Transcribing...</Text>}

      {transcript && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptText}>Transcript: {transcript}</Text>
        </View>
      )}

      {transcript && Object.keys(severityMap).length > 0 && (
        <View style={{ marginTop: 15, width: '90%' }}>
          <Text style={styles.symptomsText}>Detected symptoms:</Text>
          {Object.entries(severityMap)
            .filter(([_, severity]) => severity !== 'high')
            .map(([symptom, severity]) => {
            let color = 'green';
            if (severity === 'high') color = '#E74C3C';
            else if (severity === '' || severity === 'medium') color = 'orange';

            return (
              <View
                key={symptom}
                style={{
                  backgroundColor: color,
                  padding: 12,
                  borderRadius: 10,
                  marginTop: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                  {symptom.replace(/_/g, ' ')} 
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {recommendation && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationText}>{recommendation}</Text>
        </View>
      )}
    </ScrollView>
  );
}