"use client";

import React, { useEffect, useState, useContext } from "react";
import { ChoirContext } from "@/components/ChoirContext";
import { UserContext } from "@/components/UserContext";
import { StateContext } from "@/components/StateContext";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import NewMessagingChannelModal from "@/components/NewMessagingChannelModal";
import ChatApp from "@/components/ChatApp";
import { useRouter } from "next/navigation";

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

  const channels = choir?.channels || [];
  const [newChannelModalOpen, setNewChannelModalOpen] = useState(false);

  const setCurrentChannel = (channel) => {
    if (state.messagingChannel?.channelId !== channel.channelId) {
      state.setMessagingChannel(channel);
    }
  };

  console.log("Current Channel:", state.messagingChannel);

  return (
    <div className="flex h-full">
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-4">
          <button
            onClick={() => setNewChannelModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            + New Channel
          </button>
        </div>
        <ul className="space-y-2">
          {channels.map((item) => (
            <li key={item.channelId}>
              <button
                onClick={() => setCurrentChannel(item)}
                className={`block w-full text-left py-2 px-4 rounded ${
                  state.messagingChannel?.channelId === item.channelId
                    ? "bg-blue-500"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        {state.messagingChannel ? (
          <div className="w-full h-full">
            <button
              onClick={() => state.setMessagingChannel(null)}
              className="bg-blue-500 mb-2 flex flex-row hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            >
              <ChevronLeftIcon className="h-6 w-6" />
              {state.messagingChannel.name}
            </button>
            <div className="relative w-full h-full">
              <ChatApp key={state.messagingChannel.channelId} />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h1 className="text-xl font-bold">Select a Channel</h1>
          </div>
        )}
      </div>

      <NewMessagingChannelModal
        open={newChannelModalOpen}
        setOpen={setNewChannelModalOpen}
      />
    </div>
  );
}
