'use client';

import api from '@/api';
import { connection } from '@/helper/connection';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/table/table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  DarkBlueButton,
  WhiteBlueButton,
  WhiteRedButton,
} from '@/components/base/Button';
import Link from 'next/link';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Checkbox from '@/components/base/Checkbox';
import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import AddSchedule from '@/components/AddSchedule';

export default function Page() {
  const pathname = usePathname();
  const id = pathname.split('/')[3];
  const [data, setData] = useState<any>({});
  const [students, setStudents] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();
  const [listSelected, setListSelected] = useState<any>([]);
  const [listSchedule, setListSchedule] = useState<any>([]);
  const [currentSchedule, setCurrentSchedule] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCancel, setIsCancle] = useState<boolean>(false);
  const [dfListSchedule, setDfListSchedule] = useState<any>([]);

  const columnHelper = createColumnHelper<any>();

  const tableColumns: ColumnDef<any, any>[] = [
    columnHelper.accessor('checkbox', {
      header: () => <></>,
      cell: (info) => (
        <div className="flex justify-center align-middle">
          <Checkbox
            checked={listSelected.includes(info.row.original.studentId)}
            onChange={(e) => {
              if (e.target.checked)
                setListSelected([...listSelected, info.row.original.studentId]);
              else
                setListSelected(
                  listSelected.filter(
                    (e: any) => e !== info.row.original.studentId,
                  ),
                );
            }}
          />
        </div>
      ),
      size: 64,
    }),
    columnHelper.accessor('fullname', {
      header: () => <span>Họ tên</span>,
      cell: (info) => (
        <Link
          href={`/home/student/${info.row.original.studentId}`}
          className="underline text-blue-800 mb-1 "
          prefetch={false}
        >
          {info.getValue()}
        </Link>
      ),
      size: 1000,
    }),
    columnHelper.accessor('isAttendant', {
      header: () => <span>Điểm danh</span>,
      cell: (info) => (
        <>
          {info.getValue() ? (
            <div className="flex">
              Có mặt{' '}
              <XCircleIcon
                onClick={() => unAttendance([info.row.original.studentId])}
                className="w-4 h-4 translate-y-1 ml-2 text-red-500"
                data-tooltip-content="Huỷ điểm danh"
                data-tooltip-id="right-tooltip"
              />
            </div>
          ) : (
            <div className="flex">
              Vắng mặt{' '}
              <CheckCircleIcon
                onClick={() => attendance([info.row.original.studentId])}
                className="w-4 h-4 translate-y-1 ml-2 text-blue-800"
                data-tooltip-content="Điểm danh"
                data-tooltip-id="right-tooltip"
              />
            </div>
          )}
        </>
      ),
      size: 1000,
    }),
  ];

  const getData = async () => {
    try {
      const res = await api.functional.schedule.getSchedule(connection, id);
      if (res.data) {
        setData(res.data);
        if (res.data.attendance && res.data.attendance.length > 0)
          setStudents(res.data.attendance);
        getListSchedule(res.data.classId);
      }
    } catch (err) {
      toast.error('Tải thông tin giờ học thất bại');
      console.log(err);
    }
    return 1;
  };

  useQuery({
    queryKey: ['detailSchedule'],
    queryFn: getData,
    refetchOnWindowFocus: false,
  });

  const getListSchedule = async (classId: string) => {
    try {
      const res = await api.functional.schedule.by_class.getScheduleByClassId(
        connection,
        { classId: classId },
      );
      if (res.data) {
        setListSchedule(res.data);
        setDfListSchedule(res.data);
      }
    } catch (err) {
      console.log(err);
      toast.error('Tải danh sách lịch học thất bại');
    }
  };

  useEffect(() => {
    setCurrentSchedule(listSchedule.findIndex((e: any) => e.id === id));
  }, [listSchedule]);

  useEffect(() => {
    if (isCancel) {
      setListSchedule(dfListSchedule);
    }
  }, [isCancel]);

  const deleteMutation = useMutation({
    mutationFn: () => api.functional.schedule.deleteSchedule(connection, id),
    onSuccess: () => {
      setOpenDelete(false);
      toast.success('Xoá lịch học thành công');
      router.back();
    },
    onError: () => {
      setOpenDelete(false);
      toast.error('Xoá lịch học thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      api.functional.schedule.updateSchedule(connection, id, data),
    onSuccess: () => {
      toast.success('Cập nhật thành công');
      getData();
    },
    onError: () => {
      toast.error('Cập nhật thất bại');
      getData();
    },
  });

  const attendance = (list: Array<any>) => {
    const params = data.attendance.map((e: any) => {
      if (!e.isAttendant && list.includes(e.studentId))
        return { ...e, isAttendant: true };
      else return e;
    });
    setStudents(params);
    updateMutation.mutate({ attendance: params });
  };

  const unAttendance = (list: Array<any>) => {
    const params = data.attendance.map((e: any) => {
      if (e.isAttendant && list.includes(e.studentId))
        return { ...e, isAttendant: false };
      else return e;
    });
    setStudents(params);
    updateMutation.mutate({ attendance: params });
  };

  const checkTime = (startTime: string, endTime: string) => {
    if (startTime.length == 4) startTime = `0${startTime}`;
    if (endTime.length == 4) endTime = `0${endTime}`;
    return startTime < endTime;
  };

  const onChangeTime = (
    startTime: string = data.startTime,
    date: string = new Date(data.date).toISOString(),
  ) => {
    console.log('b');
    let tmp = listSchedule;
    tmp[currentSchedule] = {
      ...listSchedule[currentSchedule],
      startTime: startTime,
      date: date,
    };
    // console.log(tmp);
    tmp.sort((a: any, b: any) => {
      if (a.date < b.date) return -1;
      if (a.date === b.date) {
        if (checkTime(a.startTime, b.startTime)) return -1;
        else return 0;
      }
      return 0;
    });
    console.log(tmp);
    setListSchedule([...tmp]);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px]">
          <span className=" font-semibold">Chi tiết giờ học</span>
        </div>
        <div className="flex gap-2">
          <WhiteBlueButton
            className="px-4 py-2 w-auto mb-5"
            onClick={() => router.back()}
          >
            Quay lại
          </WhiteBlueButton>
          <WhiteRedButton
            className="px-4 py-2 w-auto mb-5"
            onClick={() => setOpenDelete(true)}
          >
            Xoá giờ học
          </WhiteRedButton>
        </div>
      </div>
      <div className="bg-white w-full rounded-lg px-8 py-6 mt-2">
        <div className="items-center leading-8 text-[18px] py-2 font-semibold">
          Buổi học thứ {currentSchedule + 1}/{listSchedule.length}
        </div>
        <div className="grid large:flex gap-x-8">
          <AddSchedule
            defaultData={data}
            className={'w-full'}
            onChangeTime={onChangeTime}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            setIsCancle={setIsCancle}
          />
          <ul className="grid grid-cols-6 gap-x-10 gap-y-4 large:pr-5">
            {listSchedule.map((e: any, id: number) => (
              <li key={e.id} className="w-[40px]">
                <div
                  className={clsx(
                    'w-10 h-10 rounded-full bg-blue-500 text-center leading-10 font-semibold',
                    currentSchedule === id
                      ? 'bg-blue-700 text-white'
                      : currentSchedule > id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300',
                  )}
                >
                  {id + 1}
                </div>
                <div className="text-center text-sm text-gray-800">
                  {new Date(e.date).getDate()}/{new Date(e.date).getMonth() + 1}
                </div>
                <div className="text-center text-sm text-gray-800">
                  {e.startTime}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white w-full rounded-lg px-8 py-6 mt-5">
        <div className="flex justify-between">
          {(!listSelected || listSelected.length == 0) && (
            <div className="items-center leading-8 text-[18px] py-2 font-semibold">
              Danh sách học sinh
            </div>
          )}
          {listSelected && listSelected.length > 0 && (
            <div className="items-center leading-8 text-[18px] py-2">
              Đã chọn <b>{listSelected.length}</b> học sinh
            </div>
          )}
          <div className="flex gap-2">
            {listSelected && listSelected.length > 0 && (
              <WhiteBlueButton
                className="px-4 py-2 w-auto mb-5"
                onClick={() => setListSelected([])}
              >
                Huỷ chọn
              </WhiteBlueButton>
            )}

            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button as={DarkBlueButton} className="px-4 py-2 w-auto">
                Hành động
              </Menu.Button>

              <Menu.Items className="bg-white w-[200px] right-0 absolute mt-2 divide-y divide-gray-300 rounded-lg shadow-lg ring-2 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-1">
                  <Menu.Item>
                    <div
                      onClick={() => {
                        attendance(listSelected);
                        setListSelected([]);
                      }}
                      className={clsx(
                        'cursor-pointer',
                        'px-4 py-2',
                        !listSelected || listSelected.length == 0
                          ? 'text-gray-500 bg-gray-100'
                          : 'hover:bg-gray-200 rounded-md',
                      )}
                      aria-disabled={!listSelected || listSelected.length == 0}
                    >
                      Điểm danh
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      onClick={() => {
                        unAttendance(listSelected);
                        setListSelected([]);
                      }}
                      className={clsx(
                        'cursor-pointer',
                        'px-4 py-2',
                        !listSelected || listSelected.length == 0
                          ? 'text-gray-500 bg-gray-100'
                          : 'hover:bg-gray-200 rounded-md',
                      )}
                      aria-disabled={!listSelected || listSelected.length == 0}
                    >
                      Xoá điểm danh
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      onClick={() => {
                        router.push(
                          `/home/class/${data.classId}/add-student?from=schedule`,
                        );
                      }}
                      className={clsx(
                        'cursor-pointer',
                        'hover:bg-gray-200',
                        'px-4 py-2',
                        'rounded-md',
                      )}
                    >
                      Thêm học viên
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
        <Table data={students} columns={tableColumns} />
        <ConfirmDialog
          open={openDelete}
          title={'Bạn muốn xoá giờ học này?'}
          onClickNo={() => {
            setOpenDelete(false);
          }}
          onClickYes={() => {
            deleteMutation.mutate();
            setOpenDelete(false);
          }}
        />
      </div>
    </>
  );
}
