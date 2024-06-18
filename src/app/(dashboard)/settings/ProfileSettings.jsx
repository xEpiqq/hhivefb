"use client";

import { UserContext } from "@/components/UserContext";
import { useContext, useState, useEffect } from "react";

import { firestore } from "@/components/Firebase";
import { getDoc, updateDoc, doc, collection } from "firebase/firestore";

export default function ProfileSettings() {
  const user = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  console.log(user);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  function handleSubmit(e) {
    e.preventDefault();
    setEditing(false);


    const userRef = doc(firestore, "users", user.id);

    updateDoc(userRef, {
      name: name,
      email: email,
    }).then(() => {
      alert("Profile updated");
    });
  }

  return (
    <div className="divide-y divide-gray-200">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Use a permanent address where you can receive mail.
          </p>
        </div>

        <form className="md:col-span-2" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              <img
                src={user.image}
                alt=""
                className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
              />
              <div>
                <button
                  type="button"
                  disabled={!editing}
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold hover:bg-indigo-400  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-0"
                >
                  Change avatar
                </button>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="first-name"
                  autoComplete="given-name"
                  disabled={!editing}
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-0"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  disabled={!editing}
                  id="email"
                  value={email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-insetdisabled:bg-gray-50 disabled:text-gray-500 disabled:ring-0"
                />
              </div>
            </div>

            {/* <div className="col-span-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-gray-50 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    example.com/
                  </span>
                  <input
                    disabled={!editing}
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ring-insetdisabled:bg-gray-50 disabled:text-gray-500 disabled:ring-0"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div> */}
          </div>

          <div className="mt-8 flex">
            {!editing ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEditing(true);
                }}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={!editing}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={!editing}
                  onClick={() => setEditing(false)}
                  className="ml-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
