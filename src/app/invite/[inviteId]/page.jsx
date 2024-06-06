'use client';

import { useParams, useSearchParams, redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InvitePage() {
  const router = useRouter();
  const { inviteId } = useParams();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const choirId = searchParams.get('choirId');
  const choirName = searchParams.get('choirName'); // Added to fetch the choirName from the query parameters

  const [message, setMessage] = useState('');
  const [userNotFound, setUserNotFound] = useState(false); // State to manage user not found
  const [emailMismatch, setEmailMismatch] = useState(false); // State to manage email mismatch
  const [success, setSuccess] = useState(false); // State to manage success message

  useEffect(() => {

    if (inviteId && uid && choirId) {
      console.log(`Invite ID: ${inviteId}, UID: ${uid}, Choir ID: ${choirId}`);

      const addAdmin = async () => {
        try {
          const response = await fetch('/api/addadmin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ admincode: inviteId, email: uid, choirId }),
          });

          const data = await response.json();
          setMessage(data.message);
          console.log(data.message);

          if (data.action === 'USER_NOT_FOUND') {
            setUserNotFound(true);
          } else if (data.status === 403 && data.message === "You must be signed in before we can add you... signin then come back to this page.") {
            setEmailMismatch(true);
          } else if (data.status === 200) {
            setSuccess(true);
            setTimeout(() => router.push('/choirselect'), 500);
          }
        } catch (error) {
          console.error('Error adding admin:', error);
          setMessage('Error adding admin');
        }
      };

      addAdmin();
    }
  }, [inviteId, uid, choirId]);

  function goToLogin() {
    redirect('/');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div
          className="ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mx-auto"
          style={{
            borderTopColor: '#4A90E2',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <p className="mt-4 text-lg font-medium">
          Adding user {uid} <br /> as admin in {decodeURIComponent(choirName)}
        </p>
        {message && (
          <p className={`mt-2 ${success ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        {userNotFound && (
          <div className="mt-4">
            <Link href="/">
              <button
                onClick={goToLogin}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Create Account
              </button>
            </Link>
          </div>
        )}
        {emailMismatch && (
          <div className="mt-4">
            <Link href="/">
              <button
                onClick={goToLogin}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
