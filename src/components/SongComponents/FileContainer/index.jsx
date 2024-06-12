"use client";

import { useContext } from "react";
import { MusicControllerContext } from "@/components/MusicControllerProvider";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function FileContainer({ file }) {
  const musicController = useContext(MusicControllerContext);

  return (
    <div className="w-full bg-white">
      <div className="max-w-full">
        <div className="">
          <Disclosure as="div" key={file.name} className="py-2">
            {({ open }) => (
              <>
                <dt>
                  <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-900 p-2 font-semibold border-dotted rounded-md border-2 border-emerald-300 rounded-t-1 group">
                    <span className="text-base font-semibold leading-7">
                      {file.name} ({file.type})
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      {open ? (
                        <ChevronUpIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="pr-4">
                  <div className="p-2 text-sm leading-normal text-blue-gray-500/80">
                    {file.type === "satb_sheets" ? (
                      <div className="w-full grid grid-cols-1 gap-4">
                        {file.url.map((sheetUrl, index) => (
                          <img key={index} src={sheetUrl} alt={`SATB Sheet ${index + 1}`} />
                        ))}
                      </div>
                    ) : file.type === "pdf" ? (
                      <div className="w-full">
                        <embed src={file.url} width="100%" height="500" />
                      </div>
                    ) : (
                      <div>
                        <button
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={() => {
                            musicController.setSongUrl(file.url);
                            musicController.setSongName(file.name);
                          }}
                        >
                          Play Audio
                        </button>
                        <button
                          className="inline-flex items-center rounded-md bg-white border border-gray-300 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                          onClick={() => {
                            musicController.setSongUrl(file.url);
                            musicController.setSongName(file.name);
                          }}
                        >
                          Add Timestamps
                        </button>
                      </div>
                    )}
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
}
