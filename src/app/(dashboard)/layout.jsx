"use server";

import SideBarlayout from "./SideBarLayout";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import UserProvider from "../../components/UserContext";
import ChoirProvider from "../../components/ChoirContext";
import StateContextProvider from "../../components/StateContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestoreAdapter";
import MusicControllerProvider from "@/components/MusicControllerProvider";

export default async function Layout({ children, params }) {
  const user = await getCurrentUser();
  console.log("the user id is: " + user?.id);

  if (!user) {
    redirect("/");
  }

  // const memberRef = doc(db, "choirs", choirId, "members", user.id);
  // const memberDoc = await getDoc(memberRef);

  // if (!memberDoc.exists()) {
  //   return redirect("/not-found");
  // }

  // TODO: Re-enable this when we have choir admins
  // if (memberDoc.data().role !== "Admin") {
  //   return redirect("/not-found");
  // }

  return (
    <StateContextProvider>
      <MusicControllerProvider>
        <UserProvider user={user}>
          <ChoirProvider>
            <SideBarlayout>{children}</SideBarlayout>
          </ChoirProvider>
        </UserProvider>
      </MusicControllerProvider>
    </StateContextProvider>
  );
}
