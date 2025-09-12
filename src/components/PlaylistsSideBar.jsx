import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { ExternalLink, Music, Pencil, Pin, Plus, Trash } from "lucide-react";
import PlaylistsSide from "../components/List/PlaylistSide";
import axios from "axios";
import ContextMenu from "./Menus/ContextMenu";
import { useNavigate } from "react-router-dom";

function PlaylistsSideBar() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchPlaylists() {
      setIsLoading(true);

      try {
        const token = JSON.parse(localStorage.getItem("userToken"));

        if (!token) {
          console.warn("Nenhum token encontrado.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/playlists/user`,
          {
            headers: {
              Authorization: `Bearer ${token.token.token}`,
            },
          }
        );

        setPlaylists(response.data);
        setUsername(token.user.nome);
      } catch (error) {
        console.error("Erro ao buscar playlists:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlaylists();
  }, []);

  useEffect(() => {
    const handleUpdate = (e) => {
      const updated = e.detail;
      setPlaylists((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    };
    window.addEventListener("playlistUpdated", handleUpdate);
    return () => window.removeEventListener("playlistUpdated", handleUpdate);
  }, []);

  async function handleCreatePlaylist() {
    const playlistNumber = playlists.length + 1;
    const playlistName = `Playlist nº ${playlistNumber}`;

    const token = JSON.parse(localStorage.getItem("userToken"));

    const createPromise = axios.post(
      "http://localhost:3000/playlists/",
      { name: playlistName },
      {
        headers: {
          Authorization: `Bearer ${token.token.token}`,
        },
      }
    );
    toast.promise(createPromise, {
      pending: "Playlist sendo criada...",
      success: "Playlist criada com sucesso!",
      error: "Erro ao criar playlist...",
    });

    try {
      const response = await createPromise;
      setPlaylists((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Erro ao criar playlist:", err);
    } finally {
      setIsOpen(false);
    }
  }

  async function handleDeletePlaylist(playlistId) {
    const token = JSON.parse(localStorage.getItem("userToken"));

    const deletePromise = axios.delete(
      `${import.meta.env.VITE_SERVER_IP}/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token.token.token}`,
        },
      }
    );

    toast.promise(deletePromise, {
      pending: "Excluindo playlist...",
      success: "Playlist excluída com sucesso!",
      error: "Erro ao excluir playlist...",
    });

    try {
      await deletePromise;
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    } catch (err) {
      console.error("Erro ao deletar playlist:", err);
    }
  }

  const { menuElement, openMenu } = ContextMenu({
    options: [
      {
        label: "Abrir Playlist",
        icon: (
          <ExternalLink className="size-4 group-hover:rotate-12 group-hover:text-purple-500 group-hover:scale-110 transition-all" />
        ),
        onClick: (playlistId) => navigate(`/playlist/${playlistId}`),
      },
      {
        label: "Fixar Homepage",
        icon: (
          <Pin className="size-4 group-hover:rotate-12 group-hover:text-purple-500 group-hover:scale-110 transition-all" />
        ),
        onClick: (playlistId) => navigate(`/playlist/${playlistId}?edit=true`),
      },
      {
        label: "Editar",
        icon: (
          <Pencil className="size-4 group-hover:rotate-12 group-hover:text-purple-500 group-hover:scale-110 transition-all" />
        ),
        onClick: (playlistId) => navigate(`/playlist/${playlistId}?edit=true`),
      },
      {
        icon: (
          <Trash className="size-4 group-hover:rotate-12 group-hover:text-purple-500 group-hover:scale-110 transition-all" />
        ),
        label: "Deletar",
        onClick: (playlistId) => handleDeletePlaylist(playlistId),
      },
    ],
  });

  return (
    <div className="hidden md:flex flex-col w-[10%] h-full bg-gradient-to-b from-zinc-900 to-background rounded-xl lg:w-[90px] min-w-[90px] relative p-3 pb-10">
      <div
        className="flex flex-col w-full items-center justify-start py-2 mb-3 relative"
        ref={menuRef}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-zinc-800 p-3 rounded-full hover:scale-110 hover:brightness-90 transition-all"
        >
          <Plus
            className={`text-white font-bold ${
              isOpen ? "rotate-45 scale-125" : "rotate-0"
            } transition-all`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-4 mt-2 w-[400px] bg-background rounded-lg shadow-lg z-50">
            <ul className="flex flex-col p-1 gap-2 text-white">
              <li className="group flex hover:bg-zinc-900 active:brightness-90 p-2 rounded cursor-pointer items-center space-x-4 transition-all">
                <div className="bg-zinc-950 rounded-full p-4">
                  <Music className="group-hover:rotate-12 group-hover:scale-150 group-hover:text-purple-500 transition-all" />
                </div>

                <div onClick={handleCreatePlaylist} className="flex-1 flex-col">
                  <h1 className="text-xl font-semibold">Criar Playlist</h1>
                  <h1 className="text-sm text-neutral-300">
                    Crie um espacinho para guardar suas músicas favoritas.
                  </h1>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full h-full items-center space-y-2">
        {isLoading && (
          <>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
            <div className="flex items-center w-full h-16 rounded-md p-[0.4em] bg-zinc-700 animate-pulse"></div>
          </>
        )}
        {!isLoading &&
          playlists.map((playlist) => (
            <PlaylistsSide
              key={playlist.id}
              playlistId={playlist.id}
              username={username}
              playlistName={playlist.name}
              coverCDN={playlist.coverCDN}
              onRightClick={(id, e) => openMenu(id, e)}
            />
          ))}

        {menuElement}
      </div>
    </div>
  );
}

export default PlaylistsSideBar;
