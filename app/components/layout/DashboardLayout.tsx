'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { navigation, quickActions } from '../../constants/navigation';
import DemoControls from '../DemoControls';
import { GetAccountResponse } from '../../types/account';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  accountData: GetAccountResponse | null;
  onRefreshAccount: () => Promise<void>;
}

export default function DashboardLayout({
  children,
  accountData,
  onRefreshAccount,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 opacity-90">
              <div className="relative flex h-16 shrink-0 items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-600">
                    [EXAMPLE]
                  </span>
                </div>
              </div>
              <nav className="relative flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              pathname === item.href
                                ? 'bg-gray-100 text-gray-600'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-medium transition-colors'
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                pathname === item.href
                                  ? 'text-gray-600'
                                  : 'text-gray-400',
                                'size-6 shrink-0'
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs/6 font-semibold text-gray-400">
                      Quick Actions
                    </div>
                    <ul
                      role="list"
                      className="-mx-2 mt-2 space-y-1 pointer-events-none"
                    >
                      {quickActions.map((action) => (
                        <li key={action.name}>
                          <a
                            href={action.href}
                            className="text-gray-500 group flex gap-x-3 rounded-md p-2 text-sm/6 font-medium"
                          >
                            <span className="border-gray-200 text-gray-400 flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium">
                              {action.initial}
                            </span>
                            <span className="truncate">{action.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col opacity-90">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-300 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-lg font-semibold text-gray-600">
                [EXAMPLE]
              </span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              pathname === item.href
                                ? 'bg-gray-100 text-gray-600'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-medium transition-colors'
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                pathname === item.href
                                  ? 'text-gray-600'
                                  : 'text-gray-400',
                                'size-6 shrink-0'
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs/6 font-semibold text-gray-400">
                      Quick Actions
                    </div>
                    <ul
                      role="list"
                      className="-mx-2 mt-2 space-y-1 pointer-events-none"
                    >
                      {quickActions.map((action) => (
                        <li key={action.name}>
                          <a
                            href={action.href}
                            className="text-gray-500 group flex gap-x-3 rounded-md p-2 text-sm/6 font-medium"
                          >
                            <span className="border-gray-200 text-gray-400 flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium">
                              {action.initial}
                            </span>
                            <span className="truncate">{action.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <a
                  href="#"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-medium text-gray-500 pointer-events-none"
                >
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5 grayscale opacity-60"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">John Doe</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden opacity-90">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-500 lg:hidden pointer-events-none"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="flex-1 text-sm/6 font-medium text-gray-600">
          Dashboard
        </div>
        <a href="#" className="pointer-events-none">
          <span className="sr-only">Your profile</span>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5 grayscale opacity-60"
          />
        </a>
      </div>

      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      <DemoControls
        accountData={accountData}
        onRefreshAccount={onRefreshAccount}
      />
    </div>
  );
}
