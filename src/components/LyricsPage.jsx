import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { Languages, RefreshCcw, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const serverIP = import.meta.env.VITE_SERVER_IP;

function LyricsPage() {
  const { currentMusicTime, setCurTime, setLyricsOpen, currentMusic } =
    usePlayer();
  const [isTranslated, setIsTranslated] = useState(false);
  const autoScroll = useRef(true);
  const isAutoScrolling = useRef(false);

  const lyricsContainerRef = useRef(null);
  const lyricsRefs = useRef([]);
  lyricsRefs.current = [];

  const {
    data: lyrics,
    error: lyricsError,
    isLoading: lyricsLoading,
  } = useQuery({
    queryKey: ["lyrics", currentMusic?.musicId],
    queryFn: () =>
      axios
        .get(`${serverIP}/lyrics/music/${currentMusic?.musicId}`)
        .then((res) => res.data),
    enabled: !!currentMusic?.musicId,
  });

  const {
    data: translatedLyrics,
    error: translatedError,
    isLoading: translatedLoading,
  } = useQuery({
    queryKey: ["lyrics-translated", currentMusic?.musicId],
    queryFn: () =>
      axios
        .get(`${serverIP}/lyrics/language/pt-br/music/${currentMusic?.musicId}`)
        .then((res) => res.data),
    enabled: !!currentMusic?.musicId,
  });

  function scrollToLyrics() {
    const currentIdx = lyrics?.content?.findIndex(
      (phrase) =>
        currentMusicTime >= phrase.start && currentMusicTime < phrase.end
    );

    if (
      currentIdx !== -1 &&
      lyricsRefs.current[currentIdx] &&
      lyricsContainerRef.current
    ) {
      isAutoScrolling.current = true;

      const container = lyricsContainerRef.current;
      const target = lyricsRefs.current[currentIdx];
      const containerMiddle = container.clientHeight / 2;
      const targetOffset = target.offsetTop - container.offsetTop;

      container.scrollTo({
        top: targetOffset - containerMiddle + target.clientHeight / 2,
        behavior: "smooth",
      });

      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 300);
    }
  }

  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setLyricsOpen(false);
  }, [location.pathname, setLyricsOpen]);

  useEffect(() => {
    if (!autoScroll.current) return;
    scrollToLyrics();
  }, [currentMusicTime, lyrics]);

  return (
    <>
      <div className="flex flex-col relative w-full h-full py-10 bg-gradient-to-b from-violet-500 to-violet-600 rounded-xl gap-5 animate-fadeIn">
        {translatedLyrics && translatedLyrics[0]?.content?.length > 0 && (
          <div className="mx-auto w-3/4 max-w-5xl flex justify-between items-center">
            <button
              onClick={() => setIsTranslated(!isTranslated)}
              className="bg-white p-1 rounded-full transition-all hover:scale-110 active:scale-100"
            >
              <Languages />
            </button>
            <button
              onClick={() => setLyricsOpen(false)}
              className="bg-white p-1 rounded-full transition-all hover:scale-110 active:scale-100"
            >
              <X />
            </button>
          </div>
        )}
        <div
          onWheel={() => (autoScroll.current = false)}
          onTouchMove={() => (autoScroll.current = false)}
          ref={lyricsContainerRef}
          className="mx-auto w-full md:w-3/4 md:max-w-6xl flex flex-col text-5xl text-left gap-8 pb-40 overflow-auto [&&&::-webkit-scrollbar]:hidden p-12"
        >
          {(!translatedLoading && translatedError) ||
          (!lyricsLoading && lyricsError) ? (
            <h1 className="text-white font-bold text-center text-3xl">
              Infelizmente Nós Ainda Não Temos A Letra Dessa Música...
            </h1>
          ) : null}

          {(lyricsLoading || translatedLoading) && (
            <>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
              <div className="flex w-full h-8 bg-white opacity-50 animate-pulse rounded-lg"></div>
            </>
          )}
          {!isTranslated &&
            lyrics?.content?.map((phrase, idx) => {
              const isCurrent =
                currentMusicTime >= phrase.start &&
                currentMusicTime < phrase.end;
              const isUpcoming = currentMusicTime <= phrase.end;

              return (
                <h1
                  key={idx}
                  ref={(el) => el && (lyricsRefs.current[idx] = el)}
                  onClick={() => setCurTime(phrase.start, true)}
                  className={`cursor-pointer transition-all hover:underline font-bold ${
                    isCurrent
                      ? "text-white scale-105"
                      : isUpcoming
                      ? "text-white opacity-40"
                      : "text-white opacity-20"
                  }`}
                >
                  {phrase.content}
                </h1>
              );
            })}
          {isTranslated &&
            translatedLyrics[0]?.content?.map((phrase, idx) => {
              const isCurrent =
                currentMusicTime >= phrase.start &&
                currentMusicTime < phrase.end;
              const isUpcoming = currentMusicTime <= phrase.end;

              return (
                <h1
                  key={idx}
                  ref={(el) => el && (lyricsRefs.current[idx] = el)}
                  onClick={() => setCurTime(phrase.start, true)}
                  className={`cursor-pointer transition-all hover:underline font-bold ${
                    isCurrent
                      ? "text-white scale-105"
                      : isUpcoming
                      ? "text-white opacity-40"
                      : "text-white opacity-20"
                  }`}
                >
                  {phrase.content}
                </h1>
              );
            })}
        </div>
        {!autoScroll.current && (
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 mb-10 flex items-center justify-center z-50">
            <div
              onClick={() => {
                autoScroll.current = true;
                scrollToLyrics();
              }}
              className="bg-white cursor-pointer flex gap-2 p-3 rounded-lg font-bold items-center hover:scale-110 active:scale-100 transition-all"
            >
              <RefreshCcw className="size-8" />
              <h1>Sincronizar Música</h1>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LyricsPage;
