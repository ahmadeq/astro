'use client';
import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AZ from '@/components/AZ';

export default function Home() {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(true);
  const [commandTimeout, setCommandTimeout] = useState(null);
  const [astroDetected, setAstroDetected] = useState(false);
  const [command , setCommand] = useState("");
  const [enable, setEnable] = useState(true);
  const [audioFile, setAudioFile] = useState(null);
  const [counter , setCounter] = useState(0); 

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.error("Browser doesn't support speech recognition.");
      return;
    }
    handleStart(); 
  }, []);

  // Function to extract the action and subject from the transcript
  const extractCommand = (text) => {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    const actions = ['run', 'start', 'turn on', 'turn off', 'say', 'execute' , 'stop', 'play'];
    const subjects = ['level 1', 'level two', 'level three', 'the light', 'test' , "hello", "audio1", "audio2"];

    let detectedAction = null;
    let detectedSubject = null;

    // Find the action
    for (const action of actions) {
      if (lowerText.includes(action)) {
        detectedAction = action;
        break;
      }
    }

    // Find the subject
    for (const subject of subjects) {
      if (lowerText.includes(subject)) {
        detectedSubject = subject;
        break;
      }
    }

    return { action: detectedAction, subject: detectedSubject };
  };

  const playAudio = (fileName) => {
    setAudioFile(fileName);
    setCounter(counter + 1);
    if (typeof window !== 'undefined') { // Check if we're in the browser
      const audio = new Audio(`/audio/${fileName}.mp3`);
      // audio.play().catch(error => {
      //   console.error('Error playing audio:', error);
      // });
  
      // Analyze the audio file
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
  
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
  
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
      audio.addEventListener('play', () => {
        const analyzeAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const averageFrequency = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          // setTranscript(`Average Frequency: ${averageFrequency}`);
          requestAnimationFrame(analyzeAudio);
        };
        analyzeAudio();
      });
    }
  };
  


  useEffect(() => {
    if (transcript.toLowerCase().includes('astro') && !astroDetected) {
      setAstroDetected(true);

      if (commandTimeout) {
        clearTimeout(commandTimeout);
      }

      setCommandTimeout(setTimeout(() => {
        console.log("I didn't understand the command.");
        setAstroDetected(false);
        resetTranscript();
      }, 3000));
    
      
    } else if (astroDetected) {
      const { action, subject } = extractCommand(transcript);
      console.log(transcript)
      if (action && subject) {
        console.log(`Action: ${action}, Subject: ${subject}`); // Print the action and subject to the console
        
        // Uncomment the appropriate line below to execute the command
        setCommand(action + " " + subject)
        console.log(command)
        if (command === 'turn on the light') {
          playAudio("sorry");
          executeCommand(`http://192.168.1.12/on`);
        } else if (command === 'turn off the light') {
          playAudio("sorry");
          executeCommand(`http://192.168.1.12/off`);
        } else if (command === 'run level 1' || command === 'start level one') {
          executeCommand(`http://192.168.1.12/levelOne`);
        } else if (command === 'run level two' || command === 'start level two') {
          executeCommand(`http://192.168.1.12/levelTwo`);
        } else if (command === 'run level three' || command === 'start level three') {
          executeCommand(`http://192.168.1.12/levelThree`);
        } else if (command === 'execute test' || command === 'run test') {
          executeCommand(`http://192.168.1.12/test`);
        } else if (command === 'say hello') {
          executeCommand(`http://192.168.1.12/hello`);
        } else if (command === 'stop') {
          executeCommand(`http://192.168.1.12/stop`);
        } else if (command.startsWith('play')) {
          const audioFile = command.split(' ')[1];
          playAudio(audioFile);
        }

        setAstroDetected(false);
        clearTimeout(commandTimeout);
        resetTranscript();
      }
    }
  }, [transcript, resetTranscript, astroDetected, commandTimeout]);

  const executeCommand = (url) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          console.error('Fetch failed:', response.statusText);
          return null;
        }
        return response.text();
      })
      .then(data => {
        if (data !== null) {
          console.log(data);
        }
      })
      .catch(error => {
        console.error('Error caught:', error);
      })
      .finally(() => {
        resetTranscript();
        if (commandTimeout) {
          clearTimeout(commandTimeout);
        }
      });
  };

  const handleStart = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true })
      .catch((error) => {
        console.error("Error starting speech recognition:", error);
      });
  };

  const handleStop = () => {
    setIsListening(false);
    SpeechRecognition.stopListening()
      .catch((error) => {
        console.error("Error stopping speech recognition:", error);
      });
  };

  const handleReset = () => {
    resetTranscript();
  };

  const enableAudio = () => {
    const silentAudio = new Audio('/audio/sorry.mp3'); 
    silentAudio.play().then(() => {
      setAudioEnabled(true);
      console.log('Audio enabled by user interaction.');
    }).catch(error => {
      console.error('Error enabling audio:', error);
    });
    setEnable(false);
  };

  

  return (
    <div className="overflow-x-hidden">
      
          {enable &&  <Button 
            className="fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2" 
            onClick={enableAudio}
          >
            Enable Audio
          </Button>}
        
      <AZ audioFile={audioFile} counter={counter}/>
    </div>
  );
}