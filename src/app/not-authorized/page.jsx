'use client'
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from "@/lib/session";

export default function ChoirSelect() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }

    fetchUser();
  }, []);

  function returnToLogin() {
    window.location.href = '/';
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-white flex-col">
      <div className='w-1/2 flex items-center justify-center flex-col gap-2'>
  
        <div className='text-xs'>{user?.name} we ❤️ u but</div>
        <div className='text-2xl'>You are not authorized as an admin of this choir.</div>
        <div>
          The owner can add you by going to <span className='font-bold'>Dashboard</span> &gt; <span className='font-bold'>Members</span> &gt; <span className='font-bold'>Click Email Dropdown</span> &gt; <span className='font-bold'>Select Admin</span> &gt; <span className='font-bold'>Send Invite</span>
        </div>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-10 right-10' onClick={returnToLogin}>Return To Login</button>
      </div>
    </div>
  );
}
