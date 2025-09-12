import { useState, useRef, useEffect } from "react";

export default function ContextMenu({ options }) {
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    target: null,
  });
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const openMenu = (target, event) => {
    event.preventDefault();
    setMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      target,
    });
  };

  const menuStyle = {
    top: menu.y,
    left: menu.x,
    position: "fixed",
    zIndex: 50,
    transform: `translate(${menu.x + 150 > window.innerWidth ? -150 : 0}px, ${
      menu.y + options.length * 40 > window.innerHeight ? -menu.y / 2 : 0
    }px)`,
  };

  return {
    menuElement: menu.visible ? (
      <ul
        ref={menuRef}
        style={menuStyle}
        className={`bg-zinc-900 text-white rounded-md shadow-lg p-[0.25rem] w-80 absolute animate-fadeIn`}
      >
        {options.map((option, index) => (
          <>
            <li
              key={index}
              className="group flex items-center space-x-2 px-4 p-2 rounded-lg cursor-pointer hover:bg-zinc-800 hover:scale-110 transition-all"
              onClick={() => {
                option.onClick(menu.target);
                setMenu((prev) => ({ ...prev, visible: false }));
              }}
            >
              {option.icon}
              <h1>{option.label}</h1>
            </li>
          </>
        ))}
      </ul>
    ) : null,
    openMenu,
  };
}
