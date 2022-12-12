import { Fragment, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  ChartBarIcon,
  LifebuoyIcon,
  PhoneIcon,
  PlayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

const solutions = [
  {
    name: 'Analytics',
    description:
      'Get a better understanding of where your traffic is coming from.',
    href: '#',
    icon: ChartBarIcon,
  },
];
const callsToAction = [
  { name: 'Watch Demo', href: '#', icon: PlayIcon },
  { name: 'Contact Sales', href: '#', icon: PhoneIcon },
];
const resources = [
  {
    name: 'Help Center',
    description:
      'Get all of your questions answered in our forums or contact support.',
    href: '#',
    icon: LifebuoyIcon,
  },
];
const recentPosts: {
  id: number;
  name: string;
  href: string;
}[] = [{ id: 1, name: 'How to?', href: '#' }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage?.getItem('token')) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Popover className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="bold flex justify-start lg:w-0 lg:flex-1">
            <a href="#">
              <span className="sr-only">Your Company</span>
              E-MoD
            </a>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <Link
              href={loggedIn ? '/logout' : '/login'}
              className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
            >
              {loggedIn ? 'Log out' : 'Sign in'}
            </Link>
          </div>
        </div>
      </div>
    </Popover>
  );
};
