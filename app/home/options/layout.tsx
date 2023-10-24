'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DarkBlueButton } from '@/components/base/Button';
import { PlusSmIcon } from '@heroicons/react/outline';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const path = pathname.split('/')[3];
  const [categories] = useState([
    { label: 'Trạng thái tư vấn', value: 'student-state' },
    { label: 'Kết quả tư vấn', value: 'advisement-result' },
    { label: 'Mục đích học', value: 'study-goal' },
    { label: 'Ngày học', value: 'day-option' },
    { label: 'Khung giờ học', value: 'time-option' },
  ]);
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="w-full">
      <ul className="flex space-x-2 rounded-xl bg-blue-900/20 p-1">
        {categories.map((ctg: any) => (
          <Link
            href={ctg.value}
            key={ctg.value}
            className={clsx(
              'text-center w-full rounded-lg py-2 px-4 font-medium text-sm text-blue-700',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              path === ctg.value
                ? 'bg-white shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
            )}
          >
            {ctg.label}
          </Link>
        ))}
      </ul>
      {children}
    </div>
  );
}
