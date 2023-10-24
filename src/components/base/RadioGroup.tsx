import React, { ChangeEventHandler, ReactNode } from 'react';
import Radio from './Radio';
import tw from 'tailwind-styled-components';
import clsx from 'clsx';

type Props = {
  options: any[];
  name: string;
  setValue: (e: any) => void;
  value: any;
  label?: string;
  required?: boolean;
  helperText?: any;
  width?: string;
};

const HelperText = tw.div`text-red-600 my-1 text-sm`;

const RadioGroup = ({
  options,
  name,
  value,
  setValue,
  label,
  required,
  helperText,
  width = '150px',
}: Props) => {
  function onChangeChecked(checked = '') {
    setValue(checked);
  }

  return (
    <div className="my-1 w-full">
      <div className="flex">
        <span className={clsx('m-auto mr-4 ', `w-[${width}]`)}>
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </span>
        <div className="flex-1 flex gap-4">
          {options.map((opt) => (
            <Radio
              key={opt.value}
              name={name}
              checked={opt.value === value}
              onChange={() => onChangeChecked(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </div>
      {helperText && (
        <HelperText className="ml-4" style={{ paddingLeft: label ? width : 0 }}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
};

export default RadioGroup;
