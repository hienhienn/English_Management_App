'use client';

import { DarkBlueInput } from '../../src/components/common/input';
import { useForm } from 'react-hook-form';
import api from '@/api';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { DarkBlueButton } from '@/components/base/Button';
import { ErrorText } from '@/components/base/ErrorText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { connection } from '@/helper/connection';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/outline';

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Bạn chưa nhập email'),
});

export default function ForgetPassword() {
  const router = useRouter();
  const [isFirstSend, setIsFirstSend] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(LoginSchema) });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.functional.users.sendEmail(connection, data);
      if (res.error === true) toast.error(res.msg);
      else {
        toast.success(res.data);
        setIsFirstSend(false);
      }
    } catch (err) {
      console.log(err);
      toast.error('Hãy thử lại');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-tr from-purple-300 to-blue-300">
      <div className="grid p-10 justify-items-center w-auto m-auto bg-white rounded-2xl">
        <div className="text-center text-[20px] font-bold mb-5 text-black max-w-[400px]">
          <div className="bg-blue-100 text-blue-500 rounded-[30px] w-[60px] h-[60px] p-3 mx-auto mb-5">
            <LockClosedIcon className="font-semibold"></LockClosedIcon>
          </div>
          Quên mật khẩu
          <div className="text-[14px] font-normal">
            Nhập email liên kết với tài khoản của bạn để chúng tôi gửi bạn link
            thay đổi mật khẩu
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[400px] grid"
        >
          <DarkBlueInput
            $error={!!errors?.email}
            className={clsx('w-full', errors?.email ? 'mb-0' : 'mb-2')}
            placeholder="Email"
            {...register('email')}
          />
          <ErrorText>{errors.email?.message}</ErrorText>

          <DarkBlueButton
            className={clsx('w-full uppercase', {
              'bg-gray-300 hover:bg-gray-300': !isValid,
            })}
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          >
            GỬI EMAIL
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
