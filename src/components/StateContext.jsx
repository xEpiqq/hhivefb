"use client";

import { createContext, useEffect, useState } from "react";

export const StateContext = createContext({ songs: [] });

export default function StateContextProvider({ children }) {
  const [choirId, setChoirId] = useState();
  const [songId, setSongId] = useState();
  const [messagingChannel, setMessagingChannel] = useState();

  useEffect(() => {
    // Store state in local storage
    if (choirId) {
      setChoirId(localStorage.getItem("choirId"));
    }
    if (songId) {
      setSongId(localStorage.getItem("songId"));
    }
    if (messagingChannel) {
      setMessagingChannel(localStorage.getItem("messagingChannel"));
    }
  }, [choirId, songId, messagingChannel]);

  useEffect(() => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
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
