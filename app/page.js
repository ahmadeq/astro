'use client';
import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Home() {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(true);
  const [commandTimeout, setCommandTimeout] = useState(null);
  const [astroDetected, setAstroDetected] = useState(false);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.error("Browser doesn't support speech recognition.");
      return;
    }
    handleStart(); 
  }, []);

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
      if (transcript.toLowerCase().includes('turn on')) {
        // executeCommand('http://192.168.1.32/on');
        console.log('Turn on');
        setAstroDetected(false);
        clearTimeout(commandTimeout);
        resetTranscript();
      } else if (transcript.toLowerCase().includes('turn off')) {
        // executeCommand('http://192.168.1.32/off');
        console.log('Turn off');
        setAstroDetected(false);
        clearTimeout(commandTimeout);
        resetTranscript();
      } else if (transcript.toLowerCase().includes('say hello')) {
        // executeCommand('http://192.168.1.32/hello');
        console.log('hello world!');
        setAstroDetected(false);
        clearTimeout(commandTimeout);
        resetTranscript();
      } else if (transcript.toLowerCase().includes('run test')) {
        // executeCommand('http://192.168.1.32/all');
        console.log('running all levels');
        setAstroDetected(false);
        clearTimeout(commandTimeout);
        resetTranscript();
      } else if (transcript.toLowerCase().includes('level 1')) {
        // executeCommand('http://192.168.1.32/one');
        console.log('level  one');
        setAstroDetected(false);
        clearTimeout(commandTimeout);
        resetTranscript();
      } else if (transcript.toLowerCase().includes('level 2')) {
        // executeCommand('http://192.168.1.32/two');
        console.log('level two');
        setAstroDetected(false);
        clearTimeout(commandTimeout);
        resetTranscript();
      } else if (transcript.toLowerCase().includes('level 3')) {
        // executeCommand('http://192.168.1.32/three');
        console.log('level three');
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a192f] text-[#ccd6f6]">
      <div className="max-w-md w-full space-y-4">
        <div className="flex justify-between">
          <Button 
            className="bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 border-[#64ffda]" 
            onClick={handleStart}
            disabled={isListening}
          >
            Start
          </Button>
          <Button 
            className="bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 border-[#64ffda]" 
            onClick={handleStop}
            disabled={!isListening}
          >
            Stop
          </Button>
          <Button 
            className="bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 border-[#64ffda]" 
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
        <Textarea
          className="h-48 p-4 bg-[#112240] text-[#ccd6f6] rounded-md border border-[#64ffda] focus:border-[#64ffda] focus:ring-1 focus:ring-[#64ffda]"
          placeholder="Transcribed text will appear here..."
          value={transcript}
          readOnly
        />
      </div>
    </div>
  );
}