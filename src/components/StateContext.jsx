"use client";

import { createContext, useEffect, useState } from "react";

export const StateContext = createContext({ songs: [] });

export default function StateContextProvider({ children }) {
  const [choirId, setChoirId] = useState(localStorage.getItem("choirId"));
  const [songId, setSongId] = useState(localStorage.getItem("songId"));

  useEffect(() => {
    // Store state in local storage
    localStorage.setItem("choirId", choirId);
    localStorage.setItem("songId", songId);
  }, [choirId, songId]);

  return (
    <StateContext.Provider value={{ choirId, setChoirId, songId, setSongId }}>
      {children}
    </StateContext.Provider>
  );
}
