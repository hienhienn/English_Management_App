'use client';

import {
  PencilIcon,
  PlusSmIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/outline';
import {
  DarkBlueButton,
  WhiteBlueButton,
  WhiteRedButton,
} from '@/components/base/Button';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import Table from '@/components/table/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { connection } from '@/helper/connection';
import api from '@/api';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/table/pagination';
import ColumnSelect from '@/components/common/ColumnSelect';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FilterMenu from '@/components/common/FilterMenu';

const listColumn = [
  { key: 'student', value: 'Học viên', fixed: true, default: true },
  { key: 'phoneNumber', value: 'Số điện thoại', default: true },
  { key: 'creator', value: 'Người tạo' },
  { key: 'class', value: 'Lớp học' },
  { key: 'totalTuition', value: 'Tổng tiền', default: true },
  { key: 'paidMoney', value: 'Số tiền đóng', default: true },
  { key: 'debtMoney', value: 'Còn nợ', default: true },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];

const addCommas = (num: string) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const TuitionManagement = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('student', {
      header: () => (
        <div>
          Học viên{' '}
          <FilterMenu
            selected={studentFilter}
            setSelected={setStudentFilter}
            items={listStudent.map((t: any) => ({
              key: t.id,
              value: `${t.fullname} - ${t.phoneNumber}`,
            }))}
            setPageNumber={setPageNumber}
          />
        </div>
      ),
      cell: (info) => (
        <Link
          href={`/home/tuition-management/${info.row.original.id}`}
          className="underline text-blue-800"
        >
          {info.getValue().fullname}
        </Link>
      ),
      size: 1000,
    }),
    columnHelper.accessor('phoneNumber', {
      header: () => <span>Số điện thoại</span>,
      cell: (info) => <span>{info.row.original.student.phoneNumber}</span>,
      size: 1000,
    }),
    columnHelper.accessor('creator', {
      header: () => <span>Người tạo</span>,
      cell: (info) => <span>{info.getValue().username}</span>,
      size: 1000,
    }),
    columnHelper.accessor('class', {
      header: () => <span>Lớp học</span>,
      cell: (info) => <span>{info.getValue().courseTitle}</span>,
      size: 1000,
    }),
    columnHelper.accessor('totalTuition', {
      header: () => <div className="text-right">Tổng tiền</div>,
      cell: (info) => (
        <div className="text-right">{addCommas(info.getValue())}</div>
      ),
      size: 400,
    }),
    columnHelper.accessor('paidMoney', {
      header: () => <div className="text-right">Số tiền đóng</div>,
      cell: (info) => (
        <div className="text-right">{addCommas(info.getValue())}</div>
      ),
      size: 400,
    }),
    columnHelper.accessor('debtMoney', {
      header: () => <div className="text-right">Còn nợ</div>,
      cell: (info) => (
        <div className="text-right">{addCommas(info.getValue())}</div>
      ),
      size: 400,
    }),
    columnHelper.accessor('action', {
      header: () => <span>Hành động</span>,
      enableSorting: false,
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <WhiteBlueButton
            className="w-auto p-2 edit-btn"
            onClick={() =>
              router.push(`/home/tuition-management/${info.row.original.id}`)
            }
          >
            <PencilIcon className="h-4 w-4" />
          </WhiteBlueButton>
          <WhiteRedButton
            className="w-auto p-2 delete-btn"
            onClick={() => onDelete(info.row.original.id)}
          >
            <TrashIcon className="text-red-600 h-4 w-4" />
          </WhiteRedButton>
        </div>
      ),
      size: 110,
    }),
  ];

  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const [tableData, setTableData] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDelete, setOpenDelete] = useState('');
  const [studentFilter, setStudentFilter] = useState({ key: '', value: '' });
  const [displayColumns, setDisplayedColumns] = useState<Array<any>>(
    listColumn.filter((t: any) => t.default).map((t: any) => t.key),
  );
  const [tableColumns, setTableColumns] = useState<Array<any>>([]);
  const [listStudent, setListStudent] = useState<any>([]);

  const getData = async () => {
    try {
      const query = {
        studentId: studentFilter.key,
        pageNumber: pageNumber,
        pageSize: pageSize,
      };
      const res = await api.functional.tuition_management.list.getWithQuery(
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
      toast.error('Tải danh sách phòng học thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['tuition', pageNumber, studentFilter, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  useQuery({
    queryKey: ['listStudent'],
    queryFn: async () => {
      try {
        const res = await api.functional.student.all.getAll(connection);
        if (res.data) {
          setListStudent(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách học sinh thất bại');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.tuition_management.deleteTuitionManagement(connection, id),
    onSuccess: () => {
      toast.success('Xoá thanh toán thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá thanh toán thất bại');
    },
  });

  const onDelete = (id: string) => {
    setOpenDelete(id);
  };

  useEffect(() => {
    setTableColumns(
      columns.filter((t: any) => displayColumns.includes(t.accessorKey)),
    );
  }, [displayColumns, listStudent, studentFilter]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách thanh toán học phí
        </div>
        <div className="flex gap-2">
          <div>
            <ColumnSelect
              items={listColumn}
              selected={displayColumns}
              setSelected={setDisplayedColumns}
            />
          </div>
          <DarkBlueButton
            className="px-4 py-2 w-auto mb-5"
            onClick={() => router.push('/home/tuition-management/add-tuition')}
          >
            <div className="flex">
              <PlusSmIcon className="text-white w-6 h-6" />
              Thu học phí
            </div>
          </DarkBlueButton>
        </div>
      </div>
      <div className="bg-white rounded-lg p-5">
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
        open={!!openDelete}
        title={'Bạn muốn xoá thanh toán này?'}
        onClickNo={() => {
          setOpenDelete('');
        }}
        onClickYes={() => {
          deleteMutation.mutate(openDelete);
          setOpenDelete('');
        }}
      />
    </div>
  );
};

export default TuitionManagement;
