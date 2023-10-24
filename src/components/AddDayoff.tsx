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
import DatePickerField from './base/DatePicker/DatePicker';

const RoomSchema = yup.object().shape({
  title: yup.string().required('Bạn chưa nhập tên kỳ nghỉ'),
  startDate: yup.date().required('Bạn chưa chọn ngày bắt đầu'),
  endDate: yup.date().required('Bạn chưa chọn ngày kết thúc'),
});

const AddDayoff = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RoomSchema),
    defaultValues: {
      title: defaultData.title || '',
      startDate: new Date(defaultData.startDate || null),
      endDate: new Date(defaultData.endDate || null),
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addDayoff'],
    mutationFn: (data: any) => api.functional.dayoff.create(connection, data),
    onSuccess: (data) => {
      getData();
      toast.success('Thêm lịch nghỉ thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm lịch nghỉ thất bại');
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateDayoff'],
    mutationFn: (data: any) =>
      api.functional.dayoff.update(connection, defaultData.id, data),
    onSuccess: (data) => {
      getData();
      toast.success('Cập nhật lịch nghỉ thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Cập nhật lịch nghỉ thất bại');
      closeModal();
    },
  });
  const onSubmit = (data: any) => {
    if (data.startDate > data.endDate) {
      toast.error('Lịch nghỉ không hợp lệ');
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
          label={'Tên kỳ nghỉ'}
          required={true}
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
              required={true}
              hasTimeInput={false}
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
              required={true}
              hasTimeInput={false}
              minDate={getValues('startDate')}
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

export default AddDayoff;
