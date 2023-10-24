import React, { Fragment } from 'react';
import clsx from 'clsx';
import { Menu, Transition } from '@headlessui/react';

type Props = {
  items: Array<{ key: string; value: string; onChange: any }>;
  value?: any;
  title?: string;
};

function DropDown({ items, value, title }: Props) {
  function onClickMenu(it: { key: string; value: string; onChange: any }) {
    if (!!it.onChange)
      return () => {
        it.onChange();
      };
  }

  return (
    <Menu>
      <div>{title}</div>
      <Menu.Button className="py-1 px-2 rounded-md">{value}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-blue-900 absolute right-0 w-56 mt-2 origin-top-right divide-y divide-gray-300 rounded-md shadow-lg ring-2 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            {items.map((it) => (
              <Menu.Item key={it.key}>
                <div
                  onClick={onClickMenu(it)}
                  className={clsx(
                    'cursor-pointer',
                    'text-white',
                    'hover:bg-blue-800',
                    'px-4 py-2',
                    'rounded-md',
                  )}
                >
                  {it.value}
                </div>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default DropDown;
