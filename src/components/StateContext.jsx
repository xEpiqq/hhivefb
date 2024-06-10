"use client";

import { createContext, useEffect, useState } from "react";

export const StateContext = createContext({ songs: [] });

export default function StateContextProvider({ children }) {
  const [choirId, setChoirId] = useState();
  const [songId, setSongId] = useState();

  useEffect(() => {
    // Store state in local storage
    localStorage.setItem("choirId", choirId);
    localStorage.setItem("songId", songId);
  }, [choirId, songId]);

  useEffect(() => {
    // Retrieve state from local storage
    setChoirId(localStorage.getItem("choirId"));
    setSongId(localStorage.getItem("songId"));
  }, []);

  return (
    <StateContext.Provider value={{ choirId, setChoirId, songId, setSongId }}>
      {children}
    </StateContext.Provider>
  );
}
