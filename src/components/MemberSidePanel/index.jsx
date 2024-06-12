import { Fragment, useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { ChoirContext } from "@/components/ChoirContext";

const userRoles = [
  { id: "Admin", title: "Admin" },
  { id: "Member", title: "Member" },
];

export default function MemberSlidePanel({ open, setOpen, member }) {
  const choir = useContext(ChoirContext);

  const [role, setRole] = useState("Member");

  if (member === null) return null;

  useEffect(() => {
    setRole(member.role);
  }, [member]);

  useEffect(() => {
    console.log(role);
  }, [role]);

  console.log(member.role)

  return (
    <Transition show={open}>
      <Dialog className="relative z-[50]" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <TransitionChild
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <DialogTitle className="text-base font-semibold leading-6 text-white">
                            Member Details
                          </DialogTitle>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-1 pb-5 pt-6">
                            <div>{member.name}</div>
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              Joined{" "}
                              {new Date(member.dateJoined.toDate()).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="pb-6 pt-4">
                            <fieldset>
                              <legend className="text-sm font-semibold leading-6 text-gray-900">
                                Permissions
                              </legend>
                              <p className="mt-1 text-sm leading-6 text-gray-600">
                                What permissions do you want to give this user?
                              </p>
                              <div className="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                {userRoles.map((userRole) => (
                                  <div
                                    key={userRole.id}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={userRole.id}
                                      name="user-permissions"
                                      type="radio"
                                      defaultChecked={userRole.id === member.role}
                                      onChange={(e) => setRole(e.target.value)}
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                      htmlFor={userRole.id}
                                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      {userRole.title}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => choir.removeMember(member)}
                        type="button"
                        className="ml-4 bg-red inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Remove Member
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
