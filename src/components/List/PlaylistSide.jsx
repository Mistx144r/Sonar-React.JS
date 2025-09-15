import { useNavigate } from "react-router-dom";
import nosong from "../../imgs/nosong.jpg";
import ImageWithPlaceholder from "../album/ImageWithPlaceholder";
import { usePlayer } from "../../contexts/PlayerContext";
import axios from "axios";
import { useEffect, useState } from "react";

function PlaylistsSide({
  username,
  playlistName,
  coverCDN,
  playlistId,
  onRightClick,
}) {
  const navigate = useNavigate();
  const { currentMusic } = usePlayer();
  const [userMusics, setUserMusics] = useState([]);

  useEffect(() => {
    async function fetchMusicsData() {
      try {
        const token = JSON.parse(localStorage.getItem("userToken"));

        const musics = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/playlistMusics/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token.token}`,
            },
          }
        );

        setUserMusics(musics.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMusicsData();
  }, [playlistId]);

  return (
    <div
      onContextMenu={(e) => onRightClick(playlistId, e)}
      onClick={() => navigate(`/playlist/${playlistId}`)}
      className={`flex items-center max-w-24 rounded-md p-[0.4em] cursor-pointer hover:bg-zinc-800 transition-all relative ${
        userMusics.some((item) => item.music.musicId === currentMusic?.id) &&
        currentMusic?.sourceURL === `/playlist/${playlistId}`
          ? "order-first"
          : ""
      }`}
    >
      <div className="relative group">
        <ImageWithPlaceholder
          src={coverCDN || nosong}
          alt={"Cover"}
          size={48}
        />
        <div className="absolute left-[120%] top-0 w-[200px] p-2 bg-zinc-800 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[20]">
          <h1
            className={`font-semibold text-sm truncate ${
              currentMusic?.sourceURL === `/playlist/${playlistId}`
                ? "text-purple-500 font-black"
                : "text-white"
            }`}
          >
            {playlistName}
          </h1>
          <h1 className="text-xs text-neutral-300">Playlist • {username}</h1>
        </div>
      </div>
    </div>
  );
}

export default PlaylistsSide;
