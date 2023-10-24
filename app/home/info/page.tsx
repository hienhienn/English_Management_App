'use client';

import api from '@/api';
import { DarkBlueButton, WhiteBlueButton } from '@/components/base/Button';
import TextField from '@/components/base/TextField';
import { connection } from '@/helper/connection';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
const Info = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const InfoSchema = yup.object().shape({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Bạn chưa nhập email'),
    username: yup.string().required('Bạn chưa nhập username'),
  });
  const PasswordSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .required('Bạn chưa nhập mật khẩu cũ')
      .min(8, 'Độ dài tối thiểu của mật khẩu là 8')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
      ),
    newPassword: yup
      .string()
      .required('Bạn chưa nhập mật khẩu mới')
      .min(8, 'Độ dài tối thiểu của mật khẩu là 8')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
      ),
    confirmPassword: yup
      .string()
      .required('Bạn chưa xác nhận mật khẩu')
      .min(8, 'Độ dài tối thiểu của mật khẩu là 8')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
      ),
  });
  const infoForm = useForm({ resolver: yupResolver(InfoSchema) });
  const passwordForm = useForm({ resolver: yupResolver(PasswordSchema) });
  useQuery({
    queryKey: ['getInfo'],
    queryFn: async () => {
      try {
        const res = await api.functional.users.getUser(
          connection,
          localStorage.getItem('userId') || '',
        );
        if (res.data) {
          setUserInfo(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải thông tin cá nhân thất bại');
      }
      return 1;
    },
  });

  useEffect(() => {
    if (userInfo) {
      infoForm.setValue('email', userInfo.email);
      infoForm.setValue('username', userInfo.username);
    }
    passwordForm.reset();
  }, [userInfo]);

  const updateInfo = useMutation({
    mutationFn: (data: any) =>
      api.functional.users.updateUser(
        {
          ...connection,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
        localStorage.getItem('userId') || '',
        data,
      ),
    onSuccess: () => {
      toast.success('Cập nhật thông tin cá nhân thành công');
      setIsEditing(false);
    },
    onError: () => toast.error('Cập nhật thông tin cá nhân thất bại'),
  });

  const onSubmit = (data: any) => {
    updateInfo.mutate(data);
  };

  const changePassword = async (data: any) => {
    if (data.confirmPassword !== data.newPassword) {
      passwordForm.setError('confirmPassword', {
        message: 'Xác nhận mật khẩu không đúng',
      });
      return;
    }
    try {
      const res = await api.functional.users.login(connection, {
        email: userInfo.email,
        password: data.oldPassword,
      });
      if (res.statusCode !== 201) {
        toast.error('Đổi mật khẩu thất bại');
        return;
      }
    } catch (err) {
      console.log(err);
      toast.error('Đổi mật khẩu thất bại');
      return;
    }
  };

  return (
    <div>
      <div className="items-center leading-10 text-[20px] font-semibold">
        Thông tin cá nhân
      </div>
      <div className="bg-white w-full rounded-lg px-8 py-6 mt-2 gap-4 grid">
        <TextField
          label={'Tên người dùng'}
          register={{ ...infoForm.register('username') }}
          helperText={infoForm.formState.errors?.username?.message}
          disabled={!isEditing}
        />
        <TextField
          label={'Email'}
          register={{ ...infoForm.register('email') }}
          helperText={infoForm.formState.errors?.email?.message}
          disabled={!isEditing}
        />
        <TextField label={'Quyền'} disabled value={userInfo?.role} />
        <div className="flex justify-end gap-2">
          {/* <WhiteRedButton>Đổi mật khẩu</WhiteRedButton> */}
          {!isEditing ? (
            <WhiteBlueButton onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </WhiteBlueButton>
          ) : (
            <>
              <WhiteBlueButton
                onClick={() => {
                  setIsEditing(false);
                  infoForm.setValue('email', userInfo.email);
                  infoForm.setValue('username', userInfo.username);
                }}
              >
                Huỷ
              </WhiteBlueButton>
              <DarkBlueButton onClick={infoForm.handleSubmit(onSubmit)}>
                Lưu
              </DarkBlueButton>
            </>
          )}
        </div>
      </div>
      <div className="items-center leading-10 text-[20px] font-semibold mt-4">
        Đổi mật khẩu
      </div>
      <div className="bg-white w-full rounded-lg px-8 py-6 mt-2 gap-4 grid">
        <TextField
          label={'Mật khẩu cũ'}
          type="password"
          register={{ ...passwordForm.register('oldPassword') }}
          helperText={passwordForm.formState.errors?.oldPassword?.message}
        />
        <TextField
          label={'Mật khẩu mới'}
          type="password"
          register={{ ...passwordForm.register('newPassword') }}
          helperText={passwordForm.formState.errors?.newPassword?.message}
        />
        <TextField
          label={'Xác nhận mật khẩu'}
          type="password"
          register={{ ...passwordForm.register('confirmPassword') }}
          helperText={passwordForm.formState.errors?.confirmPassword?.message}
        />
        <div className="flex justify-end gap-2">
          <WhiteBlueButton
            onClick={() =>
              passwordForm.reset({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              })
            }
          >
            Huỷ
          </WhiteBlueButton>
          <DarkBlueButton onClick={passwordForm.handleSubmit(changePassword)}>
            Lưu
          </DarkBlueButton>
        </div>
      </div>
    </div>
  );
};

export default Info;
