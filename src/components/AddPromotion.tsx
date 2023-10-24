import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from './base/TextField';
import api from '@/api';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { connection } from '@/helper/connection';
import RadioGroup from './base/RadioGroup';
import DatePickerField from './base/DatePicker/DatePicker';
import NumberInput from './base/NumberInput';

const RoomSchema = yup.object().shape({
  code: yup.string().required('Bạn chưa nhập mã khuyến mại'),
  title: yup.string().required('Bạn chưa nhập CT khuyến mại'),
  description: yup.string(),
  value: yup
    .string()
    .required('Bạn chưa nhập giá trị')
    .matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
  type: yup.string().required('Bạn chưa chọn loại giảm giá'),
  isActive: yup.boolean(),
  startDate: yup.date().required('Bạn chưa chọn ngày bắt đầu'),
  endDate: yup.date().required('Bạn chưa chọn ngày kết thúc'),
});

const AddPromotion = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    // @ts-ignore
    resolver: yupResolver(RoomSchema),
    defaultValues: {
      type: defaultData.type || '',
      code: defaultData.code || '',
      title: defaultData.title || '',
      description: defaultData.description || '',
      value: defaultData.value || '',
      isActive:
        JSON.stringify(defaultData) !== JSON.stringify({})
          ? defaultData.isActive
          : true,
      startDate: new Date(defaultData.startDate || null),
      endDate: new Date(defaultData.endDate || null),
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addFinancial'],
    mutationFn: (data: any) =>
      api.functional.promotional_code.create(connection, data),
    onSuccess: (data) => {
      getData();
      toast.success('Thêm mã khuyến mại thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm mã khuyến mại thất bại');
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updatePromotion'],
    mutationFn: (data: any) =>
      api.functional.promotional_code.update(connection, defaultData.id, data),
    onSuccess: (data) => {
      getData();
      toast.success('Cập nhật mã khuyến mại thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Cập nhật mã khuyến mại thất bại');
      closeModal();
      // getData();
    },
  });
  const onSubmit = (data: any) => {
    if (data.startDate > data.endDate) {
      toast.error('Ngày khuyến mại không hợp lệ');
      return;
    }
    data.startDate = new Date(data.startDate).toISOString();
    data.endDate = new Date(data.endDate).toISOString();
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
          label={'CT khuyến mại'}
          required={true}
        />
        <TextField
          register={{ ...register('code') }}
          helperText={errors?.code?.message}
          label={'Mã khuyến mại'}
          required={true}
        />
        <TextField
          register={{ ...register('description') }}
          helperText={errors?.description?.message}
          label={'Nội dung'}
          // required={true}
          multiline={true}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <RadioGroup
              options={[
                { value: '%', label: 'Phần trăm' },
                { value: 'VND', label: 'Số tiền' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              name="type"
              label={'Loại giảm giá'}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="value"
          render={({ field }) => (
            <NumberInput
              helperText={errors?.value?.message}
              label={'Giá trị'}
              required={true}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
            />
          )}
        />
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <RadioGroup
              options={[
                { value: true, label: 'Có' },
                { value: false, label: 'Không' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              name="isActive"
              label={'Kích hoạt'}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePickerField
              selected={field.value}
              onChange={(date: any) => field.onChange(date)}
              label={'Ngày bắt đầu'}
              helperText={errors?.startDate?.message}
              // required={true}
              hasTimeInput={false}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DatePickerField
              selected={field.value}
              onChange={(date: any) => field.onChange(date)}
              label={'Ngày kết thúc'}
              helperText={errors?.endDate?.message}
              // required={true}
              hasTimeInput={false}
              minDate={getValues('startDate')}
              required={true}
            />
          )}
        />
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

export default AddPromotion;
