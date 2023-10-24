import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';

type ModalProps = {
  children: any;
  onClose: any;
  isOpen: boolean;
  title?: string;
};

function Modal({ children, onClose, isOpen, title }: ModalProps) {
  function handleEsc(e: any) {
    if (e.key === 'Esc' || e.key === 'Escape') {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEsc, { capture: true });
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block p-6 my-8 text-left align-middle transition-all transform bg-gray-100 shadow-xl rounded-2xl -translate-y-20 translate-x-5">
              <Dialog.Title
                as="h3"
                className="text-xl font-bold leading-6 text-center uppercase"
              >
                {title}
              </Dialog.Title>
              <div
                className="absolute right-1 top-1 z-50 cursor-pointer"
                onClick={onClose}
              >
                <XIcon className="w-8 h-8 text-gray-600" />
              </div>
              <div className="flex flex-col space-y-1 mt-4">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
