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
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { connection } from '@/helper/connection';
import api from '@/api';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Table from '@/components/table/table';
import SearchBar from '@/components/table/searchBar';
import Link from 'next/link';
import Pagination from '@/components/table/pagination';
import FilterMenu from '@/components/common/FilterMenu';
import ColumnSelect from '@/components/common/ColumnSelect';
import { useEventCallback } from 'rxjs-hooks';

const ItemsFilter = [
  { key: 'all', value: 'Tất cả' },
  { key: 'courseTitle', value: 'Tên lớp học' },
  { key: 'office', value: 'Cơ sở' },
];

const listColumn = [
  { key: 'courseTitle', value: 'Tên', fixed: true, default: true },
  { key: 'office', value: 'Cơ sở' },
  { key: 'state', value: 'Trạng thái', default: true },
  { key: 'teacher', value: 'Giáo viên' },
  { key: 'course', value: 'Khoá học', default: true },
  { key: 'level', value: 'Trình độ', default: true },
  { key: 'startDate', value: 'Ngày bắt đầu' },
  { key: 'endDate', value: 'Ngày kết thúc' },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];

const ClassTab = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('courseTitle', {
      header: () => <span>Tên</span>,
      cell: (info) => (
        <Link
          href={`/home/class/${info.row.original.id}`}
          className="underline text-blue-800"
        >
          {info.row.original.courseTitle}
        </Link>
      ),
      size: 1000,
    }),
    columnHelper.accessor('office', {
      header: () => <span>Cơ sở</span>,
      size: 1000,
    }),
    columnHelper.accessor('state', {
      header: () => <span>Trạng thái</span>,
      size: 1000,
    }),
    columnHelper.accessor('teacher', {
      header: () => (
        <div>
          Giáo viên{' '}
          <FilterMenu
            selected={choseFilter}
            setSelected={setChoseFilter}
            items={listTeacher.map((t: any) => ({
              key: t.id,
              value: t.fullname,
            }))}
            type="teacher"
            setPageNumber={setPageNumber}
          />
        </div>
      ),
      cell: (info) => <span>{info.row.original.teacher?.fullname}</span>,
      size: 1000,
    }),
    columnHelper.accessor('course', {
      header: () => (
        <div>
          Khoá học{' '}
          <FilterMenu
            selected={choseFilter}
            setSelected={setChoseFilter}
            items={listCourse.map((t: any) => ({
              key: t.id,
              value: t.courseTitle,
            }))}
            type="course"
            setPageNumber={setPageNumber}
          />
        </div>
      ),
      cell: (info) => <span>{info.row.original.course?.courseTitle}</span>,
      size: 1000,
    }),
    columnHelper.accessor('level', {
      header: () => <span>Trình độ</span>,
      size: 1000,
    }),
    columnHelper.accessor('startDate', {
      header: () => <span>Ngày bắt dầu</span>,
      cell: (info) => (
        <span>
          {info.row.original.startDate
            ? new Date(info.row.original.startDate).toLocaleDateString('vi')
            : ''}
        </span>
      ),
      size: 1000,
    }),
    columnHelper.accessor('endDate', {
      header: () => <span>Ngày kết thúc</span>,
      cell: (info) => (
        <span>
          {info.row.original.endDate
            ? new Date(info.row.original.endDate).toLocaleDateString('vi')
            : ''}
        </span>
      ),
      size: 1000,
    }),
    columnHelper.accessor('action', {
      header: () => <span>Hành động</span>,
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <Link href={`/home/class/${info.row.original.id}`}>
            <WhiteBlueButton className="w-auto p-2 edit-btn">
              <PencilIcon className="h-4 w-4" />
            </WhiteBlueButton>
          </Link>
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
  const [tableData, setTableData] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDelete, setOpenDelete] = useState('');
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState({ key: 'all', value: 'Tất cả' });
  const [choseFilter, setChoseFilter] = useState<any>({});
  const [listCourse, setListCourse] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [displayColumns, setDisplayedColumns] = useState<Array<any>>(
    listColumn.filter((t: any) => t.default).map((t: any) => t.key),
  );
  const [tableColumns, setTableColumns] = useState<Array<any>>([]);
  const [clickYesCallBack, id] = useEventCallback<string, string>(
    (event$) => event$,
    '',
  );

  useEffect(() => {
    if (id === '') return;
    deleteMutation.mutate(id);
  }, [id]);

  const getData = async () => {
    if (JSON.stringify(choseFilter) !== JSON.stringify({})) {
      try {
        const query = {
          id: choseFilter.key,
          pageNumber: pageNumber,
          type: choseFilter.type,
          pageSize: pageSize,
        };
        const res = await api.functional.$class.search.queryClassForTeacher(
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
        toast.error('Tải danh sách lớp học thất bại');
      }
      return 1;
    }
    try {
      const query = {
        pageNumber: pageNumber,
        keyword: searchText,
        field: typeFilter.key,
        pageSize: pageSize,
      };
      const res = await api.functional.$class.list.getWithQuery(
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
      toast.error('Tải danh sách lớp học thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: [
      'class',
      pageNumber,
      searchText,
      typeFilter,
      choseFilter,
      pageSize,
    ],
    queryFn: getData,
  });

  useQuery({
    queryKey: ['getTeacherAll'],
    queryFn: async () => {
      try {
        const res = await api.functional.employee.list.getWithQuery(
          connection,
          {
            field: 'all',
            keyword: '',
            role: 'TEACHER',
            pageNumber: 1,
            pageSize: 100,
          },
        );
        if (res.data) {
          setListTeacher(res.data.result);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách giáo viên thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['getCourseAll'],
    queryFn: async () => {
      try {
        const res = await api.functional.course.all.getAll(connection);
        if (res.data) {
          setListCourse(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách khoá học thất bại');
      }
      return 1;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.$class.deleteClass(connection, id),
    onSuccess: () => {
      toast.success('Xoá lớp học thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá lớp học thất bại');
    },
  });

  const onDelete = (id: string) => {
    setOpenDelete(id);
  };

  useEffect(() => {
    if (
      searchText === '' &&
      JSON.stringify(typeFilter) ===
        JSON.stringify({ key: 'all', value: 'Tất cả' })
    )
      return;
    setChoseFilter({});
  }, [searchText, typeFilter]);

  useEffect(() => {
    if (JSON.stringify(choseFilter) === JSON.stringify({})) return;
    setSearchText('');
    setTypeFilter({ key: 'all', value: 'Tất cả' });
  }, [choseFilter]);

  useEffect(() => {
    // setChoseFilter({});
    setTableColumns(
      columns.filter((t: any) => displayColumns.includes(t.accessorKey)),
    );
  }, [displayColumns, choseFilter, listCourse, listTeacher]);

  return (
    <>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách lớp học
        </div>
        <div className="flex gap-2">
          <div>
            <ColumnSelect
              items={listColumn}
              selected={displayColumns}
              setSelected={setDisplayedColumns}
            />
          </div>
          <Link href={'/home/class/add-class'}>
            <DarkBlueButton className="px-4 py-2 w-auto mb-5">
              <div className="flex">
                <PlusSmIcon className="text-white w-6 h-6" />
                Thêm lớp học
              </div>
            </DarkBlueButton>
          </Link>
        </div>
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
        open={!!openDelete}
        title={'Bạn muốn xoá lớp học này?'}
        onClickNo={() => {
          setOpenDelete('');
        }}
        onClickYes={() => {
          clickYesCallBack(openDelete);
          setOpenDelete('');
        }}
      />
    </>
  );
};

export default ClassTab;
