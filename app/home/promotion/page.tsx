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
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/table/pagination';
import ColumnSelect from '@/components/common/ColumnSelect';
import AddPromotion from '@/components/AddPromotion';
import Input from '@/components/base/Input';
import NumberInput from '@/components/base/NumberInput';

const listColumn = [
  { key: 'code', value: 'Mã khuyến mại', default: true, fixed: true },
  { key: 'title', value: 'CT khuyến mại', default: true },
  { key: 'description', value: 'Nội dung' },
  { key: 'value', value: 'Giá trị', fixed: true, default: true },
  { key: 'isActive', value: 'Kích hoạt' },
  { key: 'startDate', value: 'Ngày bắt đầu' },
  { key: 'endDate', value: 'Ngày kết thúc' },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];

const Promotion = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('code', {
      header: () => <span>Mã khuyến mại</span>,
      size: 1000,
    }),
    columnHelper.accessor('title', {
      header: () => <span>CT khuyến mại</span>,
      size: 1000,
    }),
    columnHelper.accessor('description', {
      header: () => <span>Nội dung</span>,
      size: 1000,
    }),
    columnHelper.accessor('value', {
      header: () => <span>Giá trị</span>,
      cell: (info) => (
        <span>
          {info.row.original.type === '%'
            ? `${info.getValue()}%`
            : `${info.getValue()} VND`}
        </span>
      ),
      size: 1000,
    }),
    columnHelper.accessor('isActive', {
      header: () => <span>Kích hoạt</span>,
      cell: (info) => <span>{info.getValue() ? 'Có' : 'Không'}</span>,
      size: 1000,
    }),
    columnHelper.accessor('startDate', {
      header: () => <span>Ngày bắt đầu</span>,
      cell: (info) => (
        <span>
          {info.getValue()
            ? new Date(info.getValue()).toLocaleDateString('vi')
            : ''}
        </span>
      ),
      size: 1000,
    }),
    columnHelper.accessor('endDate', {
      header: () => <span>Ngày kết thúc</span>,
      cell: (info) => (
        <span>
          {info.getValue()
            ? new Date(info.getValue()).toLocaleDateString('vi')
            : ''}
        </span>
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
  const [openDelete, setOpenDelete] = useState('');
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
        field: 'title',
        pageSize: pageSize,
      };
      const res = await api.functional.promotional_code.query.getQuery(
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
      toast.error('Tải danh sách mã khuyến mãi thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['financial', pageNumber, searchText, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.promotional_code.remove(connection, id),
    onSuccess: () => {
      toast.success('Xoá mã khuyến mãi thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá mã khuyến mãi thất bại');
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
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách mã khuyến mãi
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
              Thêm mã khuyến mãi
            </div>
          </DarkBlueButton>
        </div>
        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Thêm mã khuyến mãi
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddPromotion closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật mã khuyến mãi
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddPromotion
            closeModal={() => setOpenUpdate(false)}
            getData={getData}
            defaultData={studentSelected}
          />
        </Popup>
      </div>
      <div className="bg-white rounded-lg p-5">
        <Input
          placeholder="Tìm kiếm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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
        title={'Bạn muốn xoá mã khuyến mãi này?'}
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

export default Promotion;
