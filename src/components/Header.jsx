import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Search,
  UserCircle,
} from "lucide-react";

function Header() {
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
