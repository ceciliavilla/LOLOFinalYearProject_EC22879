import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';

// Connection with Assembly (KEY)
const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";

export default function SpeechScreen() {
  const [recording, setRecording] = useState(); 
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');

  // START RECORDING
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync(); // Ask the user to use the microphone 
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
    console.log('Audio saved at:', uri);

    await uploadAndTranscribeAudio(uri);
  }

  // UPLOAD AUDIO AND REQUEST TRANSCRIPTION FROM ASSEMBLYAI
  const uploadAndTranscribeAudio = async (audioUri) => {
    try {
      setLoading(true);

      const response = await fetch(audioUri);
      const audioBlob = await response.blob();

      // Upload audio to AssemblyAI
      const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'authorization': ASSEMBLYAI_API_KEY,
        },
        body: audioBlob
      });

      const { upload_url } = await uploadRes.json();

      // 2️⃣ Request transcription
      const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'authorization': ASSEMBLYAI_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_code: 'en' // English
        })
      });

      const { id } = await transcriptRes.json();

      // Poll until transcription is completed
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

      //Detect symptoms and give recommendation
      const detectedSymptoms = detectSymptoms(transcribedText);
      const finalRecommendation = giveRecommendation(detectedSymptoms);
      setRecommendation(finalRecommendation);

    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setLoading(false);
    }
  };

  // DETECT SYMPTOMS FROM TRANSCRIPTED TEXT
  function detectSymptoms(text) {
    const detectedSymptoms = [];
    const possibleSymptoms = ['leg', 'head', 'fever', 'cough', 'pain', 'dizziness'];

    possibleSymptoms.forEach(symptom => {
      if (text.toLowerCase().includes(symptom)) {
        detectedSymptoms.push(symptom);
      }
    });

    return detectedSymptoms;
  }

  // GIVE A RECOMMENDATION BASED ON DETECTED SYMPTOMS
  function giveRecommendation(symptoms) {
    if (symptoms.includes('head') && symptoms.includes('fever')) {
      return "You might have the flu. Rest and see a doctor if needed.";
    } else if (symptoms.includes('leg')) {
      return "It might be a muscle pain. Rest and consult a doctor if it continues.";
    } else {
      return "Please consult a healthcare professional for a proper diagnosis.";
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Button title={recording ? "Stop recording" : "Start recording"} onPress={recording ? stopRecording : startRecording} />
      {loading && <Text>Transcribing...</Text>}
      {transcript ? (
        <>
          <Text>Transcript: {transcript}</Text>
          <Text>Detected symptoms: {detectSymptoms(transcript).join(', ')}</Text>
          <Text>Recommendation: {recommendation}</Text>
        </>
      ) : null}
    </View>
  );
}
