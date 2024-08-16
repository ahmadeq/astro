'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import AZ from '@/components/AZ';

export default function Home() {
  const [audioFile, setAudioFile] = useState(null);
  const [counter, setCounter] = useState(0);

  const playAudio = (fileName) => {
    setAudioFile(fileName);
    setCounter(counter + 1);
    if (typeof window !== 'undefined') { // Check if we're in the browser
      const audio = new Audio(`/audio/${fileName}.mp3`);
    }
  };

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
      });
  };

  return (
    <div className="overflow-x-hidden">
      <AZ audioFile={audioFile} counter={counter}/>
      
      <div className="button-container fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">        <Button onClick={() => {playAudio("sorry"); executeCommand(`http://192.168.1.12/on`);}}>
          Turn On Light
        </Button>
        <Button onClick={() => {playAudio("sorry"); executeCommand(`http://192.168.1.12/off`);}}>
          Turn Off Light
        </Button>
        <Button onClick={() => executeCommand(`http://192.168.1.12/levelOne`)}>
          Run Level 1
        </Button>
        <Button onClick={() => executeCommand(`http://192.168.1.12/levelTwo`)}>
          Run Level 2
        </Button>
        <Button onClick={() => executeCommand(`http://192.168.1.12/levelThree`)}>
          Run Level 3
        </Button>
        <Button onClick={() => executeCommand(`http://192.168.1.12/test`)}>
          Execute Test
        </Button>
        <Button onClick={() => executeCommand(`http://192.168.1.12/hello`)}>
          Say Hello
        </Button>
        <Button onClick={() => executeCommand(`http://192.168.1.12/stop`)}>
          Stop System
        </Button>
        <Button onClick={() => playAudio("audio1")}>
          Play Audio 1
        </Button>
        <Button onClick={() => playAudio("audio2")}>
          Play Audio 2
        </Button>
      </div>

      
    </div>
  );
}
