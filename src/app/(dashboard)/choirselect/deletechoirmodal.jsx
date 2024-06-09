"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';

export default function DeleteChoirModal({ open, setOpen, user, choirid, choirname }) {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function deleteChoir() {
    setIsLoading(true);
    const response = await fetch('/api/deletechoir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choirId: choirid, userId: user.id })
    });
    const data = await response.json();
    setIsLoading(false);
    setOpen(false);
    setConfirmationCode("");
    router.refresh();
  }

  useEffect(() => {
    if (!open) {
      setConfirmationCode("");
    }
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment} className='z-50'>
      <Dialog as="div" className="fixed z-[100]" static onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <form
                  className="mt-5 sm:mt-4 sm:flex sm:flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (confirmationCode.trim() === `Delete ${choirname}`) {
                      deleteChoir();
                    }
                  }}
                >

                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start flex-col">
                    <div className="mt-3 text-center w-full sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete Choir
                      </Dialog.Title>
                      <div className="flex flex-col w-full mt-3">
                        <label
                          htmlFor="confirmationCode"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        <span className="italic ">This action cannot be undone - type </span> <span className="font-bold "> "Delete {choirname}" </span> <span className="italic"> to confirm </span>
                        </label>
                        <label htmlFor="confirmationCode" className="blcok text-sm font-medium leading-6 text-gray-900">
                            <span className="">(case sensitive)</span>
                        </label>
                        <div className="mt-2">
                        <input
                            type="text"
                            name="confirmationCode"
                            id="confirmationCode"
                            className="block w-full rounded-md px-2 border-1 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none bg-gray-100"
                            placeholder={`Delete ${choirname}`}
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                        />

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                        type="submit"
                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                        isLoading || confirmationCode.trim() !== `Delete ${choirname}`
                            ? 'bg-red-200'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                        disabled={isLoading || confirmationCode.trim() !== `Delete ${choirname}`}
                    
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-2.829-2.828A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-3.647z"
                          ></path>
                        </svg>
                      ) : (
                        'Delete Choir'
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
