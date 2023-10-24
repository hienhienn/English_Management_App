'use client';

import {
  PencilIcon,
  PlusSmIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/outline';
import { Popup } from 'reactjs-popup';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
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
import AddEmployee from '@/components/AddEmployee';
import SearchBar from '@/components/table/searchBar';
import Pagination from '@/components/table/pagination';
import ColumnSelect from '@/components/common/ColumnSelect';

let subscription: Subscription;
let deleteSubject = new Subject<boolean>();

const ItemsFilter = [
  { key: 'all', value: 'Tất cả' },
  { key: 'fullname', value: 'Họ tên' },
  { key: 'phoneNumber', value: 'Số điện thoại' },
  { key: 'department', value: 'Phòng ban' },
];

const listColumn = [
  { key: 'fullname', value: 'Họ tên', fixed: true, default: true },
  { key: 'phoneNumber', value: 'Số điện thoại', default: true },
  { key: 'office', value: 'Cơ sở' },
  { key: 'state', value: 'Trạng thái', default: true },
  { key: 'classCategory', value: 'Loại lớp', default: true },
  { key: 'department', value: 'Phòng ban' },
  { key: 'note', value: 'Ghi chú' },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];

const TeacherTab = () => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('fullname', {
      header: () => <span>Họ tên</span>,
      size: 1000,
    }),
    columnHelper.accessor('phoneNumber', {
      header: () => <span>Số điện thoại</span>,
      size: 1000,
    }),
    columnHelper.accessor('office', {
      header: () => <span>Cơ sở</span>,
      cell: (info) => <span>{info.getValue().title}</span>,
      size: 1000,
    }),
    columnHelper.accessor('state', {
      header: () => <span>Trạng thái</span>,
      size: 1000,
    }),
    columnHelper.accessor('classCategory', {
      header: () => <span>Loại lớp</span>,
      size: 1000,
    }),
    columnHelper.accessor('department', {
      header: () => <span>Phòng ban</span>,
      size: 1000,
    }),
    columnHelper.accessor('note', {
      header: () => <span>Ghi chú</span>,
      size: 1000,
    }),
    columnHelper.accessor('action', {
      header: () => <span>Hành động</span>,
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <WhiteBlueButton
            className="w-auto p-2 edit-btn"
            onClick={() => {
              setOpenUpdate((o) => !o);
              setStudentSelected(info.row.original);
            }}
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
      maxSize: 110,
    }),
  ];

  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const closeModal = () => setOpenAdd(false);
  const [tableData, setTableData] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [studentSelected, setStudentSelected] = useState({});
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState({ key: 'all', value: 'Tất cả' });
  const [displayColumns, setDisplayedColumns] = useState<Array<any>>(
    listColumn.filter((t: any) => t.default).map((t: any) => t.key),
  );
  const [tableColumns, setTableColumns] = useState<Array<any>>([]);

  const getData = async () => {
    try {
      const query = {
        pageNumber: pageNumber,
        keyword: searchText,
        field: typeFilter.key,
        pageSize: pageSize,
        role: 'TEACHER',
      };
      const res = await api.functional.employee.list.getWithQuery(
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
      toast.error('Tải danh sách giáo viên thất bại');
    }
    return 1;
  };
  useQuery({
    queryKey: ['teacher', pageNumber, searchText, typeFilter, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.employee.deleteEmployee(
        {
          ...connection,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
        id,
      ),
    onSuccess: () => {
      toast.success('Xoá giáo viên thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá giáo viên thất bại');
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
          Danh sách giáo viên
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
            onClick={() => setOpenAdd((o) => !o)}
          >
            <div className="flex">
              <PlusSmIcon className="text-white w-6 h-6" />
              Thêm giáo viên
            </div>
          </DarkBlueButton>
        </div>

        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Thêm giáo viên
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddEmployee
            closeModal={closeModal}
            getData={getData}
            role={'TEACHER'}
          />
        </Popup>

        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật giáo viên
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddEmployee
            closeModal={() => setOpenUpdate(false)}
            getData={getData}
            defaultData={studentSelected}
            role={'TEACHER'}
          />
        </Popup>
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
      <ConfirmDialog
        open={openDelete}
        title={'Bạn muốn xoá giáo viên này?'}
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

export default TeacherTab;
