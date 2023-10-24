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
import { Subject, Subscription } from 'rxjs';
import { connection } from '@/helper/connection';
import api from '@/api';
import AddCourse from '@/components/AddCourse';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/table/pagination';
import Input from '@/components/base/Input';
import Tag from '@/components/common/Tag';

let subscription: Subscription;
let deleteSubject = new Subject<boolean>();

const CourseTab = () => {
  const columnHelper = createColumnHelper<any>();
  const tableColumns: ColumnDef<any, any>[] = [
    columnHelper.accessor('courseTitle', {
      header: () => <span>Tên khoá học</span>,
      size: 1000,
    }),
    columnHelper.accessor('price', {
      header: () => <div>Học phí</div>,
      cell: (info) => (
        <div>
          {info.getValue().toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}
        </div>
      ),
      size: 1000,
    }),
    columnHelper.accessor('level', {
      header: () => <span>Trình độ</span>,
      cell: (info) => (
        <div className="flex gap-2">
          {info.getValue().map((t: any, id: any) => (
            <Tag text={t} key={id} />
          ))}
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

  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const closeModal = () => setOpenAdd(false);
  const [tableData, setTableData] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selected, setSelected] = useState({});

  const getData = async () => {
    let query = {
      pageNumber: pageNumber,
      keyword: searchText,
      field: 'courseTitle',
      pageSize: pageSize,
    };
    try {
      const res = await api.functional.course.list.getWithQuery(
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
      toast.error('Tải danh sách khoá học thất bại');
    }
    return 1;
  };

  const { isLoading } = useQuery({
    queryKey: ['room', pageNumber, searchText, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.course.deleteCourse(connection, id),
    onSuccess: () => {
      toast.success('Xoá khoá học thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá khoá học thất bại');
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

  return (
    <>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách khoá học
        </div>
        <DarkBlueButton
          className="px-4 py-2 w-auto mb-5"
          onClick={() => setOpenAdd((o) => !o)}
        >
          <div className="flex">
            <PlusSmIcon className="text-white w-6 h-6" />
            Thêm khoá học
          </div>
        </DarkBlueButton>
        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Thêm khoá học
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <AddCourse closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật khoá học
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <AddCourse
            closeModal={() => setOpenUpdate(false)}
            getData={getData}
            defaultData={selected}
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
        title={'Bạn muốn xoá khoá học này?'}
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

export default CourseTab;
