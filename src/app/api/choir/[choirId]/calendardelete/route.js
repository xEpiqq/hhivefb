import { NextResponse } from "next/server";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export async function POST(request, { params }) {
  try {
    const { choirId } = params;
    const { eventId } = await request.json();

    console.log("Deleting this little frick: ", eventId);

    // Get the event document from Firestore
    const eventDocRef = doc(db, "choirs", choirId, "calendar", eventId);
    const eventDoc = await getDoc(eventDocRef);

    if (!eventDoc.exists()) {
      return NextResponse.json({
        status: 404,
        message: "Event not found",
      });
    }

    // Delete the calendar event
    await deleteDoc(eventDocRef);

    return NextResponse.json({
      status: 200,
      message: "Calendar event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document: ", error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
