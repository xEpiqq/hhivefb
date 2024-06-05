'use client'
import { Fragment, useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition, Radio, RadioGroup } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


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
  const [newChoirName, setNewChoirName] = useState('');

  async function updateChoir(choirid) {
    const response = await fetch('/api/prefchoir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choirId: choirid, userId: user.id })
    });
    router.push('/music');
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

  const choirList = user && user.choirs ? Object.keys(user.choirs).map(key => ({
    name: key,
    id: user.choirs[key],
  })) : [];

  const handleModalClose = () => setIsModalOpen(false);
  const handleChoirNameChange = (event) => setNewChoirName(event.target.value);
  const handleSaveChoir = () => {
    if (newChoirName.trim() !== '') {
      createNewChoir();
    }
  }

  return (
    <>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20" onClick={handleModalClose} />
          <div className="bg-white shadow sm:rounded-lg fixed top-1/3 z-30">
            <button type="button" className="absolute top-0 left-0 inline-flex items-center justify-center rounded-md p-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500" onClick={handleModalClose}>
              X
            </button>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">Add a New Choir</h3>
              <form className="mt-5 sm:flex sm:items-center">
                <div className="w-full">
                  <input type="text" name="choirName" placeholder="Choir Name" onChange={handleChoirNameChange} value={newChoirName} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                <div className="mt-5 sm:mt-0 sm:ml-3">
                  <button type="button" className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto" onClick={handleSaveChoir}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

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
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Select a choir</h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <button className="py-2 px-4 bg-green-500 text-white rounded" onClick={() => setIsModalOpen(true)}>Add New Choir</button>

                <RadioGroup value={selected} onChange={setSelected} className="flex flex-col gap-2 mt-4">
                {choirList.map((choir) => (
                    <Link key={choir.name} href={`/${choir.name}/music`} passHref>
                    <Radio value={choir} className={({ focus }) => classNames(focus ? 'border-indigo-600 ring-2 ring-indigo-600' : '', !focus ? 'border-gray-300 border ' : '', 'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between')}>
                        {({ checked, focus }) => (
                        <>
                            <span className="flex items-center">
                            <span className="flex flex-col text-sm">
                                <span className="font-medium text-gray-900">{choir.id}</span>
                                <span className="text-gray-500">Total Members: 30</span>
                            </span>
                            </span>
                            <span className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                            <span className="font-medium text-gray-900">Last opened</span>
                            </span>
                            <span className={classNames(checked ? 'border-indigo-600' : 'border-transparent', focus ? 'border' : 'border-2', 'pointer-events-none absolute -inset-px rounded-lg')} aria-hidden="true" />
                        </>
                        )}
                    </Radio>
                    </Link>
                ))}
                </RadioGroup>


                {choirList.length === 0 && <div>No choirs available</div>}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
