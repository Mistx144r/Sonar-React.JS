import { createContext, useState, useContext, useRef, useEffect } from "react";
import { Howl } from "howler";
import { toast } from "react-toastify";

const PlayerContext = createContext();
const ws = new WebSocket("ws://localhost:4000");

export function PlayerProvider({ children }) {
  const [currentMusic, setCurrentMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicTime, setMusicTime] = useState(0);
  const [lastGreatVolume, setLastGreatVolume] = useState(0.25);
  const [volume, setVolume] = useState(0.25);
  const [isMuted, setMuted] = useState(false);
  const [currentMusicTime, setCurrentMusicTime] = useState(0);

  const [isSideBarOpen, setSideBar] = useState(false);
  const [isLyricsOpen, setLyricsOpen] = useState(false);

  const howlRef = useRef(null);
  const intervalRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isLooped = useRef(false);

  const [isLoopedState, setIsLooped] = useState(false);
  const [isQueueLoopedState, setIsQueueLooped] = useState(false);
  const isQueueLooped = useRef(false);
  const currentIndexRef = useRef(null);

  const queueRef = useRef([]);

  useEffect(() => {
    let interval;

    if (isPlaying && howlRef.current) {
      interval = setInterval(() => {
        setCurrentMusicTime(howlRef.current.seek() || 0);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const cleanupHowl = () => {
    if (howlRef.current instanceof Howl) {
      howlRef.current.off();
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    clearInterval(intervalRef.current);
  };

  const playMusic = (music, index = null) => {
    let done = false;
    cleanupHowl();

    console.trace("PlayMusic chamado");

    if (index !== null) {
      currentIndexRef.current = index;
      setCurrentIndex(index);
    }

    setCurrentMusic(music);
    setMusicTime(0);
    setIsPlaying(true);

    howlRef.current = new Howl({
      src: [music.musicAudioCDN],
      volume: 0,
      html5: true,
    });

    howlRef.current.play();
    howlRef.current.fade(0, volume, 500);

    if (!done) {
      done = true;
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "PLAYBACK_MUSIC",
            data: {
              userId: JSON.parse(localStorage.getItem("userToken"))?.user?.id,
              musicId: music.musicId,
              playedAt: new Date().toISOString(),
            },
          })
        );
      }
    }

    intervalRef.current = setInterval(() => {
      if (howlRef.current && !isDraggingRef.current) {
        const current = howlRef.current.seek() || 0;
        const duration = howlRef.current.duration() || 1;
        setMusicTime((current / duration) * 100);
      }
    }, 100);

    howlRef.current.on("end", () => {
      if (isLooped.current) {
        playFromQueue(currentIndexRef.current);
      } else if (
        isQueueLooped.current &&
        currentIndexRef.current === queueRef.current.length - 1
      ) {
        playFromQueue(0);
      } else {
        next();
      }
    });
  };

  const playPause = () => {
    if (!(howlRef.current instanceof Howl)) {
      console.log("No Music!");
      return;
    }

    if (!isPlaying) {
      setIsPlaying(true);
      howlRef.current.fade(0, volume, 200);
      howlRef.current.play();
    } else {
      setIsPlaying(false);
      howlRef.current.fade(howlRef.current.volume(), 0, 200);
      setTimeout(() => howlRef.current.pause(), 200);
    }
  };

  const setTime = (value, isUserChange = false) => {
    if (!(howlRef.current instanceof Howl)) {
      console.log("No Music!");
      return;
    }

    if (isUserChange) {
      const duration = howlRef.current.duration() || 1;
      howlRef.current.seek((duration * value) / 100);
    }

    setMusicTime(value);
  };

  const setCurTime = (value, isUserChange = false) => {
    if (!(howlRef.current instanceof Howl)) {
      console.log("No Music!");
      return;
    }

    if (isUserChange) {
      howlRef.current.seek(value);
    }

    setMusicTime(value);
  };

  const setBarIsDragging = (value) => {
    isDraggingRef.current = value;
  };

  const changeVolume = (newVolume) => {
    if (newVolume <= 0) {
      setLastGreatVolume(volume);
    }

    setVolume(newVolume);

    if (howlRef.current instanceof Howl) {
      howlRef.current.volume(newVolume);
    }
  };

  const addToQueue = (music) => {
    queueRef.current.push(music);
  };

  function addNextToQueue(music) {
    if (!Array.isArray(queueRef.current)) {
      queueRef.current = [];
    }

    if (currentIndex === null) {
      queueRef.current.push(music);
      playFromQueue(0);
      return;
    }

    const newQueue = [...queueRef.current];
    newQueue.splice(currentIndex + 1, 0, music);
    queueRef.current = newQueue;
  }

  const playFromQueue = (index, startPaused = false) => {
    if (queueRef.current[index]) {
      playMusic(queueRef.current[index], index, startPaused);
    }
  };

  const next = () => {
    let newIndex = currentIndexRef.current + 1;

    if (isLooped.current) {
      playFromQueue(currentIndexRef.current);
      return;
    }

    if (newIndex >= queueRef.current.length) {
      if (isQueueLooped.current) {
        playFromQueue(0);
      } else {
        cleanupHowl();
        clearQueue();
        setCurrentMusic(null);
        setIsPlaying(false);
        setMusicTime(0);
        currentIndexRef.current = null;
        setCurrentIndex(null);
        toast.info("Fim Da Fila!");
      }
      return;
    }

    howlRef.current.fade(volume, 0, 200);
    setTimeout(() => playFromQueue(newIndex), 200);
  };

  const prev = () => {
    let newIndex = currentIndexRef.current - 1;

    if (isLooped.current) {
      playFromQueue(currentIndexRef.current);
      return;
    }

    if (newIndex < 0) {
      if (isQueueLooped.current) {
        playFromQueue(queueRef.current.length - 1);
      }
      return;
    }

    playFromQueue(newIndex);
  };

  const clearQueue = () => {
    cleanupHowl();
    queueRef.current = [];
    setCurrentMusic(null);
    setIsPlaying(false);
    setMusicTime(0);
  };

  const loop = () => {
    if (!isLooped.current && !isQueueLooped.current) {
      setIsQueueLooped(true);
      isQueueLooped.current = true;
    } else if (isQueueLooped.current && !isLooped.current) {
      isLooped.current = true;
      setIsLooped(true);
      setIsQueueLooped(false);
      isQueueLooped.current = false;
    } else if (isLooped.current) {
      isLooped.current = false;
      isQueueLooped.current = false;
      setIsLooped(false);
      setIsQueueLooped(false);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        queueRef,
        currentMusic,
        currentIndex,
        isPlaying,
        playMusic,
        playPause,
        next,
        prev,
        addToQueue,
        addNextToQueue,
        playFromQueue,
        clearQueue,
        musicTime,
        howlRef,
        setBarIsDragging,
        setTime,
        isSideBarOpen,
        setSideBar,
        volume,
        changeVolume,
        isMuted,
        lastGreatVolume,
        loop,
        isLoopedState,
        isQueueLoopedState,
        isLyricsOpen,
        setLyricsOpen,
        currentMusicTime,
        setCurTime,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
