import axios from "axios";
import VanillaTilt from "vanilla-tilt";
import {
  CloudDownload,
  Ellipsis,
  ExternalLink,
  Frown,
  PlayCircle,
  PlusCircle,
  Search,
  Shuffle,
  UserStar,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MusicPlaylist from "./List/MusicPlaylist";
import ImageWithPlaceholder from "./album/ImageWithPlaceholder";

function AlbumPage() {
  const { albumId } = useParams();

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [albumData, setAlbumData] = useState();
  const [albumMusics, setAlbumMusics] = useState();
  const [artistData, setArtistData] = useState();

  const tiltRef = useRef(null);

  function getAlbumYear(releaseDate) {
    const date = new Date(releaseDate);
    return date.getFullYear();
  }

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
    albumMusics?.forEach((currentMusic) => {
      totalTime += currentMusic.duration;
    });

    return formatPlaylistDuration(totalTime);
  }

  const handleClick = () => {
    if (artistData?.id) {
      navigate(`/artist/${artistData.id}`);
    }
  };

  useEffect(() => {
    if (!albumId) return;

    setError(null);

    async function fetchAlbumData() {
      try {
        const [allMusicOnAlbum, currentAlbum] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_SERVER_IP}/musics/album/${albumId}`,
            {
              headers: {
                "ngrok-skip-browser-warning": "1",
              },
            }
          ),
          axios.get(`${import.meta.env.VITE_SERVER_IP}/albums/${albumId}`, {
            headers: {
              "ngrok-skip-browser-warning": "1",
            },
          }),
        ]);

        setAlbumMusics(allMusicOnAlbum.data);
        setAlbumData(currentAlbum.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("404");
        } else {
          setError("Erro ao carregar o álbum");
        }
      }
    }

    fetchAlbumData();
  }, [albumId]);

  useEffect(() => {
    if (!albumData?.artistId) return;

    async function fetchArtistData() {
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/artists/${albumData.artistId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "1",
            },
          }
        );
        setArtistData(profileRes.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("404");
        } else {
          setError("Erro ao carregar o artista");
        }
      }
    }

    fetchArtistData();
  }, [albumData?.artistId]);

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

  if (error === "404")
    return (
      <>
        <div className="flex flex-col w-full h-full rounded-xl bg-background justify-center items-center text-white gap-5">
          <Frown className="size-20" />
          <h1 className="font-bold text-3xl">Erro 404 Album Não Encontrado</h1>
        </div>
      </>
    );
  if (error)
    return (
      <>
        <div className="flex flex-col w-full h-full rounded-xl bg-background justify-center items-center text-white gap-5">
          <X className="size-20" />
          <h1 className="font-bold text-3xl">Erro Desconhecido!</h1>
        </div>
      </>
    );

  return (
    <>
      <div className="flex w-full h-full bg-gradient-to-b from-zinc-900 to-background rounded-xl p-8 space-x-5 overflow-y-auto">
        <div className="flex flex-col w-full h-full space-y-6">
          <div className="flex flex-col items-start space-y-6">
            <div
              ref={tiltRef}
              className="w-[250px] h-[250px] rounded-lg overflow-hidden bg-transparent lg:hidden"
            >
              <ImageWithPlaceholder
                src={albumData?.coverCDN}
                alt={albumData?.albumName}
              />
            </div>
            <div className="flex flex-col w-full h-auto text-white space-y-4">
              <h1 className="font-bold text-5xl">{albumData?.albumName}</h1>
              <div className="flex gap-2 text-neutral-400 text-sm items-center">
                <UserStar className="size-5" />
                <div className="flex gap-1">
                  <button onClick={handleClick}>
                    <h1 className="hover:underline cursor-pointer hover:text-purple-500 text-white">
                      {`${artistData?.artistName}`}
                    </h1>
                  </button>
                  <h1>
                    {`• ${getAlbumYear(albumData?.data_lancamento)} • ${
                      albumMusics?.length
                    } Músicas • ${getTotalPlaylist()}`}
                  </h1>
                </div>
              </div>
              <div className="flex w-full text-white justify-between items-center">
                <div className="flex items-center space-x-6">
                  <button>
                    <PlayCircle className="size-12 cursor-pointer hover:text-purple-500 hover:scale-105 active:scale-100 transition-all" />
                  </button>
                  <button>
                    <Shuffle className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                  <button>
                    <PlusCircle className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                  <button>
                    <CloudDownload className="cursor-pointer hover:scale-105 hover:text-purple-500 active:scale-100 transition-all" />
                  </button>
                  <button>
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
                {albumMusics?.length === 0 && (
                  <h1 className="text-center text-white text-sm">
                    Esse álbum ainda não possui músicas.
                  </h1>
                )}
                {albumMusics?.map((music, index) => (
                  <MusicPlaylist
                    key={music.id}
                    index={index + 1}
                    allTracks={albumMusics}
                    musicName={music.musicName}
                    totalPlays={music.totalPlays || 0}
                    duration={music.duration}
                    albumName={albumData.albumName}
                    musicAlbumCDN={albumData.coverCDN}
                    musicAudioCDN={music.musicAudioCDN}
                    musicMiniVideoCDN={music.musicMiniCDN}
                    artistName={artistData?.artistName}
                    isMusicExplicit={music.isMusicExplicit}
                    isMusicLikedByUser={music.isMusicLikedByUser || false}
                    artistId={artistData?.id}
                    musicId={music.id}
                    isAlbum={true}
                    albumId={albumData.id}
                  />
                ))}
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
              src={albumData?.coverCDN}
              alt={albumData?.albumName}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AlbumPage;
