'use client'
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/components/Firebase";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  SHEET: 'sheet',
};

function DraggableSheet({ image, index, moveSheet }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SHEET,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={drag}
      className="w-96 h-auto bg-gray-300 m-2 flex items-center justify-center cursor-pointer border-black border-2"
      style={{ opacity }}
    >
      <img src={image} alt={`Sheet ${index + 1}`} className="w-full h-full object-cover" />
    </div>
  );
}

function SheetContainer({ sheetMusicImages, moveSheet }) {
  return (
    <div className="flex flex-wrap">
      {sheetMusicImages.map((image, index) => (
        <DroppableContainer key={index} index={index} moveSheet={moveSheet}>
          <DraggableSheet index={index} image={image} moveSheet={moveSheet} />
        </DroppableContainer>
      ))}
    </div>
  );
}

function DroppableContainer({ index, moveSheet, children }) {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.SHEET,
    hover(item) {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveSheet(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  }), [index]);

  return (
    <div ref={drop}>
      {children}
    </div>
  );
}

export default function SheetOrderModal({ choirId, songId, setSheetOrderModal }) {
  const [sheetMusicImages, setSheetMusicImages] = useState([]);

  useEffect(() => {
    const fetchSheetMusicImages = async () => {
      try {
        const songDoc = await getDoc(doc(firestore, `choirs/${choirId}/songs/${songId}`));
        if (songDoc.exists()) {
          setSheetMusicImages(songDoc.data().satb_sheets || []);
        }
      } catch (error) {
        console.error("Error fetching sheet music images: ", error);
      }
    };

    fetchSheetMusicImages();
  }, [choirId, songId]);

  const moveSheet = (fromIndex, toIndex) => {
    const updatedSheets = [...sheetMusicImages];
    const [movedSheet] = updatedSheets.splice(fromIndex, 1);
    updatedSheets.splice(toIndex, 0, movedSheet);
    setSheetMusicImages(updatedSheets);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-white w-full h-full p-6">
          <h2 className="text-2xl font-bold mb-4">Order Sheets</h2>
          <button onClick={() => console.log(songId)}>{choirId} and {songId}</button>

          <SheetContainer sheetMusicImages={sheetMusicImages} moveSheet={moveSheet} />

          <button
            className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            onClick={() => setSheetOrderModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </DndProvider>
  );
}
