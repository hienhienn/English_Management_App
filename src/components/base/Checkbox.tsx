import React, { ChangeEventHandler } from 'react';
import clsx from 'clsx';

type Props = {
  checked: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
};

function Checkbox({ checked, className, onChange, disabled }: Props) {
  return (
    <input
      className={clsx('w-4 h-4 rounded-xl accent-blue-800', className)}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export default Checkbox;
