import React from 'react';
import tw from 'tailwind-styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import './DatePicker.css';
import vi from 'date-fns/locale/vi';
import clsx from 'clsx';

registerLocale('vi', vi);

const Textarea = tw.textarea`rounded-sm`;

const HelperText = tw.div`text-red-600 my-1 text-sm`;

type Props = {
  label: String;
  selected: Date | undefined;
  onChange?: any;
  helperText?: any;
  placeholder?: string;
  hasTimeInput?: boolean;
  required?: boolean;
  maxDate?: any;
  minDate?: any;
  width?: string;
  disabled?: boolean;
};

function DatePickerField({
  label,
  selected,
  onChange,
  helperText,
  placeholder,
  hasTimeInput = true,
  required,
  maxDate,
  minDate,
  width = '150px',
  disabled,
}: Props) {
  return (
    <div className="my-1 w-full">
      <div className="flex">
        <span className={clsx('m-auto mr-4 ', `w-[${width}]`)}>
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </span>
        <DatePicker
          placeholderText={placeholder}
          onChange={onChange}
          selected={selected}
          timeInputLabel="Thời gian:"
          dateFormat={hasTimeInput ? 'dd/MM/yyyy h:mm aa' : 'dd/MM/yyyy'}
          showTimeInput={hasTimeInput}
          locale="vi"
          minDate={minDate}
          maxDate={maxDate}
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
}

export default DatePickerField;
