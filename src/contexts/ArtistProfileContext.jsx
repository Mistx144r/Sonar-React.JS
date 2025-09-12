import { createContext, useState, useContext } from "react";
const ArtistProfileContext = createContext();

export function ArtistProfileProvider({ children }) {
  const [currentArtistId, setArtistId] = useState(2);

  return (
    <ArtistProfileContext.Provider value={{ currentArtistId, setArtistId }}>
      {children}
    </ArtistProfileContext.Provider>
  );
}

export const useArtistProfile = () => useContext(ArtistProfileContext);
