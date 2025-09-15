import { useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../album/ImageWithPlaceholder";

function AlbumList(albumData) {
  const navigate = useNavigate();

  function getAlbumYear(releaseDate) {
    const date = new Date(releaseDate);
    return date.getFullYear();
  }

  function handleAlbumChange() {
    navigate(`/album/${albumData?.id}`);
  }

  return (
    <>
      <div
        onClick={handleAlbumChange}
        className="flex flex-col w-[200px] h-full rounded-lg overflow-hidden p-2 group hover:bg-neutral-800 hover:scale-105 active:scale-100 cursor-pointer transition-all"
      >
        <ImageWithPlaceholder
          src={albumData?.coverCDN}
          alt={"Cover"}
          size={185}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-white font-semibold mt-2 w-full h-auto line-clamp-2 group-hover:text-purple-500 transition-all group-hover:underline">
            {albumData.albumName}
          </h1>
          <h1 className="text-xs font-normal text-neutral-400">
            {getAlbumYear(albumData.data_lancamento)} • Album
          </h1>
        </div>
      </div>
    </>
  );
}

export default AlbumList;
