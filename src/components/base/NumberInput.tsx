import clsx from 'clsx';
import React, { useState } from 'react';
import Input from './Input';
import tw from 'tailwind-styled-components';
// import { handleChange } from '../helper/utils';
type Props = {
  label: string;
  postfix?: string;
  isFullWidth?: boolean;
  required?: boolean;
  helperText?: any;
  className?: string;
  value: string | undefined;
  setValue: any;
  width?: string;
  disabled?: boolean;
};

const HelperText = tw.div`text-red-600 my-1 text-sm`;

const NumberInput = ({
  label,
  postfix = ' ',
  required,
  helperText,
  className,
  value,
  setValue,
  width = '150px',
  disabled,
}: Props) => {
  const addCommas = (num: string) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const removeNonNumeric = (num: string) => {
    return num.toString().replace(/[^0-9]/g, '');
  };

  const handleChange = (event: any) => {
    setValue(addCommas(removeNonNumeric(event.target.value)));
  };

  return (
    <div className="my-1 w-full">
      <div className="flex">
        <span className={clsx('m-auto mr-4 ', `w-[${width}]`)}>
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </span>

        <Input
          className={clsx(className)}
          type="text"
          value={value}
          onInput={handleChange}
          disabled={disabled}
        />
      </div>
      {helperText && (
        <HelperText className="ml-4" style={{ paddingLeft: label ? width : 0 }}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
};

export default NumberInput;
