import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";
import { getCurrentUser } from "@/lib/session";

export async function POST(request) {
  const { admincode, email, choirId } = await request.json();
  console.log("admincode", admincode, "email", email, "choirId", choirId);

  // Query the user collection to get the true UID
  const userQuery = query(collection(db, "users"), where("email", "==", email));
  const userDocs = await getDocs(userQuery);

  if (userDocs.empty) {
    console.log(`No user found with email ${email}`);
    return NextResponse.json({ status: 404, message: `No user found with email ${email}... create an account and come back to this page.`, action: "USER_NOT_FOUND" });
  }

  const userDoc = userDocs.docs[0];
  const uid = userDoc.id;
  console.log("Found UID:", uid);

  const user = await getCurrentUser();

  if (!user || user.email !== email) {
    console.log("User not signed in or email mismatch");
    return NextResponse.json({ status: 403, message: "You must be signed in before we can add you... signin then come back to this page.", action: "SIGN_IN_REQUIRED" });
  }

  // Fetch choir document
  const choirDocRef = doc(db, "choirs", choirId);
  const choirDocSnap = await getDoc(choirDocRef);
  if (!choirDocSnap.exists()) {
    console.log(`Choir with ID ${choirId} not found`);
    return NextResponse.json({ status: 404, message: "Choir not found" });
  }

  const choirDoc = choirDocSnap.data();
  console.log(choirDoc);

  const trueAdminCode = choirDoc.adminCode;
  console.log(trueAdminCode);

  if (admincode !== trueAdminCode) {
    console.log("Admin code mismatch");
    return NextResponse.json({ status: 401, message: "Invalid admin code" });
  }

  console.log("Admin code match!" + admincode + "=" + trueAdminCode);

  // Check if the user is already an admin
  if (!choirDoc.admins.includes(uid)) {
    const newAdmins = [...choirDoc.admins, uid];
    await updateDoc(choirDocRef, {
      admins: newAdmins,
    });
    console.log("New admins", newAdmins);
  } else {
    console.log(`User ${email} is already an admin of the choir`);
  }

  // Update user's choir list if not already present
  const userRef = doc(db, "users", uid);
  const userData = userDoc.data();

  if (!userData.choirs) {
    userData.choirs = {};
  }

  if (!(choirId in userData.choirs)) {
    const updatedChoirs = {
      ...userData.choirs,
      [choirId]: choirDoc.name,
    };
    await updateDoc(userRef, {
      choirs: updatedChoirs,
    });
    console.log(`User ${email} updated with new choir: ${choirId}`);
  } else {
    console.log(`User ${email} already has the choir ${choirId} in their list`);
  }

  return NextResponse.json({ status: 200, message: "Admin added successfully" });
}
