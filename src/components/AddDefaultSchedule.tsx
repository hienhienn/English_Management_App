import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import api from '@/api';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { connection } from '@/helper/connection';
import SelectBox from './base/SelectBox';
import DatePickerField from './base/DatePicker/DatePicker';
import SelectBoxKeyValue from './base/SelectBoxKeyValue';

const ScheduleSchema = yup.object().shape({
  class: yup.object().required('Bạn chưa chọn tên lớp học'),
  roomTitle: yup.string().required('Bạn chưa chọn tên phòng'),
  time: yup.object().required('Bạn chưa chọn khung giờ học'),
  days: yup.object().required('Bạn chưa chọn ngày học trong tuần'),
  startDate: yup.date().required('Bạn chưa chọn ngày bắt đầu'),
  endDate: yup.date().required('Bạn chưa chọn ngày kết thúc'),
});

const AddDefaultSchedule = ({ closeModal, getData }: any) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ScheduleSchema),
  });

  const [listClass, setListClass] = useState([]);
  const [listRoom, setListRoom] = useState([]);
  const [listTime, setListTime] = useState([]);
  const [listDays, setListDays] = useState([]);

  useQuery({
    queryKey: ['getRoom'],
    queryFn: async () => {
      try {
        const res = await api.functional.room.all.getAll(connection);
        if (res.data) {
          setListRoom(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách phòng học thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['getClass'],
    queryFn: async () => {
      try {
        const res = await api.functional.$class.all.getAll(connection);
        if (res.data) {
          setListClass(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách lớp học thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['getTime'],
    queryFn: async () => {
      try {
        const res = await api.functional.time_option.active.findAllActive(
          connection,
        );
        if (res.data) {
          setListTime(res.data);
        }
      } catch (err) {
        console.log(err);
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['getDays'],
    queryFn: async () => {
      try {
        const res = await api.functional.day_option.active.findAllActive(
          connection,
        );
        if (res.data) {
          setListDays(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách lựa chọn thất bại');
      }
      return 1;
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addDefaultSchedule'],
    mutationFn: (data: any) =>
      api.functional.schedule.createDefaultSchedule.makenew(connection, data),
    onSuccess: () => {
      toast.success('Thêm lịch học thành công');
      setTimeout(() => getData(), 50);
      closeModal();
    },
    onError: () => {
      toast.error('Thêm lịch học thất bại');
      closeModal();
    },
  });

  const onSubmit = (data: any) => {
    let params: any = {};
    params.startDate = new Date(
      new Date(data.startDate).getTime() + 7 * 60 * 60 * 1000,
    ).toISOString();
    params.endDate = new Date(
      new Date(data.endDate).getTime() + 7 * 60 * 60 * 1000,
    ).toISOString();
    if (params.startDate > params.endDate) {
      toast.error('Ngày học không hợp lệ');
      return;
    }
    params.classId = data.class.key;
    params.roomTitle = data.roomTitle;
    params.daysOfWeek = data.days.key;
    params.startTime = data.time.key.startTime;
    params.endTime = data.time.key.endTime;
    addMutation.mutate(params);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6 gap-3 grid w-[700px]">
        <Controller
          control={control}
          name="class"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listClass.map((t: any) => ({
                key: t.id,
                value: t.courseTitle,
              }))}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Tên lớp học'}
              helperText={errors?.class?.message}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="roomTitle"
          render={({ field }) => (
            <SelectBox
              items={listRoom.map((t: any) => t.title)}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Tên phòng học'}
              helperText={errors?.roomTitle?.message}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listTime.map((t: any) => ({ key: t, value: t.title }))}
              selected={field.value}
              setSelected={(e: any) => field.onChange(e)}
              title={'Khung giờ học'}
              helperText={errors?.time?.message}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="days"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listDays.map((t: any) => ({
                key: t.days,
                value: t.title,
              }))}
              selected={field.value}
              setSelected={(e: any) => field.onChange(e)}
              title={'Ngày trong tuần'}
              helperText={errors?.days?.message}
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

export default AddDefaultSchedule;
