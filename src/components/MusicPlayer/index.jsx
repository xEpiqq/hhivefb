"use client";

import { Fragment, useState, useContext } from "react";

import { Dialog, Transition } from "@headlessui/react";

import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { MusicControllerContext } from "@/components/MusicControllerProvider";

export default function MusicPlayer() {
  const { songUrl, setSongUrl, paused, setPaused, songName } = useContext(
    MusicControllerContext
  );

  if (!songUrl) return null;
  return (
    <div className="mx-2.5 mt-3 px-4 py-2 rounded-lg left-0 right-0 absolute bottom-3 shadow-2xl bg-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <audio
            controls
            src={songUrl}
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
          />
          <p className="ml-2.5 font-medium">{songName}</p>
        </div>
        <button
          className="ml-2.5 p-2.5 bg-slate-300 rounded-full"
          onClick={() => setSongUrl(null)}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
