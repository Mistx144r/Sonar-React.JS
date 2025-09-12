<<<<<<< HEAD
function Dashboard() {
  return (
    <>
      <div className="flex w-full h-full rounded-xl bg-background"></div>
=======
import axios from "axios";
import { useEffect, useState } from "react";
import PlaylistFixed from "./List/PlaylistFixed";
import sonarlogowhite from "../imgs/Logo_Sonar_White.png";
import { motion, useAnimation } from "framer-motion";

function Dashboard() {
  const controls = useAnimation();
  const [maxFixedPlaylists, setMaxFixedPlaylists] = useState(8);

  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.25)`;
  }

  function handleHover() {
    const color = randomColor();
    const newGradient = `linear-gradient(to bottom, ${color} 0%, ${color.replace(
      "0.25",
      "0.1"
    )} 70%, ${color.replace("0.25", "0")} 100%)`;

    controls.start({
      background: newGradient,
      transition: { duration: 0.5, ease: "easeInOut" }, // smooth
    });
  }

  useEffect(() => {
    async function fetchUserData() {
      const userToken = JSON.parse(localStorage.getItem("userToken"));
      if (!userToken) return;

      setUserId(userToken.user.id);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/users/${userToken.user.id}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "1",
            },
          }
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        localStorage.removeItem("userToken");
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 770) {
        setMaxFixedPlaylists(2);
      } else if (window.innerWidth < 1450) {
        setMaxFixedPlaylists(4);
      } else {
        setMaxFixedPlaylists(8);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-full rounded-xl bg-gradient-to-b from-zinc-900 to-background items-center">
        <motion.div
          animate={controls}
          style={{
            background:
              "linear-gradient(to bottom, rgba(168,75,247,0.25) 0%, rgba(168,75,247,0.1) 70%, rgba(168,75,247,0) 100%)",
          }}
          className="flex rounded-lg w-full h-auto relative justify-center p-5"
        >
          <div className="flex flex-col w-full 2xl:w-full max-w-[1500px] gap-5">
            <div className="flex justify-between items-center">
              <h1 className="text-white font-bold text-4xl">
                Olá {userData?.nome}!
              </h1>
              <img
                className="h-20 animate-pulse hidden md:block"
                src={sonarlogowhite}
              />
            </div>
            <div className="grid sm:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-3 w-full h-[180px] overflow-hidden">
              {[...Array(maxFixedPlaylists)].map((_, i) => (
                <motion.div
                  key={i}
                  onHoverStart={handleHover}
                  className="w-full h-full animate-fadeIn"
                >
                  <PlaylistFixed />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
>>>>>>> b179d2f (Novas Features Como Pagina Do Artista, Playlist, Album, Pagina De Pesquisa, Playlist Na Sidebar, Mini Player, Header E Controller, Context Para Controlar As Musicas Universalmente No Aplicativo, Pagina De Login, Proteção De Rotas Com O React Router. Consertei Varios Bugs No Caminho.)
    </>
  );
}

export default Dashboard;
