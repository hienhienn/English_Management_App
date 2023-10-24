import { Menu, Transition } from '@headlessui/react';
import { FilterIcon, CheckIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { type } from 'os';
import React, { Fragment } from 'react';
import { WhiteBlueButton } from '../base/Button';
import Checkbox from '../base/Checkbox';
import Link from 'next/link';

type Props = {
  selected: Array<any>;
  setSelected: any;
  items: Array<any>;
};

const ColumnSelect = ({ selected, setSelected, items }: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left mb-5">
      <Menu.Button className="rounded-lg bg-white border border-blue-900 hover:bg-gray-200 text-blue-900  py-2 px-4">
        <b>
          {selected.length}/{items.length}
        </b>{' '}
        cột hiển thị
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
        <Menu.Items className="z-10 absolute shadow-md shadow-slate-200 inline-flex top-full right-0 mt-2 min-w-[200px] max-w-[500px] justify-center rounded-md bg-white p-1 text-sm font-normal text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <div className="p-2 w-full">
            {items.map((it: any) => (
              <Menu.Item
                as="div"
                key={it.key}
                className="w-full"
                onClick={(e) => e.preventDefault()}
              >
                <div
                  className={clsx(
                    'cursor-pointer',
                    'text-black',
                    'hover:bg-blue-200',
                    'px-4 py-2',
                    'rounded-md',
                    'w-full',
                    'flex',
                    selected.includes(it.key) ? 'font-bold' : '',
                    it?.fixed ? 'opacity-60 cursor-default' : '',
                  )}
                  onClick={() => {
                    if (it?.fixed) return;
                    if (!selected.includes(it.key))
                      setSelected([...selected, it.key]);
                    else setSelected(selected.filter((t: any) => t != it.key));
                  }}
                >
                  {selected.includes(it.key) ? (
                    <CheckIcon className="w-4 h-4 my-auto mr-3" />
                  ) : (
                    <div className="w-7 h-2"></div>
                  )}
                  {it.value}
                </div>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ColumnSelect;
