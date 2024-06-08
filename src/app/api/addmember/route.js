import { NextResponse } from "next/server";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";
import { getCurrentUser } from "@/lib/session";

export async function POST(request) {
  const { membercode, email, choirId } = await request.json();
  console.log("membercode", membercode, "email", email, "choirId", choirId);

  const userQuery = query(collection(db, "users"), where("email", "==", email));
  const userDocs = await getDocs(userQuery);

  if (userDocs.empty) {
    console.log(`No user found with email ${email}`);
    return NextResponse.json({
      status: 404,
      message: `No user found with email ${email}... create an account and come back to this page.`,
      action: "USER_NOT_FOUND",
    });
  }

  const user = await getCurrentUser();

  if (!user || user.email !== email) {
    console.log("User not signed in or email mismatch");
    return NextResponse.json({
      status: 403,
      message:
        "You must be signed in before we can add you... signin then come back to this page.",
      action: "SIGN_IN_REQUIRED",
    });
  }

  const choirDocRef = doc(db, "choirs", choirId);
  const choirDocSnap = await getDoc(choirDocRef);
  if (!choirDocSnap.exists()) {
    console.log(`Choir with ID ${choirId} not found`);
    return NextResponse.json({ status: 404, message: "Choir not found" });
  }

  const choirDoc = choirDocSnap.data();
  console.log(choirDoc);

  const trueMemberCode = choirDoc.code;
  console.log(trueMemberCode);

  if (membercode !== trueMemberCode) {
    console.log("Member code mismatch");
    return NextResponse.json({ status: 401, message: "Invalid member code" });
  }

  console.log("Member code match!" + membercode + "=" + trueMemberCode);

  await Promise.all(
    userDocs.docs.map(async (userDoc) => {
      const uid = userDoc.id;
      console.log("Found UID:", uid);

      const choirMembersCollection = collection(
        db,
        "choirs",
        choirId,
        "members"
      );
      const choirMembersQuery = query(
        choirMembersCollection,
        where("email", "==", email),
      );

      const querySnapshot = await getDocs(choirMembersQuery);


      if (querySnapshot.empty) {
        // Add user to choir members
        console.log(`Adding user ${email} to choir members`);
        await setDoc(doc(choirMembersCollection, uid), {
          email,
          name: userDoc.data().name,
          role: "Member",
        });
      } else {
        console.log(`User ${email} is already a member of the choir`);
      }

      const userRef = doc(db, "users", uid);
      const userData = userDoc.data();

      if (!userData.choirs_joined) {
        userData.choirs_joined = [];
      }

      if (!userData.choirs_joined.includes(choirId)) {
        const updatedChoirsJoined = [...userData.choirs_joined, choirId];
        await updateDoc(userRef, {
          choirs_joined: updatedChoirsJoined,
        });
        console.log(`User ${email} updated with new choir: ${choirId}`);
      } else {
        console.log(
          `User ${email} already has the choir ${choirId} in their list`
        );
      }
    })
  );

  return NextResponse.json({
    status: 200,
    message: "Member added successfully",
  });
}
