'use client';

import Header from '@/layouts/header';
import Nav from '@/layouts/nav';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const queryClient = new QueryClient();

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [openNav, setOpenNav] = useState<boolean>();
  useEffect(
    () =>
      setOpenNav(localStorage.getItem('openNav') === 'false' ? false : true),
    [],
  );
  return (
    <main>
      <Header openNav={openNav} setOpenNav={setOpenNav} />
      <div className="flex w-full max-w-full ">
        <Nav openNav={openNav} />
        <Tooltip anchorSelect=".edit-btn" content="Sửa" className="z-10" />
        <Tooltip anchorSelect=".delete-btn" content="Xoá" className="z-10" />
        <Tooltip anchorSelect=".print-btn" content="In" className="z-10" />
        <Tooltip id="right-tooltip" place="right" className="z-10" />
        <div className="bg-gray-100 w-full overflow-y-auto rounded-lg px-7 mr-4 py-5 mt-6 transition-[width] duration-300 ease-in-out">
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </div>
      </div>
    </main>
  );
}
