"use client";

import { Disclosure } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { redirect } from "next/navigation";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import Link from 'next/link'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import { UserContext } from "./UserContext";
import { ChoirContext } from "./ChoirContext";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const navigation = [
  { name: "Music", href: "/music", icon: FolderIcon },
  { name: "Members", href: "/members", icon: UsersIcon },
  { name: "Calendar", href: "/calendar", icon: CalendarIcon },
  { name: "Messaging", href: "/messaging", icon: HomeIcon },
  { name: "Attendance", href: "/attendance", icon: DocumentDuplicateIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const user = useContext(UserContext);
  const choir = useContext(ChoirContext);
  const [choirs, setChoirs] = useState([]);

  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user === null) {
      redirect("/login");
    }
  }, [user]);
  
  useEffect(() => {
    if (user && user.choirs) {
      setChoirs(Object.entries(user.choirs));
    }
  }, [user]);

  return (
    <>
      <div className="h-full bg-white">
        <div className="h-full">
          <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50 lg:hidden"
                onClose={setSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-900/80" />
                </Transition.Child>

                <div className="fixed inset-0 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                          <button
                            type="button"
                            className="-m-2.5 p-2.5"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </Transition.Child>
                      {/* Sidebar component, swap this element with another sidebar if you like */}
                      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                          <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                          />
                        </div>
                        <nav className="flex flex-1 flex-col">
                          <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                          >
                            <li>
                              <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                  <li key={item.name}>
                                    <a
                                      href={"/" + choir.choirId + item.href}
                                      className={classNames(
                                        item.href === pathname
                                          ? "bg-gray-50 text-indigo-600"
                                          : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                      )}
                                    >
                                      <item.icon
                                        className={classNames(
                                          item.href == pathname
                                            ? "text-indigo-600"
                                            : "text-gray-400 group-hover:text-indigo-600",
                                          "h-6 w-6 shrink-0"
                                        )}
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </li>
                            <li>
                              <div className="text-xs font-semibold leading-6 text-gray-400">
                                Your Choirs
                              </div>
                              <ul role="list" className="-mx-2 mt-2 space-y-1">
                                {choirs.length === 0 ? (
                                  <Skeleton width={250} height={20} />
                                ) : (
                                  choirs.map(([id, name]) => (
                                    <li key={id}>
                                      <Link
                                        href={`/${id}${pathname.replace(/^\/[^\/]+/, '')}`}
                                        className={classNames(
                                          choir.choirId === id
                                            ? "border-dotted border-2 border-gray-300 bg-gray-50 text-indigo-600"
                                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                        )}
                                      >
                                        <span
                                          className={classNames(
                                            choir.choirId === id
                                              ? 'text-indigo-600 border-indigo-600'
                                              : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                          )}
                                        >
                                          {name.charAt(0)} {/* Assuming initial is the first character of the name */}
                                        </span>
                                        <span className="truncate">{name}</span>
                                      </Link>
                                    </li>
                                  ))
                                )}
                              </ul>


                            </li>
                            <li className="mt-auto">
                              <a
                                href="#"
                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                              >
                                <Cog6ToothIcon
                                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                  aria-hidden="true"
                                />
                                Settings
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  />
                </div>

                <button className="h-10 w-full bg-blue z-50 flex justify-start">
                  {choir.name ? choir.name : <Skeleton width={100} height={30} />}
                </button>


                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                        <a
                          href={"/" + choir.choirId + item.href}
                          className={classNames(
                            pathname.includes(item.href)
                              ? "border-dotted border-2 border-gray-300 bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              pathname.includes(item.href)
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                  ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400">
                        Your Choirs
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {choirs.length === 0 ? (
                          <div className="flex flex-col gap-2">
                          <Skeleton width={250} height={30} />
                          <Skeleton width={250} height={30} />
                          <Skeleton width={250} height={30} />
                          </div>
                        ) : (
                          choirs.map(([id, name]) => (
                            <li key={id}>
                              <Link
                                href={`/${id}${pathname.replace(/^\/[^\/]+/, '')}`}
                                className={classNames(
                                  choir.choirId === id
                                    ? "border-dotted border-2 border-gray-300 bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <span
                                  className={classNames(
                                    choir.choirId === id
                                      ? 'text-indigo-600 border-indigo-600'
                                      : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                  )}
                                >
                                  {name.charAt(0)} {/* Assuming initial is the first character of the name */}
                                </span>
                                <span className="truncate">{name}</span>
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>


                    </li>
                    <li className="mt-auto">
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <Cog6ToothIcon
                          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="lg:pl-72">
              <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
                <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div
                    className="h-6 w-px bg-gray-200 lg:hidden"
                    aria-hidden="true"
                  />

                  <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form
                      className="relative flex flex-1"
                      action="#"
                      method="GET"
                    >
                      <label htmlFor="search-field" className="sr-only">
                        Search
                      </label>
                      <MagnifyingGlassIcon
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                        aria-hidden="true"
                      />

                      <input
                        id="search-field"
                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
                        placeholder="Search..."
                        type="search"
                        name="search"
                      />
                    </form>
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Separator */}
                      <div
                        className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                        aria-hidden="true"
                      />

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative">
                        <Menu.Button className="-m-1.5 flex items-center p-1.5">
                          <span className="sr-only">Open user menu</span>

                          {user ? (
                            <img
                              className="h-8 w-8 rounded-full bg-gray-50"
                              src={user.image}
                              alt=""
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-50 m-10" />
                          )}
                          <span className="hidden lg:flex lg:items-center">
                            {user ? (
                              <span className="hidden lg:flex lg:items-center">
                                <span
                                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                                  aria-hidden="true"
                                >
                                  {user.displayName}
                                </span>
                                <ChevronDownIcon
                                  className="ml-2 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : (
                              <span className="hidden lg:flex lg:items-center">
                                <span
                                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                                  aria-hidden="true"
                                ></span>
                                <ChevronDownIcon
                                  className="ml-2 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </span>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Subscription
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Sign Out
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Support
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <main className="py-10 relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
                {/* <MusicPlayer /> */}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
