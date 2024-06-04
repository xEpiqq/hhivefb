import { useState, useEffect } from "react";
// import { collection, doc, getDoc } from "firebase/firestore"; 
// import { db } from "@/lib/firestoreAdapter"; 

export default function useChoir(choirId) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [members, setMembers] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [choirCode, setChoirCode] = useState(null);

  useEffect(() => {
    loadChoir();
  }, [choirId]);

  const addFile = async (songId, formData) => {
    const response = await fetch(
      "/api/choir/" + choirId + "/songs/" + songId + "/addFile",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();

    if (data.status !== 200) {
      console.error("Error adding file: ", data.message);
      return data;
    }

    loadChoir();

    return data;
  };

  const renameSong = async (songId, newName) => {
    const response = await fetch(`/api/choir/${choirId}/songs/${songId}/rename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newName }),
    });

    if (response.status !== 200) {
      const data = await response.json();
      console.error("Error renaming song: ", data.message);
      return;
    }

    // Update the state with the new song name
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.songId === songId ? { ...song, name: newName } : song
      )
    );
  };

  const deleteSong = async (songId) => {
    const response = await fetch(`/api/choir/${choirId}/songs/${songId}/delete`, {

      method: "DELETE",
    });

    if (response.status !== 200) {
      const data = await response.json();
      console.error("Error deleting song: ", data.message);
      return;
    }

    // Remove the song from the state
    setSongs((prevSongs) => prevSongs.filter((song) => song.songId !== songId));
  };

  const updateLastOpened = async (songId) => {
    const response = await fetch(`/api/choir/${choirId}/songs/${songId}/updateLastOpened`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (response.status !== 200) {
      const data = await response.json();
      console.error("Error updating last opened date: ", data.message);
      return;
    }
  };
  


  const addCalendarEvent = async (event) => {
    const response = await fetch("/api/choir/" + choirId + "/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    const data = await response.json();

    if (data.status !== 200) {
      console.error("Error adding event: ", data.message);
      return data;
    }

    loadChoir();

    return data;
  };



  const addSong = async (songName) => {
    setSongs([...songs, songName]);
    const addSongRequest = await fetch("/api/choir/" + choirId + "/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songName: songName }),
    });

    if (addSongRequest.status !== 200) {
      console.error("Error adding song: ", addSongRequest.message);
      return addSongRequest;
    }

    const data = await addSongRequest.json();
    // TODO: probably should create a reload songs method
    loadChoir();
    return data;
  };

  const loadChoir = async () => {
    if (choirId) {
      try {
        const response = await fetch("/api/choir/" + choirId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          console.error("Error fetching choir data: ", response.statusText);
          setError("Error fetching choir data");
          setLoading(false);
          return;
        }
  
        const data = await response.json();
  
        if (data.status !== 200) {
          console.error("Choir not found");
          setError("Choir not found");
          setLoading(false);
          return;
        }
  
        // Set default values if fields are missing
        const choir = data.choir || {};
        setSongs(choir.songs || []);
        setName(choir.name || "Unnamed Choir");
        setChoirCode(choir.code || null);
        setMembers(choir.members || []);
        setCalendar(choir.calendar || []);
        setLoading(false);
        setError(null);
  
      } catch (error) {
        console.error("Error parsing JSON: ", error);
        setError("Error parsing choir data");
        setLoading(false);
      }
    }
  };
  

  return {
    choirId,
    songs,
    loading,
    error,
    name,
    members,
    calendar,
    choirCode,
    renameSong,
    addSong,
    deleteSong,
    reloadChoir: loadChoir,
    addFile,
    addCalendarEvent,
    updateLastOpened,
  };
}