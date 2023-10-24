import tw from 'tailwind-styled-components';
import clsx from 'clsx';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const HelperText = tw.div`text-red-600 my-1 text-sm`;

type Props = {
  label?: string;
  value: string;
  onChange?: any;
  helperText?: any;
  required?: boolean;
  width?: string;
  disabled?: boolean;
};

function TimeField({
  label,
  value,
  onChange,
  helperText,
  required,
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
        <TimePicker
          onChange={onChange}
          value={value}
          clockIcon={false}
          disableClock={true}
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

export default TimeField;
