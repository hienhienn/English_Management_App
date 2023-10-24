'use client';

import { PencilIcon, PlusSmIcon, TrashIcon } from '@heroicons/react/outline';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Tab } from '@/model/dictionary';
import { useEffect, useState } from 'react';
import api from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Subject, Subscription } from 'rxjs';
import { connection } from '@/helper/connection';
import {
  WhiteBlueButton,
  WhiteRedButton,
  DarkBlueButton,
} from '@/components/base/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Table from '@/components/table/table';
import Pagination from '@/components/table/pagination';
import SearchBar from '@/components/table/searchBar';
import ColumnSelect from '@/components/common/ColumnSelect';
import Tag from '@/components/common/Tag';
import Link from 'next/link';

let subscription: Subscription;
let deleteSubject = new Subject<boolean>();

const ItemsFilter = [
  { key: 'all', value: 'Tất cả' },
  { key: 'fullname', value: 'Họ tên' },
  { key: 'phoneNumber', value: 'Số điện thoại' },
];

const listColumn = [
  { key: 'fullname', value: 'Họ tên', fixed: true, default: true },
  { key: 'phoneNumber', value: 'Số điện thoại', default: true },
  { key: 'state', value: 'Trạng thái', default: true },
  { key: 'result', value: 'Kết quả', default: true },
  { key: 'class', value: 'Lớp học' },
  { key: 'studyGoal', value: 'Mục đích học' },
  { key: 'note', value: 'Ghi chú' },
  { key: 'reCallTime', value: 'Thời gian gọi lại' },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];
const StudentPotentialTab = () => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('fullname', {
      header: () => <span>Họ tên</span>,
      cell: (info) => (
        <div className="w-fit">
          <div className="justify-center flex">
            <Link
              href={`/home/student/${info.row.original.id}`}
              className="underline text-blue-800 mb-1 "
              prefetch={false}
            >
              {info.getValue()}
            </Link>
          </div>
          {info.row.original.paymentState && (
            <Tag
              text={info.row.original.paymentState}
              bgColor={
                info.row.original.paymentState === 'Thanh toán theo tháng'
                  ? '#3b82f6'
                  : '#22c55e'
              }
              textColor="#fff"
            />
          )}
        </div>
      ),
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
    columnHelper.accessor('result', {
      header: () => <span>Kết quả</span>,
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

    columnHelper.accessor('studyGoal', {
      header: () => <span>Mục đích học</span>,
      size: 1000,
    }),
    columnHelper.accessor('note', {
      header: () => <span>Ghi chú</span>,
      size: 1000,
    }),
    columnHelper.accessor('reCallTime', {
      header: () => <span>Thời gian gọi lại</span>,
      cell: (info) => {
        if (info.row.original.reCallTime) {
          const time =
            new Date(info.row.original.reCallTime).getTime() +
            7 * 60 * 60 * 1000;
          const date = new Date(time).toISOString();
          return (
            <span>
              {`${date.substring(11, 16)} ${new Date(time).toLocaleDateString(
                'vi',
              )}`}
            </span>
          );
        }
      },
      size: 1000,
    }),

    columnHelper.accessor('action', {
      header: () => <span>Hành động</span>,
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <Link href={`/home/student/${info.row.original.id}`}>
            <WhiteBlueButton className="w-auto p-2 edit-btn">
              <PencilIcon className="h-4 w-4" />
            </WhiteBlueButton>
          </Link>
          <WhiteRedButton
            className="w-auto p-2 delete-btn"
            onClick={() => onDelete(info.row.original.id)}
          >
            <TrashIcon className="text-red-600 h-4 w-4" />
          </WhiteRedButton>
        </div>
      ),
      size: 110,
      maxSize: 110,
    }),
  ];

  const [pageSize, setPageSize] = useState(10);
  const [tableData, setTableData] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [typeFilter, setTypeFilter] = useState({ key: 'all', value: 'Tất cả' });
  const [searchText, setSearchText] = useState('');
  const [displayColumns, setDisplayedColumns] = useState<Array<any>>(
    listColumn.filter((t: any) => t.default).map((t: any) => t.key),
  );
  const [tableColumns, setTableColumns] = useState<Array<any>>([]);

  const getData = async () => {
    try {
      const query = {
        role: Tab.OLD,
        pageNumber: pageNumber,
        keyword: searchText,
        field: typeFilter.key,
        pageSize: pageSize,
      };
      const res = await api.functional.student.search(connection, query);
      if (res.data) {
        setTableData(res.data.result);
        setTotal(res.data.total);
        setTotalPage(Math.ceil(res.data.total / pageSize));
      }
    } catch (err) {
      console.log(err);
      toast.error('Tải danh sách học viên thất bại');
    }
    return 1;
  };

  const { isLoading } = useQuery({
    queryKey: ['student', pageNumber, searchText, typeFilter, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.student.deleteStudent(
        {
          ...connection,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
        id,
      ),
    onSuccess: () => {
      toast.success('Xoá học viên thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá học viên thất bại');
    },
  });

  const onDelete = (id: string) => {
    setOpenDelete(true);
    subscription = deleteSubject.subscribe({
      next: (v: boolean) => {
        if (v) deleteMutation.mutate(id);
      },
    });
  };

  useEffect(() => {
    setTableColumns(
      columns.filter((t: any) => displayColumns.includes(t.accessorKey)),
    );
  }, [displayColumns]);

  return (
    <>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách học viên cũ
        </div>
        <div className="flex gap-2">
          <div>
            <ColumnSelect
              items={listColumn}
              selected={displayColumns}
              setSelected={setDisplayedColumns}
            />
          </div>
          <Link href={'/home/student/add-student'}>
            <DarkBlueButton className="px-4 py-2 w-auto mb-5">
              <div className="flex">
                <PlusSmIcon className="text-white w-6 h-6" />
                Thêm học viên
              </div>
            </DarkBlueButton>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg p-5">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          ItemsFilter={ItemsFilter}
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
      <ConfirmDialog
        open={openDelete}
        title={'Bạn muốn xoá học sinh này?'}
        onClickNo={() => {
          subscription.unsubscribe();
          setOpenDelete(false);
        }}
        onClickYes={() => {
          deleteSubject.next(true);
          subscription.unsubscribe();
          setOpenDelete(false);
        }}
      />
    </>
  );
};

export default StudentPotentialTab;
