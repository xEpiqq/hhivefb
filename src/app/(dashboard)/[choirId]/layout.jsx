"use server";

import SideBarlayout from "./SideBarLayout";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import UserProvider from "./UserContext";
import ChoirProvider from "./ChoirContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";

export default async function Layout({ children, params }) {
  const user = await getCurrentUser();
  const { choirId } = params;
  console.log("the user id is: " + user?.id);

  if (!user) {
    redirect("/");
  }

  const memberRef = doc(db, "choirs", choirId, "members", user.id);
  const memberDoc = await getDoc(memberRef);

  if (!memberDoc.exists()) {
    return redirect("/not-found");
  }

  // TODO: Re-enable this when we have choir admins
  // if (memberDoc.data().role !== "Admin") {
  //   return redirect("/not-found");
  // }

  return (
    <UserProvider user={user}>
      <ChoirProvider choirId={choirId}>
        <SideBarlayout>{children}</SideBarlayout>
      </ChoirProvider>
    </UserProvider>
  );
}
