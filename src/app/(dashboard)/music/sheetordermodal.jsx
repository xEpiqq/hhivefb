import React from 'react';

export default function SheetOrderModal({ newSongSheetMusicImages, setSheetOrderModal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full h-full p-6">
        <h2 className="text-2xl font-bold mb-4">Order Sheets</h2>
        <div className="flex flex-wrap">
          {newSongSheetMusicImages.map((image, index) => (
            <div
              key={index}
              className="w-32 h-32 bg-gray-300 m-2 flex items-center justify-center cursor-pointer"
              draggable
            >
              {/* Replace with actual image element in the future */}
              <span>Image {index + 1}</span>
            </div>
          ))}
        </div>
        <button
          className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          onClick={() => setSheetOrderModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
