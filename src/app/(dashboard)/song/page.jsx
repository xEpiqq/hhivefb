"use client";

import { useContext, useState } from "react";
import { ChoirContext } from "@/components/ChoirContext";
import { StateContext } from "@/components/StateContext";
import AddFileModal from "@/components/AddFileModal";
import FileContainer from "@/components/SongComponents/FileContainer";
import { PlusIcon } from '@heroicons/react/20/solid';

// Tabs configuration
const tabs = [
  { name: 'My Account', href: '#', current: false },
  { name: 'Company', href: '#', current: false },
  { name: 'Team Members', href: '#', current: true },
  { name: 'Billing', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SongPage({ params }) {
  const { songId } = useContext(StateContext);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const choir = useContext(ChoirContext);

  // the correct song is the one with the id
  const song = choir.songs.find((song) => song.songId === songId);

  const missingParts = [
    { name: 'soprano_audio', label: 'Soprano Audio' },
    { name: 'alto_audio', label: 'Alto Audio' },
    { name: 'tenor_audio', label: 'Tenor Audio' },
    { name: 'bass_audio', label: 'Bass Audio' }
  ].filter(part => !song[part.name]);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Song Page Content */}
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

      {missingParts.length > 0 && (
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">Missing Audios</span>
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
                  onClick={() => setAddFileModalOpen(true)}
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
      />
    </div>
  );
}
