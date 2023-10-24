'use client';

import {
  PencilIcon,
  PlusSmIcon,
  PrinterIcon,
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
import { useEffect, useRef, useState } from 'react';
import Table from '@/components/table/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Subject, Subscription } from 'rxjs';
import { connection } from '@/helper/connection';
import api from '@/api';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SearchBar from '@/components/table/searchBar';
import Pagination from '@/components/table/pagination';
import ColumnSelect from '@/components/common/ColumnSelect';
import AddFinancial from '@/components/AddFinancial';
import { PrintFinancial } from '@/components/PrintFinancial';
import ReactToPrint from 'react-to-print';

let subscription: Subscription;
let deleteSubject = new Subject<boolean>();

const ItemsFilter = [
  { key: 'all', value: 'Tất cả' },
  { key: 'code', value: 'Mã phiếu' },
  { key: 'type', value: 'Loại' },
  { key: 'paymentType', value: 'Hình thức thanh toán' },
  { key: 'description', value: 'Nội dung' },
];

const listColumn = [
  { key: 'code', value: 'Mã phiếu' },
  { key: 'type', value: 'Loại', default: true },
  { key: 'student', value: 'Họ tên', default: true },
  { key: 'paymentType', value: 'HT thanh toán' },
  { key: 'description', value: 'Nội dung', default: true },
  { key: 'isPaid', value: 'Đã thanh toán' },
  { key: 'user', value: 'Người thu/chi' },
  { key: 'isValidate', value: 'Xác nhận' },
  { key: 'amountOfMoney', value: 'Số tiền', default: true },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];

const Financial = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('code', {
      header: () => <span>Mã phiếu</span>,
      size: 1000,
    }),
    columnHelper.accessor('type', {
      header: () => <span>Loại</span>,
      size: 1000,
    }),
    columnHelper.accessor('student', {
      header: () => <span>Họ tên</span>,
      cell: (info) => <span>{info.getValue().fullname}</span>,
      size: 1000,
    }),
    columnHelper.accessor('paymentType', {
      header: () => <span>HT thanh toán</span>,
      size: 1000,
    }),
    columnHelper.accessor('description', {
      header: () => <span>Nội dung</span>,
      size: 1000,
    }),
    columnHelper.accessor('isPaid', {
      header: () => <span>Đã thanh toán</span>,
      cell: (info) => (
        <span>{info.getValue() ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
      ),
      size: 1000,
    }),
    columnHelper.accessor('user', {
      header: () => <span>Người thu/chi</span>,
      cell: (info) => <span>{info.getValue().username}</span>,
      size: 1000,
    }),
    columnHelper.accessor('isValidate', {
      header: () => <span>Xác nhận</span>,
      cell: (info) => (
        <span>{info.getValue() ? 'Đã xác nhận' : 'Chưa xác nhận'}</span>
      ),
      size: 1000,
    }),
    columnHelper.accessor('amountOfMoney', {
      header: () => <span>Số tiền</span>,
      cell: (info) => (
        <span>
          {info.getValue().toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}
        </span>
      ),
      size: 1000,
    }),
    columnHelper.accessor('action', {
      header: () => <div className="text-center">Hành động</div>,
      enableSorting: false,
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <ReactToPrint
            // onBeforeGetContent={() => setStudentSelected(info.row.original)}
            content={() => componentRef.current}
            trigger={() => (
              <WhiteBlueButton
                className="w-auto p-2 print-btn"
                onMouseOver={() => setStudentSelected(info.row.original)}
              >
                <PrinterIcon className="h-4 w-4" />
              </WhiteBlueButton>
            )}
          />
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
  const [studentSelected, setStudentSelected] = useState<any>({});
  const [displayColumns, setDisplayedColumns] = useState<Array<any>>(
    listColumn.filter((t: any) => t.default).map((t: any) => t.key),
  );
  const [tableColumns, setTableColumns] = useState<Array<any>>([]);
  const componentRef = useRef(null);
  // const [openPrint, setOpentPrint] = useState(false);

  const getData = async () => {
    try {
      const query = {
        pageNumber: pageNumber,
        keyword: searchText,
        field: typeFilter.key,
        pageSize: pageSize,
      };
      const res = await api.functional.financial_management.query.queryRecord(
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
      toast.error('Tải danh sách thu/chi thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['financial', pageNumber, searchText, typeFilter, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.financial_management.remove(connection, id),
    onSuccess: () => {
      toast.success('Xoá phiếu thu chi thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá phiếu thu chi thất bại');
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
          Danh sách thu/chi
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
              Tạo phiếu thu/chi
            </div>
          </DarkBlueButton>
        </div>
        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Tạo phiếu thu/chi
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddFinancial closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật phiếu thu/chi
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddFinancial
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
      {/* <Popup
        contentStyle={{ width: '70%' }}
        open={openPrint}
        closeOnDocumentClick={true}
        onClose={() => setOpentPrint(false)}
      >
        <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
          In phiếu thu/chi
          <XIcon
            className="w-6 h-6 text-gray-700"
            onClick={() => setOpentPrint(false)}
          />
        </div>
        <PrintFinancial ref={componentRef} code={studentSelected?.code} /> 
        <div>
          <div className="flex gap-2 p-6 pt-0 justify-end">
            <WhiteBlueButton
              className="w-[100px]"
              onClick={() => setOpentPrint(false)}
            >
              <div className="flex items-center w-full justify-center">
                Quay lại
              </div>
            </WhiteBlueButton>
          </div>
        </div>
      </Popup> */}
      <div className="hidden">
        <PrintFinancial ref={componentRef} data={studentSelected} />
      </div>
    </div>
  );
};

export default Financial;
