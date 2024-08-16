'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from '@/components/ui/background-beams';
export default function Home() {

  const [image, setImage] = useState(null);


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
    <div className="grid grid-cols-3 h-screen">
      <div className="flex flex-col h-screen items-center justify-center gap-2 col-span-1 z-50">
        <Button onClick={() => {executeCommand(`http://192.168.1.12/levelOne`) 
          setImage("Figure_1")} }>
          Level 1
        </Button>
        <Button onClick={() => {executeCommand(`http://192.168.1.12/levelOne`) 
          setImage("Figure_2")} }>
          Level 2
        </Button>
        <Button onClick={() => {executeCommand(`http://192.168.1.12/levelTwo`) 
          setImage("Figure_3")} }>
          Level 3
        </Button>
        <Button onClick={() => {executeCommand(`http://192.168.1.12/levelThree`) 
          setImage(null)} }>
          Stop System
        </Button>
     
      </div>

      <div className='col-span-2'>
        <div className='flex flex-col h-screen items-center justify-center z-50 '>
          <img src={`/${image}.png`} alt="hero" className="w-3/4 z-50" />
        </div>
      </div>
     <div className='z-10'>
      <BackgroundBeams/>
      </div>
    </div>
  );
}
