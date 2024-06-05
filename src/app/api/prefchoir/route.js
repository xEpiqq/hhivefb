import { NextResponse } from "next/server";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export async function POST(request) {
  const data = await request.json();
  const userDocRef = doc(db, "users", data.userId);
  const choirDocRef = doc(db, "choirs", data.choirId);

  // Update the user's document with the current choir selected and the timestamp
  await updateDoc(userDocRef, { 
    current_choir_selected: data.choirId, 
    lastOpened: serverTimestamp() 
  });

  // Optionally, update the choir document with the last opened timestamp for the user
  await updateDoc(choirDocRef, { 
    [`lastOpened.${data.userId}`]: serverTimestamp() 
  });

  return NextResponse.json({ status: 200, message: "User is authenticated" });
}
