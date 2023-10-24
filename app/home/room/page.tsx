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
import { Popup } from 'reactjs-popup';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import Table from '@/components/table/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Subject, Subscription } from 'rxjs';
import AddRoom from '@/components/AddRoom';
import { connection } from '@/helper/connection';
import api from '@/api';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SearchBar from '@/components/table/searchBar';
import Pagination from '@/components/table/pagination';
import ColumnSelect from '@/components/common/ColumnSelect';

let subscription: Subscription;
let deleteSubject = new Subject<boolean>();

const ItemsFilter = [
  { key: 'all', value: 'Tất cả' },
  { key: 'office', value: 'Cơ sở' },
  { key: 'title', value: 'Tên phòng' },
];

const listColumn = [
  { key: 'title', value: 'Tên phòng', fixed: true, default: true },
  { key: 'office', value: 'Cơ sở', default: true },
  { key: 'code', value: 'Mã phòng' },
  { key: 'category', value: 'Loại phòng' },
  { key: 'state', value: 'Trạng thái', default: true },
  { key: 'min', value: 'Tối thiểu' },
  { key: 'max', value: 'Tối đa' },
  { key: 'area', value: 'Diện tích' },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];

const RoomTab = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('title', {
      header: () => <span>Tên phòng</span>,
      size: 1000,
    }),
    columnHelper.accessor('office', {
      header: () => <span>Cơ sở</span>,
      size: 1000,
    }),
    columnHelper.accessor('code', {
      header: () => <span>Mã phòng</span>,
      size: 1000,
    }),
    columnHelper.accessor('category', {
      header: () => <span>Loại phòng</span>,
      size: 1000,
    }),
    columnHelper.accessor('state', {
      header: () => <span>Trạng thái</span>,
      size: 1000,
    }),
    columnHelper.accessor('min', {
      header: () => <span>Tối thiểu</span>,
      size: 1000,
    }),
    columnHelper.accessor('max', {
      header: () => <span>Tối đa</span>,
      size: 1000,
    }),
    columnHelper.accessor('area', {
      header: () => <span>Diện tích</span>,
      size: 1000,
    }),
    columnHelper.accessor('action', {
      header: () => <span>Hành động</span>,
      enableSorting: false,
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
  const [typeFilter, setTypeFilter] = useState({ key: 'all', value: 'Tất cả' });
  const [searchText, setSearchText] = useState('');
  const [openUpdate, setOpenUpdate] = useState(false);
  const [studentSelected, setStudentSelected] = useState({});
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
      };
      const res = await api.functional.room.list.getWithQuery(
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

  const { isLoading } = useQuery({
    queryKey: ['room', pageNumber, searchText, typeFilter, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.functional.room.deleteRoom(connection, id),
    onSuccess: () => {
      toast.success('Xoá phòng học thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá phòng học thất bại');
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
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách phòng học
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
              Thêm phòng học
            </div>
          </DarkBlueButton>
        </div>
        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Thêm phòng học
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddRoom closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật phòng học
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddRoom
            closeModal={() => setOpenUpdate(false)}
            getData={getData}
            defaultData={studentSelected}
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
        title={'Bạn muốn xoá phòng học này?'}
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
    </div>
  );
};

export default RoomTab;
