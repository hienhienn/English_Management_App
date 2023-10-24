import React, { ChangeEventHandler } from 'react';
import Label from './Label';

type Props = {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  name: string;
  label: string;
  value?: string;
};

function Radio({ label, value, checked, name, onChange }: Props) {
  return (
    <Label className="cursor-pointer">
      <input
        className="rounded-md pl-2 cursor-pointer accent-blue-800 w-4 h-4"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2">{label}</span>
    </Label>
  );
}

export default Radio;
