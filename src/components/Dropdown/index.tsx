'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import DropdownMenuItem from './DropdownMenuItem';

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
const DropdownMenu = ({
  items,
  selected,
  setSelected,
  rounded = 'full',
  shadow = 'sm',
}: DropdownMenuProps) => {
  return (
    <Menu as="div" className="relative z-10">
      {({ open }) => (
        <Fragment>
          <div>
            <Menu.Button
              // eslint-disable-next-line tailwindcss/no-custom-classname, tailwindcss/no-contradicting-classname
              className={clsx(
                `animated-transition btn animated-transition text-h2 animated-transition rounded- inline-flex w-full items-center justify-center rounded-3xl bg-slate-400 px-4 py-2 font-ubuntu font-bold font-thin text-white hover:opacity-80 focus:outline-none${rounded} shadow-${shadow} ring-none outline-none active:opacity-50`,
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
            <Menu.Items className="dark:bg-navy-blue-600 absolute right-0 mt-1 w-32 rounded-3xl bg-slate-400 shadow-lg focus:outline-none">
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
};
export default DropdownMenu;
