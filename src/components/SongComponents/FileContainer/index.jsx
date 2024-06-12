"use client";

import MP3File from "@/components/SongComponents/MP3File";
import PDFFile from "@/components/SongComponents/PDFFile";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function FileContainer({ file }) {
  return (
    <div className="w-full bg-white">
      <div className="max-w-full">
        <div className="">
          <Disclosure as="div" key={file.name} className="py-2">
            {({ open }) => (
              <>
                <dt>
                  <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-900 p-2 font-semibold border-dotted rounded-md border-2 border-emerald-300 rounded-t-1 group">
                    <span className="text-base font-semibold leading-7">{file.name}</span>
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
                    {file.name.split(".").pop() === "pdf" ? (
                      <PDFFile file={file} />
                    ) : (
                      <MP3File file={file} />
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
