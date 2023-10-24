import React from 'react';
import ReactLoading from 'react-loading';
import clsx from 'clsx';

type Props = {
  active: boolean;
  text?: string;
};

function LoadingDialog({ active, text }: Props) {
  function onClickDialog(e: any) {
    if (active) {
      e.stopPropagation();
    }
  }

  return (
    <div
      className={clsx(
        'fixed z-50 left-0 top-0 w-full h-screen bg-black opacity-80 text-center',
        active ? 'block' : 'hidden',
      )}
      onClick={onClickDialog}
    >
      <div className="left-1/2 top-1/3 mt-16 fixed">
        <ReactLoading className="mx-auto my-2" type="spinningBubbles" />
        {text}
      </div>
    </div>
  );
}

export default LoadingDialog;
