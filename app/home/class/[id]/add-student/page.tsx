'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useContext, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { connection } from '@/helper/connection';
import api from '@/api';
import Table from '@/components/table/table';
import SearchBar from '@/components/table/searchBar';
import Pagination from '@/components/table/pagination';
import Checkbox from '@/components/base/Checkbox';
import { DarkBlueButton, WhiteBlueButton } from '@/components/base/Button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import Tag from '@/components/common/Tag';
import { ClassContext } from '@/context/ClassContext';

const ItemsFilter = [
  { key: 'all', value: 'Tất cả' },
  { key: 'fullname', value: 'Họ tên' },
  { key: 'phoneNumber', value: 'Số điện thoại' },
];

const AddClassStudent = () => {
  const columnHelper = createColumnHelper<any>();
  const tableColumns: ColumnDef<any, any>[] = [
    columnHelper.accessor('checkbox', {
      header: () => <></>,
      cell: (info) => (
        <div className="flex justify-center align-middle">
          <Checkbox
            className={clsx(
              students
                .map((t: any) => t.studentId)
                .includes(info.row.original.id)
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer',
            )}
            disabled={students
              .map((t: any) => t.studentId)
              .includes(info.row.original.id)}
            checked={listSelected
              .map((t: any) => t.studentId)
              .includes(info.row.original.id)}
            onChange={(e) => {
              if (e.target.checked) {
                if (searchParams.get('from') === 'schedule')
                  setListSelected([
                    ...listSelected,
                    {
                      studentId: info.row.original.id,
                      fullname: info.row.original.fullname,
                      isAttendant: false,
                    },
                  ]);
                else
                  setListSelected([
                    ...listSelected,
                    {
                      studentId: info.row.original.id,
                      fullname: info.row.original.fullname,
                      phoneNumber: info.row.original.phoneNumber,
                      payment: false,
                      paymentAt: null,
                    },
                  ]);
              } else {
                setListSelected(
                  listSelected.filter(
                    (e: any) => e.studentId !== info.row.original.id,
                  ),
                );
              }
            }}
          />
        </div>
      ),
      size: 64,
    }),
    columnHelper.accessor('fullname', {
      header: () => <span>Họ tên</span>,
      size: 1000,
    }),
    columnHelper.accessor('phoneNumber', {
      header: () => <span>Số điện thoại</span>,
      size: 1000,
    }),
    columnHelper.accessor('state', {
      header: () => <span>Trạng thái</span>,
      size: 1000,
    }),
    columnHelper.accessor('class', {
      header: () => <div className="text-center">Lớp học - Trạng thái</div>,
      cell: (info) =>
        info.row.original.class && (
          <div className="text-center">
            <p>
              {info.row.original.class.courseTitle} {' - '}
              {info.row.original.class.office}
            </p>
            <div className="flex gap-1 mt-1 justify-center">
              {info.row.original.learningType && (
                <Tag text={info.row.original.learningType} />
              )}
              {info.row.original.learningState && (
                <Tag
                  text={info.row.original.learningState}
                  bgColor="#3b82f6"
                  textColor="#fff"
                />
              )}
            </div>
          </div>
        ),
      size: 1000,
    }),
  ];

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/')[3];
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = useState(10);
  const [tableData, setTableData] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState({ key: 'all', value: 'Tất cả' });
  const [listSelected, setListSelected] = useState<any>([]);
  const { students, setStudents } = useContext(ClassContext);

  console.log(searchParams.get('from'));

  useQuery({
    queryKey: ['getStudent', pageNumber, pageSize, searchText, typeFilter],
    queryFn: async () => {
      try {
        const query = {
          keyword: searchText,
          field: typeFilter.key,
          pageNumber: pageNumber,
          pageSize: pageSize,
        };
        const res = await api.functional.student.list.getAllByType(
          connection,
          query,
        );
        if (res.data) {
          setTableData(res.data.result);
          setTotal(res.data.total);
          setTotalPage(Math.ceil(res.data.total / pageSize));
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách học sinh thất bại');
      }
      return 1;
    },
  });

  const addFromSchedule = useMutation({
    mutationFn: (data: any) =>
      api.functional.schedule.addFromSchedule.addStudentFromSchedule(
        connection,
        {
          classId: id,
          studentList: data,
        },
      ),
    onSuccess: () => {
      toast.success('Thêm học sinh thành công');
      router.back();
    },
    onError: () => {
      toast.error('Thêm học sinh thất bại');
    },
  });

  return (
    <>
      <div className="flex justify-between">
        {listSelected.length === 0 ? (
          <>
            <div className="items-center leading-10 text-[20px] font-semibold">
              Thêm học sinh vào lớp
            </div>
            <WhiteBlueButton
              className="px-4 py-2 w-auto mb-5"
              onClick={() => router.back()}
            >
              Quay lại
            </WhiteBlueButton>
          </>
        ) : (
          <>
            <div className="items-center leading-10 text-[18px]">
              Đã chọn<b> {listSelected.length} </b>học sinh
            </div>
            <div className="flex gap-2">
              <WhiteBlueButton
                className="px-4 py-2 w-auto mb-5"
                onClick={() => setListSelected([])}
              >
                Huỷ chọn
              </WhiteBlueButton>
              <DarkBlueButton
                className="px-4 py-2 w-auto mb-5"
                disabled={listSelected.length === 0}
                onClick={() => {
                  if (searchParams.get('from') === 'schedule')
                    addFromSchedule.mutate(listSelected);
                  else {
                    setStudents(students.concat(listSelected));
                    router.back();
                  }
                }}
              >
                Thêm học sinh
              </DarkBlueButton>
            </div>
          </>
        )}
      </div>
      <div className="bg-white rounded-lg p-5">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          ItemsFilter={ItemsFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
        <Table data={tableData} columns={tableColumns} />
        {total > 0 && (
          <Pagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalPage={totalPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            total={total}
            size={tableData.length}
          />
        )}
      </div>
    </>
  );
};

export default AddClassStudent;
