import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, FilterIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { Fragment } from 'react';

type Props = {
  selected: any;
  setSelected: any;
  items: Array<any>;
  type?: string;
  setPageNumber?: any;
  position?: string;
};

const FilterMenu = ({
  selected,
  setSelected,
  items,
  type,
  setPageNumber,
  position = 'left',
}: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button>
        <FilterIcon
          className="h-4 w-4 translate-y-[2px]"
          style={{
            strokeWidth: items.map((t: any) => t.key).includes(selected.key)
              ? '3px'
              : '2px',
          }}
        />
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
        <Menu.Items
          className={clsx(
            `${position}-0`,
            'absolute shadow-md shadow-slate-200 inline-flex top-full min-w-[300px] max-h-[300px] overflow-y-auto z-[5] justify-center rounded-md bg-white p-1 text-sm font-normal text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
          )}
        >
          <div className="p-2 w-full">
            {items.map((it: any) => (
              <Menu.Item as="div" key={it.key} className="w-full">
                <div
                  className={clsx(
                    'cursor-pointer',
                    'text-black',
                    'hover:bg-blue-200',
                    'px-4 py-2',
                    'rounded-md',
                    'w-full',
                    'flex',
                    selected?.key === it.key ? 'font-bold' : '',
                  )}
                  onClick={() => {
                    setPageNumber(1);
                    if (selected?.key === it.key) setSelected({});
                    else setSelected({ ...it, type: type });
                  }}
                >
                  {it.key === selected?.key ? (
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

export default FilterMenu;
