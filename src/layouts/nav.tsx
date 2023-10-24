import CustomDisclosure from '@/components/base/Disclosure';
import {
  BookOpenIcon,
  CalendarIcon,
  ChatIcon,
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  UserIcon,
} from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

export default function Nav({ openNav }: any) {
  const data = [
    {
      key: 1,
      value: 'Quản lí học viên',
      icon: <UserIcon className="h-6 text-white" />,
      sublist: [
        {
          key: 0,
          value: 'Học viên tiềm năng',
          url: '/home/student/student-potential',
        },
        {
          key: 1,
          value: 'Học viên chính thức',
          url: '/home/student/student-official',
        },
        {
          key: 2,
          value: 'Học viên cũ',
          url: '/home/student/student-old',
        },
      ],
    },
    {
      key: 2,
      value: 'Quản lí giáo vụ',
      icon: <BookOpenIcon className="h-6 text-white" />,
      sublist: [
        {
          key: 3,
          value: 'Quản lí lịch học',
          url: '/home/schedule',
        },
        {
          key: 4,
          value: 'Quản lí khoá học',
          url: '/home/course',
        },
        {
          key: 5,
          value: 'Quản lí lớp học',
          url: '/home/class',
        },
        {
          key: 6,
          value: 'Quản lí phòng học',
          url: '/home/room',
        },
      ],
    },
    {
      key: 7,
      value: 'Quản lí nhân sự',
      icon: <BookOpenIcon className="h-6 text-white" />,
      sublist: [
        {
          key: 7,
          value: 'Quản lí giáo viên',
          url: '/home/teacher',
        },
        {
          key: 20,
          value: 'Quản lí nhân viên',
          url: '/home/employee',
        },
        {
          key: 21,
          value: 'Bảng chấm công',
          url: '/home/work-attendance',
        },
      ],
    },
    {
      key: 3,
      value: 'Quản lí đánh giá',
      icon: <ChatIcon className="h-6 text-white" />,
      sublist: [
        {
          key: 8,
          value: 'Đánh giá giáo viên',
          url: '/home/comment-teacher',
        },
        {
          key: 9,
          value: 'Đánh giá học sinh',
          url: '/home/comment-student',
        },
      ],
    },
    {
      key: 4,
      value: 'Quản lí tài chính',
      icon: <CreditCardIcon className="h-6 text-white" />,
      sublist: [
        {
          key: 19,
          value: 'Thanh toán học phí',
          url: '/home/tuition-management',
        },
        {
          key: 10,
          value: 'Quản lí thu/chi',
          url: '/home/financial',
        },
        {
          key: 11,
          value: 'Mã khuyến mại',
          url: '/home/promotion',
        },
        {
          key: 11,
          value: 'Quản lí VAT',
          url: '/home/vat-management',
        },
      ],
    },
    {
      key: 5,
      value: 'Hệ thống',
      icon: <CogIcon className="h-6 text-white" />,
      sublist: [
        {
          key: 12,
          value: 'Quản lí cơ sở',
          url: '/home/office',
        },
        {
          key: 13,
          value: 'Quản lí tài khoản',
          url: '/home/user',
        },
        {
          key: 14,
          value: 'Quản lí lựa chọn',
          url: '/home/options/student-state',
        },
      ],
    },
    {
      key: 6,
      value: 'Vận hành',
      icon: <CalendarIcon className="h-6 text-white" />,
      sublist: [
        {
          key: 16,
          value: 'Trình độ',
          url: '/home/level',
        },
        {
          key: 15,
          value: 'Lịch nghỉ',
          url: '/home/dayoff',
        },
      ],
    },
  ];

  const [open, setOpen] = useState(0);

  const toggleDisclosure = (key: number) => {
    setOpen((prev: number) => (prev !== key ? key : 0));
  };
  return (
    <div
      className={clsx(
        'mr-4 bg-blue-900 p-5 transition-[width] duration-300 ease-in-out',
        openNav ? 'w-[290px]' : 'w-[100px]',
      )}
      style={{ minHeight: 'calc(100vh - 74.22px)' }}
    >
      <Tooltip id="nav-tooltip" place="right" offset={30} hidden={openNav} />
      <Link
        href="/home"
        prefetch={false}
        className={clsx(
          'flex justify-between rounded-lg bg-blue-800 my-2 px-4 py-2 text-left font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
          openNav ? 'w-full' : 'w-[60px]',
          'transition-[width] duration-300 ease-in-out',
        )}
        data-tooltip-id="nav-tooltip"
        data-tooltip-content={'Tổng quan'}
      >
        <div className="flex gap-2">
          <div>
            <HomeIcon className="h-6 text-white" />
          </div>
          <div
            className={clsx(
              openNav ? 'w-full' : 'w-0',
              'h-6 overflow-hidden transition-[width] ease-in-out duration-100',
            )}
          >
            Tổng quan
          </div>
        </div>
      </Link>
      {data.map((e, i) => (
        <CustomDisclosure
          icon={e.icon}
          key={i}
          title={e}
          items={e.sublist}
          openId={open}
          id={e.key}
          onClick={() => toggleDisclosure(e.key)}
          openNav={openNav}
        />
      ))}
    </div>
  );
}
