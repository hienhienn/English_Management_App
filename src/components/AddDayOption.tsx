import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from './base/TextField';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import RadioGroup from './base/RadioGroup';
import api from '@/api';
import { connection } from '@/helper/connection';

const CourseSchema = yup.object().shape({
  title: yup.string().required('Bạn chưa nhập tên'),
  isActive: yup.boolean(),
  days: yup.array().of(yup.number()),
});

const DaysOfWeek = [
  { value: 1, label: 'T2' },
  { value: 2, label: 'T3' },
  { value: 3, label: 'T4' },
  { value: 4, label: 'T5' },
  { value: 5, label: 'T6' },
  { value: 6, label: 'T7' },
  { value: 0, label: 'CN' },
];

const AddDayOption = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CourseSchema),
    defaultValues: {
      title: defaultData.title || '',
      isActive:
        JSON.stringify(defaultData) !== JSON.stringify({})
          ? defaultData.isActive
          : true,
      days: defaultData.days || [],
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addOption'],
    mutationFn: (data: any) =>
      api.functional.day_option.create(connection, data),
    onSuccess: () => {
      getData();
      toast.success('Thêm lựa chọn thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Thêm lựa chọn thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateOption'],
    mutationFn: (data: any) =>
      api.functional.day_option.update(connection, defaultData.id, data),
    onSuccess: () => {
      getData();
      toast.success('Cập nhật lựa chọn thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật lựa chọn thất bại');
    },
  });

  const onSubmit = (data: any) => {
    if (JSON.stringify(defaultData) === JSON.stringify({})) {
      addMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6 gap-3 grid w-[700px]">
        <TextField
          register={{ ...register('title') }}
          helperText={errors?.title?.message}
          label={'Tên'}
          required={true}
        />
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <RadioGroup
              name="isActive"
              options={[
                { value: true, label: 'Có' },
                { value: false, label: 'Không' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              label="Kích hoạt"
              required={true}
            />
          )}
        />
        <div className="my-1">
          <div className="flex">
            <span className="m-auto mr-2 w-[150px]">
              Ngày trong tuần
              <span className="ml-1 text-red-600">*</span>
            </span>
            <div className="flex-1 flex gap-4">
              {DaysOfWeek.map((e: any) => (
                <label key={e.value}>
                  <Controller
                    name="days"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="w-4 h-4 rounded-xl accent-blue-800 mr-2"
                        type="checkbox"
                        value={e.value}
                        checked={field.value.includes(e.value)}
                        onChange={(e) => {
                          const selectedValue = Number(e.target.value);
                          const selectedValues = getValues('days');

                          if (e.target.checked) {
                            setValue('days', [
                              ...selectedValues,
                              selectedValue,
                            ]);
                          } else {
                            setValue(
                              'days',
                              selectedValues.filter(
                                (item: any) => item !== selectedValue,
                              ),
                            );
                          }
                        }}
                      />
                    )}
                  />
                  {e.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 p-6 pt-0 justify-end">
        <WhiteBlueButton className="w-[100px]" onClick={closeModal}>
          <div className="flex items-center w-full justify-center">
            <XIcon className="w-4 h-4 text-blue-900 mr-1" />
            Huỷ
          </div>
        </WhiteBlueButton>
        <DarkBlueButton className="w-[100px] " onClick={handleSubmit(onSubmit)}>
          <div className="flex items-center w-full justify-center">
            <SaveIcon className="w-4 h-4 text-white mr-1" />
            Lưu
          </div>
        </DarkBlueButton>
      </div>
    </div>
  );
};

export default AddDayOption;
