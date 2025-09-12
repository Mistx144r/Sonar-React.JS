import MusicPlaylist from "./List/MusicPlaylist";
import axios from "axios";
import AlbumList from "./List/AlbumList";

import { BadgeCheck, PlayCircle, Frown, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import noprofile from "../imgs/noprofile.webp";
import nocover from "../imgs/nocover.gif";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

function ArtistProfile() {
  const { artistId } = useParams();

  const [artistData, setArtistData] = useState({});
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artistTopTracks, setArtistTopTracks] = useState([]);

  const scrollRef = useRef(null);
  const y = useMotionValue(0);

  const opacity = useTransform(y, [0, 350], [1, 0]);
  const headerOpacity = useTransform(y, [300, 400], [0, 1]);
  const zoom = useTransform(y, [0, 350], [1, 1.2]);

  const smoothScale = useSpring(zoom, { stiffness: 150, damping: 30 });

  const [error, setError] = useState(null);

  const handleScroll = () => {
    if (scrollRef.current) y.set(scrollRef.current.scrollTop);
  };

  useEffect(() => {
    if (!artistId) return;

    setError(null);

    async function fetchArtistData() {
      try {
        const [profileRes, albumsRes, topTracksRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_IP}/artists/${artistId}`, {
            headers: {
              "ngrok-skip-browser-warning": "1",
            },
          }),
          axios.get(
            `${import.meta.env.VITE_SERVER_IP}/albums/art/${artistId}`,
            {
              headers: {
                "ngrok-skip-browser-warning": "1",
              },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_SERVER_IP}/musics/artist/${artistId}/top`,
            {
              headers: {
                "ngrok-skip-browser-warning": "1",
              },
            }
          ),
        ]);

        setArtistData(profileRes.data);
        setArtistAlbums(albumsRes.data);
        setArtistTopTracks(topTracksRes.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("404");
        } else {
          setError("Erro ao carregar o artista");
        }
      }
    }

    fetchArtistData();
  }, [artistId]);

  if (error === "404")
    return (
      <>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-col w-full h-full rounded-xl bg-background justify-center items-center text-white gap-5"
        >
          <Frown className="size-20" />
          <h1 className="font-bold text-3xl">
            Erro 404 Artista Não Encontrado
          </h1>
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
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-full rounded-xl bg-background overflow-y-auto [&&&::-webkit-scrollbar]:hidden overflow-x-hidden"
      >
        <motion.div
          className="sticky top-0 left-0 w-full h-16 bg-zinc-900 flex items-center px-5 text-white text-xl font-bold z-30 drop-shadow-md -m-8"
          style={{
            opacity: headerOpacity,
            display: y.get() > 200 ? "flex" : "none",
          }}
        >
          <div className="flex w-full items-center justify-between">
            {artistData.artistName || "Loading..."}
          </div>
        </motion.div>

        <div className="relative w-full h-[55vh] rounded-t-xl overflow-hidden shadow-xl">
          <div className="relative w-full h-full group overflow-hidden bg-zinc-900">
            <motion.img
              src={artistData.artistBackgroundImageCDN || nocover}
              alt="cover"
              style={{ opacity: opacity, scale: smoothScale }}
              className="w-full h-full object-top object-cover group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_100%,rgba(0,0,0,0.8)_0%)]"></div>

            <div className="absolute bottom-0 left-0 w-full p-5 text-white drop-shadow-lg">
              <img
                alt="profile"
                className="w-32 h-32 hidden rounded-full border-2 border-black mb-4 object-cover shadow-2xl 2xl:block"
                src={artistData.artistImageCDN || noprofile}
              />
              <div className="flex items-center w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center font-semibold gap-2 text-xs">
                    <h1 className="text-5xl font-black lg:text-7xl">
                      {artistData.artistName || "Loading..."}
                    </h1>
                    {artistData.isVerified && (
                      <BadgeCheck className="size-8 text-purple-500" />
                    )}
                  </div>
                  <h1 className="text-zinc-300 font-normal text-xs">
                    0 ouvintes mensais
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full h-auto p-5 text-white font-bold bg-gradient-to-b from-zinc-900 to-background rounded-b-none gap-3">
          <div className="flex flex-col w-full h-full">
            <h1 className="text-2xl">Trending</h1>
            <div className="w-full h-[325px] overflow-y-auto mt-3 [&&&::-webkit-scrollbar]:hidden scrollbar-hide">
              {artistTopTracks <= 0 && (
                <h1 className="text-sm font-normal">
                  Aparentemente Esse Artista Ainda Não Tem Nenhuma Música...
                </h1>
              )}
              {artistTopTracks.map((track, index) => (
                <MusicPlaylist
                  key={track.id}
                  index={index + 1}
                  allTracks={artistTopTracks}
                  musicAlbumCDN={track.album.coverCDN}
                  albumName={track.album.albumName}
                  albumId={track.album.albumId}
                  artistName={track.album.artist.artistName}
                  artistId={track.album.artist.id}
                  musicId={track.id}
                  {...track}
                />
              ))}
            </div>
          </div>
          <div className="hidden flex-col w-full h-full 2xl:flex">
            <h1 className="text-2xl text-right">
              Meet {artistData.artistName}!
            </h1>
          </div>
        </div>

        <div className="w-full h-[60%] p-5 text-white font-bold rounded-b-none">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col w-full h-full gap-3">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-2xl">Albums</h1>
                <button className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-full hover:scale-105 hover:brightness-90 active:scale-100 transition-all duration-200">
                  See All
                </button>
              </div>
              <div className="flex w-full overflow-x-auto flex-wrap gap-4 p-2">
                {artistAlbums <= 0 && (
                  <h1 className="text-sm font-normal">
                    Aparentemente Esse Artista Ainda Não Tem Nenhum Album...
                  </h1>
                )}
                {artistAlbums.map((album) => (
                  <AlbumList key={album.id} {...album} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtistProfile;
