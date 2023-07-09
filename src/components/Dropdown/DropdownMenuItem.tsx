import { Menu } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

type DropdownMenuItemProps = {
  children: React.ReactNode;
  handleBtn: (text: string) => void;
  selected: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'primary-active'
    | 'secondary-active'
    | 'gray'
    | 'method';
};

const DropdownMenuItem = ({
  children,
  handleBtn,
  selected,
}: DropdownMenuItemProps) => (
  <Menu.Item>
    {({ active }) => (
      <a
        onClick={() => {
          handleBtn(children as string);
        }}
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={clsx(
          'md:text-md block cursor-pointer rounded-full py-2 text-sm hover:bg-gray-100 hover:opacity-80',
          active ? 'bg-gray-100 text-gray-800' : '',
          selected
            ? 'bg-gray-100 font-semibold text-gray-900'
            : 'bg-slate-400 font-semibold text-gray-900 '
        )}
      >
        <div className="grid grid-cols-6">
          <span>
            {selected ? (
              <CheckIcon className="ml-3 h-4 w-4 lg:h-5 lg:w-5" />
            ) : (
              ''
            )}
          </span>
          <span className="col-span-4 col-start-2 text-center">{children}</span>
        </div>
      </a>
    )}
  </Menu.Item>
);

export default DropdownMenuItem;
