import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import api from '@/api';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { connection } from '@/helper/connection';
import SelectBox from './base/SelectBox';
import TimeField from './base/TimeField';
import DatePickerField from './base/DatePicker/DatePicker';
import SelectBoxKeyValue from './base/SelectBoxKeyValue';
import { useRouter } from 'next/navigation';

const RoomSchema = yup.object().shape({
  class: yup.object().required('Bạn chưa chọn tên lớp học'),
  roomTitle: yup.string().required('Bạn chưa chọn tên phòng'),
  startTime: yup.string().required('Bạn chưa nhập thời gian bắt đầu'),
  endTime: yup.string().required('Bạn chưa nhập thời gian bắt đầu'),
  date: yup.date(),
});

const AddSchedule = ({
  defaultData = {},
  className,
  onChangeTime,
  isEdit,
  setIsEdit,
  setIsCancle,
  getData,
  closeModal,
  type,
}: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RoomSchema),
    defaultValues: {
      class: { key: '', value: '' },
      roomTitle: '',
    },
  });

  const [listClass, setListClass] = useState([]);
  const [listRoom, setListRoom] = useState([]);
  const [selectedClass, setSelectedClass] = useState<any>([]);
  const router = useRouter();

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

  useEffect(() => {
    setDefaultData();
  }, [defaultData]);

  const addMutation = useMutation({
    mutationKey: ['addSchedule'],
    mutationFn: (data: any) => api.functional.schedule.create(connection, data),
    onSuccess: (data) => {
      // router.replace(data.data.id);
      toast.success('Thêm lịch học thành công');
      getData();
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm lịch học thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateSchedule'],
    mutationFn: (data: any) =>
      api.functional.schedule.updateSchedule(connection, defaultData.id, data),
    onSuccess: (data) => {
      toast.success('Cập nhật lịch học thành công');
    },
    onError: (data) => {
      toast.error('Cập nhật lịch học thất bại');
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
    let params: any = {};
    const tmp = new Date(data.date).getTime() + 7 * 60 * 60 * 1000;
    params.date = new Date(tmp).toISOString();
    params.startTime = data.startTime;
    params.endTime = data.endTime;
    params.classId = data.class.key;
    params.roomTitle = data.roomTitle;
    params.attendance = selectedClass.students?.map((e: any) => ({
      studentId: e.studentId,
      fullname: e.fullname,
      isAttendant: true,
    }));
    if (defaultData.type === 'ADD' || type === 'ADD') {
      addMutation.mutate(params);
    } else updateMutation.mutate(params);
  };

  const setDefaultData = () => {
    setValue('roomTitle', defaultData.roomTitle || '');
    setValue('startTime', defaultData.startTime || '00:00');
    setValue('endTime', defaultData.endTime || '00:00');
    setValue(
      'date',
      defaultData.date ? new Date(defaultData.date) : new Date(),
    );
    setValue(
      'class',
      defaultData.class
        ? { key: defaultData.class.id, value: defaultData.class.courseTitle }
        : { key: '', value: '' },
    );
    // console.log(getValues());
  };

  return (
    <div className={className}>
      <div className="gap-4 pb-5 grid">
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
              setSelected={(e: any) => {
                field.onChange(e);
                setSelectedClass(listClass.find((it: any) => it.id === e.key));
              }}
              title={'Tên lớp học'}
              helperText={errors?.class?.message}
              required={true}
              disabled={!(type === 'ADD')}
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
              disabled={!isEdit}
            />
          )}
        />
        <Controller
          control={control}
          name="startTime"
          render={({ field }) => (
            <TimeField
              label={'Thời gian bắt đầu'}
              value={field.value}
              onChange={(e: any) => {
                field.onChange(e);
                onChangeTime(e);
              }}
              helperText={errors?.startTime?.message}
              required={true}
              disabled={!isEdit}
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
              disabled={!isEdit}
            />
          )}
        />
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePickerField
              selected={field.value}
              onChange={(date: any) => {
                field.onChange(date);
                onChangeTime(
                  getValues('startTime'),
                  new Date(date).toISOString(),
                );
              }}
              label={'Ngày'}
              helperText={errors?.date?.message}
              required={true}
              hasTimeInput={false}
              disabled={!isEdit}
            />
          )}
        />
      </div>
      {!(type === 'ADD') &&
        (isEdit ? (
          <div className="flex gap-2 pb-6 justify-end">
            <WhiteBlueButton
              onClick={() => {
                setIsEdit(false);
                setDefaultData();
                setIsCancle(true);
              }}
            >
              Huỷ
            </WhiteBlueButton>
            <DarkBlueButton onClick={handleSubmit(onSubmit)}>
              Lưu
            </DarkBlueButton>
          </div>
        ) : (
          <div className="flex gap-2 pb-6 justify-end">
            <DarkBlueButton onClick={() => setIsEdit(true)}>Sửa</DarkBlueButton>
          </div>
        ))}
      {type === 'ADD' && (
        <div className="flex gap-2 p-6 pt-0 justify-end">
          <WhiteBlueButton className="w-[100px]" onClick={closeModal}>
            <div className="flex items-center w-full justify-center">
              <XIcon className="w-4 h-4 text-blue-900 mr-1" />
              Huỷ
            </div>
          </WhiteBlueButton>
          <DarkBlueButton
            className="w-[100px] "
            onClick={handleSubmit(onSubmit)}
          >
            <div className="flex items-center w-full justify-center">
              <SaveIcon className="w-4 h-4 text-white mr-1" />
              Lưu
            </div>
          </DarkBlueButton>
        </div>
      )}
    </div>
  );
};

export default AddSchedule;
