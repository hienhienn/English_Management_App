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
import AddDayOption from '@/components/AddDayOption';
import { toast } from 'react-toastify';

const StudyGoal = () => {
  const columnHelper = createColumnHelper<any>();
  const tableColumns: ColumnDef<any, any>[] = [
    columnHelper.accessor('title', {
      header: () => <span>Tên</span>,
      size: 1000,
    }),
    columnHelper.accessor('isActive', {
      header: () => <div className="text-center">Kích hoạt</div>,
      cell: (info) => (
        <div className="text-center">{info.getValue() ? 'Có' : 'Không'}</div>
      ),
      size: 300,
      maxSize: 300,
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
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selected, setSelected] = useState<any>({});

  const getData = async () => {
    let query = {
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    try {
      const res = await api.functional.day_option.findAll(connection, query);
      if (res.data) {
        setTableData(res.data.result);
        setTotal(res.data.total);
        setTotalPage(Math.ceil(res.data.total / pageSize));
      }
    } catch (err) {
      console.log(err);
      toast.error('Tải danh sách lựa chọn thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['studyGoal', pageNumber, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  return (
    <>
      <Popup open={openAdd} closeOnDocumentClick={false}>
        <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
          Thêm lựa chọn
          <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
        </div>
        <AddDayOption closeModal={closeModal} getData={getData} />
      </Popup>
      <Popup open={openUpdate} closeOnDocumentClick={false}>
        <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
          Cập nhật lựa chọn
          <XIcon
            className="w-6 h-6 text-gray-700"
            onClick={() => setOpenUpdate(false)}
          />
        </div>
        <AddDayOption
          closeModal={() => setOpenUpdate(false)}
          getData={getData}
          defaultData={selected}
        />
      </Popup>
      <div className="bg-white rounded-lg p-5 my-5">
        <div className="flex justify-end">
          <DarkBlueButton
            className="px-4 py-2 w-auto mb-5 f"
            onClick={() => setOpenAdd((o) => !o)}
          >
            <div className="flex">
              <PlusSmIcon className="text-white w-6 h-6" />
              Thêm lựa chọn
            </div>
          </DarkBlueButton>
        </div>

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

export default StudyGoal;
