'use client';
import { useState, useContext } from 'react';
import { ChoirContext } from '../../ChoirContext';
import { HomeIcon } from '@heroicons/react/20/solid';

const pages = [
  { name: 'Music', href: '#', current: false },
  { name: 'Create New Song', href: '#', current: true },
]

const steps = [
  { id: 'Step 1', name: 'Song Title', href: '#', status: 'current' },
  { id: 'Step 2', name: 'Upload Sheet Music', href: '#', status: 'upcoming' },
  { id: 'Step 3', name: 'Upload Audio', href: '#', status: 'upcoming' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AddSongPage() {
  const choir = useContext(ChoirContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongSheetMusic, setNewSongSheetMusic] = useState(null);
  const [newSongAudio, setNewSongAudio] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const validateCurrentStep = () => {
    if (currentStep === 0 && !newSongTitle) {
      alert('Please enter the song title.');
      return false;
    }
    if (currentStep === 1 && !newSongSheetMusic) {
      alert('Please upload the sheet music.');
      return false;
    }
    if (currentStep === 2 && !newSongAudio) {
      alert('Please upload the accompaniment audio.');
      return false;
    }
    return true;
  };

  async function handleFormSubmit () {
      setIsSaving(true);
      const newSong = await choir.addSong(newSongTitle);
      const songId = newSong.songId;
      const pdfData = new FormData();
      pdfData.append('file', newSongSheetMusic);
      pdfData.append('fileName', 'sheet-music.pdf');
      await choir.addFile(songId, pdfData);
      const musicData = new FormData();
      musicData.append('file', newSongAudio);
      musicData.append('fileName', 'audio.mp3');
      await choir.addFile(songId, musicData);
      setIsSaving(false);
      console.log("The song id is")
      console.log(newSong.songId)
      window.location.href = `/${choir.choirId}/song/${newSong.songId}`
  }

  return (
    <div className="w-full h-full flex items-center flex-col">
      <nav className="flex border-b border-gray-200 bg-white w-full" aria-label="Breadcrumb">
        <ol role="list" className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
          <li className="flex">
            <div className="flex items-center">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {pages.map((page) => (
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

      <div className="min-h-full w-1/2">
        <div className="py-10">
          <header className=' flex justify-between'>
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 ">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-6 ">
                Create New Song
              </h1>
            </div>

            <div className='mr-14'/>

            <div className='w-8 h-8 text-indigo-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-400 hover:text-white transition duration-75 -mr-14' onClick={() => window.location.href = `/${choir.choirId}/music/`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>

          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <nav aria-label="Progress">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                  {steps.map((step, index) => (
                    <li key={step.name} className="md:flex-1">
                      <a
                        href={step.href}
                        className={classNames(
                          index === currentStep
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                        )}
                        aria-current={index === currentStep ? 'step' : undefined}
                      >
                        <span className="text-sm font-medium">{step.id}</span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>


              <div className='w-full h-20 mt-20'>

                {currentStep === 0 && (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter the title of your new song
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
                )}

                {currentStep === 1 && (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SATB Sheet Music (PDF)
                    </label>
                    <input
                      type="file"
                      name="sheetMusic"
                      onChange={(e) => setNewSongSheetMusic(e.target.files[0])}
                      className="block w-full rounded-md border-0 focus:ring-indigo-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                      style={{ fontSize: newSongSheetMusic ? 'initial' : 0 }}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SATB Audio / Accompaniment (MP3)
                    </label>
                    <input
                      type="file"
                      name="audio"
                      onChange={(e) => setNewSongAudio(e.target.files[0])}
                      className="block w-full rounded-md border-0 focus:ring-indigo-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                      style={{ fontSize: newSongAudio ? 'initial' : 0 }}
                    />
                  </div>
                )}

                </div>

                <div className="flex justify-between mt-10">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                    className={classNames(
                      currentStep === 0 ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-500',
                      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    )}
                  >
                    Previous
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      disabled={isSaving}
                      onClick={handleFormSubmit}
                    >
                      {isSaving ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      ) : (
                        'Save'
                      )}
                    </button>
                  )}
                </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
