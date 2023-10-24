import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from './base/TextField';
import api from '@/api';
import { toast } from 'react-toastify';
import SelectBox from './base/SelectBox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { connection } from '@/helper/connection';
import { ListStateEmployee } from '@/model/dictionary';
import SelectBoxKeyValue from './base/SelectBoxKeyValue';

const EmployeeSchema = yup.object().shape({
  fullname: yup.string().required('Bạn chưa nhập họ tên'),
  phoneNumber: yup
    .string()
    .min(10, 'Độ dài 10 số')
    .max(10, 'Độ dài 10 số')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Sai định dạng số điện thoại'),
  classCategory: yup.string(),
  officeId: yup.object().required('Bạn chưa chọn cơ sở'),
  department: yup.string().required('Bạn chưa nhập phòng ban'),
  role: yup
    .object()
    .shape({ key: yup.string(), value: yup.string() })
    .required('Bạn chưa chọn chức vụ'),
  note: yup.string(),
  state: yup.string().required('Bạn chưa chọn trạng thái'),
});
const AddEmployee = ({ closeModal, getData, defaultData = {}, role }: any) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EmployeeSchema),
    defaultValues: {
      fullname: defaultData.fullname || '',
      phoneNumber: defaultData.phoneNumber || '',
      classCategory: defaultData.classCategory || '',
      note: defaultData.note || '',
      state: defaultData.state || '',
      officeId: defaultData.officeId
        ? {
            key: defaultData.office.id,
            value: defaultData.office.title,
          }
        : {
            key: '',
            value: '',
          },
      department: defaultData.department || '',
      role: defaultData.role
        ? {
            key: defaultData.role,
            value: defaultData.role === 'TEACHER' ? 'Giáo viên' : 'Nhân viên',
          }
        : {
            key: role,
            value: role === 'TEACHER' ? 'Giáo viên' : 'Nhân viên',
          },
    },
  });
  const [listOffice, setListOffice] = useState([]);

  const addMutation = useMutation({
    mutationKey: ['addEmployee'],
    mutationFn: (data: any) => api.functional.employee.create(connection, data),
    onSuccess: (data) => {
      getData();
      toast.success('Thêm nhân sự thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Thêm nhân sự thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateTeacher'],
    mutationFn: (data: any) =>
      api.functional.employee.updateEmployee(
        {
          ...connection,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
        defaultData.id,
        data,
      ),
    onSuccess: () => {
      getData();
      toast.success('Cập nhật nhân sự thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật nhân sự thất bại');
      closeModal();
    },
  });

  useQuery({
    queryKey: ['listOffice'],
    queryFn: async () => {
      try {
        const res = await api.functional.setting.office.findAll(connection);
        if (res.data) {
          setListOffice(
            res.data.map((e: any) => ({ key: e.id, value: e.title })),
          );
          console.log(listOffice);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách học sinh thất bại');
      }
      return 1;
    },
  });

  const onSubmit = (data: any) => {
    let params = {};
    for (const key in data) {
      if (!!data[key] && data[key] !== '---') {
        if (key === 'officeId' || key === 'role')
          params = { ...params, [key]: data[key].key };
        else params = { ...params, [key]: data[key] };
      }
    }
    if (JSON.stringify(defaultData) === JSON.stringify({})) {
      addMutation.mutate(params);
    } else {
      updateMutation.mutate(params);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6 gap-3 grid w-[700px]">
        <TextField
          register={{ ...register('fullname') }}
          helperText={errors?.fullname?.message}
          label={'Họ tên'}
          required={true}
        />
        <TextField
          register={{ ...register('phoneNumber') }}
          helperText={errors?.phoneNumber?.message}
          label={'Số điện thoại'}
          required={true}
        />
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={[
                { key: 'TEACHER', value: 'Giáo viên' },
                { key: 'STAFF', value: 'Nhân viên' },
              ]}
              selected={field.value}
              setSelected={(e: any) => field.onChange(e)}
              title={'Chức vụ'}
              required={true}
              helperText={errors.officeId?.message}
              disabled
            />
          )}
        />
        <Controller
          control={control}
          name="officeId"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listOffice}
              selected={field.value}
              setSelected={(e: any) => field.onChange(e)}
              title={'Cơ sở'}
              required={true}
              helperText={errors.officeId?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <SelectBox
              items={ListStateEmployee}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Trạng thái'}
              required={true}
              helperText={errors.state?.message}
            />
          )}
        />
        {getValues('role').key === 'TEACHER' && (
          <TextField
            register={{ ...register('classCategory') }}
            label={'Loại lớp'}
          />
        )}
        <TextField
          register={{ ...register('department') }}
          required
          label={'Phòng ban'}
          helperText={errors.department?.message}
        />
        <TextField register={{ ...register('note') }} label={'Ghi chú'} />
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

export default AddEmployee;
