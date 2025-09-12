import axios from "axios";
import VanillaTilt from "vanilla-tilt";
import {
  CloudDownload,
  Ellipsis,
  ExternalLink,
  Frown,
  PauseCircle,
  Pencil,
  PlayCircle,
  Search,
  Shuffle,
  User,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MusicPlaylist from "./List/MusicPlaylist";
import nosong from "../imgs/nosong.jpg";
import ImageWithPlaceholder from "./album/ImageWithPlaceholder";
import { usePlayer } from "../contexts/PlayerContext";
import { toast } from "react-toastify";

function PlaylistPage() {
  const { playlistId } = useParams();

  const {
    addToQueue,
    clearQueue,
    playFromQueue,
    currentMusic,
    playPause,
    isPlaying,
  } = usePlayer();

  const [error, setError] = useState("");
  const [playlistData, setPlaylistData] = useState();
  const [playlistMusics, setPlaylistMusics] = useState([]);
  const [userData, setUserData] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const [preview, setPreview] = useState(null);

  const [playlistForm, setPlaylistForm] = useState({
    name: "",
    description: "",
    coverCDN: null,
  });

  const location = useLocation();
  const showEdit = new URLSearchParams(location.search).get("edit") === "true";

  function copyUrlToClipboard() {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copiada para o clipboard!");
      })
      .catch((err) => {
        console.error("Erro ao copiar a URL:", err);
        toast.error("Não foi possível copiar a URL.");
      });
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!validTypes.includes(file.type)) {
        toast.error("Formato inválido. Use .JPG, .PNG, ou .WEBP!");
        e.target.value = "";
        return;
      }

      setPreview(URL.createObjectURL(file));

      setPlaylistForm((prev) => ({
        ...prev,
        coverCDN: file,
      }));
    }
  };

  const tiltRef = useRef(null);

  function formatPlaylistDuration(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    let result = "";
    if (days > 0) result += `${days} day${days > 1 ? "s" : ""} `;
    if (hours > 0) result += `${hours} hr `;
    if (mins > 0) result += `${mins} min`;

    return result.trim();
  }

  function getTotalPlaylist() {
    let totalTime = 0;
    playlistMusics?.forEach((currentMusic) => {
      totalTime += currentMusic.duration;
    });

    if (totalTime === 0) {
      return "0 min";
    }
    return formatPlaylistDuration(totalTime);
  }

  useEffect(() => {
    if (!playlistId) return;
    setError(null);

    async function fetchPlaylistData() {
      try {
        const playlistRes = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/playlists/${playlistId}`,
          { headers: { "ngrok-skip-browser-warning": "1" } }
        );

        setPlaylistData(playlistRes.data);

        if (playlistRes.data) {
          setPlaylistForm({
            name: playlistRes.data.name || "",
            description: playlistRes.data.description || "",
            coverCDN: null,
          });
        }

        if (playlistRes.data.ownerId) {
          const userRes = await axios.get(
            `${import.meta.env.VITE_SERVER_IP}/users/${
              playlistRes.data.ownerId
            }`,
            { headers: { "ngrok-skip-browser-warning": "1" } }
          );
          setUserData(userRes.data);
        }

        const token = JSON.parse(localStorage.getItem("userToken"));

        const musicsRes = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/playlistMusics/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token.token}`,
            },
          }
        );

        setPlaylistMusics(musicsRes.data.map((item) => item.music));
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("404");
        } else {
          setError("Erro ao carregar a playlist");
        }
      }
    }

    fetchPlaylistData();
  }, [playlistId]);

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
    if (showEdit) {
      setIsEditing(true);
    }
  }, [showEdit, playlistId]);

  function handlePlayQueue(startIndex = 0) {
    if (!playlistMusics || playlistMusics.length === 0) return;

    clearQueue();

    const currentURL = window.location.pathname;

    playlistMusics.forEach((track) => {
      const musicData = {
        musicName: track.musicName,
        musicAlbumCDN: track.album?.coverCDN,
        musicAudioCDN: track.musicAudioCDN,
        musicMiniCDN: track.musicMiniCDN,
        albumName: track.album?.albumName,
        artistName: track.album?.artist?.artistName,
        isMusicLikedByUser: track.isMusicLikedByUser || false,
        duration: track.duration,
        albumId: track.album?.id,
        artistId: track.album?.artist?.id,
        sourceURL: currentURL,
      };

      console.log(musicData);

      addToQueue(musicData);
    });

    playFromQueue(startIndex);
  }

  async function handleUpdatePlaylistDetails() {
    setIsEditing(false);

    try {
      const formData = new FormData();
      formData.append("name", playlistForm.name);
      formData.append("description", playlistForm.description);

      if (playlistForm.coverCDN instanceof File) {
        formData.append("coverCDN", playlistForm.coverCDN);
      }

      const token = JSON.parse(localStorage.getItem("userToken"));

      if (!token) {
        console.error("Token Invalido Ou Formatado Errado.");
        return;
      }

      const promise = axios.put(
        `${import.meta.env.VITE_SERVER_IP}/playlists/${playlistId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token.token.token}`,
          },
        }
      );

      window.dispatchEvent(
        new CustomEvent("playlistUpdated", { detail: (await promise).data })
      );

      const { data } = await toast.promise(promise, {
        loading: "Atualizando playlist...",
        success: "Playlist atualizada com sucesso!",
        error: "Erro ao atualizar playlist",
      });

      console.log("Playlist atualizada!", data);
      setPlaylistData(data);
    } catch (err) {
      console.error("Erro inesperado", err);
      toast.error("Erro inesperado ao atualizar playlist");
    }
  }

  if (error === "404")
    return (
      <div className="flex flex-col w-full h-full rounded-xl bg-background justify-center items-center text-white gap-5">
        <Frown className="size-20" />
        <h1 className="font-bold text-3xl">Erro 404 Playlist Não Encontrada</h1>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col w-full h-full rounded-xl bg-background justify-center items-center text-white gap-5">
        <X className="size-20" />
        <h1 className="font-bold text-3xl">Erro Desconhecido!</h1>
      </div>
    );

  return (
    <>
      {isEditing && (
        <>
          <div className="absolute flex justify-center items-center bg-black bg-opacity-40 top-0 left-0 w-full h-full z-50 animate-fadeIn">
            <div className="flex flex-col w-[550px] bg-gradient-to-b bg-zinc-900 p-8 rounded-lg space-y-5">
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-white text-2xl">
                  Editar Playlist
                </h1>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setPreview(null);
                    toast.warn("Mudanças Não Salvas!");
                  }}
                  className="hover:bg-zinc-800 hover:scale-110 p-1 rounded-full transition-all"
                >
                  <X className="font-bold text-white" />
                </button>
              </div>
              <form className="flex w-full gap-5">
                <div className="group w-36 h-36 relative">
                  <img
                    className="w-full h-full rounded-lg object-cover shadow-2xl shadow-black"
                    src={preview || playlistData?.coverCDN || nosong}
                  />
                  <div className="absolute flex justify-center items-center top-0 left-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                    <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all">
                      <Pencil className="text-white size-10" />
                      <h1 className="font-semibold text-white">
                        Escolher Foto
                      </h1>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".jpg,.png,.webp"
                    onChange={handleFileChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex flex-1 flex-col w-full h-36">
                  <div className="group w-full">
                    <input
                      className="bg-zinc-800 w-full text-neutral-300 placeholder-neutral-600 font-semibold text-sm outline-none group-focus-within:ring-2 ring-zinc-700 p-2 rounded-lg transition-all"
                      type="text"
                      value={playlistForm?.name}
                      onChange={(e) =>
                        setPlaylistForm({
                          ...playlistForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Nome Da Playlist"
                    />
                    <h1 className="relative font-bold text-xs text-neutral-300 -top-[2.9rem] -right-2 opacity-0 group-focus-within:opacity-100 transition-all">
                      Nome
                    </h1>
                  </div>

                  <div className="group w-full">
                    <textarea
                      placeholder="Dê uma descrição a sua obra de arte! (Opcional)"
                      value={playlistForm?.description}
                      onChange={(e) =>
                        setPlaylistForm({
                          ...playlistForm,
                          description: e.target.value,
                        })
                      }
                      className="bg-zinc-800 w-full min-h-24 text-neutral-300 placeholder-neutral-600  font-semibold text-sm outline-none group-focus-within:ring-2 ring-zinc-700 p-2 rounded-lg transition-all resize-none"
                    />
                    <h1 className="relative font-bold text-xs text-neutral-300 -top-[7rem] -right-2 opacity-0 group-focus-within:opacity-100 transition-all">
                      Descrição
                    </h1>
                  </div>
                </div>
              </form>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdatePlaylistDetails}
                  className="bg-purple-700 hover:bg-purple-500 px-8 text-white p-2 rounded-md transition-all"
                >
                  Finalizar
                </button>
              </div>
              <h1 className="text-xs text-white font-semibold">
                Ao continuar, você autoriza o Sonar a acessar a imagem enviada.
                Certifique-se de que você tem o direito de fazer o upload dessa
                imagem.
              </h1>
            </div>
          </div>
        </>
      )}
      <div className="flex w-full h-full bg-gradient-to-b from-zinc-900 to-background rounded-xl p-8 space-x-5 overflow-y-visible">
        <div className="flex flex-col w-full h-full space-y-6">
          <div className="flex flex-col items-start space-y-6">
            <div
              ref={tiltRef}
              className="w-[250px] h-[250px] rounded-lg overflow-hidden bg-transparent lg:hidden"
            >
              <ImageWithPlaceholder
                src={playlistData?.coverCDN || nosong}
                alt={playlistData?.name}
              />
            </div>
            <div className="flex flex-col w-full h-auto text-white space-y-4">
              <h1 className="font-bold text-5xl">{playlistData?.name}</h1>
              <h1 className="text-sm text-neutral-300 opacity-50">
                {playlistData?.description}
              </h1>
              <div className="flex gap-2 text-neutral-400 text-sm items-center">
                <User className="size-5" />
                <div className="flex gap-1">
                  <h1 className="hover:underline cursor-pointer hover:text-purple-500">
                    {userData?.nome || "Usuário"}
                  </h1>
                  <h1>
                    {`• ${
                      playlistMusics?.length || 0
                    } Músicas • ${getTotalPlaylist()}`}
                  </h1>
                </div>
              </div>

              <div className="flex w-full text-white justify-between items-center">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => {
                      if (
                        currentMusic?.sourceURL === window.location.pathname
                      ) {
                        playPause();
                      } else {
                        handlePlayQueue(0);
                      }
                    }}
                  >
                    {currentMusic?.sourceURL === window.location.pathname &&
                    isPlaying ? (
                      <PauseCircle className="size-12 cursor-pointer hover:text-purple-500 hover:scale-105 active:scale-100 transition-all" />
                    ) : (
                      <PlayCircle className="size-12 cursor-pointer hover:text-purple-500 hover:scale-105 active:scale-100 transition-all" />
                    )}
                  </button>
                  <button>
                    <Shuffle className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                  <button onClick={() => setIsEditing(true)}>
                    <Pencil className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                  <button>
                    <CloudDownload className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                  <button onClick={copyUrlToClipboard}>
                    <ExternalLink className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                  <button>
                    <Ellipsis className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                </div>
                <button>
                  <Search className="cursor-pointer hover:text-purple-500 hover:scale-105 active:scale-100 transition-all" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full h-full space-y-3">
            <div className="space-y-2">
              <div className="flex text-neutral-500 justify-between px-2">
                <div className="flex space-x-3">
                  <h1>#</h1>
                  <h1>Título</h1>
                </div>
                <div className="flex space-x-6 mr-6">
                  <h1>Reproduções</h1>
                  <h1>Duração</h1>
                </div>
              </div>
              <div className="w-full h-[0.05rem] bg-neutral-800"></div>
            </div>
            <div className="flex flex-col w-full h-[90%] bg-none rounded-lg space-y-2">
              <div className="w-full h-full text-neutral-200">
                {playlistMusics?.length === 0 ? (
                  <h1 className="text-center text-white text-sm">
                    Essa playlist ainda não possui músicas.
                  </h1>
                ) : (
                  playlistMusics.map((music, index) => (
                    <MusicPlaylist
                      index={index + 1}
                      allTracks={playlistMusics}
                      musicName={music.musicName}
                      totalPlays={music.totalPlays || 0}
                      duration={music.duration}
                      albumName={music.album?.albumName}
                      musicAlbumCDN={music.album?.coverCDN}
                      musicAudioCDN={music.musicAudioCDN}
                      musicMiniVideoCDN={music.musicMiniCDN}
                      artistName={music.album?.artist?.artistName}
                      isMusicExplicit={music.isMusicExplicit}
                      isMusicLikedByUser={music.isMusicLikedByUser || false}
                      artistId={music.album?.artist?.id}
                      musicId={music.id}
                      isAlbum={false}
                      albumId={music.album?.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden w-[55%] h-full justify-center md:hidden lg:flex">
          <div
            ref={tiltRef}
            className="w-[450px] h-[450px] rounded-lg overflow-hidden p-2 bg-transparent"
          >
            <ImageWithPlaceholder
              src={playlistData?.coverCDN || nosong}
              alt={playlistData?.name}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaylistPage;
