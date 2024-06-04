"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaMicrophone, FaPaperclip, FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

import { firestore, storage } from "@/components/Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  serverTimestamp,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ChoirContext } from "../ChoirContext";
import { UserContext } from "../UserContext";
import { useContext } from "react";

export default function ChatScreen() {
  const choir = useContext(ChoirContext);
  const choirId = choir.choirId;
  const user = useContext(UserContext);
  console.log(user);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showIcons, setShowIcons] = useState(false);
  const [emojiKeyboard, setEmojiKeyboard] = useState(false);
  const [pictureZoom, setPictureZoom] = useState();
  const [reactionMessageId, setReactionMessageId] = useState("");
  const flatListRef = useRef(null);
  const bottom = useRef(null);
  console.log(messages);

  useEffect(() => {
    const messagesRef = collection(firestore, "choirs", choirId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages.reverse());
    });

    return () => unsubscribe();
  }, [choirId]);

  useEffect(() => {
    // Scroll to the div with the id of "bottom" when the messages change
    bottom.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      await addDoc(collection(firestore, "choirs", choirId, "messages"), {
        message: inputText.trim(),
        createdAt: serverTimestamp(),
        user: {
          id: user.id,
          name: user.name || user.email,
          avatar: user.image || "https://via.placeholder.com/150",
        },
      });
      setInputText("");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const fileRef = ref(storage, `${choirId}/files/${fileName}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    const messageRef = await addDoc(
      collection(firestore, "choirs", choirId, "messages"),
      {
        message: "",
        createdAt: serverTimestamp(),
        user: {
          id: user.id,
          name: user.name || user.email,
          avatar: user.image || "https://via.placeholder.com/150",
        },
        file: {
          url: downloadURL,
          name: fileName,
          type: file.type,
        },
      }
    );
  };

  const handleTextToSpeech = () => {
    Tts.speak(inputText);
  };

  function handleNewReaction(messageId) {
    setEmojiKeyboard(true);
    console.log(messageId);
    setReactionMessageId(messageId);
  }

  async function handleEmojiReactionTwo(emojiObject) {
    try {
      const messageRef = collection(
        firestore,
        "choirs",
        choirId,
        "messages"
      ).doc(reactionMessageId);

      const messageDoc = await messageRef.get();

      if (messageDoc.exists) {
        const reactions = messageDoc.data().reactions || {};
        const userReactions = reactions[user.uid] || [];

        const updatedUserReactions = userReactions.includes(emojiObject.emoji)
          ? userReactions
          : [...userReactions, emojiObject.emoji];

        await messageRef.update({
          [`reactions.${user.uid}`]: updatedUserReactions,
        });
      } else {
        await messageRef.update({
          reactions: {
            [user.uid]: [emojiObject.emoji],
          },
        });
      }
    } catch (error) {
      console.log("Error adding reaction:", error);
    }
  }

  // E
  async function handleEmojiReaction(emojiObject, messageId) {
    console.log(emojiObject.emoji);
    console.log(messageId);

    try {
      const messageRef = doc(
        firestore,
        "choirs",
        choirId,
        "messages",
        messageId
      );

      const messageDoc = await getDoc(messageRef);

      if (messageDoc.exists) {
        const reactions = messageDoc.data().reactions || {};
        const userReactions = reactions[user.uid] || [];

        const updatedUserReactions = userReactions.includes(emojiObject.emoji)
          ? userReactions
          : [...userReactions, emojiObject.emoji];

        await updateDoc(messageRef, {
          [`reactions.${user.uid}`]: updatedUserReactions,
        });
      } else {
        await messageRef.update({
          reactions: {
            [user.uid]: [emojiObject.emoji],
          },
        });
      }
    } catch (error) {
      console.log("Error adding reaction:", error);
    }
  }

  function handleNormalEmoji(emojiObject) {
    setEmojiKeyboard(false);
    setInputText(inputText + emojiObject.emoji);
  }

  async function handleRemoveReaction(messageId, emoji) {
    try {
      const messageRef = firestore
        .collection("choirs")
        .doc(choirId)
        .collection("messages")
        .doc(messageId);

      const messageDoc = await messageRef.get();
      const reactions = messageDoc.data().reactions || {};
      const userReaction = reactions[user.uid] || [];

      const updatedReactions = userReaction.filter((e) => e !== emoji);

      await messageRef.update({
        [`reactions.${user.uid}`]: updatedReactions,
      });
    } catch (error) {
      console.log("Error removing reaction:", error);
    }
  }

  const renderItem = ({ item, index }) => {
    const previousItem =
      index < messages.length - 1 ? messages[index + 1] : null;
    const isSameUser = previousItem && item.user.id === previousItem.user.id;
    const showProfilePicture =
      !isSameUser ||
      (previousItem &&
        item.createdAt &&
        previousItem.createdAt &&
        item.createdAt.toDate().getTime() -
          previousItem.createdAt.toDate().getTime() >
          10 * 60 * 1000);

    const handleReactionPress = (emoji, messageId) => {
      const userReactions = item.reactions
        ? item.reactions[user.uid] || []
        : [];
      if (userReactions.includes(emoji)) {
        // User already reacted with this emoji, so remove the reaction
        handleRemoveReaction(messageId, emoji);
      } else {
        // User hasn't reacted with this emoji, so add the reaction
        setReactionMessageId(messageId); // Set the reactionMessageId state variable
        handleEmojiReaction({ emoji }, messageId);
      }
    };

    return (
      <div className="flex flex-col items-start px-4">
        <hr className="bg-gray-200 mr-2 mb-3" />{" "}
        <div className="flex max-w-fit flex-row items-start px-4">
          {showProfilePicture && (
            <div className="relative">
              <img
                src={item.user.avatar}
                alt="User Avatar"
                className="w-9 h-9 rounded-xl shadow-lg"
              />
            </div>
          )}
          <div
            className={`rounded-xl w-fit ${showProfilePicture ? "" : "ml-9"}`}
          >
            {showProfilePicture && (
              <div className="flex flex-row items-center gap-2 pl-4">
                <span className="text-sm font-semibold">{item.user.name}</span>
                <span className="text-xs text-gray-400">
                  {item.createdAt?.toDate()
                    ? new Date(item.createdAt.toDate()).toLocaleDateString() +
                      " at " +
                      new Date(item.createdAt.toDate()).toLocaleTimeString(
                        undefined,
                        { hour: "2-digit", minute: "2-digit" }
                      )
                    : ""}
                </span>
              </div>
            )}
            <button
              onMouseDown={() => handleNewReaction(item.id)}
              className="text-start"
            >
              <p className="text-base text-gray-800 px-4 pb-2 break-words max-w-fit">
                {item.message}
              </p>
            </button>
            {item.file && (
              <img
                onClick={() => setPictureZoom(item.id)}
                src={item.file.url}
                target="_blank"
                className="rounded-xl shadow-lg max-w-[300px] max-h-[300px] cursor-pointer"
                rel="noopener noreferrer"
              ></img>
            )}
            <div className="flex flex-row items-center px-4 pb-2">
              {Object.entries(
                Object.entries(item.reactions || {}).reduce(
                  (acc, [userId, reaction]) => {
                    const emojis = Array.isArray(reaction)
                      ? reaction
                      : [reaction];
                    emojis.forEach((emoji) => {
                      acc[emoji] = acc[emoji] || { count: 0, userIds: [] };
                      acc[emoji].count++;
                      if (!acc[emoji].userIds.includes(userId)) {
                        acc[emoji].userIds.push(userId);
                      }
                    });
                    return acc;
                  },
                  {}
                )
              )
                .sort(([, a], [, b]) => b.count - a.count)
                .map(([emoji, { userIds, count }]) => (
                  <button
                    key={emoji}
                    onClick={() => handleReactionPress(emoji, item.id)}
                    className={`flex flex-row items-center space-x-1 rounded-full px-2 py-1 ${
                      userIds.includes(user.uid) ? "bg-blue-100" : ""
                    }`}
                  >
                    <span>{emoji}</span>
                    {count > 1 && <span className="text-xs">{count}</span>}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <div
        onClick={() => setPictureZoom(undefined)}
        className={`fixed top-0 left-0 w-screen bg-black h-screen z-50 flex items-center justify-center transition-all duration-300
         ${pictureZoom ? "opacity-50" : "opacity-0 pointer-events-none"}`}
      ></div>
      <div
        onClick={() => setPictureZoom(undefined)}
        className={`fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center transition-all duration-300
          ${pictureZoom ? "opacity-100" : "hidden"}`}
      >
        <img
          src={messages.find((m) => m.id === pictureZoom)?.file.url}
          className="rounded-xl max-w-[90%] max-h-[90%]"
        />
      </div>
      <ol ref={flatListRef} className="flex-1">
        {messages?.map((item) => (
          <li key={item.id}>{renderItem({ item })}</li>
        ))}
      </ol>
      <div ref={bottom}></div>
      <div
        className={`flex w-full h-14 justify-center rounded-xl border-[0.5px]`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="w-full h-full"
        >
          <input
            className="w-full h-full px-2 bg-transparent focus:outline-none focus:ring-0 text-sm text-gray-800"
            placeholder="Message #general"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </form>

        {!showIcons && (
          <div className="flex flex-row items-center gap-2 mr-4">
            <button onClick={handleTextToSpeech}>
              <div className="w-7 h-7 flex items-center justify-center rounded-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 512 512">
                  <g>
                    <g>
                      <path
                        d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z"
                        fill="#585858"
                      />
                      <path
                        d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z"
                        fill="#585858"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </button>
            <input type="file" hidden id="file" onChange={handleFileUpload} />
            <label htmlFor="file">
              <div className="w-7 h-7 flex items-center justify-center rounded-full mouse-pointer">
                <FaPaperclip className="w-5 h-5 text-[#585858]" />
              </div>
            </label>
          </div>
        )}
      </div>

      {showIcons && (
        <div className="flex flex-row items-center w-full h-9 justify-between px-2">
          <div className="flex flex-row gap-2">
            <button onClick={handleFileUpload}>
              <div className="w-8 h-8 flex items-center justify-center bg-[#eeeeee] rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 45.402 45.402"
                  fill="currentColor"
                  className="h-4 w-4 text-[#585858]"
                >
                  <path
                    fillRule="evenodd"
                    d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            <button>
              <div className="w-8 h-8 flex justify-center items-center rounded-full">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M7.301 14.001C8.07344 15.7578 9.98814 17 11.9996 17C14.0025 17 15.9135 15.7546 16.6925 14.0055"
                    stroke="#585858"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="9" r="1.5" fill="#585858" />{" "}
                  {/* Left Eye */}
                  <circle cx="15" cy="9" r="1.5" fill="#585858" />{" "}
                  {/* Right Eye */}
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="#585858"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
