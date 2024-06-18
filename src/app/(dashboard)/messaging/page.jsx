"use client";

import React, { useEffect, useState, useContext, Fragment } from "react";
import { ChoirContext } from "@/components/ChoirContext";
import { UserContext } from "@/components/UserContext";
import { StateContext } from "@/components/StateContext";
import { ChevronLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import NewMessagingChannelModal from "@/components/NewMessagingChannelModal";
import ChatApp from "@/components/ChatApp";
import { useRouter } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// import { getFirestore, collection, getDocs, query, addDoc } from "firebase/firestore";
// import { app } from '../../../lib/firestoreAdapter'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// new code
const PERMANENT_CHANNELS = [
  { name: "Main", id: "main" },
  { name: "Sopranos", id: "sopranos" },
  { name: "Altos", id: "altos" },
  { name: "Tenors", id: "tenors" },
  { name: "Basses", id: "basses" },
];


export default function ChatScreen() {
  const choir = useContext(ChoirContext);
  const choirId = choir?.choirId;
  const user = useContext(UserContext);
  const state = useContext(StateContext);
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      if (state.messagingChannel) {
        state.setMessagingChannel(null);
      } else {
        router.push("/messaging");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, state]);

  // new code
  useEffect(() => {
    const ensureChannelsExist = async () => {
      if (!choirId) return;
      
      const channelsRef = collection(firestore, "choirs", choirId, "channels");
      const q = query(channelsRef);
      const existingChannelsSnapshot = await getDocs(q);
      const existingChannels = existingChannelsSnapshot.docs.map(doc => doc.data());
  
      for (const channel of PERMANENT_CHANNELS) {
        if (!existingChannels.find(existingChannel => existingChannel.id === channel.id)) {
          await addDoc(channelsRef, { name: channel.name, id: channel.id });
        }
      }
    };
  
    ensureChannelsExist();
  }, [choirId]);
  

  const channels = choir?.channels || [];
  const [newChannelModalOpen, setNewChannelModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const setCurrentChannel = (channel) => {
  //   if (state.messagingChannel?.channelId !== channel.channelId) {
  //     state.setMessagingChannel(channel);
  //   }
  // };

  const setCurrentChannel = (channel) => {
    if (state.messagingChannel?.id !== channel.id) {
      state.setMessagingChannel(channel);
    }
  };
  

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                  </div>
                 
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">
                          Channels
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {channels.length === 0 ? (
                            <Skeleton width={250} height={20} />
                          ) : (
                            channels.map((item) => (
                              <li key={item.channelId}>
                                <button
                                  onClick={() => setCurrentChannel(item)}
                                  className={classNames(
                                    state.messagingChannel?.channelId === item.channelId
                                      ? "bg-blue-500 text-white"
                                      : "text-gray-700 hover:text-white hover:bg-gray-700",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full"
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      state.messagingChannel?.channelId === item.channelId
                                        ? 'text-white border-white'
                                        : 'text-gray-400 border-gray-200 group-hover:border-white group-hover:text-white',
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                    )}
                                  >
                                    {item.name.charAt(0)} {/* Assuming initial is the first character of the name */}
                                  </span>
                                  <span className="truncate">{item.name}</span>
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
          </div>
         
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Channels
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {PERMANENT_CHANNELS.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setCurrentChannel(item)}
                        className={classNames(
                          state.messagingChannel?.id === item.id
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:text-white hover:bg-gray-700",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full"
                        )}
                      >
                        <span
                          className={classNames(
                            state.messagingChannel?.id === item.id
                              ? 'text-white border-white'
                              : 'text-gray-400 border-gray-200 group-hover:border-white group-hover:text-white',
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                          )}
                        >
                          {item.name.charAt(0)}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>

        </div>
      </div>

      <div className="lg:pl-72 flex flex-col w-full h-full">
        <div className="sticky top-0 z-40 w-full lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {state.messagingChannel ? (
                  <button
                    onClick={() => state.setMessagingChannel(null)}
                    className="bg-blue-500 flex items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                    {state.messagingChannel.name}
                  </button>
                ) : (
                  <div className="text-lg font-semibold text-gray-900">
                    Select a Channel
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="py-10 flex-1 relative h-full">
          <div className="mx-auto relative max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-full">
            {state.messagingChannel ? (
              <ChatApp key={state.messagingChannel.channelId} />
            ) : (
              <div className="p-4">
                <h1 className="text-xl font-bold">Select a Channel</h1>
              </div>
            )}
          </div>
        </main>
      </div>

      <NewMessagingChannelModal
        open={newChannelModalOpen}
        setOpen={setNewChannelModalOpen}
      />
    </>
  );
}
