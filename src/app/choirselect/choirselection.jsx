'use client'
import { Fragment, useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition, Radio, RadioGroup } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Image from 'next/image'
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import NewChoirModal from './newchoirmodal';
import DeleteChoirModal from './deletechoirmodal';

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ChoirSelection({ user }) {
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newChoirName, setNewChoirName] = useState('');
  const [choirList, setChoirList] = useState([]);
  const [choirsLoading, setChoirsLoading] = useState(true);
  const [choirDeleteId, setChoirDeleteId] = useState('');
  const [choirDeleteName, setChoirDeleteName] = useState('');
  const [renameDelete, setRenameDelete] = useState(false);


  useEffect(() => {
    if (user && user.id) {
      const fetchChoirDetails = async () => {
        const response = await fetch('/api/fetchchoirs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
        
        const result = await response.json();

        console.log(result)
        
        if (result.status === 200) {
          setChoirList(result.choirDetails);
        } else {
          console.error(result.message);
        }
      };
      fetchChoirDetails();
    }

    setChoirsLoading(false);
  }, [user]);

  async function updateChoir(choirid) {
    const response = await fetch('/api/prefchoir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choirId: choirid, userId: user.id, lastOpened: new Date().toLocaleString() })
    });
  }

  async function createNewChoir() {
    const response = await fetch('/api/createchoir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newChoirName, userId: user.id })
    });
    const data = await response.json();
    setIsModalOpen(false);
    router.refresh();
  }

  // const choirList = user && user.choirs ? Object.keys(user.choirs).map(key => ({
  //   name: key,
  //   id: user.choirs[key],
  // })) : [];

  const handleModalClose = () => setIsModalOpen(false);
  const handleChoirNameChange = (event) => setNewChoirName(event.target.value);
  const handleSaveChoir = () => {
    if (newChoirName.trim() !== '') {
      createNewChoir();
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
  };

  return (
    <>

      <NewChoirModal 
        open={isModalOpen}
        setOpen={setIsModalOpen}
        submit={handleSaveChoir}
        user={user}
      />

      <DeleteChoirModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        user={user}
        choirid={choirDeleteId}
        choirname={choirDeleteName}
      />


      <div className='w-full h-full'>
        <div className="min-h-full bg-white">
          <Disclosure as="nav" className="border-b border-gray-200 bg-white">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 justify-between">
                    <div className="flex">
                      <div className="flex flex-shrink-0 items-center">
                        <img className="block h-8 w-auto lg:hidden" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                        <img className="hidden h-8 w-auto lg:block" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                      </div>
                      <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                        <a href="#" className='border-indigo-500 text-gray-900 inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium' aria-current='page'>Choir Select</a>
                      </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                      <button type="button" className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.image} alt="" />
                          </MenuButton>
                        </div>
                        <Transition enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <MenuItem key={item.name}>
                                {({ focus }) => (
                                  <a href={item.href} className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                    {item.name}
                                  </a>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                      <DisclosureButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                      </DisclosureButton>
                    </div>
                  </div>
                </div>

                <DisclosurePanel className="sm:hidden">
                  <div className="space-y-1 pb-3 pt-2">
                    <DisclosureButton key="Choir Select" as="a" href="#" className='border-indigo-500 bg-indigo-50 text-indigo-700 block border-l-4 py-2 pl-3 pr-4 text-base font-medium' aria-current='page'>Choir Select</DisclosureButton>
                  </div>
                  <div className="border-t border-gray-200 pb-3 pt-4">
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                      </div>
                      <button type="button" className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1">
                      {userNavigation.map((item) => (
                        <DisclosureButton key={item.name} as="a" href={item.href} className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          <div className="py-10">
            <header>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-6">Select a choir</h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <button 
                  className="py-2 px-4 bg-white text-black border border-dashed border-indigo-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 transition duration-150 ease-in-out" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Add New Choir
                </button>


                {choirsLoading && 
                  <div className='mt-4'>
                    <Skeleton width={1200} height={65} className="mb-2" />
                    <Skeleton width={1200} height={65} className="mb-2" />
                  </div>
                }

                <RadioGroup value={selected} onChange={setSelected} className="flex flex-col gap-2 mt-4">
                  {choirList.map((choir) => (
                    <>
                    <Fragment key={choir.id}>
                      <div className="relative">
                        <Link href={`/${choir.id}/music`} passHref>
                          <Radio value={choir} className={({ focus }) => classNames(focus ? 'border-indigo-600 ring-2 ring-indigo-600' : '', !focus ? 'border-gray-300 border ' : '', 'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between border-gray-400 hover:border-gray-700')} onClick={() => updateChoir(choir.id)}>
                            {({ checked, focus }) => (
                              <>
                                <div className="flex items-center justify-between w-full">
                                  <span className="flex items-center">
                                    <span className="flex flex-col text-sm">
                                      <span className="font-bold text-gray-900">{choir.name}</span>
                                      <span className="text-gray-500">Total Members: {choir.members}</span>
                                    </span>
                                  </span>
                                  <div className="flex items-center space-x-4">
                                    <span className="flex flex-col text-sm text-right">
                                      <span className="font-medium text-gray-900">Last opened:</span>
                                      <span className="text-gray-500">{formatTimestamp(choir.lastOpened)}</span>
                                    </span>
                                    <button
                                      className='w-10 h-10 border border-indigo-300 rounded-full px-2 py-2 hover:border-indigo-500 flex items-center justify-center'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Add any additional logic for button click here
                                      }}
                                    >
                                      <EllipsisVerticalIcon className="w-full h-full pointer-events-none text-indigo-500" />
                                    </button>
                                  </div>
                                </div>
                                <span className={classNames(checked ? 'border-indigo-600' : 'border-transparent', focus ? 'border' : 'border-2', 'pointer-events-none absolute -inset-px rounded-lg')} aria-hidden="true" />
                              </>
                            )}
                          </Radio>
                        </Link>


                      </div>
                    </Fragment>

                    <button 
                      onClick={() => {
                        setChoirDeleteId(choir.id);
                        setChoirDeleteName(choir.name);
                        setRenameDelete(true);
                      }} 
                      className='w-10 h-10 border border-red-300 rounded-full px-2 py-2 hover:border-red-500 flex items-center justify-center'>
                      g
                    </button>
                    
      {renameDelete && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setRenameDelete(false)}></div>
          <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" >
              Rename
            </button>
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" 
            
            onClick={() => {
              setIsDeleteModalOpen(true);
              setRenameDelete(false);
            }} 
            >
              Delete
            </button>
          </div>
        </>
      )}
    </>
                  ))}
                </RadioGroup>


                {choirList.length === 0 && !choirsLoading && 
                
                <button onClick={() => setIsModalOpen(true)}
                    type="button"
                    className="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                  <Image
                        src="/people.png"
                        width={256}
                        height={256}
                        alt="choirs"
                        className='w-12'
                      />
                    <span className="mt-4 block text-sm font-semibold text-gray-900">
                      Create Your First Choir!
                    </span>
                  </button>
                
                }

              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}