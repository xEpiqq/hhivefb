import { NextResponse } from "next/server";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export async function POST(request) {
  try {
    const data = await request.json();
    const userId = data.userId;
    
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userChoirs = userDoc.data().choirs || {};
      const choirDetails = await Promise.all(Object.entries(userChoirs).map(async ([choirId, choirName]) => {
        const choirDocRef = doc(db, "choirs", choirId);
        const choirDoc = await getDoc(choirDocRef);
        
        if (choirDoc.exists()) {
          const choirData = choirDoc.data();
          return {
            id: choirId,
            name: choirName,
            members: choirData.members.length,
            lastOpened: choirData.lastOpened?.[userId] || null
          };
        } else {
          return null;
        }
      }));

      return NextResponse.json({ status: 200, choirDetails: choirDetails.filter(Boolean) });
    } else {
      return NextResponse.json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: error.message });
  }
}
