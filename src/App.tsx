import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, Volume2, Timer, Coffee, Cloud, Waves } from 'lucide-react';

type TimerMode = 'focus' | 'break';
type Sound = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

const SOUNDS: Sound[] = [
  {
    name: 'Rain',
    url: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    icon: <Cloud className="w-5 h-5" />
  },
  {
    name: 'Cafe',
    url: 'https://assets.mixkit.co/active_storage/sfx/2514/2514-preview.mp3',
    icon: <Coffee className="w-5 h-5" />
  },
  {
    name: 'Waves',
    url: 'https://assets.mixkit.co/active_storage/sfx/2516/2516-preview.mp3',
    icon: <Waves className="w-5 h-5" />
  }
];

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  }, [mode]);

  const switchMode = () => {
    setMode(mode === 'focus' ? 'break' : 'focus');
    resetTimer();
  };

  const playSound = (sound: Sound) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(sound.url);
    newAudio.loop = true;
    newAudio.volume = volume;
    newAudio.play();
    setAudio(newAudio);
    setSelectedSound(sound);
  };

  const stopSound = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setSelectedSound(null);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Focus Timer</h1>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setMode('focus')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                mode === 'focus'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setMode('break')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                mode === 'break'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Break
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-800 font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={toggleTimer}
            className="bg-indigo-500 text-white p-4 rounded-full hover:bg-indigo-600 transition-colors"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={resetTimer}
            className="bg-gray-200 text-gray-600 p-4 rounded-full hover:bg-gray-300 transition-colors"
          >
            <Timer className="w-6 h-6" />
          </button>
          <button
            onClick={switchMode}
            className="bg-gray-200 text-gray-600 p-4 rounded-full hover:bg-gray-300 transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Background Sounds</h2>
          <div className="grid grid-cols-3 gap-2">
            {SOUNDS.map((sound) => (
              <button
                key={sound.name}
                onClick={() => selectedSound?.name === sound.name ? stopSound() : playSound(sound)}
                className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedSound?.name === sound.name
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {sound.icon}
                <span className="text-sm">{sound.name}</span>
              </button>
            ))}
          </div>
          
          {selectedSound && (
            <div className="flex items-center gap-3 mt-4">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;