<<<<<<< HEAD
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> b179d2f (Novas Features Como Pagina Do Artista, Playlist, Album, Pagina De Pesquisa, Playlist Na Sidebar, Mini Player, Header E Controller, Context Para Controlar As Musicas Universalmente No Aplicativo, Pagina De Login, Proteção De Rotas Com O React Router. Consertei Varios Bugs No Caminho.)
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
<<<<<<< HEAD
=======
  LayoutDashboard,
>>>>>>> b179d2f (Novas Features Como Pagina Do Artista, Playlist, Album, Pagina De Pesquisa, Playlist Na Sidebar, Mini Player, Header E Controller, Context Para Controlar As Musicas Universalmente No Aplicativo, Pagina De Login, Proteção De Rotas Com O React Router. Consertei Varios Bugs No Caminho.)
  Search,
  UserCircle,
} from "lucide-react";

function Header() {
<<<<<<< HEAD
  return (
    <>
      <nav className="flex w-screen h-auto items-center relative p-5 select-none">
        <div className="flex items-center space-x-2">
          <Ellipsis className="text-zinc-300 size-10 cursor-pointer transition-all hover:scale-110 active:scale-95" />
          <div className="flex space-x-2">
            <ChevronLeft className="text-zinc-300 size-10 cursor-pointer transition-all hover:scale-110 active:scale-95" />
            <ChevronRight className="text-zinc-300 size-10 cursor-pointer transition-all hover:scale-110 active:scale-95" />
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="relative w-[28rem] transition-transform duration-200 ease-out focus-within:scale-110">
            <input
              type="text"
              placeholder="O que você quer ouvir?"
              className="
    pl-10 pr-2 py-[0.75em] rounded-full w-full
    bg-zinc-900 text-zinc-300 placeholder-zinc-300
    transition-all duration-300 ease-in-out
    focus:outline-none 
    focus:ring-2 focus:ring-white
  "
=======
  const [searchQuery, setSearchQuery] = useState("");
  const currentURL = window.location.pathname;
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  function returnPage() {
    window.history.back();
  }

  function nextPage() {
    window.history.forward();
  }

  function goHome() {
    navigate("/");
  }

  return (
    <>
      <nav className="flex w-full h-auto items-center relative p-5 select-none">
        <div className="flex items-center space-x-2">
          <Ellipsis className="text-zinc-300 size-10 cursor-pointer transition-all hover:scale-110 active:scale-95" />
          <div className="flex space-x-2">
            <ChevronLeft
              onClick={returnPage}
              className="text-zinc-300 size-10 cursor-pointer transition-all hover:scale-110 active:scale-95"
            />
            <ChevronRight
              onClick={nextPage}
              className="text-zinc-300 size-10 cursor-pointer transition-all hover:scale-110 active:scale-95"
            />
          </div>
        </div>

        <div className="flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-2">
          <button
            onClick={goHome}
            className="bg-zinc-900 p-3 rounded-full hover:scale-110 active:scale-100 transition-all"
          >
            <LayoutDashboard
              className={`text-white ${
                currentURL === "/" ? "fill-white" : ""
              } transition-all`}
            />
          </button>
          <div className="relative w-[28rem]">
            <input
              type="text"
              placeholder="O que você quer ouvir?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="
                pl-10 pr-2 py-[0.75em] rounded-full w-full
                bg-zinc-900 text-zinc-300 placeholder-zinc-300
                transition-all duration-200 ease-out
                focus:outline-none 
                focus:ring-2 focus:ring-white
              "
>>>>>>> b179d2f (Novas Features Como Pagina Do Artista, Playlist, Album, Pagina De Pesquisa, Playlist Na Sidebar, Mini Player, Header E Controller, Context Para Controlar As Musicas Universalmente No Aplicativo, Pagina De Login, Proteção De Rotas Com O React Router. Consertei Varios Bugs No Caminho.)
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-300" />
          </div>
        </div>

        <UserCircle className="text-zinc-300 size-10 ml-auto cursor-pointer transition-all hover:scale-110 active:scale-95" />
      </nav>
    </>
  );
}

export default Header;
