"use client";

import { useState, useContext } from "react";
import { ChoirContext } from "../ChoirContext";

export default function AddSongModal({ closeModal }) {
  const choir = useContext(ChoirContext);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongSheetMusic, setNewSongSheetMusic] = useState();
  const [newSongAudio, setNewSongAudio] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Add the new song to the choir
    const newSong = await choir.addSong(newSongTitle);
    const songId = newSong.songId;

    // Add the sheet music and audio files to the song
    const pdfData = new FormData();
    pdfData.append("file", newSongSheetMusic);
    pdfData.append("fileName", "sheet-music.pdf");
    choir.addFile(songId, pdfData);

    const musicData = new FormData();
    musicData.append("file", newSongAudio);
    musicData.append("fileName", "audio.mp3");
    choir.addFile(songId, musicData);

    await pdfData;
    await musicData;

    // Close the modal
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white sm:rounded-lg relative p-4 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-0 right-0 inline-flex items-center justify-center rounded-md p-2 text-sm font-semibold m-2 text-gray-700 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
          onClick={closeModal}
        >
          <span className="font-bold">X</span>
        </button>
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
            Add a New Song
          </h3>
          <form
            className="mt-5 sm:flex sm:items-center flex-col gap-6"
            onSubmit={handleFormSubmit}
          >
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                onChange={(e) => setNewSongTitle(e.target.value)}
                value={newSongTitle}
                className="h-10 pl-2 block w-full rounded-md bg-gray-100 focus:ring-indigo-500 sm:text-sm outline-none"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sheet Music (PDF)
              </label>
              <input
                type="file"
                name="sheetMusic"
                onChange={(e) => setNewSongSheetMusic(e.target.files[0])}
                className="block w-full rounded-md border-0 focus:ring-indigo-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                style={{ fontSize: newSongSheetMusic ? 'initial' : 0 }}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accompaniment Audio (MP3)
              </label>
              <input
                type="file"
                name="audio"
                onChange={(e) => setNewSongAudio(e.target.files[0])}
                className="block w-full rounded-md border-0 focus:ring-indigo-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                style={{ fontSize: newSongAudio ? 'initial' : 0 }}
              />
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-3 self-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
