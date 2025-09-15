import {
  Circle,
  CircleAlert,
  CircleCheck,
  List,
  ListPlus,
  ListStart,
  ListX,
  X,
} from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../album/ImageWithPlaceholder";
import ContextMenu from "../Menus/ContextMenu";
import { toast } from "react-toastify";
import axios from "axios";
import nosong from "../../imgs/nosong.jpg";

function MusicPlaylist(props) {
  const {
    index,
    allTracks,
    isMusicExplicit,
    musicName,
    totalPlays,
    duration,
    albumName,
    musicAlbumCDN,
    musicMiniVideoCDN,
    musicAudioCDN,
    artistName,
    isMusicLikedByUser,
    isAlbum,
    albumId,
    artistId,
    musicId,
  } = props;

  const navigate = useNavigate();
  const musicCurrentURL = window.location.pathname;
  const {
    addToQueue,
    clearQueue,
    playFromQueue,
    currentMusic,
    addNextToQueue,
  } = usePlayer();

  const token = JSON.parse(localStorage.getItem("userToken"));
  const [currentIndex, setIndex] = useState(index);
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

  const { menuElement, openMenu } = ContextMenu({
    options: [
      {
        label: "Adicionar à fila",
        icon: (
          <ListStart className="size-4 group-hover:rotate-12 group-hover:text-purple-500 group-hover:scale-125 transition-all" />
        ),
        onClick: () => {
          const musicDataSet = {
            musicName: musicName,
            musicAlbumCDN: musicAlbumCDN,
            musicAudioCDN: musicAudioCDN,
            musicMiniCDN: props.musicMiniVideoCDN,
            albumName: albumName,
            artistName: artistName,
            isMusicLikedByUser: false,
            duration: duration,
            albumId: albumId,
            artistId: artistId,
            musicId: musicId,
            sourceURL: musicCurrentURL,
          };
          addNextToQueue(musicDataSet);
          toast.success(`${musicName} Adicionada Na Fila!`);
        },
      },
      {
        label: "Adicionar à playlist",
        icon: (
          <List className="size-4 group-hover:rotate-12 group-hover:text-purple-500 group-hover:scale-125 transition-all" />
        ),
        onClick: () => {
          setIsAddModal(true);
          handleAddMusicToPlaylist();
        },
      },
    ],
  });

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    secs = Math.floor(secs);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function formatTotalPlays(totalPlays) {
    return totalPlays.toLocaleString("pt-BR");
  }

  function handleIndexChange() {
    if (isAlbum) {
      if (currentIndex === "▸") {
        setIndex(index);
      } else {
        setIndex("▸");
      }
    }
  }

  function handleGoToArtist() {
    navigate(`/artist/${artistId}`);
  }

  function handlePlayQueue() {
    clearQueue();

    if (!allTracks || allTracks.length === 0) {
      const musicData = {
        musicName: musicName,
        musicAlbumCDN: musicAlbumCDN,
        musicAudioCDN: musicAudioCDN,
        musicMiniCDN: musicMiniVideoCDN,
        albumName: albumName,
        artistName: artistName,
        isMusicLikedByUser: false,
        duration: duration,
        albumId: albumId,
        artistId: artistId,
        musicId: musicId,
        sourceURL: musicCurrentURL,
      };

      addToQueue(musicData);
      playFromQueue(0);
      return;
    }

    const currentURL = window.location.pathname;

    allTracks.forEach((track) => {
      const musicData = {
        musicName: track.musicName,
        musicAlbumCDN: track.album?.coverCDN,
        musicAudioCDN: track.musicAudioCDN,
        musicMiniCDN: track.musicMiniCDN,
        albumName: track.album?.albumName,
        artistName: track.album?.artist?.artistName,
        isMusicLikedByUser: false,
        duration: track.duration,
        albumId: track.album?.id,
        artistId: track.album?.artist?.id,
        musicId: track.id,
        sourceURL: currentURL,
      };

      addToQueue(musicData);
    });

    playFromQueue(index - 1);
  }

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
      {menuElement}
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

                    {playlist.musicIds.includes(musicId) && (
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

                    {!playlist.musicIds.includes(musicId) && (
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
                    handlePlaylistChanges(props.musicId);
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
      <div
        onMouseEnter={handleIndexChange}
        onMouseLeave={handleIndexChange}
        onContextMenu={(e) => openMenu({ ...props }, e)}
        className="flex w-full items-center gap-3 p-2 group rounded-lg hover:bg-zinc-900 cursor-pointer transition-all"
      >
        {musicCurrentURL === currentMusic?.sourceURL &&
          musicName === currentMusic?.musicName && (
            <h1 onClick={handlePlayQueue} className="font-bold text-purple-500">
              {currentIndex}
            </h1>
          )}

        {!(
          musicCurrentURL === currentMusic?.sourceURL &&
          musicName === currentMusic?.musicName
        ) && (
          <h1 onClick={handlePlayQueue} className="font-bold">
            {currentIndex}
          </h1>
        )}

        <div className="flex items-center w-full gap-6">
          <div className="flex items-center gap-3 relative">
            {!isAlbum && (
              <div>
                <ImageWithPlaceholder
                  src={musicAlbumCDN}
                  alt={"No Song"}
                  size={48}
                />

                <div
                  className="flex absolute text-white bottom-0 w-12 h-12 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all items-center justify-center rounded-md"
                  onClick={handlePlayQueue}
                >
                  <h1 className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ▸
                  </h1>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              {musicCurrentURL === currentMusic?.sourceURL &&
                musicName === currentMusic?.musicName && (
                  <h1 className="font-bold text-purple-500">{musicName}</h1>
                )}

              {!(
                musicCurrentURL === currentMusic?.sourceURL &&
                musicName === currentMusic?.musicName
              ) && <h1 className="font-bold">{musicName}</h1>}

              <div className="flex items-center gap-1">
                {isMusicExplicit === 1 && (
                  <CircleAlert className="text-red-300 size-4" />
                )}
                <p
                  onClick={handleGoToArtist}
                  className="text-zinc-400 font-medium text-sm hover:underline"
                >
                  {artistName}
                </p>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-5">
            <p className="text-zinc-400 font-normal  text-sm">
              {formatTotalPlays(totalPlays)}
            </p>
            <p className="text-zinc-400 font-normal text-sm">
              {formatDuration(duration)}
            </p>
          </div>
          <button className="group-hover:opacity-100 opacity-0 transition-all">
            {isMusicLikedByUser && (
              <ListX
                onClick={handleAddMusicToPlaylist}
                className="text-purple-500 size-5 hover:text-purple-700 transition-all"
              />
            )}
            {!isMusicLikedByUser && (
              <ListPlus
                onClick={handleAddMusicToPlaylist}
                className="text-zinc-400 size-5 hover:text-white transition-all"
              />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default MusicPlaylist;
