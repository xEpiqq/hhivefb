"use client";
import { useState, useContext, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { ChoirContext } from "../ChoirContext";
import AddSongModal from "./AddSongModal";
import Link from "next/link";
import Skeleton from 'react-loading-skeleton';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'

import 'react-loading-skeleton/dist/skeleton.css';
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const letterColors = {
  A: 'bg-red-300',
  B: 'bg-orange-300',
  C: 'bg-yellow-300',
  D: 'bg-green-300',
  E: 'bg-teal-300',
  F: 'bg-blue-300',
  G: 'bg-indigo-300',
  H: 'bg-purple-300',
  I: 'bg-pink-300',
  J: 'bg-red-200',
  K: 'bg-orange-200',
  L: 'bg-yellow-200',
  M: 'bg-green-200',
  N: 'bg-teal-200',
  O: 'bg-blue-200',
  P: 'bg-indigo-200',
  Q: 'bg-purple-200',
  R: 'bg-pink-200',
  S: 'bg-red-100',
  T: 'bg-orange-100',
  U: 'bg-yellow-100',
  V: 'bg-green-100',
  W: 'bg-teal-100',
  X: 'bg-blue-100',
  Y: 'bg-indigo-100',
  Z: 'bg-purple-100'
};


const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this song?</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded flex items-center"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const RenameModal = ({ isOpen, onClose, onConfirm, newName, setNewName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rename Song</h2>
        <form onSubmit={onConfirm}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="pl-2 mb-4 w-full focus:outline-none block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Rename"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MusicCard = ({ item, choir }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateLastOpened = async () => {
    await choir.updateLastOpened(item.songId);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  const handleRename = () => {
    setIsRenaming(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await choir.deleteSong(item.songId);
    setShowMenu(false);
    setIsConfirmDeleteOpen(false);
    setIsLoading(false);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await choir.renameSong(item.songId, newName);
    setIsRenaming(false);
    setIsLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} ${formattedTime}`;
  };
  
  const firstLetter = item.name ? item.name[0].toUpperCase() : '?';
  const colorClass = letterColors[firstLetter] || 'bg-gray-600';

  const handleLinkClick = async () => {
    await updateLastOpened();
  };

  return (
    <li className="overflow-hidden rounded-xl border border-gray-200">
      <Link href={`/${choir.choirId}/song/${item.songId}`} passHref>
        <div onClick={handleLinkClick} className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <div className={`flex w-16 h-16 flex-shrink-0 items-center justify-center rounded-lg ${colorClass} text-sm font-medium text-white`}>
            {firstLetter}
          </div>
          <div className="text-sm font-medium leading-6 text-gray-900">{item.name}</div>
          <Menu as="div" className="relative ml-auto">
            <button className="" onClick={toggleMenu}>
              <span className="sr-only">Open options</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </Menu>
        </div>
      </Link>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-xs leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500 font-light">Last Opened:</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-normal text-gray-500">{formatDate(item.lastOpened)}</div>
          </dd>
        </div>
      </dl>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeMenu}></div>
          <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={handleRename}>
              Rename
            </button>
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => setIsConfirmDeleteOpen(true)}>
              Delete
            </button>
          </div>
        </>
      )}
      <ConfirmDeleteModal isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} onConfirm={handleDelete} isLoading={isLoading} />
      <RenameModal isOpen={isRenaming} onClose={() => setIsRenaming(false)} onConfirm={handleRenameSubmit} newName={newName} setNewName={setNewName} isLoading={isLoading} />
    </li>
  );
};


export default function MusicPage() {
  const choir = useContext(ChoirContext);
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    setMusic(choir.songs);
    setLoading(false);

  }, [choir]);

  const handleAddMusicClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Music Hive
        </h3>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddMusicClick}
          >
            Add Music Folder
          </button>
        </div>
      </div>

      <main className="flex flex-col items-center justify-between p-24">
  {loading ? (
    <div className="w-full grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="col-span-1 flex flex-col items-center">
          <Skeleton width={300} height={50} className="mb-2" />
          <Skeleton width={200} height={20} />
          <Skeleton width={250} height={20} />
        </div>
      ))}
    </div>
  ) : (
    <>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {music.map((item) => (
          <MusicCard key={item.songId} item={item} choir={choir} />
        ))}
      </ul>
      {music.length === 0 && (
        <button
          type="button"
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleAddMusicClick}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <span className="mt-2 block text-sm font-semibold text-gray-900">
            Create Your First Music Folder
          </span>
        </button>
      )}
    </>
  )}
</main>


      {showModal && <AddSongModal closeModal={handleCloseModal} />}
    </>
  );
}