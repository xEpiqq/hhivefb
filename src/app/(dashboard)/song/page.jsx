"use client";

import { useContext, useState } from "react";
import { ChoirContext } from "@/components/ChoirContext";
import { StateContext } from "@/components/StateContext";
import AddFileModal from "@/components/AddFileModal";
import FileContainer from "@/components/SongComponents/FileContainer";
import { HomeIcon, PlusIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SongPage({ params }) {
  const { songId } = useContext(StateContext);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [fileType, setFileType] = useState("");
  const choir = useContext(ChoirContext);
  const song = choir.songs.find((song) => song.songId === songId);
  const songName = song?.name || "NA";
  const missingParts = song ? [
    { name: 'soprano_audio', label: 'Soprano Audio' },
    { name: 'alto_audio', label: 'Alto Audio' },
    { name: 'tenor_audio', label: 'Tenor Audio' },
    { name: 'bass_audio', label: 'Bass Audio' }
  ].filter(part => !song[part.name]) : [];

  const breadcrumbPages = [
    { name: 'Music', href: '/music', current: false },
    { name: songName, href: '#', current: true },
  ];

  const handleAddFileClick = (fileType) => {
    setFileType(fileType);
    setAddFileModalOpen(true);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="fixed top-0 w-full left-0 lg:pl-72">
        <nav className="relative top-0 w-full left-0" aria-label="Breadcrumb">
          <ol role="list" className="flex space-x-4 bg-white px-6 shadow">
            <li className="flex">
              <div className="flex items-center">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </a>
              </div>
            </li>
            {breadcrumbPages.map((page) => (
              <li key={page.name} className="flex">
                <div className="flex items-center">
                  <svg
                    className="h-full w-6 flex-shrink-0 text-gray-200"
                    viewBox="0 0 24 44"
                    preserveAspectRatio="none"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                  </svg>
                  <a
                    href={page.href}
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    aria-current={page.current ? 'page' : undefined}
                  >
                    {page.name}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    
      {/* Tabs */}
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mt-12">
        <h3 className="text-base font-semibold leading-6 text-gray-900"><span className="font-normal">{song?.name}</span> &gt; Files</h3>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          <button
            onClick={() => handleAddFileClick('')}
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add File
          </button>
        </div>
      </div>

      {/* Song Page Content */}
      {/* <div className="flex gap-3 flex-col justify-between mt-6">
        {song?.files?.map((file) => (
          <FileContainer key={file.fileId} file={file} />
        ))} */}

        {/* Song Page Content */}
        <div className="flex gap-3 flex-col justify-between mt-6">
        {song?.satb_sheets && (
          <FileContainer key="satb_sheets" file={{ url: song.satb_sheets, name: 'SATB Sheets', type: 'satb_sheets' }} />
        )}
          {song?.satb_audio && (
          <FileContainer key={song.satb_audio} file={{ url: song.satb_audio, name: 'Satb Audio', type: 'audio' }} />
        )}
        {song?.soprano_audio && (
          <FileContainer key={song.soprano_audio} file={{ url: song.soprano_audio, name: 'Soprano Audio', type: 'audio' }} />
        )}
        {song?.alto_audio && (
          <FileContainer key={song.alto_audio} file={{ url: song.alto_audio, name: 'Alto Audio', type: 'audio' }} />
        )}
        {song?.tenor_audio && (
          <FileContainer key={song.tenor_audio} file={{ url: song.tenor_audio, name: 'Tenor Audio', type: 'audio' }} />
        )}
        {song?.bass_audio && (
          <FileContainer key={song.bass_audio} file={{ url: song.bass_audio, name: 'Bass Audio', type: 'audio' }} />
        )}
      </div>





      {/* </div> */}

      {missingParts.length > 0 && (
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-300">Missing Files</span>
            </div>
          </div>
          {missingParts.map(part => (
            <div key={part.name} className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-between items-center">
                <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">{part.label}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => handleAddFileClick(part.name)}
                >
                  <PlusIcon className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span>Add {part.label}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddFileModal
        songId={songId}
        choir={choir}
        open={addFileModalOpen}
        setOpen={setAddFileModalOpen}
        fileType={fileType}
      />
    </div>
  );
}
