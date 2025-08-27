import { useState } from "react";
import {
  CirclePlay,
  CirclePlus,
  PauseCircle,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import nosong from "../imgs/nosong.jpg";

function PlayerController() {
  const [musicTime, setMusicTime] = useState(25);

  return (
    <>
      <div className="absolute flex w-screen h-20 bg-playerController bottom-0 items-center py-12 px-5">
        <div className="w-1/4 flex h-full text-white gap-3 items-center">
          <img src={nosong} alt="No song" className="size-16" />
          <div className="flex flex-col items-baseline justify-center">
            <h1 className="font-semibold">Changes - 2009 Remaster</h1>
            <p className="font-normal text-zinc-400">Black Sabbath</p>
          </div>
          <button className="transition-all scale-[.85] hover:scale-[.90] active:scale-[.8] hover:text-purple-500">
            <CirclePlus />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="flex items-center text-white gap-5">
            <Shuffle className="size-6 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
            <SkipBack className="size-6 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
            <CirclePlay className="size-10 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
            <SkipForward className="size-6 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
            <Repeat className="size-6 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
          </div>
          <div className="flex items-center gap-3 text-white">
            <h1>0:00</h1>
            <input
              style={{
                background: `linear-gradient(to right, #9333EA ${musicTime}%, #191B1B ${musicTime}%)`,
              }}
              className="
          w-[30rem] h-[0.45rem] appearance-none transition-all rounded-lg
          
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-purple-600
          [&::-webkit-slider-thumb]:cursor-pointer

          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-purple-600
          [&::-moz-range-thumb]:cursor-pointer
        "
              type="range"
              min="0"
              max="100"
              value={musicTime}
              onChange={(e) => setMusicTime(e.target.value)}
            />
            <h1>0:00</h1>
          </div>
        </div>

        <div className="w-1/4"></div>
      </div>
    </>
  );
}

export default PlayerController;
