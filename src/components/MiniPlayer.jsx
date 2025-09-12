import { usePlayer } from "../contexts/PlayerContext.jsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import nosong from "../imgs/nosong.jpg";
import VanillaTilt from "vanilla-tilt";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function MiniPlayer() {
  const { currentMusic, isPlaying, queueRef, currentIndex } = usePlayer();
  const navigate = useNavigate();

  const textRef = useRef(null);
  const containerRef = useRef(null);
  const currentVideo = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isInfoUp, setInfoUp] = useState(false);

  const { data: currentArtistInfo } = useQuery({
    queryKey: ["artist", currentMusic?.artistId],
    queryFn: async () => {
      if (!currentMusic?.artistId) return null;
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_IP}/artists/${currentMusic.artistId}`,
        { headers: { "ngrok-skip-browser-warning": "1" } }
      );
      return response.data;
    },
    enabled: !!currentMusic?.artistId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const tiltRef = useRef(null);

  useEffect(() => {
    if (!currentVideo.current) return;

    if (isPlaying) {
      currentVideo.current.play().catch(() => {});
    } else {
      currentVideo.current.pause();
    }
  }, [isPlaying, currentMusic]);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 10,
        speed: 100,
        glare: true,
        "max-glare": 0.1,
      });
    }
  }, []);

  useEffect(() => {
    if (!currentMusic?.albumName) {
      setShouldAnimate(false);
      return;
    }
    const textWidth = textRef.current?.scrollWidth || 0;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    setShouldAnimate(textWidth > containerWidth);
  }, [currentMusic?.albumName]);

  function handleAlbumPage() {
    navigate(`/album/${currentMusic?.albumId}`);
  }

  return (
    <>
      <div
        className={`hidden md:flex flex-col w-1/2 h-full bg-gradient-to-b from-zinc-900 to-background text-white 
  sm:w-1/2 md:w-[100%] xl:w-[35%] 2xl:w-[30%] overflow-y-auto shadow-lg rounded-lg select-none [&&&::-webkit-scrollbar]:hidden
  ${currentMusic?.musicMiniCDN ? "p-0" : "p-4"}`}
      >
        <div className="flex flex-col w-full">
          {!currentMusic?.musicMiniCDN && (
            <>
              <div className="flex flex-col space-y-2 mb-8">
                <div
                  ref={containerRef}
                  className="flex w-[250px] overflow-hidden"
                >
                  <h1
                    ref={textRef}
                    className={`text-white font-bold whitespace-nowrap text-lg ${
                      shouldAnimate
                        ? "animate-slideHorizontal [animation-delay:2s]"
                        : ""
                    }`}
                  >
                    {currentMusic?.albumName || "Nome Album"}
                  </h1>
                </div>

                <div
                  onClick={handleAlbumPage}
                  ref={tiltRef}
                  className="flex w-full h-auto rounded-xl cursor-pointer"
                >
                  <img
                    className="w-full h-full rounded-xl object-cover shadow-xl hover:scale-95 transition-all"
                    src={currentMusic?.musicAlbumCDN || nosong}
                    alt={currentMusic?.musicName || "Nome Musica"}
                  />
                </div>

                <div className="flex">
                  <div className="flex flex-col">
                    <h1
                      onClick={handleAlbumPage}
                      className="text-xl font-bold tracking-wide hover:underline cursor-pointer"
                    >
                      {currentMusic?.musicName || "Nome Da Musica"}
                    </h1>
                    <h1
                      onClick={() =>
                        navigate(`/artist/${currentMusic?.artistId}`)
                      }
                      className="text-lg font-medium text-neutral-400 hover:underline cursor-pointer"
                    >
                      {currentMusic?.artistName || "Nome Do Artista"}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full h-auto bg-zinc-900 rounded-lg relative cursor-pointer">
                <div className="relative rounded-t-lg w-full h-56 overflow-hidden">
                  <img
                    className="object-cover rounded-t-lg scale-110 w-full h-full"
                    src={currentArtistInfo?.artistBackgroundImageCDN}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-100 rounded-t-lg group-hover:opacity-0 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.05), rgba(0,0,0,0))",
                    }}
                  ></div>
                  <h1 className="absolute top-2 left-2 text-white font-bold">
                    Sobre o artista
                  </h1>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <h1 className="font-bold text-lg">
                    {currentArtistInfo?.artistName}
                  </h1>
                  <h1 className="text-neutral-300 font-semibold text-sm">
                    0 Ouvintes Mensais
                  </h1>
                  <h1 className="text-neutral-300 text-sm line-clamp-3">
                    {currentArtistInfo?.artistBio || "Sem Biografia..."}
                  </h1>
                </div>
              </div>

              {queueRef.current &&
                queueRef.current.length > currentIndex + 1 && (
                  <div className="flex flex-col w-full mt-6 p-3 bg-zinc-900 rounded-lg">
                    <h1 className="text-white font-bold text-sm mb-2">
                      A Seguir
                    </h1>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          queueRef.current[currentIndex + 1]?.musicAlbumCDN ||
                          nosong
                        }
                        alt={
                          queueRef.current[currentIndex + 1]?.musicName ||
                          "Próxima Música"
                        }
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex flex-col">
                        <h1 className="text-white font-bold">
                          {queueRef.current[currentIndex + 1]?.musicName ||
                            "Sem música"}
                        </h1>
                        <h1 className="text-neutral-400 text-sm">
                          {queueRef.current[currentIndex + 1]?.artistName ||
                            "Artista"}
                        </h1>
                      </div>
                    </div>
                  </div>
                )}

              <div className="flex h-48"></div>
            </>
          )}
          {currentMusic?.musicMiniCDN && (
            <>
              <div className="relative w-full h-[100vh] overflow-auto [&&&::-webkit-scrollbar]:hidden">
                <h1
                  onClick={handleAlbumPage}
                  className="absolute text-lg font-bold tracking-wide z-20 p-2 hover:underline cursor-pointer"
                >
                  {currentMusic?.albumName || "Nome Do Album"}
                </h1>
                <div
                  onClick={() => setInfoUp(!isInfoUp)}
                  className="group relative w-full h-full"
                >
                  <video
                    loop
                    autoPlay
                    muted
                    src={currentMusic?.musicMiniCDN}
                    ref={currentVideo}
                    className="w-full h-full object-cover"
                  ></video>

                  <div
                    className="absolute inset-0 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
                    }}
                  ></div>
                </div>
                <div
                  className={`absolute w-full h-full overflow-hidden z-0 rounded-lg p-2
             transition-transform duration-500 ease-in-out ${
               isInfoUp ? "translate-y-[-25rem]" : "translate-y-[-35rem]"
             }`}
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(14,14,14,0.2) 5%, rgba(14,14,14,1) 25%)",
                  }}
                >
                  <div className="flex">
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-bold tracking-wide">
                        {currentMusic?.musicName || "Nome Da Musica"}
                      </h1>
                      <h1 className="text-lg font-medium text-neutral-400">
                        {currentMusic?.artistName || "Nome Do Artista"}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-col w-full h-auto bg-zinc-900 rounded-lg relative cursor-pointer mt-36">
                    <div className="relative rounded-t-lg w-full h-56 overflow-hidden">
                      <img
                        className="object-cover rounded-t-lg scale-110 w-full h-full"
                        src={currentArtistInfo?.artistBackgroundImageCDN}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none opacity-100 rounded-t-lg group-hover:opacity-0 transition-opacity duration-500"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.05), rgba(0,0,0,0))",
                        }}
                      ></div>
                      <h1 className="absolute top-2 left-2 text-white font-bold">
                        Sobre o artista
                      </h1>
                    </div>
                    <div className="flex flex-col gap-2 p-3">
                      <h1 className="font-bold text-lg">
                        {currentArtistInfo?.artistName}
                      </h1>
                      <h1 className="text-neutral-300 font-semibold text-sm">
                        0 Ouvintes Mensais
                      </h1>
                      <h1 className="text-neutral-300 text-sm line-clamp-3">
                        {currentArtistInfo?.artistBio || "Sem Biografia..."}
                      </h1>
                    </div>
                  </div>

                  {queueRef.current &&
                    queueRef.current.length > currentIndex + 1 && (
                      <div className="flex flex-col w-full mt-6 p-3 bg-zinc-900 rounded-lg">
                        <h1 className="text-white font-bold text-sm mb-2">
                          A Seguir
                        </h1>
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              queueRef.current[currentIndex + 1]
                                ?.musicAlbumCDN || nosong
                            }
                            alt={
                              queueRef.current[currentIndex + 1]?.musicName ||
                              "Próxima Música"
                            }
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex flex-col">
                            <h1 className="text-white font-bold">
                              {queueRef.current[currentIndex + 1]?.musicName ||
                                "Sem música"}
                            </h1>
                            <h1 className="text-neutral-400 text-sm">
                              {queueRef.current[currentIndex + 1]?.artistName ||
                                "Artista"}
                            </h1>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MiniPlayer;
