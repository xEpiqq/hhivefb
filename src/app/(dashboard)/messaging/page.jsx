"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChoirContext } from "../../../components/ChoirContext";
import { UserContext } from "../../../components/UserContext";
import { StateContext } from "@/components/StateContext";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import NewMessagingChannelModal from "@/components/NewMessagingChannelModal";
import ChatApp from "@/components/ChatApp";

export default function ChatScreen() {
  const choir = useContext(ChoirContext);
  const choirId = choir.choirId;
  const user = useContext(UserContext);
  const state = useContext(StateContext);

  const channels = choir.channels;
  const [newChannelModalOpen, setNewChannelModalOpen] = useState(false);

  const setCurrentChannel = (channel) => {
    state.setMessagingChannel(channel);
  };

  if (state.messagingChannel) {
    return (
      <div className="w-full h-full">
        <button
          onClick={() => state.setMessagingChannel(undefined)}
          className="bg-blue-500 mb-2 flex flex-row hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
        >
          <ChevronLeftIcon className="h-6 w-6" />
          {state.messagingChannel.name}
        </button>
        <div className="relative w-full h-full">
          <ChatApp />
        </div>
      </div>
    );
  }

  console.log(state.messagingChannel);

  if (!state.messagingChannel) {
    return (
      <div>
        <NewMessagingChannelModal
          open={newChannelModalOpen}
          setOpen={setNewChannelModalOpen}
        />
        <div>
          <h1>Select a Channel</h1>
          <div className="p-2 flex flex-col">
            <div>
              <ul role="list" className="divide-y divide-gray-200">
                {channels.map((item) => (
                  <li key={item.channelId} className="py-4">
                    <button
                      onClick={() => setCurrentChannel(item)}
                      className="text-left w-full font-medium text-gray-900 hover:translate-x-2 transition-all hover:cursor-pointer hover:text-blue-500"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <button
                onClick={() => setNewChannelModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                + New Channel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
