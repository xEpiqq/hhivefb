import { useState, useEffect } from "react";

export default function useMusicController(choirId) {
  const [songUrl, setSongUrl] = useState("");
  const [paused, setPaused] = useState(true);
  const [songName, setSongName] = useState("No song")

  return {
    songUrl,
    setSongUrl,
    paused,
    setPaused,
    songName,
    setSongName,
  };
}