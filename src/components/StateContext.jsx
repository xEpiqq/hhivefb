"use client";

import { createContext, useEffect, useState } from "react";

export const StateContext = createContext({ songs: [] });

export default function StateContextProvider({ children }) {
  const [choirId, setChoirId] = useState();
  const [songId, setSongId] = useState();
  const [messagingChannel, setMessagingChannel] = useState();

  useEffect(() => {
    // Store state in local storage
    localStorage.setItem("choirId", choirId);
    localStorage.setItem("songId", songId);
    localStorage.setItem("messagingChannel", messagingChannel);
  }, [choirId, songId, messagingChannel]);

  useEffect(() => {
    // Retrieve state from local storage
    setChoirId(localStorage.getItem("choirId"));
    setSongId(localStorage.getItem("songId"));
    setMessagingChannel(localStorage.getItem("messagingChannel"));
  }, []);

  return (
    <StateContext.Provider value={{ choirId, setChoirId, songId, setSongId, messagingChannel, setMessagingChannel }}>
      {children}
    </StateContext.Provider>
  );
}
