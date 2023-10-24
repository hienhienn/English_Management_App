import React, { FormEventHandler } from 'react';
import clsx from 'clsx';
import Switch from './Switch';

type Props = {
  checked: boolean;
  onChange:
    | ((checked: boolean) => void)
    | (FormEventHandler<HTMLButtonElement> & ((checked: boolean) => void));
  name: string;
  label?: string;
  width?: string;
};

function SwitchField({
  checked,
  onChange,
  name,
  label,
  width = '150px',
}: Props) {
  return (
    <div className="my-1 w-full">
      <div className="flex">
        <span className={clsx('m-auto mr-4 ', `w-[${width}]`)}>{label}</span>
        <div className="flex flex-1">
          <Switch name={name} checked={checked} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

export default SwitchField;
