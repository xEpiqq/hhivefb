"use client";

import { useContext, useEffect, useState } from "react";
import { ChoirContext } from "@/components/ChoirContext";
import { StateContext } from "@/components/StateContext";
import { MusicControllerContext } from "@/components/MusicControllerProvider";
import AddFileModal from "@/components/AddFileModal";

export default function SongPage({ params }) {
  const { songId } = useContext(StateContext);
  const [addFileModalOpen, setAddFileModalOpen] = useState(true);
  const choir = useContext(ChoirContext);

  const musicController = useContext(MusicControllerContext);

  // the correct song is the one with the id
  const song = choir.songs.find((song) => song.songId === songId);
  console.log(song);

  return (
    <div>
      <h1>{choir.songs[songId]}</h1>
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
                src={
                  file.url
                }
                width="100%"
                height="500"
              />
            ) : (
              <button
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  musicController.setSongUrl(
                    file.url
                  );
                  musicController.setSongName(file.name);
                }}
              >
                Play Audio
              </button>
            )}
          </div>
        ))}
      </div>

      <AddFileModal
        songId={songId}
        choir={choir}
        open={addFileModalOpen}
        setOpen={setAddFileModalOpen}
      />
    </div>
  );
}
