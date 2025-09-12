import { Play, SquareArrowOutUpRight } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../album/ImageWithPlaceholder";
import nosong from "../../imgs/nosong.jpg";

function BestResult({ bestResult }) {
  const navigate = useNavigate();
  const { playMusic, currentMusic } = usePlayer();

  if (!bestResult) return null;

  const isArtist = bestResult.type === "artist";
  const isAlbum = bestResult.type === "album";
  const isMusic = bestResult.type === "music";

  const imageURL = isArtist
    ? bestResult.artistImageCDN
    : isAlbum
    ? bestResult.coverCDN
    : bestResult.album.coverCDN;

  let subText = "";
  if (isArtist)
    subText = `${bestResult.totalFollowers} seguidores • ${
      bestResult.isVerified ? "Verificado" : "Não verificado"
    }`;
  if (isAlbum)
    subText = `Álbum • ${new Date(
      bestResult.data_lancamento
    ).getFullYear()} • ${bestResult.artist.artistName}`;
  if (isMusic)
    subText = `Música • ${bestResult.album.albumName} • ${Math.floor(
      bestResult.duration / 60
    )}:${Math.floor(bestResult.duration % 60)
      .toString()
      .padStart(2, "0")}`;

  const titleText = isArtist
    ? bestResult.artistName
    : isAlbum
    ? bestResult.albumName
    : bestResult.musicName;

  function navigateTo() {
    if (isAlbum) {
      navigate(`/album/${bestResult.id}`);
    }
    if (isArtist) {
      navigate(`/artist/${bestResult.id}`);
    }
  }

  function handlePlayMusic() {
    console.log(bestResult);
    const currentURL = window.location.pathname;
    playMusic({
      musicName: bestResult?.musicName,
      musicAlbumCDN: bestResult?.album?.coverCDN,
      musicAudioCDN: bestResult?.musicAudioCDN,
      musicMiniCDN: bestResult?.musicMiniCDN,
      albumName: bestResult?.album?.albumName,
      artistName: bestResult?.album?.artist?.artistName,
      isMusicLikedByUser: false,
      duration: bestResult?.duration,
      sourceURL: currentURL,
      albumId: bestResult?.album?.id,
      artistId: bestResult?.album?.artistId,
    });
  }

  return (
    <div className="flex flex-col w-full max-w-[600px] space-y-4">
      <h1 className="font-bold text-2xl">Melhor Resultado</h1>

      <div className="flex h-[150px] bg-zinc-900 rounded-2xl shadow-md overflow-hidden items-center hover:scale-[1.02] transition-transform cursor-pointer group">
        <div className="relative inline-block w-[150px] h-[150px] group/card">
          <ImageWithPlaceholder src={imageURL} alt={nosong} />
        </div>
        <div className="flex flex-col justify-center px-4 overflow-hidden">
          <h1 className="font-bold text-xl truncate">{titleText}</h1>
          <p className="text-zinc-400 truncate">{subText}</p>
        </div>
        {isMusic && (
          <button
            onClick={handlePlayMusic}
            className="ml-auto mr-4 bg-purple-500 p-3 rounded-full hover:scale-110 active:scale-95 transition-all"
          >
            <Play />
          </button>
        )}
        {isAlbum && (
          <button
            onClick={navigateTo}
            className="ml-auto mr-4 bg-purple-500 p-3 rounded-full hover:scale-110 active:scale-95 transition-all"
          >
            <SquareArrowOutUpRight />
          </button>
        )}
        {isArtist && (
          <button
            onClick={navigateTo}
            className="ml-auto mr-4 bg-purple-500 p-3 rounded-full hover:scale-110 active:scale-95 transition-all"
          >
            <SquareArrowOutUpRight />
          </button>
        )}
      </div>
    </div>
  );
}

export default BestResult;
