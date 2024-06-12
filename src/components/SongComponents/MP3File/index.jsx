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
      <button
        className="inline-flex items-center rounded-md bg-white border border-gray-300 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
        onClick={() => {
          musicController.setSongUrl(file.url);
          musicController.setSongName(file.name);
        }}
      >
        Add Timestamps
      </button>
    </div>
  );
}
