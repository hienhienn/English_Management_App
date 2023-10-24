'use client';

import { TrashIcon } from '@heroicons/react/outline';
import { WhiteRedButton } from '@/components/base/Button';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import Table from '@/components/table/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Subject, Subscription } from 'rxjs';
import { connection } from '@/helper/connection';
import api from '@/api';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/table/pagination';
import ColumnSelect from '@/components/common/ColumnSelect';
import StarRatingComponent from 'react-star-rating-component';
import Image from 'next/image';
import FilterMenu from '@/components/common/FilterMenu';

let subscription: Subscription;
let deleteSubject = new Subject<boolean>();

const listColumn = [
  { key: 'teacher', value: 'Giáo viên', fixed: true, default: true },
  { key: 'class', value: 'Lớp học', default: true },
  { key: 'classDate', value: 'Thời gian học' },
  { key: 'score', value: 'Điểm giáo viên', default: true },
  { key: 'reaction', value: 'Cảm xúc', default: true },
  { key: 'evaluation', value: 'Tiêu chí đánh giá' },
  { key: 'comment', value: 'Nhận xét', default: true },
  { key: 'student', value: 'Được tạo bởi' },
  { key: 'action', value: 'Hành động', fixed: true, default: true },
];

const CommentTeacher = () => {
  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
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
    columnHelper.accessor('class', {
      header: () => (
        <div>
          Lớp học{' '}
          <FilterMenu
            selected={choseFilter}
            setSelected={setChoseFilter}
            items={listClass.map((t: any) => ({
              key: t.id,
              value: t.courseTitle,
            }))}
            type="class"
            setPageNumber={setPageNumber}
          />
        </div>
      ),
      cell: (info) => <span>{info.row.original.class?.courseTitle}</span>,
      size: 1000,
    }),
    columnHelper.accessor('classDate', {
      header: () => <span>Thời gian học</span>,
      cell: (info) => {
        if (info.row.original.classDate) {
          const time = new Date(info.row.original.classDate);
          return <span>{new Date(time).toLocaleDateString('vi')}</span>;
        }
      },
      size: 1000,
    }),
    columnHelper.accessor('score', {
      header: () => <span>Điểm giáo viên</span>,
      cell: (info) => (
        <div className="min-w-[120px]">
          <StarRatingComponent
            name={info.row.original.teacher}
            editing={false}
            value={info.row.original.score}
            emptyStarColor="#d1d5db"
            renderStarIcon={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          />
        </div>
      ),
      size: 1000,
    }),
    columnHelper.accessor('reaction', {
      header: () => <div className="text-center">Cảm xúc</div>,
      cell: (info) => (
        <Image
          src={`/react/${info.row.original.reaction}.png`}
          width={40}
          height={40}
          alt={info.row.original.reaction}
          className="m-auto"
        />
      ),
      size: 500,
    }),
    columnHelper.accessor('evaluation', {
      header: () => <span>Tiêu chí đánh giá</span>,
      size: 1000,
    }),
    columnHelper.accessor('comment', {
      header: () => <span>Nhận xét</span>,
      size: 1000,
    }),
    columnHelper.accessor('student', {
      header: () => (
        <div>
          Được tạo bởi{' '}
          <FilterMenu
            selected={choseFilter}
            setSelected={setChoseFilter}
            items={listStudent.map((t: any) => ({
              key: t.id,
              value: t.fullname,
            }))}
            type="student"
            setPageNumber={setPageNumber}
            position="right"
          />
        </div>
      ),
      cell: (info) => <span>{info.row.original.student?.fullname}</span>,
      size: 1000,
    }),
    columnHelper.accessor('action', {
      header: () => <span>Hành động</span>,
      enableSorting: false,
      cell: (info) => (
        <div className="flex gap-2 justify-center">
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
  const [openDelete, setOpenDelete] = useState(false);
  const [displayColumns, setDisplayedColumns] = useState<Array<any>>(
    listColumn.filter((t: any) => t.default).map((t: any) => t.key),
  );
  const [tableColumns, setTableColumns] = useState<Array<any>>([]);
  const [choseFilter, setChoseFilter] = useState<any>({});
  const [listTeacher, setListTeacher] = useState([]);
  const [listClass, setListClass] = useState([]);
  const [listStudent, setListStudent] = useState([]);

  const getData = async () => {
    try {
      const query = {
        pageNumber: pageNumber,
        id: choseFilter.key || '',
        type: choseFilter.type || 'teacher',
      };
      const res =
        await api.functional.comment.query.teacher.getTeacherCommentWithQuery(
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
      toast.error('Tải danh sách đánh giá thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['comment-teacher', pageNumber, choseFilter, pageSize],
    queryFn: () => {
      if (!pageNumber) return;
      return getData();
    },
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
    queryKey: ['getClassAll'],
    queryFn: async () => {
      try {
        const res = await api.functional.$class.all.getAll(connection);
        if (res.data) {
          setListClass(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách lớp học thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['getStudentAll'],
    queryFn: async () => {
      try {
        const res = await api.functional.student.all.getAll(connection);
        if (res.data) {
          setListStudent(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách học sinh thất bại');
      }
      return 1;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.functional.comment.teacher.removeStudent(connection, id),
    onSuccess: () => {
      toast.success('Xoá đánh giá thành công');
      getData();
    },
    onError: () => {
      toast.error('Xoá đánh giá thất bại');
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
  }, [displayColumns, listClass, listStudent, listTeacher, choseFilter]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Danh sách đánh giá giáo viên
        </div>
        <div className="flex gap-2">
          <div>
            <ColumnSelect
              items={listColumn}
              selected={displayColumns}
              setSelected={setDisplayedColumns}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-5">
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
        title={'Bạn muốn xoá đánh giá này?'}
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

export default CommentTeacher;
