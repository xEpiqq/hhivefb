import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export async function POST(request) {
  try {
    const data = await request.json();
    const { choirId, newName, userId } = data;

    const choirDocRef = doc(db, "choirs", choirId);
    const choirDoc = await getDoc(choirDocRef);

    if (!choirDoc.exists()) {
      return NextResponse.json({ status: 404, message: "Choir not found" });
    }

    await updateDoc(choirDocRef, { name: newName });

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const choirs = userDoc.data().choirs || {};
      choirs[choirId] = newName;

      await updateDoc(userDocRef, { choirs: choirs });

      return NextResponse.json({ status: 200, message: "Choir renamed successfully" });
    } else {
      return NextResponse.json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: error.message });
  }
}
