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
import { useState } from 'react';
import Table from '@/components/table/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { connection } from '@/helper/connection';
import api from '@/api';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/table/pagination';
import Input from '@/components/base/Input';
import AddDayoff from '@/components/AddDayoff';
import AddLevel from '@/components/AddLevel';

const Level = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('title', {
      header: () => <span>Tên</span>,
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

  const getData = async () => {
    try {
      const query = {
        pageNumber: pageNumber,
        keyword: searchText,
        field: 'title',
        pageSize: pageSize,
      };
      const res = await api.functional.level.query.getQuery(connection, query);
      if (res.data) {
        setTableData(res.data.result);
        setTotal(res.data.total);
        setTotalPage(Math.ceil(res.data.total / pageSize));
      }
    } catch (err) {
      console.log(err);
      toast.error('Tải danh sách trình độ thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['level', pageNumber, searchText, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.functional.dayoff.remove(connection, id),
    onSuccess: () => {
      toast.success('Xoá trình độ thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá trình độ thất bại');
    },
  });

  const onDelete = (id: string) => {
    setOpenDelete(id);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách trình độ
        </div>
        <div className="flex gap-2">
          <DarkBlueButton
            className="px-4 py-2 w-auto mb-5"
            onClick={() => setOpenAdd((o) => !o)}
          >
            <div className="flex">
              <PlusSmIcon className="text-white w-6 h-6" />
              Thêm trình độ
            </div>
          </DarkBlueButton>
        </div>
        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Thêm trình độ
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddLevel closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật trình độ
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddLevel
            closeModal={() => setOpenUpdate(false)}
            getData={getData}
            defaultData={studentSelected}
          />
        </Popup>
      </div>
      <div className="bg-white rounded-lg p-5">
        <Input
          className="w-full"
          placeholder="Tìm kiếm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Table data={tableData} columns={columns} />
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
        title={'Bạn muốn xoá lịch nghỉ này?'}
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

export default Level;
