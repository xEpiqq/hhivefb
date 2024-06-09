import React from 'react';
import { getCurrentUser } from "@/lib/session";
import StepOne from './stepone'

export default async function ChoirSelect() {

  const user = await getCurrentUser();

  return (
    <div className="h-screen w-screen fixed top-0 left-0 z-50 bg-white flex justify-center items-center">
      <StepOne user={user}/>
    </div>
  );
}
