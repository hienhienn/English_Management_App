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
import DatePickerField from './base/DatePicker/DatePicker';
import SelectBoxKeyValue from './base/SelectBoxKeyValue';
import TimeField from './base/TimeField';

const ScheduleSchema = yup.object().shape({
  employeeId: yup.object().required('Bạn chưa chọn nhân sự'),
  checkIn: yup.string().required('Bạn chưa nhập giờ đến'),
  checkOut: yup.string().required('Bạn chưa nhập giờ về'),
  date: yup.date().required('Bạn chưa chọn ngày chấm công'),
});

const EmployeeAttendance = ({ closeModal, getData, data }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ScheduleSchema),
    defaultValues: {
      employeeId: { key: '', value: '' },
      checkIn: '8:30',
      checkOut: '18:00',
      date: new Date(),
    },
  });

  const [listEmployee, setListEmployee] = useState([]);
  const [attendance, setAttendance] = useState<any>({});

  useQuery({
    queryKey: ['getEmployee'],
    queryFn: async () => {
      if (data?.type === 'UPDATE') {
        initForm();
        try {
          const res = await api.functional.work_attendance.getWorkAttendance(
            connection,
            data.id,
          );
          if (res.data) {
            setAttendance(res.data.attendance);
            console.log(res.data.attendance);
          }
        } catch (err) {
          console.log(err);
          toast.error('Tải thông tin chấm công thất bại');
        }
        return 1;
      } else {
        try {
          const res = await api.functional.employee.all.getAllCourse(
            connection,
          );
          if (res.data) {
            setListEmployee(res.data);
          }
        } catch (err) {
          console.log(err);
          toast.error('Tải danh sách nhân sự thất bại');
        }
        return 1;
      }
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addAttendance'],
    mutationFn: (data: any) =>
      api.functional.work_attendance.create(connection, data),
    onSuccess: () => {
      toast.success('Chấm công thành công');
      getData();
      closeModal();
    },
    onError: () => {
      toast.error('Chấm công thất bại');
    },
  });

  const update = useMutation({
    mutationKey: ['addAttendance'],
    mutationFn: (params: any) =>
      api.functional.work_attendance.updateWorkAttendance(
        connection,
        data.id,
        params,
      ),
    onSuccess: () => {
      toast.success('Cập nhật chấm công thành công');
      getData();
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật chấm công thất bại');
    },
  });

  const initForm = () => {
    setValue('employeeId', { key: data.id, value: data.fullname });
  };

  const checkTime = (startTime: string, endTime: string) => {
    if (startTime.length == 4) startTime = `0${startTime}`;
    if (endTime.length == 4) endTime = `0${endTime}`;
    return startTime < endTime;
  };

  const onSubmit = (data: any) => {
    if (!checkTime(data.checkIn, data.checkOut)) {
      toast.error('Giờ chấm công không hợp lệ');
      return;
    }
    let params: any = {};
    params.checkIn = data.checkIn;
    params.checkOut = data.checkOut;
    params.date = new Date(data.date).toISOString();
    if (data.type === 'UPDATE') {
      let tmp = attendance;
      const idx = attendance.findIndex(
        (e: any) => e.date.subString(0, 10) === params.date.subString(0, 10),
      );
      // không có ngày trùng
      if (idx === -1) {
        params.employeeId = data.employeeId.key;
        addMutation.mutate(params);
      } else tmp[idx] = params;
      update.mutate({
        employeeId: data.id,
        attendance: tmp,
      });
    } else {
      params.employeeId = data.employeeId.key;
      addMutation.mutate(params);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6 gap-3 grid w-[700px]">
        <Controller
          control={control}
          name="employeeId"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listEmployee.map((t: any) => ({
                key: t.id,
                value: t.fullname,
              }))}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Nhân viên'}
              helperText={errors?.employeeId?.message}
              required={true}
              disabled={data?.type === 'UPDATE'}
            />
          )}
        />
        <Controller
          control={control}
          name="checkIn"
          render={({ field }) => (
            <TimeField
              label={'Giờ đến'}
              value={field.value}
              onChange={(e: any) => {
                field.onChange(e);
              }}
              helperText={errors?.checkIn?.message}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="checkOut"
          render={({ field }) => (
            <TimeField
              label={'Giờ về'}
              value={field.value}
              onChange={(e: any) => {
                field.onChange(e);
              }}
              helperText={errors?.checkOut?.message}
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePickerField
              selected={field.value}
              onChange={(date: any) => field.onChange(date)}
              label={'Ngày bắt đầu'}
              helperText={errors?.date?.message}
              required={true}
              hasTimeInput={false}
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

export default EmployeeAttendance;
