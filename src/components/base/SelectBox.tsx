import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import tw from 'tailwind-styled-components';
import clsx from 'clsx';

type Props = {
  selected: any;
  items: Array<any>;
  setSelected?: any;
  title?: string;
  className?: string;
  width?: string;
  required?: boolean;
  helperText?: any;
  position?: string;
  disabled?: boolean;
};

const HelperText = tw.div`text-red-600 my-1 text-sm`;

function SelectBox({
  items,
  selected,
  setSelected,
  title,
  width = '150px',
  required,
  helperText,
  position = 'top',
  disabled = false,
}: Props) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="flex">
        {title && (
          <span className={clsx('m-auto mr-4 ', `w-[${width}]`)}>
            {title}
            {required && <span className="ml-1 text-red-600">*</span>}
          </span>
        )}
        <div className={'relative flex-1'} style={{ width: width }}>
          <Listbox.Button
            aria-disabled={disabled}
            className={clsx(
              'relative w-full py-2 px-4 pl-3 text-left rounded-lg border border-gray-300 cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 sm:text-sm',
              disabled ? 'bg-gray-100' : 'bg-white',
              disabled ? 'text-gray-500' : '',
            )}
          >
            <span className="block truncate h-6">{selected}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={clsx(
                position === 'bottom' ? 'bottom-full' : '',
                'absolute w-full z-20 py-1 mt-1 max-h-[300px] overflow-y-auto text-base bg-white rounded-md rin0g-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
              )}
            >
              {items.map((it, id) => (
                <Listbox.Option
                  key={id}
                  className={({ active }) =>
                    clsx(
                      active ? 'text-blue-900 bg-blue-100' : 'text-gray-900',
                      'cursor-default select-none relative py-2 text-left px-4',
                    )
                  }
                  value={it}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={clsx(
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate',
                        )}
                      >
                        {it}
                      </span>
                      {/* {selected ? (
                      <span
                        className={`${active ? 'text-blue-600' : 'text-blue-600'
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                      >

                  </span>
                    ) : null} */}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
      {helperText && (
        <HelperText className="ml-4" style={{ paddingLeft: title ? width : 0 }}>
          {helperText}
        </HelperText>
      )}
    </Listbox>
  );
}

export default SelectBox;
