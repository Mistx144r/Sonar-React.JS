import { useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../album/ImageWithPlaceholder";
import { ExternalLink } from "lucide-react";

function PlaylistFixed() {
  const navigate = useNavigate();

  return (
    <>
      <div className="group flex bg-neutral-500 bg-opacity-20 w-full mx-auto items-center gap-2 rounded-lg hover:bg-opacity-40 transition-all cursor-pointer">
        <div className="w-[5.25rem] h-full">
          <ImageWithPlaceholder
            src={
              "https://d2314gw49sr34x.cloudfront.net/1/albums/wipedout/1756922583009-Wiped_Out!_-_Ãlbum.png"
            }
            alt={"Cover"}
          />
        </div>

        <div className="flex flex-1 w-full justify-between items-center">
          <h1 className="text-white font-semibold truncate w-full md:w-[250px] xl:w-[200px]">
            Minha Primeira Playlist Atualizadaa
          </h1>

          <button className="hidden bg-purple-500 p-2 rounded-full duration-300 hover:scale-110 group-hover:opacity-100 opacity-0 mr-3 transition-all lg:block">
            <ExternalLink className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
}

export default PlaylistFixed;
