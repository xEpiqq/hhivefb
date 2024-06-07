import { NextResponse } from "next/server";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const { choirId, eventId } = params;

    // Get the event document from Firestore
    const eventDocRef = doc(db, "choirs", choirId, "calendar", eventId);
    const eventDoc = await getDoc(eventDocRef);

    if (!eventDoc.exists()) {
      return NextResponse.json({
        status: 404,
        message: "Event not found",
      });
    }

    // Update the calendar event
    await updateDoc(eventDocRef, data);

    return NextResponse.json({
      status: 200,
      message: "Calendar event updated successfully",
    });
  } catch (error) {
    console.error("Error updating document: ", error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
