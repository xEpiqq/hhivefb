"use client";

import React from "react";

export default function PDFFile({ file }) {
  return (
    <div className="w-full">
      <div>
        <button
          className="mb-2 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            // Button functionality can be added here
          }}
        >
          Re-order Sheets
        </button>
      </div>
      <embed src={file.url} width="100%" height="500" />
    </div>
  );
}
