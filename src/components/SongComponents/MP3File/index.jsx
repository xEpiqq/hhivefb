"use client";

import { useContext } from "react";
import { MusicControllerContext } from "@/components/MusicControllerProvider";

export default function MP3File({ file }) {
  const musicController = useContext(MusicControllerContext);

  return (
    <div>
      <button
        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          musicController.setSongUrl(file.url);
          musicController.setSongName(file.name);
        }}
      >
        Play Audio
      </button>
    </div>
  );
}
