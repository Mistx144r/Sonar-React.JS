import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MusicPlaylist from "./List/MusicPlaylist";
import AlbumList from "./List/AlbumList";
import BestResult from "./Search/BestResult";

function SearchPage() {
  const { query } = useParams();
  const [isLoading, setLoading] = useState(true);

  const [result, setResult] = useState();
  const [bestResultMusics, setBestResultMusics] = useState([]);
  const [bestResultAlbums, setBestResultAlbums] = useState([]);

  useEffect(() => {
    if (!query) return;

    async function fetchSearchData() {
      setLoading(true);
      setBestResultMusics(null);
      setBestResultAlbums(null);
      setResult(null);

      try {
        const searchResult = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/search?q=${query}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "1",
            },
          }
        );
        setResult(searchResult.data);

        const best = searchResult.data?.bestResult;
        let musics = [];
        let albums = [];

        if (best) {
          if (best.type === "album") {
            const res = await axios.get(
              `${import.meta.env.VITE_SERVER_IP}/musics/album/${best.id}`,
              {
                headers: {
                  "ngrok-skip-browser-warning": "1",
                },
              }
            );
            musics = res.data;
          } else if (best.type === "artist") {
            const resMusics = await axios.get(
              `${import.meta.env.VITE_SERVER_IP}/musics/artist/${best.id}/top`,
              {
                headers: {
                  "ngrok-skip-browser-warning": "1",
                },
              }
            );
            musics = resMusics.data;

            const resAlbums = await axios.get(
              `${import.meta.env.VITE_SERVER_IP}/albums/art/${best.id}`,
              {
                headers: {
                  "ngrok-skip-browser-warning": "1",
                },
              }
            );
            albums = resAlbums.data.slice(0, 5);
          }
        }

        setBestResultMusics(musics);
        setBestResultAlbums(albums);
      } catch (err) {
        console.error(err);
        setBestResultMusics([]);
        setBestResultAlbums([]);
        setResult({});
      } finally {
        setLoading(false);
      }
    }

    fetchSearchData();
  }, [query]);

  return (
    <>
      <div className="flex flex-col w-full h-[calc(100vh-150px)] bg-gradient-to-b from-zinc-900 to-background rounded-xl overflow-y-auto p-8 space-y-5 [&&&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col w-full space-y-2">
          <h1 className="text-2xl text-white font-bold">Filtros</h1>
          <div className="flex w-full h-auto text-neutral-300 gap-3">
            <button className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 hover:scale-105 active:scale-100 transition-all">
              <h1>Tudo</h1>
            </button>
            <button className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 hover:scale-105 active:scale-100 transition-all">
              <h1>Músicas</h1>
            </button>
            <button className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 hover:scale-105 active:scale-100 transition-all">
              <h1>Albums</h1>
            </button>
            <button className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 hover:scale-105 active:scale-100 transition-all">
              <h1>Artistas</h1>
            </button>
            <button className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 hover:scale-105 active:scale-100 transition-all">
              <h1>Usuarios</h1>
            </button>
          </div>
          <div className="flex w-full h-[0.05em] bg-neutral-800"></div>
        </div>
        <div className="flex w-full h-full text-white space-x-10">
          <div className="flex flex-col w-auto min-w-[35%] space-y-4">
            {isLoading && (
              <>
                <div className="flex flex-col w-full space-y-4">
                  <h1 className="font-bold text-2xl">Melhor Resultado</h1>

                  <div className="flex h-[150px] bg-zinc-700 rounded-2xl shadow-md overflow-hidden animate-pulse"></div>
                </div>
              </>
            )}
            {!result?.bestResult && !isLoading && (
              <>
                <div className="flex flex-col gap-3">
                  <h1 className="font-bold text-2xl">Melhor Resultado</h1>
                  <h1 className="">Sem Melhor Resultado!</h1>
                </div>
              </>
            )}
            {!isLoading && <BestResult bestResult={result?.bestResult} />}
          </div>
          {isLoading && (
            <div className="flex flex-col w-full space-y-4">
              <h1 className="font-bold text-xl">Músicas</h1>
              <div className="flex flex-col w-full h-full rounded-lg space-y-2">
                <div className="flex w-full h-12 items-center gap-3 p-2 group rounded-lg bg-zinc-700 animate-pulse"></div>
                <div className="flex w-full h-12 items-center gap-3 p-2 group rounded-lg bg-zinc-700 animate-pulse"></div>
                <div className="flex w-full h-12 items-center gap-3 p-2 group rounded-lg bg-zinc-700 animate-pulse"></div>
                <div className="flex w-full h-12 items-center gap-3 p-2 group rounded-lg bg-zinc-700 animate-pulse"></div>
                <div className="flex w-full h-12 items-center gap-3 p-2 group rounded-lg bg-zinc-700 animate-pulse"></div>
              </div>
            </div>
          )}
          {!isLoading && (
            <div className="flex flex-1 flex-col w-full space-y-4">
              <h1 className="font-bold text-xl">Músicas</h1>
              <div className="flex flex-col w-full">
                {!result?.musics?.length && !bestResultMusics.length && (
                  <h1 className="text-white font-normal">
                    Nenhuma Musica Relacionada Com Essa Pesquisa...
                  </h1>
                )}
                {!isLoading &&
                  (bestResultMusics.length > 0
                    ? bestResultMusics
                    : result?.musics
                  )
                    ?.slice(0, 5)
                    .map((track, index) => (
                      <MusicPlaylist
                        key={track?.id}
                        index={index + 1}
                        musicId={track.id}
                        musicAlbumCDN={track?.album?.coverCDN}
                        musicMiniVideoCDN={track?.musicMiniCDN}
                        albumName={track?.album?.albumName}
                        albumId={track?.album?.id}
                        artistName={track?.album?.artist?.artistName}
                        artistId={
                          track?.album?.artistId || track?.album?.artist?.id
                        }
                        {...track}
                      />
                    ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-full p-5 text-white font-bold rounded-b-none">
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col w-full h-full gap-3">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-2xl">Albums</h1>
                <button className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-full hover:scale-105 hover:brightness-90 active:scale-100 transition-all duration-200">
                  See All
                </button>
              </div>
              {isLoading && (
                <div className="flex w-full h-[230px] overflow-x-auto gap-4 p-2">
                  <div className="flex flex-col w-[200px] h-full rounded-lg overflow-hidden p-2 bg-zinc-700 animate-pulse"></div>
                  <div className="flex flex-col w-[200px] h-full rounded-lg overflow-hidden p-2 bg-zinc-700 animate-pulse"></div>
                  <div className="flex flex-col w-[200px] h-full rounded-lg overflow-hidden p-2 bg-zinc-700 animate-pulse"></div>
                  <div className="flex flex-col w-[200px] h-full rounded-lg overflow-hidden p-2 bg-zinc-700 animate-pulse"></div>
                  <div className="flex flex-col w-[200px] h-full rounded-lg overflow-hidden p-2 bg-zinc-700 animate-pulse"></div>
                  <div className="flex flex-col w-[200px] h-full rounded-lg overflow-hidden p-2 bg-zinc-700 animate-pulse"></div>
                </div>
              )}
              {!isLoading && (
                <div className="flex w-full overflow-x-auto gap-4 p-2">
                  {!result?.albums?.length && !bestResultAlbums.length && (
                    <h1 className="text-white font-normal">
                      Nenhum Album Relacionado Com Essa Pesquisa...
                    </h1>
                  )}
                  {(() => {
                    const MAX_ALBUMS = 5;
                    const displayed =
                      result?.albums?.slice(0, MAX_ALBUMS) || [];
                    const remaining = MAX_ALBUMS - displayed.length;
                    const combined = [
                      ...displayed,
                      ...(bestResultAlbums?.slice(0, remaining) || []),
                    ];

                    const uniqueAlbums = combined.filter(
                      (album, index, self) =>
                        index === self.findIndex((a) => a.id === album.id)
                    );

                    return uniqueAlbums.map((album) => (
                      <AlbumList
                        key={album.id}
                        id={album.id}
                        albumName={album.albumName}
                        data_lancamento={album.data_lancamento}
                        coverCDN={album.coverCDN}
                      />
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
