import { usePlayer } from "../contexts/PlayerContext.jsx";
import {
  Circle,
  CircleCheck,
  CirclePlay,
  CirclePlus,
  Disc,
  ListPlus,
  Maximize,
  MicVocal,
  Minimize,
  PauseCircle,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import nosong from "../imgs/nosong.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "./album/ImageWithPlaceholder.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function PlayerController() {
  const {
    currentMusic,
    isPlaying,
    playPause,
    musicTime,
    setTime,
    howlRef,
    setBarIsDragging,
    isSideBarOpen,
    setSideBar,
    volume,
    changeVolume,
    isMuted,
    lastGreatVolume,
    next,
    prev,
    loop,
    isLoopedState,
    isQueueLoopedState,
    isLyricsOpen,
    setLyricsOpen,
  } = usePlayer();

  const [isFullscreen, setFullscreen] = useState(false);
  const navigate = useNavigate();

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    secs = Math.floor(secs);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function handleMiniPlayer() {
    if (currentMusic) {
      setSideBar(!isSideBarOpen);
    }
  }

  function getVolumeIcon() {
    if (isMuted || volume === 0) return <VolumeX className="text-purple-500" />;
    if (volume < 0.15) return <Volume />;
    if (volume < 0.7) return <Volume1 />;
    return <Volume2 />;
  }

  function getScreenIcon() {
    if (isFullscreen) {
      return <Minimize />;
    } else {
      return <Maximize />;
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      setFullscreen(true);
      document.documentElement.requestFullscreen();
    } else {
      setFullscreen(false);
      document.exitFullscreen();
    }
  }

  function handleGoToArtist() {
    navigate(`/artist/${currentMusic.artistId}`);
  }

  function handleGoToAlbum() {
    navigate(`/album/${currentMusic.albumId}`);
  }

  const token = JSON.parse(localStorage.getItem("userToken"));
  const [isAddModalOpen, setIsAddModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [selectedPlaylistsToRemove, setSelectedPlaylistsToRemove] = useState(
    []
  );

  const toggleSelect = (playlistId) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const toggleSelectDelete = (playlistId) => {
    setSelectedPlaylistsToRemove((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  async function handleAddMusicToPlaylist() {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));

      if (!token) {
        console.warn("Nenhum token encontrado.");
        return;
      }

      const playlistsResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_IP}/playlists/user`,
        {
          headers: {
            Authorization: `Bearer ${token.token.token}`,
          },
        }
      );

      const playlists = playlistsResponse.data;

      const playlistsWithMusics = await Promise.all(
        playlists.map(async (playlist) => {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_SERVER_IP}/playlistMusics/${playlist.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token.token.token}`,
                },
              }
            );

            const musicIds = res.data.map((item) => item.music.id);

            return {
              ...playlist,
              musicIds,
            };
          } catch (err) {
            console.error(
              `Erro ao buscar músicas da playlist ${playlist.id}`,
              err
            );
            return {
              ...playlist,
              musicIds: [],
            };
          }
        })
      );

      setUserPlaylists(playlistsWithMusics);
      setIsAddModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleInsertMusicIntoPlaylist(musicId, selectedPlaylists) {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));

      if (!token) {
        console.warn("Nenhum token encontrado.");
        return;
      }

      if (!selectedPlaylists || selectedPlaylists.length === 0) {
        console.warn("Nenhuma playlist selecionada.");
        toast.warn("Nenhuma Playlist Selecionada!");
        return;
      }

      const addPromise = Promise.all(
        selectedPlaylists.map((playlistId) =>
          axios.post(
            `${import.meta.env.VITE_SERVER_IP}/playlistMusics`,
            { playlistId, musicId },
            { headers: { Authorization: `Bearer ${token.token.token}` } }
          )
        )
      );

      await toast.promise(addPromise, {
        pending: "Adicionando música nas playlists...",
        success: "Música adicionada com sucesso!",
        error:
          "Erro ao adicionar música em alguma playlist. (Veja se a música não está duplicada)",
      });
    } catch (error) {
      console.error("Erro ao inserir música nas playlists:", error);
    } finally {
      setSelectedPlaylists([]);
    }
  }

  async function handleRemoveMusicFromPlaylist(
    musicId,
    selectedPlaylistsToRemove
  ) {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));
      if (!token) return console.warn("Nenhum token encontrado.");
      if (!selectedPlaylistsToRemove || selectedPlaylistsToRemove.length === 0)
        return;

      const removePromise = Promise.all(
        selectedPlaylistsToRemove.map((playlistId) =>
          axios.delete(
            `${
              import.meta.env.VITE_SERVER_IP
            }/playlistMusics/${playlistId}/${musicId}`,
            {
              headers: { Authorization: `Bearer ${token.token.token}` },
            }
          )
        )
      );

      await toast.promise(removePromise, {
        pending: "Removendo música das playlists...",
        success: "Música removida com sucesso!",
        error: "Erro ao remover música de alguma playlist.",
      });
    } catch (error) {
      console.error("Erro ao remover música das playlists:", error);
    } finally {
      setSelectedPlaylistsToRemove([]);
    }
  }

  async function handlePlaylistChanges(musicId) {
    if (selectedPlaylists.length > 0) {
      await handleInsertMusicIntoPlaylist(musicId, selectedPlaylists);
    }

    if (selectedPlaylistsToRemove.length > 0) {
      await handleRemoveMusicFromPlaylist(musicId, selectedPlaylistsToRemove);
    }
  }

  return (
    <>
      {isAddModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-zinc-900 text-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
              <div className="flex gap-2 items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Selecione Uma Playlist:</h2>
                <button
                  onClick={() => {
                    setIsAddModal(false);
                    setSelectedPlaylists([]);
                  }}
                  className="hover:scale-125 transition-all"
                >
                  <X />
                </button>
              </div>

              <div className="flex flex-col h-[30vh] overflow-y-auto">
                {userPlaylists.map((playlist, index) => (
                  <div
                    key={index}
                    className="flex w-full hover:bg-zinc-800 cursor-pointer rounded-md p-2 items-center justify-start transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className="w-12 h-12 rounded-lg"
                        src={playlist.coverCDN || nosong}
                      />
                      <div className="flex flex-col">
                        <h1 className="font-semibold text-sm">
                          {playlist.name}
                        </h1>
                        <h1 className="text-xs text-neutral-400">
                          {`${token.user.nome} • Playlist • ${playlist.musicIds.length} Músicas`}
                        </h1>
                      </div>
                    </div>

                    {playlist.musicIds.includes(currentMusic?.musicId) && (
                      <button
                        onClick={() => toggleSelectDelete(playlist.id)}
                        className="ml-auto hover:scale-105 active:scale-100 transition-all"
                      >
                        {!selectedPlaylistsToRemove.includes(playlist.id) ? (
                          <CircleCheck className="text-purple-500 transition-all animate-fadeIn" />
                        ) : (
                          <Circle className="text-red-500 animate-fadeIn" />
                        )}
                      </button>
                    )}

                    {!playlist.musicIds.includes(currentMusic?.musicId) && (
                      <button
                        onClick={() => toggleSelect(playlist.id)}
                        className="ml-auto hover:scale-105 active:scale-100 transition-all"
                      >
                        {selectedPlaylists.includes(playlist.id) ? (
                          <CircleCheck className="text-purple-500 transition-all animate-fadeIn" />
                        ) : (
                          <Circle className="animate-fadeIn" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    handlePlaylistChanges(currentMusic?.musicId);
                    setIsAddModal(false);
                  }}
                  className="bg-purple-600 p-2 rounded-lg hover:bg-purple-700 transition-all"
                >
                  Pronto
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <audio preload="auto" ref={howlRef} />
      <div className="fixed flex w-screen h-24 bg-playerController bottom-0 items-center justify-between py-5 px-5 z-30">
        {currentMusic && (
          <>
            <div className="flex h-full text-white gap-3 items-center">
              <div
                className="cursor-pointer hover:scale-110 transition-all"
                onClick={handleGoToAlbum}
              >
                <ImageWithPlaceholder
                  src={currentMusic?.musicAlbumCDN || nosong}
                  alt={"Song Cover"}
                  size={64}
                />
              </div>
              <div className="flex flex-col items-baseline justify-center">
                <h1
                  onClick={handleGoToAlbum}
                  className="font-semibold cursor-pointer hover:underline"
                >
                  {currentMusic?.musicName || "Nome Da Musica"}
                </h1>
                <p
                  onClick={handleGoToArtist}
                  className="font-normal hover:underline cursor-pointer text-zinc-400"
                >
                  {currentMusic?.artistName || "Artista"}
                </p>
              </div>
              {!currentMusic?.isMusicLikedByUser && (
                <button
                  onClick={handleAddMusicToPlaylist}
                  className="transition-all scale-[.85] hover:scale-[.90] active:scale-[.8] hover:text-purple-500"
                >
                  <ListPlus />
                </button>
              )}

              {currentMusic?.isMusicLikedByUser && (
                <button className="transition-all scale-[.85] hover:scale-[.90] active:scale-[.8] text-purple-500 hover:text-purple-700">
                  <CircleCheck />
                </button>
              )}
            </div>
          </>
        )}

        <div className="flex flex-col absolute left-1/2 transform -translate-x-1/2 justify-center items-center space-y-2">
          <div className="flex items-center text-white gap-5">
            <button>
              <Shuffle className="size-6 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
            </button>

            <button onClick={() => prev()}>
              <SkipBack className="size-6 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
            </button>

            {!isPlaying && (
              <button onClick={playPause}>
                <CirclePlay className="size-10 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
              </button>
            )}

            {isPlaying && (
              <button onClick={playPause}>
                <PauseCircle className="size-10 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
              </button>
            )}

            <button onClick={() => next()}>
              <SkipForward className="size-6 cursor-pointer transition-all hover:scale-110 hover:text-purple-500 active:scale-95" />
            </button>

            <button
              onClick={loop}
              className={`transition-all hover:scale-110 active:scale-95 ${
                isLoopedState || isQueueLoopedState
                  ? "text-purple-500"
                  : "text-white"
              }`}
            >
              {isLoopedState ? (
                <Repeat1 className="size-6" />
              ) : (
                <Repeat className="size-6" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-3 text-white">
            <h1 className="text-sm">
              {formatDuration((musicTime / 100) * currentMusic?.duration || 0)}
            </h1>
            <input
              style={{
                background: `linear-gradient(to right, #9333EA ${musicTime}%, #191B1B ${musicTime}%)`,
              }}
              className="
          w-[30rem] h-[0.45rem] appearance-none transition-all rounded-lg cursor-pointer

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
              onTouchStart={() => setBarIsDragging(true)}
              onTouchEnd={() => {
                setBarIsDragging(false);
                setTime(musicTime, true);
              }}
              onMouseDown={() => setBarIsDragging(true)}
              onMouseUp={() => {
                setBarIsDragging(false);
                setTime(musicTime, true);
              }}
              onChange={(e) => setTime(e.target.value, false)}
            />
            <h1 className="text-sm">
              {formatDuration(currentMusic?.duration || 0)}
            </h1>
          </div>
        </div>

        <div className="flex absolute left-[98%] transform -translate-x-[100%] gap-3 text-white">
          {isSideBarOpen && (
            <button
              onClick={handleMiniPlayer}
              className="hover:scale-105 active:scale-100 cursor-pointer transition-all text-purple-500"
            >
              <Disc />
            </button>
          )}
          {!isSideBarOpen && (
            <button
              onClick={handleMiniPlayer}
              className="hover:scale-105 active:scale-100 cursor-pointer transition-all"
            >
              <Disc />
            </button>
          )}
          {isLyricsOpen && (
            <button
              onClick={() => setLyricsOpen(false)}
              className="hover:scale-105 active:scale-100 cursor-pointer transition-all text-purple-500"
            >
              <MicVocal />
            </button>
          )}
          {!isLyricsOpen && (
            <button
              onClick={() => setLyricsOpen(true)}
              className="hover:scale-105 active:scale-100 cursor-pointer transition-all"
            >
              <MicVocal />
            </button>
          )}
          <div className="flex gap-3 items-center">
            <button
              onClick={() =>
                changeVolume(isMuted || volume === 0 ? lastGreatVolume : 0)
              }
              className="text-white hover:scale-105 active:scale-100 cursor-pointer transition-all"
            >
              {getVolumeIcon()}
            </button>
            <input
              style={{
                background: `linear-gradient(to right, #9333EA ${
                  volume * 100
                }%, #191B1B ${volume * 100}%)`,
                borderRadius: "9999px",
              }}
              className="group w-[8rem] h-[0.45rem] appearance-none transition-all rounded-lg cursor-pointer 
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-purple-600
          [&::-webkit-slider-thumb]:cursor-pointer
          
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:active:scale-110

          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-purple-600
          [&::-moz-range-thumb]:cursor-pointer
          "
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
            />
          </div>
          <button
            className="hover:scale-105 active:scale-95 transition-all cursor-pointer"
            onClick={toggleFullscreen}
          >
            {getScreenIcon()}
          </button>
        </div>
      </div>
    </>
  );
}

export default PlayerController;
