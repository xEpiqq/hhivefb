"use client";
import { Fragment, useState, useEffect, useContext } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import NewChoirModal from "./newchoirmodal";
import DeleteChoirModal from "./deletechoirmodal";
import RenameChoirModal from "./renamechoirmodal";
import { UserContext } from "../../../components/UserContext";
import { StateContext } from "../../../components/StateContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ChoirSelection() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newChoirName, setNewChoirName] = useState("");
  const [choirList, setChoirList] = useState([]);
  const [choirsLoading, setChoirsLoading] = useState(true);
  const [choirDeleteId, setChoirDeleteId] = useState("");
  const [choirDeleteName, setChoirDeleteName] = useState("");
  const [renameDelete, setRenameDelete] = useState(false);
  const user = useContext(UserContext);
  const { setChoirId } = useContext(StateContext);

  useEffect(() => {
    if (user && user.id) {
      const fetchChoirDetails = async () => {
        const response = await fetch("/api/fetchchoirs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const result = await response.json();

        console.log(result);

        if (result.status === 200) {
          setChoirList(result.choirDetails);
        } else {
          console.error(result.message);
        }
      };
      fetchChoirDetails();
    }

    setChoirsLoading(false);
  }, [user]);

  async function enterChoir(choirid) {
    await updateChoir(choirid);
    setChoirId(choirid);
    router.push(`/music`);
  }

  async function updateChoir(choirid) {
    const response = await fetch("/api/prefchoir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        choirId: choirid,
        userId: user.id,
        lastOpened: new Date().toLocaleString(),
      }),
    });
  }

  async function createNewChoir() {
    const response = await fetch("/api/createchoir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newChoirName, userId: user.id }),
    });
    const data = await response.json();
    setIsModalOpen(false);
    router.refresh();
  }

  // const choirList = user && user.choirs ? Object.keys(user.choirs).map(key => ({
  //   name: key,
  //   id: user.choirs[key],
  // })) : [];

  const handleModalClose = () => setIsModalOpen(false);
  const handleChoirNameChange = (event) => setNewChoirName(event.target.value);
  const handleSaveChoir = () => {
    if (newChoirName.trim() !== "") {
      createNewChoir();
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    const options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <>
      <NewChoirModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        submit={handleSaveChoir}
        user={user}
      />

      <DeleteChoirModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        user={user}
        choirid={choirDeleteId}
        choirname={choirDeleteName}
      />

      <RenameChoirModal
        open={isRenameModalOpen}
        setOpen={setIsRenameModalOpen}
        user={user}
        choirid={choirDeleteId}
        choirname={choirDeleteName}
      />

      <div className="w-full h-full">
        <div className="min-h-full bg-white">
          <div className="py-10">
            <header>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
                  Select a choir
                </h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <button
                  className="py-2 px-4 bg-white text-black border border-dashed border-indigo-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 transition duration-150 ease-in-out"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add New Choir
                </button>

                {choirsLoading && (
                  <div className="mt-4">
                    <Skeleton width={1200} height={65} className="mb-2" />
                    <Skeleton width={1200} height={65} className="mb-2" />
                  </div>
                )}

                <RadioGroup
                  value={selected}
                  onChange={setSelected}
                  className="flex flex-col gap-2 mt-4"
                >
                  {choirList.map((choir) => (
                    <Fragment key={choir.id}>
                      <div className="relative">
                        <Radio
                          value={choir}
                          className="border-gray-300 border relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between hover:border-gray-500"
                          onClick={() => enterChoir(choir.id)}
                        >
                          {({ checked, focus }) => (
                            <>
                              <div className="flex items-center justify-between w-full">
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <span className="font-bold text-gray-900">
                                      {choir.name}
                                    </span>
                                    <span className="text-gray-500">
                                      Total Members: {choir.members}
                                    </span>
                                  </span>
                                </span>
                                <div className="flex items-center space-x-4 mr-10">
                                  <span className="flex flex-col text-sm text-right">
                                    <span className="font-medium text-gray-900">
                                      Last opened
                                    </span>
                                    <span className="text-gray-500">
                                      {formatTimestamp(choir.lastOpened)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <span
                                className={classNames(
                                  checked
                                    ? "border-indigo-600"
                                    : "border-transparent",
                                  focus ? "border" : "border-2",
                                  "pointer-events-none absolute -inset-px rounded-lg"
                                )}
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </Radio>

                        <div
                          className="absolute top-0 right-0 h-full w-10 flex items-center justify-center py-6 group cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChoirDeleteId(choir.id);
                            setChoirDeleteName(choir.name);
                            setRenameDelete(!renameDelete);
                          }}
                        >
                          <EllipsisVerticalIcon className="w-full h-full pointer-events-none text-indigo-500 group-hover:text-indigo-700" />
                        </div>

                        {renameDelete && choirDeleteId === choir.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setRenameDelete(false)}
                            ></div>
                            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 top-[66px] right-0">
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  setIsRenameModalOpen(true);
                                  setRenameDelete(false);
                                }}
                              >
                                Rename
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  setIsDeleteModalOpen(true);
                                  setRenameDelete(false);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </Fragment>
                  ))}
                </RadioGroup>

                {choirList.length === 0 && !choirsLoading && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                    className="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <Image
                      src="/people.png"
                      width={256}
                      height={256}
                      alt="choirs"
                      className="w-12"
                    />
                    <span className="mt-4 block text-sm font-semibold text-gray-900">
                      Create Your First Choir!
                    </span>
                  </button>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
