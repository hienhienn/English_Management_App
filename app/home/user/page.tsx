'use client';

import { PencilIcon, PlusSmIcon, XIcon } from '@heroicons/react/outline';
import { DarkBlueButton, WhiteBlueButton } from '@/components/base/Button';
import { Popup } from 'reactjs-popup';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import Table from '@/components/table/table';
import { useQuery } from '@tanstack/react-query';
import { connection } from '@/helper/connection';
import api from '@/api';
import Pagination from '@/components/table/pagination';
import AddOffice from '@/components/AddOffice';
import Input from '@/components/base/Input';
import AddUser from '@/components/AddUser';
import { toast } from 'react-toastify';

const User = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('email', {
      header: () => <span>Email</span>,
      size: 1000,
    }),
    columnHelper.accessor('username', {
      header: () => <span>Tên người dùng</span>,
      size: 1000,
    }),
    columnHelper.accessor('isActive', {
      header: () => <span>Trạng thái</span>,
      cell: (info) => <span>{info.getValue() ? 'Kích hoạt' : 'Khoá'}</span>,
      size: 1000,
    }),
    columnHelper.accessor('role', {
      header: () => <span>Quyền</span>,
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
  const [searchText, setSearchText] = useState('');
  const [openUpdate, setOpenUpdate] = useState(false);
  const [studentSelected, setStudentSelected] = useState({});

  const getData = async () => {
    try {
      const query = {
        pageNumber: pageNumber,
        keyword: searchText,
        field: 'username',
        pageSize: pageSize,
      };
      const res = await api.functional.users.query.queryUser(connection, query);
      if (res.data) {
        setTableData(res.data.result);
        setTotal(res.data.total);
        setTotalPage(Math.ceil(res.data.total / pageSize));
      }
    } catch (err) {
      console.log(err);
      toast.error('Tải danh sách tài khoản thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['room', pageNumber, searchText, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  return (
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách tài khoản
        </div>
        <div className="flex gap-2">
          <DarkBlueButton
            className="px-4 py-2 w-auto mb-5"
            onClick={() => setOpenAdd((o) => !o)}
          >
            <div className="flex">
              <PlusSmIcon className="text-white w-6 h-6" />
              Thêm tài khoản
            </div>
          </DarkBlueButton>
        </div>
        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Thêm tài khoản
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddUser closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật tài khoản
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddUser
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
          onChange={(e: any) => setSearchText(e.target.value)}
          className="w-full"
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
    </div>
  );
};

export default User;
