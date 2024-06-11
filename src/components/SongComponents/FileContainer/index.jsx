"use client";

import Collapsible from "react-collapsible";

import MP3File from "@/components/SongComponents/MP3File";
import PDFFile from "@/components/SongComponents/PDFFile";

export default function FileContainer({ file }) {
  return (
    <Collapsible
      open={false}
      trigger={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="ml-2.5 font-medium">{file.name}</p>
          </div>
        </div>
      }
      className="flex p-2 flex-col justify-between rounded-md w-100 bg-slate-100"
      openedClassName="flex p-2 flex-col justify-between rounded-md w-100 bg-slate-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full">
          {file.name.split(".").pop() === "pdf" ? (
            <PDFFile file={file} />
          ) : (
            <MP3File file={file} />
          )}
        </div>
      </div>
    </Collapsible>
  );
}
