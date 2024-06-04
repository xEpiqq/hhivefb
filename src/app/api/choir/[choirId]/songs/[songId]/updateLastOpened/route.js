import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export async function PUT(request, { params }) {
  try {
    const { choirId, songId } = params;

    // Get the song document reference
    const songDocRef = doc(db, "choirs", choirId, "songs", songId);
    
    // Update the lastOpened field to the current date and time
    await updateDoc(songDocRef, {
      lastOpened: new Date().toISOString()
    });

    return NextResponse.json({
      status: 200,
      message: "Last opened date updated successfully",
    });
  } catch (error) {
    console.error("Error updating last opened date: ", error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
