import Header from "../components/Header.jsx";
import Dashboard from "../components/Dashboard.jsx";
import PlaylistsSideBar from "../components/PlaylistsSideBar.jsx";
import MiniPlayer from "../components/MiniPlayer.jsx";
import PlayerController from "../components/PlayerController.jsx";

function App() {
  return (
    <div className="flex flex-col w-screen h-screen select-none">
      <Header />
      <div className="flex flex-1 gap-3 px-5">
        <PlaylistsSideBar />
        <Dashboard />
        <MiniPlayer />
      </div>
      <PlayerController />
    </div>
  );
}

export default App;
