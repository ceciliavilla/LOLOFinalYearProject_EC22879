
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Audio } from "expo-av";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getApp } from "firebase/app";

const storage = getStorage(getApp()); 
const ASSEMBLYAI_API_KEY = "3f48dff71e3b4d239fc526e04a1d9564";

export default function Speech () {
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);

    async function startRecording (){
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status == "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
            const {recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            setRecording(recording); 
            }
        } catch (err) {}
    }
    async function stopRecording (){
        setRecording (undefined);

        await recording.stopAndUnloadAsync ();
        let allRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        allRecordings.push ({
            sound : sound, 
            duration : getDurationFormatted(status.durationMillis),
            file : recording.getURI()
        });

        setRecordings (allRecordings);
        await uploadAudioToFirebase(recording.getURI(), `audio-${Date.now()}.wav`);

    }
    const uploadAudioToFirebase = async (uri, fileName) => {
        try {
          const response = await fetch(uri);
          const blob = await response.blob(); // Convertir URI a blob
          const storageRef = ref(storage, `audios/${fileName}`); // Ruta en Storage
    
          await uploadBytes(storageRef, blob);
          console.log("Audio subido correctamente:", fileName);
        } catch (error) {
          console.error("Error subiendo el audio:", error);
        }
      };
    function getDurationFormatted(milliseconds) {
        const minutes = milliseconds / 1000 / 60; 
        const seconds = Math.round (minutes - Math.floor (minutes)) * 60;
        return seconds > 10 ? `${Math.floor(minutes)}:0 ${seconds}` : `${Math.floor(minutes)}: ${seconds}`
    }

    function getRecordingLines(){
        return recordings.map((recordingLine, index) => {
            return (
                <View key={index} style= {styles.row}>
                    <Text style ={styles.fill}>
                        Recording #{index +1}|{recordingLine.duration}
                    </Text>
                    <Button onPress={()=> recordingLine.sound.replayAsync()} title = "Play"></Button>
                </View>
            )
        });
    }
    function clearRecordings(){
        setRecordings([])
    }
    
    return (
        <View style={styles.container}>
          <Button title = { recording ? 'Stop Recording' : 'Start Recording' } onPress={recording ? stopRecording : startRecording } />
          {getRecordingLines()}
          <Button title={recordings.length > 0 ? 'Clear Recordings' : ''} onPress={clearRecordings} />
        </View>
      );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'blue',
        alignItems: 'center',
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        marginLeft: 10, 
        marginRight: 40,
    },
    fill:{
        flex: 1, 
        margin: 15,
    }
});