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
  console.log('the user id is: ' + user?.id);

  if (!user) {
    redirect("/");
    return <div>Redirecting...</div>;
  }

  const choirDocRef = doc(db, "choirs", choirId);
  const choirDoc = await getDoc(choirDocRef);

  if (!choirDoc.exists()) {
    redirect("/not-found");
    return <div>Choir not found</div>;
  }

  const choirData = choirDoc.data();
  const isAdmin = choirData.admins.includes(user.id);

  if (!isAdmin) {
    redirect("/not-authorized");
    return <div>Not authorized</div>;
  }

  return (
    <UserProvider user={user}>
      <ChoirProvider choirId={choirId}>
        <SideBarlayout>
          {children}
        </SideBarlayout>
      </ChoirProvider>
    </UserProvider>
  );
}
