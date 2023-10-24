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
import { UserIcon } from '@heroicons/react/outline';
import Image from 'next/image';

const LoginSchema = yup.object().shape({
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
});

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(LoginSchema) });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.functional.users.login(connection, data);
      if (res.error === true) toast.error(res.msg);
      else if (res.data.role === 'ADMIN') {
        toast.success('Đăng nhập thành công');
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('userId', res.data.id);
        router.push('/home');
      } else {
        toast.error('Bạn không đủ quyền truy cập trang web');
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
          <div className="flex mb-4">
            <div className="bg-blue-100 text-blue-500 rounded-full w-[120px] h-[120px] p-[10px] mx-auto mb-5">
              <Image
                src={'/logo-app.png'}
                alt="logo"
                width={100}
                height={100}
              />
            </div>
            <div className="my-auto text-left">
              <div className="font-semibold">English Education</div>
              <div className="font-normal text-[18px]">
                Hệ thống quản lý lớp học
              </div>
            </div>
          </div>
          Đăng nhập
          <div className="text-[14px] font-normal">
            Chào mừng quay trở lại. Hãy đăng nhập để tiếp tục sử dụng hệ thống
            của chúng tôi
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
          <DarkBlueInput
            $error={!!errors?.password}
            className={clsx('w-full', errors?.password ? 'mb-0' : 'mb-2')}
            placeholder="Mật khẩu"
            {...register('password')}
            type="password"
          />
          <ErrorText>{errors.password?.message}</ErrorText>
          <Link
            href={'forget-password'}
            className="text-gray-800 italic mt-2 mb-4 text-right underline text-[15px]"
          >
            Quên mật khẩu?
          </Link>
          <DarkBlueButton
            className={clsx('w-full uppercase', {
              'bg-gray-300 hover:bg-gray-300': !isValid,
            })}
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          >
            Đăng nhập
          </DarkBlueButton>
        </form>
      </div>
    </main>
  );
}
