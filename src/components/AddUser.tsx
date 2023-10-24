import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from './base/TextField';
import api from '@/api';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { connection } from '@/helper/connection';
import RadioGroup from './base/RadioGroup';
import { SaveIcon, XIcon } from '@heroicons/react/outline';
import { DarkBlueButton, WhiteBlueButton } from './base/Button';

const AddUser = ({ closeModal, getData, defaultData = {} }: any) => {
  const UserSchema = yup.object().shape({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Bạn chưa nhập email'),
    password: yup
      .string()
      .required('Bạn chưa nhập mật khẩu')
      .min(8, 'Độ dài tối thiểu của mật khẩu là 8')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
      ),
    username: yup.string().required('Bạn chưa nhập tên người dùng'),
    role: yup.string(),
    isActive: yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: {
      email: defaultData.email || '',
      username: defaultData.username || '',
      password: '',
      isActive:
        JSON.stringify(defaultData) !== JSON.stringify({})
          ? defaultData.isActive
          : true,
      role: defaultData.role || 'USER',
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addUser'],
    mutationFn: (data: any) => api.functional.users.register(connection, data),
    onSuccess: () => {
      getData();
      toast.success('Thêm tài khoản thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm tài khoản thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: (data: any) =>
      api.functional.users.updateUser(
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
      toast.success('Cập nhật tài khoản thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật tài khoản thất bại');
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
          register={{ ...register('email') }}
          helperText={errors?.email?.message}
          label={'Email'}
          required={true}
        />
        <TextField
          register={{ ...register('username') }}
          helperText={errors?.username?.message}
          label={'Tên người dùng'}
          required={true}
        />
        <TextField
          register={{ ...register('password') }}
          helperText={errors?.password?.message}
          label={'Mật khẩu'}
          required={true}
          type="password"
        />
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <RadioGroup
              name="role"
              options={[
                { value: 'USER', label: 'USER' },
                { value: 'ADMIN', label: 'ADMIN' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              label="Quyền"
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
                { value: true, label: 'Kích hoạt' },
                { value: false, label: 'Khoá' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              label="Trạng thái"
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

export default AddUser;
