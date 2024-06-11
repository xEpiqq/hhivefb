import { useState, useEffect } from "react";
import { firestore, storage } from "@/components/Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function useChoir(choirId) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [members, setMembers] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [choirCode, setChoirCode] = useState(null);

  useEffect(() => {
    let unsubscribeList = [];

    const choirRef = doc(firestore, "choirs", choirId);
    const unsubscribe = onSnapshot(choirRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setName(data.name);
        const calendarCollection = collection(choirRef, "calendar");
        const calendarQuery = query(calendarCollection, orderBy("date", "asc"));
        const calendarUnsubscribe = onSnapshot(calendarQuery, (snapshot) => {
          const events = [];
          snapshot.forEach((doc) => {
            events.push({ ...doc.data(), eventId: doc.id });
          });
          setCalendar(events);
        });
        unsubscribeList.push(calendarUnsubscribe);

        const songsCollection = collection(choirRef, "songs");
        const songsQuery = query(
          songsCollection,
          orderBy("lastOpened", "desc")
        );
        const songsUnsubscribe = onSnapshot(songsQuery, (snapshot) => {
          const songs = [];
          snapshot.forEach((doc) => {
            songs.push({ ...doc.data(), songId: doc.id });
          });
          setSongs(songs);
        });
        unsubscribeList.push(songsUnsubscribe);

        const membersCollection = collection(choirRef, "members");
        const membersQuery = query(membersCollection);
        const membersUnsubscribe = onSnapshot(membersQuery, (snapshot) => {
          const members = [];
          snapshot.forEach((doc) => {
            members.push({ ...doc.data(), memberId: doc.id });
          });
          setMembers(members);
        });
        unsubscribeList.push(membersUnsubscribe);

        setChoirCode(data.code);
      } else {
        console.error("Choir not found");
        setError("Choir not found");
      }
    });

    return () => {
      unsubscribeList.forEach((unsubscribe) => {
        unsubscribe();
      });
      unsubscribe();
    };
  }, [choirId]);

  const addFile = async (songId, formData) => {

    const songRef = doc(firestore, "choirs", choirId, "songs", songId);
    
    // Upload the file to storage
    const file = formData.get("file");
    const fileName = formData.get("fileName");
    const storageRef = ref(storage, `${choirId}/songs/${songId}/${fileName}`);
    await uploadBytes(storageRef, file);
  
    // Get the file URL
    const fileURL = await getDownloadURL(storageRef);
  
    // Update the song document with the file
    await updateDoc(songRef, {
      files: arrayUnion({
        name: fileName,
        url: fileURL,
      }),
    });
  
    // Update the last opened date
    await updateDoc(songRef, {
      lastOpened: serverTimestamp(),
    });
  
    // Return the file URL
    return fileURL;
  };

  const renameSong = async (songId, newName) => {
    const songRef = doc(firestore, "choirs", choirId, "songs", songId);
    await updateDoc(songRef, {
      name: newName,
    });
  };

  const deleteSong = async (songId) => {
    const songRef = doc(firestore, "choirs", choirId, "songs", songId);
    await deleteDoc(songRef);
  };

  const updateLastOpened = async (songId) => {
    const songRef = doc(firestore, "choirs", choirId, "songs", songId);
    await updateDoc(songRef, {
      lastOpened: serverTimestamp(),
    });
  };

  const addCalendarEvent = async (event) => {
    const calendarRef = collection(firestore, "choirs", choirId, "calendar");
    const newEvent = await addDoc(calendarRef, event);
    return newEvent.id;
  };

  const editCalendarEvent = async (eventId, updatedEvent) => {
    const eventRef = doc(firestore, "choirs", choirId, "calendar", eventId);
    await updateDoc(eventRef, updatedEvent);
  };

  const deleteCalendarEvent = async (eventId) => {
    const eventRef = doc(firestore, "choirs", choirId, "calendar", eventId);
    await deleteDoc(eventRef);
  };

  const addSong = async (songName) => {
    const songsCollection = collection(firestore, "choirs", choirId, "songs");
    const newSong = await addDoc(songsCollection, {
      name: songName,
      lastOpened: serverTimestamp(),
    });
    return { id: newSong.id };
  };

  const convertPdfToPng = async (pdfUrl, newSongId) => {
    const response = await fetch('/api/pdfconvert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pdfUrl: pdfUrl,
        choirId: choirId,
        songId: newSongId
      })
    });
  
    const result = await response.json();
    console.log(result)
    return result;
  }
  
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
    addFile,
    addCalendarEvent,
    updateLastOpened,
    editCalendarEvent,
    deleteCalendarEvent,
    convertPdfToPng
  };
}
