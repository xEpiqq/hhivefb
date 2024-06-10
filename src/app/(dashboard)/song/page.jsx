"use client";

import { useContext, useEffect, useState } from "react";
import { ChoirContext } from "@/components/ChoirContext";
import { StateContext } from "@/components/StateContext";
import { MusicControllerContext } from "@/components/MusicControllerProvider";
import AddFileModal from "@/components/AddFileModal";
import FileContainer from "@/components/SongComponents/FileContainer";

export default function SongPage({ params }) {
  const { songId } = useContext(StateContext);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const choir = useContext(ChoirContext);


  // the correct song is the one with the id
  const song = choir.songs.find((song) => song.songId === songId);
  console.log(song);

  return (
    <div>
      <button
        onClick={() => setAddFileModalOpen(true)}
        className="inline-flex my-4 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add File
      </button>
      <div className="flex gap-3 flex-col justify-between">
        {song?.files?.map((file) => (
          <FileContainer key={file.fileId} file={file} />
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
