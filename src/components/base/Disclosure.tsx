import { Disclosure, Transition } from '@headlessui/react';
import { HashtagIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactElement } from 'react';
import { FaAngleDown } from 'react-icons/fa';

type Props = {
  title: any;
  items: Array<any>;
  icon?: ReactElement;
  value?: string;
  onClick?: any;
  openId?: number;
  id?: number;
  openNav?: boolean;
};

export default function CustomDisclosure({
  title,
  items,
  icon,
  value,
  onClick,
  openId,
  id,
  openNav,
}: Props) {
  return (
    <div className={clsx('mb-2', openNav ? 'w-[250px]' : 'w-auto')}>
      <Disclosure>
        <>
          <Disclosure.Button
            onClick={onClick}
            className={clsx(
              'flex justify-between rounded-lg bg-blue-800 my-1 px-4 py-2 text-left font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
              openNav ? 'w-full' : 'w-[60px]',
              'transition-[width] duration-300 ease-in-out',
            )}
            data-tooltip-id="nav-tooltip"
            data-tooltip-content={title.value}
          >
            <div className="flex gap-2">
              <div>{icon}</div>
              <div
                className={clsx(
                  openNav ? 'w-full' : 'w-0',
                  'h-6 overflow-hidden transition-[width] ease-in-out duration-100',
                )}
              >
                {title.value}
              </div>
            </div>
            <FaAngleDown
              className={clsx(
                id === openId
                  ? '-rotate-180 transform duration-300 '
                  : 'duration-300 transform',
                'h-5',
                'w-5',
                'text-white',
                openNav ? 'flex' : 'hidden',
              )}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-150 ease-out"
            enterFrom="transform scale-95 opacity-0 origin-top"
            enterTo="transform scale-100 opacity-100 origin-top"
            leave="transition duration-100 ease-out"
            leaveFrom="transform scale-100 opacity-100 origin-top"
            leaveTo="transform scale-95 opacity-0 origin-top"
            show={id === openId}
          >
            <Disclosure.Panel
              className={clsx(
                'text-gray-500',
                // id === openId ? 'auto' : 'hidden',
              )}
            >
              {items.map((e: any, i: number) => (
                <Link
                  prefetch={false}
                  href={e.url}
                  className={clsx(
                    'flex gap-2 rounded-lg my-1 px-6 py-2 text-left font-medium text-white focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
                    value === e.key
                      ? 'bg-blue-600'
                      : 'bg-blue-800 hover:bg-blue-700',
                    openNav ? 'w-full' : 'w-[60px]',
                    'transition-[width] duration-300 ease-in-out',
                  )}
                  key={i}
                  data-tooltip-id="nav-tooltip"
                  data-tooltip-content={e.value}
                >
                  <div>
                    <HashtagIcon className="w-4" />
                  </div>
                  <div
                    className={clsx(
                      openNav ? 'w-full' : 'w-0',
                      'h-6 overflow-hidden transition-[width] ease-in-out duration-100',
                    )}
                  >
                    {e.value}
                  </div>
                </Link>
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      </Disclosure>
    </div>
  );
}
