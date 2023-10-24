import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import api from '@/api';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { connection } from '@/helper/connection';
import TimeField from './base/TimeField';
import TextField from './base/TextField';
import RadioGroup from './base/RadioGroup';

const ScheduleSchema = yup.object().shape({
  title: yup.string().required('Bạn chưa nhập tên'),
  startTime: yup.string().required('Bạn chưa nhập thời gian bắt đầu'),
  endTime: yup.string().required('Bạn chưa nhập thời gian bắt đầu'),
  isActive: yup.boolean(),
});

const AddTimeOption = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ScheduleSchema),
    defaultValues: {
      title: defaultData.title || '',
      startTime: defaultData.startTime || '0:00',
      endTime: defaultData.endTime || '0:00',
      isActive:
        JSON.stringify(defaultData) !== JSON.stringify({})
          ? defaultData.isActive
          : true,
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addTimeOption'],
    mutationFn: (data: any) =>
      api.functional.time_option.create(connection, data),
    onSuccess: () => {
      toast.success('Thêm khung giờ học thành công');
      setTimeout(() => getData(), 50);
      closeModal();
    },
    onError: () => {
      toast.error('Thêm khung giờ học thất bại');
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateTimeOption'],
    mutationFn: (data: any) =>
      api.functional.time_option.update(connection, defaultData.id, data),
    onSuccess: () => {
      toast.success('Cập nhật khung giờ học thành công');
      setTimeout(() => getData(), 50);
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật khung giờ học thất bại');
      closeModal();
    },
  });

  const checkTime = (startTime: string, endTime: string) => {
    if (startTime.length == 4) startTime = `0${startTime}`;
    if (endTime.length == 4) endTime = `0${endTime}`;
    return startTime < endTime;
  };

  const onSubmit = (data: any) => {
    if (!checkTime(data.startTime, data.endTime)) {
      toast.error('Giờ học không hợp lệ');
      return;
    }
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
          label={'Tên'}
          register={{ ...register('title') }}
          required={true}
          helperText={errors?.title?.message}
        />
        <Controller
          control={control}
          name="startTime"
          render={({ field }) => (
            <TimeField
              label={'Thời gian bắt đầu'}
              value={field.value}
              onChange={(e: any) => field.onChange(e)}
              helperText={errors?.startTime?.message}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="endTime"
          render={({ field }) => (
            <TimeField
              label={'Thời gian kết thúc'}
              value={field.value}
              onChange={(e: any) => field.onChange(e)}
              helperText={errors?.endTime?.message}
              required={true}
            />
          )}
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

export default AddTimeOption;
