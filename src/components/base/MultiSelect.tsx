import clsx from 'clsx';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import tw from 'tailwind-styled-components';

const HelperText = tw.div`text-red-600 my-1 text-sm`;

type Props = {
  title?: string;
  options: Array<any>;
  helperText?: any;
  required?: boolean;
  placeholder?: string;
  onChange?: any;
  value?: any;
  getOptionLabel?: any;
  getOptionValue?: any;
  isCreatable?: boolean;
  width?: string;
  isMulti?: boolean;
};

const MultiSelect = ({
  title,
  options,
  helperText,
  required,
  placeholder,
  onChange,
  value,
  getOptionLabel,
  getOptionValue,
  isCreatable = true,
  width = '150px',
  isMulti = true,
}: Props) => {
  return (
    <div className="my-1 w-full">
      <div className="flex">
        <span className={clsx('m-auto mr-4 ', `w-[${width}]`)}>
          {title}
          {required && <span className="ml-1 text-red-600">*</span>}
        </span>
        {isCreatable ? (
          <CreatableSelect
            classNamePrefix={'select-box'}
            isMulti={isMulti}
            options={options}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
          />
        ) : (
          <Select
            classNamePrefix={'select-box'}
            isMulti={isMulti}
            options={options}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
          />
        )}
      </div>
      {helperText && (
        <HelperText className="ml-4" style={{ paddingLeft: title ? width : 0 }}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
};

export default MultiSelect;
