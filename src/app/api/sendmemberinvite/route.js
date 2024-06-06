import { NextResponse } from "next/server";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export async function POST(request) {
  try {
    const { inputBox, choirName, choirId, choirCode } = await request.json();
    const choirDocRef = doc(db, "choirs", choirId);
    const choirDocSnap = await getDoc(choirDocRef);

    if (!choirDocSnap.exists()) {
      return NextResponse.json({ status: 404, message: "Choir not found" });
    }

    const choirData = choirDocSnap.data();
    const memberCode = choirData.memberCode;

    const emailCollectionRef = collection(db, "mail");
    const encodedChoirName = encodeURIComponent(choirName);
    const docRef = await addDoc(emailCollectionRef, {
      to: [inputBox],
      message: {
        subject: `Invitation to join ${choirName}`,
        text: `You have been invited to join the choir ${choirName}. Please use the following link to join: ${process.env.NEXTAUTH_URL}/memberinvite/${memberCode}?uid=${inputBox}&choirId=${choirId}&choirName=${encodedChoirName}`,
        html: `
          <p>Dear recipient,</p>
          <p>You have been invited to join the choir <strong>${choirName}</strong>.</p>
          <p>Please use the following link to join: <a href="${process.env.NEXTAUTH_URL}/memberinvite/${choirCode}?uid=${inputBox}&choirId=${choirId}&choirName=${encodedChoirName}">Accept Invitation</a></p>
          <p>Best regards,</p>
          <p>Your Choir Teacher</p>
        `,
      }
    });

    console.log("Document successfully created with ID: ", docRef.id);
    return NextResponse.json({ status: 200, message: "Member invitation email triggered successfully" });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}