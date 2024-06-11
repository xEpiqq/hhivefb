"use client";

import { useContext, useState } from "react";
import { ChoirContext } from "@/components/ChoirContext";
import { StateContext } from "@/components/StateContext";
import AddFileModal from "@/components/AddFileModal";
import FileContainer from "@/components/SongComponents/FileContainer";

export default function SongPage({ params }) {
  const { songId } = useContext(StateContext);
  const [addFileModalOpen, setAddFileModalOpen] = useState(true);
  const { choirId, songs } = useContext(ChoirContext);
  const [songUrl, setSongUrl] = useState("");
  const [paused, setPaused] = useState(true);

  // Find the correct song using the songId
  const song = songs.find((song) => song.songId === songId);
  console.log("Choir:", choirId, "Songs:", songs);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <h1>{song?.title || "Song Title"}</h1>
        <button
          onClick={() => setAddFileModalOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add File
        </button>
        <div className="flex flex-col justify-between p-24">
          {song?.files?.map((file) => (
            <div
              key={file.url}
              className="flex flex-col justify-between items-start"
            >
              <h2>{file.name}</h2>
              {file.name.split(".").pop() === "pdf" ? (
                <embed
                  src={file.url}
                  width="100%"
                  height="500"
                />
              ) : (
                <button
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => setSongUrl(file.url)}
                >
                  Play Audio
                </button>
              )}
            </div>
          ))}
        </div>

        <AddFileModal
          songId={songId}
          choir={choirId}
          open={addFileModalOpen}
          setOpen={setAddFileModalOpen}
        />
      </div>

      {songUrl && (
        <div className="sticky bottom-3 mx-2.5 p-4 bg-slate-200 rounded-lg">
          <div className="flex items-start">
            <audio
              controls
              src={songUrl}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
