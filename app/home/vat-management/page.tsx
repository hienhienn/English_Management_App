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
import { connection } from '@/helper/connection';
import api from '@/api';
import AddCourse from '@/components/AddCourse';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/table/pagination';
import Input from '@/components/base/Input';
import Tag from '@/components/common/Tag';
import AddVat from '@/components/AddVat';
import SearchBar from '@/components/table/searchBar';
import ColumnSelect from '@/components/common/ColumnSelect';

const VatManagement = () => {
  const ItemsFilter = [
    { key: 'all', value: 'Tất cả' },
    { key: 'name', value: 'Tên' },
    { key: 'address', value: 'Địa chỉ' },
    { key: 'phoneNumber', value: 'Số điện thoại' },
  ];
  const listColumn = [
    { key: 'info', value: 'VAT', fixed: true, default: true },
    { key: 'financialManagement', value: 'Tên hoá đơn', default: true },
    { key: 'note', value: 'Ghi chú' },
    { key: 'user', value: 'Người tạo' },
    { key: 'money', value: 'Số tiền', default: true },
    { key: 'state', value: 'Trạng thái' },
    { key: 'action', value: 'Hành động', fixed: true, default: true },
  ];
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('info', {
      header: () => <span>VAT</span>,
      cell: (info) => (
        <div>
          <p>
            <span className="font-semibold">Loại: </span>
            {info.row.original.type}
          </p>
          <p>
            <span className="font-semibold">Tên: </span>
            {info.row.original.name}
          </p>
          <p>
            <span className="font-semibold">Hình thức xuất: </span>
            {info.row.original.exportType}
          </p>
          {info.row.original.phoneNumber && (
            <p>
              <span className="font-semibold">Số ĐT: </span>
              {info.row.original.phoneNumber}
            </p>
          )}
          {info.row.original.address && (
            <p>
              <span className="font-semibold">Địa chỉ: </span>
              {info.row.original.address}
            </p>
          )}
          {info.row.original.description && (
            <p>
              <span className="font-semibold">Nội dung: </span>
              {info.row.original.description}
            </p>
          )}
        </div>
      ),
      size: 2000,
    }),
    columnHelper.accessor('financialManagement', {
      header: () => <div>Tên hoá đơn</div>,
      cell: (info) => <div>{info.getValue()?.student?.fullname}</div>,
      size: 1000,
    }),
    columnHelper.accessor('note', {
      header: () => <span>Ghi chú</span>,

      size: 1000,
    }),
    columnHelper.accessor('user', {
      header: () => <span>Người tạo</span>,
      cell: (info) => <span>{info.getValue()?.username}</span>,
      size: 1000,
    }),
    columnHelper.accessor('money', {
      header: () => <span>Số tiền</span>,
      cell: (info) => (
        <div className="flex gap-2">
          {info.getValue()?.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}
        </div>
      ),
      size: 1000,
    }),
    columnHelper.accessor('state', {
      header: () => <span>Trạng thái</span>,
      cell: (info) => (
        <div className="flex gap-2">
          {!info.row.original.isValidated
            ? 'Chưa xác nhận'
            : info.row.original.isRelease
            ? 'Đã phát hành'
            : 'Đã xác nhận, Chưa phát hành'}
        </div>
      ),
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
              setSelected(info.row.original);
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

  const [pageSize, setPageSize] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const closeModal = () => setOpenAdd(false);
  const [tableData, setTableData] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDelete, setOpenDelete] = useState('');
  const [searchText, setSearchText] = useState('');
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selected, setSelected] = useState({});
  const [typeFilter, setTypeFilter] = useState({ key: 'all', value: 'Tất cả' });
  const [displayColumns, setDisplayedColumns] = useState<Array<any>>(
    listColumn.filter((t: any) => t.default).map((t: any) => t.key),
  );
  const [tableColumns, setTableColumns] = useState<Array<any>>([]);

  const getData = async () => {
    let query = {
      pageNumber: pageNumber,
      keyword: searchText,
      field: typeFilter.key,
      pageSize: pageSize,
    };
    try {
      const res = await api.functional.vat_management.query.queryRecord(
        connection,
        query,
      );
      if (res.data) {
        setTableData(res.data.result);
        setTotal(res.data.total);
        setTotalPage(Math.ceil(res.data.total / pageSize));
      }
    } catch (err) {
      toast.error('Tải danh sách VAT thất bại');
      console.log(err);
    }
    return 1;
  };

  const { isLoading } = useQuery({
    queryKey: ['room', pageNumber, searchText, pageSize, typeFilter],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.vat_management.remove(connection, id),
    onSuccess: () => {
      toast.success('Xoá VAT thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá VAT thất bại');
    },
  });

  const onDelete = (id: string) => {
    setOpenDelete(id);
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
          Danh sách VAT
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
              Thêm VAT
            </div>
          </DarkBlueButton>
        </div>

        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Thêm VAT
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddVat closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật VAT
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddVat
            closeModal={() => setOpenUpdate(false)}
            getData={getData}
            defaultData={selected}
          />
        </Popup>
      </div>
      <div className="bg-white rounded-lg p-5">
        <SearchBar
          ItemsFilter={ItemsFilter}
          searchText={searchText}
          setSearchText={setSearchText}
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
        open={!!openDelete}
        title={'Bạn muốn xoá VAT này?'}
        onClickNo={() => {
          setOpenDelete('');
        }}
        onClickYes={() => {
          deleteMutation.mutate(openDelete);
          setOpenDelete('');
        }}
      />
    </>
  );
};

export default VatManagement;
