'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { DropdownMenuItem } from './DropdownMenuItem';

interface DropdownMenuProps {
  items: string[];
  multiple?: boolean;
  selected: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'primary-active'
    | 'secondary-active'
    | 'gray'
    | 'method';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'method';
  rounded?: 'full' | '2xl' | 'xl' | 'lg' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  setSelected: (selected: string) => void;
}
export function DropdownMenu({
  items,
  selected,
  setSelected,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  shadow = 'sm',
}: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative z-10">
      {({ open }) => (
        <Fragment>
          <div>
            <Menu.Button
              // eslint-disable-next-line tailwindcss/no-custom-classname, tailwindcss/no-contradicting-classname
              className={clsx(
                `animated-transition flex items-center justify-center focus:outline-none btn animated-transition bg-slate-400 text-white font-bold hover:opacity-80 text-h5 font-ubuntu animated-transition inline-flex w-full justify-center rounded-3xl px-4 py-2 font-thin focus:outline-none rounded-${rounded} shadow-${shadow} ring-none outline-none`,
                open ? 'opacity-80' : ''
              )}
            >
              {selected}

              <ChevronDownIcon
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className={`animated-transition -mr-1 ml-2 h-5 w-5 ${
                  open ? 'rotate-180 ' : ''
                }`}
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom=" opacity-0 scale-95"
            enterTo=" opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom=" opacity-100 scale-100"
            leaveTo=" opacity-0 scale-95"
          >
            <Menu.Items className="dark:bg-navy-blue-600 absolute right-0 mt-1 w-48 rounded-3xl bg-slate-400 shadow-lg focus:outline-none">
              <div className="p-1">
                {items.map((item, id) => (
                  <DropdownMenuItem
                    selected={item === selected}
                    handleBtn={setSelected}
                    key={id}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Fragment>
      )}
    </Menu>
  );
}
