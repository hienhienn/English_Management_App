'use client';

import { ClassContext } from '@/context/ClassContext';
import { useState } from 'react';

export default function ClassIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<any>({});
  const [students, setStudents] = useState<any>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [bfData, setBfData] = useState<any>({});
  const [listLevel, setListLevel] = useState<any>([]);

  return (
    <main>
      <ClassContext.Provider
        value={{
          data,
          setData,
          students,
          setStudents,
          loaded,
          setLoaded,
          bfData,
          setBfData,
          listLevel,
          setListLevel,
        }}
      >
        {children}
      </ClassContext.Provider>
    </main>
  );
}
