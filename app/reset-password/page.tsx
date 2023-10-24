'use client';

import api from '@/api';
import { DarkBlueButton } from '@/components/base/Button';
import { ErrorText } from '@/components/base/ErrorText';
import { DarkBlueInput } from '@/components/common/input';
import { connection } from '@/helper/connection';
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId') || '';
  const token = searchParams.get('token') || '';
  const PasswordSchema = yup.object().shape({
    changePassword: yup
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
  const {
    setError,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(PasswordSchema) });

  const onSubmit = async (data: any) => {
    if (data.confirmPassword !== data.changePassword) {
      setError('confirmPassword', {
        message: 'Xác nhận mật khẩu không đúng',
      });
      return;
    }
    console.log(data);
    try {
      const res = await api.functional.users.reset_password.resetPassword(
        connection,
        userId,
        {
          token: token,
          newPassword: data.changePassword,
        },
      );
      console.log(res);
      if (res.message === 'success') {
        toast.success('Đặt lại mật khẩu thành công');
        router.push('login');
      } else toast.error('Đặt lại mật khẩu thất bại');
    } catch (err: any) {
      toast.error(JSON.parse(err.message).message || 'Hãy thử lại');
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-tr from-purple-300 to-blue-300">
      <div className="grid p-10 justify-items-center w-auto m-auto bg-white rounded-2xl">
        <div className="text-center text-[20px] font-bold mb-5 text-black max-w-[400px]">
          <div className="bg-blue-100 text-blue-500 rounded-[30px] w-[60px] h-[60px] p-3 mx-auto mb-5">
            <LockClosedIcon className="font-semibold"></LockClosedIcon>
          </div>
          Đặt lại mật khẩu
          <div className="text-[14px] font-normal">
            Mật khẩu phải dài tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ in
            thường, 1 chữ in hoa và 1 số
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[400px] grid"
        >
          <DarkBlueInput
            $error={!!errors?.changePassword}
            className={clsx('w-full', errors?.changePassword ? 'mb-0' : 'mb-2')}
            placeholder="Mật khẩu mới"
            {...register('changePassword')}
            type="password"
          />
          <ErrorText>{errors.changePassword?.message}</ErrorText>
          <DarkBlueInput
            $error={!!errors?.confirmPassword}
            className={clsx(
              'w-full',
              errors?.confirmPassword ? 'mb-0' : 'mb-2',
            )}
            placeholder="Nhập lại mật khẩu"
            {...register('confirmPassword')}
            type="password"
          />
          <ErrorText>{errors.confirmPassword?.message}</ErrorText>

          <DarkBlueButton
            className={clsx('w-full uppercase', {
              'bg-gray-300 hover:bg-gray-300': !isValid,
            })}
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          >
            ĐẶT LẠI MẬT KHẨU
          </DarkBlueButton>
          <Link
            href={'login'}
            className="text-gray-800 mb-4 text-center text-[15px] mt-5 flex justify-center gap-4"
          >
            <div className="h-6 w-6 hover:bg-gray-200 rounded-full">
              <ArrowLeftIcon className="w-4 h-6 m-auto"></ArrowLeftIcon>
            </div>
            <span className="hover:underline">Quay lại trang đăng nhập</span>
          </Link>
        </form>
      </div>
    </main>
  );
}
