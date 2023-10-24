'use client';

import api from '@/api';
import { connection } from '@/helper/connection';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/table/table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DarkBlueButton, WhiteBlueButton } from '@/components/base/Button';
import { PlusIcon, XIcon } from '@heroicons/react/outline';
import { Menu } from '@headlessui/react';
import { ClassContext } from '@/context/ClassContext';
import { Controller, useForm } from 'react-hook-form';
import DatePickerField from '@/components/base/DatePicker/DatePicker';
import SelectBox from '@/components/base/SelectBox';
import SelectBoxKeyValue from '@/components/base/SelectBoxKeyValue';
import TextField from '@/components/base/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ListClassState } from '@/model/dictionary';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import clsx from 'clsx';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split('/')[3];
  const {
    data,
    setData,
    students,
    setStudents,
    loaded,
    setLoaded,
    bfData,
    setBfData,
    listLevel,
    setListLevel,
  } = useContext(ClassContext);
  const [listSelected, setListSelected] = useState<any>([]);

  const columnHelper = createColumnHelper<any>();

  const tableColumns: ColumnDef<any, any>[] = [
    columnHelper.accessor('fullname', {
      header: () => <span>Họ tên</span>,
      size: 1000,
    }),
    columnHelper.accessor('phoneNumber', {
      header: () => <span>Số điện thoại</span>,
      size: 1000,
    }),
    // columnHelper.accessor('payment', {
    //   header: () => <span>Trạng thái thanh toán</span>,
    //   cell: (info) => (
    //     <>
    //       {info.row.original.payment ? (
    //         <div>Đã thanh toán</div>
    //       ) : (
    //         <div className="flex">
    //           Chưa thanh toán{' '}
    //           <CheckCircleIcon
    //             onClick={() =>
    //               paymentMutation.mutate([info.row.original.studentId])
    //             }
    //             className="w-4 h-4 translate-y-1 ml-2 text-blue-800"
    //             data-tooltip-content="Thanh toán"
    //             data-tooltip-id="right-tooltip"
    //           />
    //         </div>
    //       )}
    //     </>
    //   ),
    //   size: 1000,
    // }),
    columnHelper.accessor('action', {
      header: () => <span></span>,
      enableSorting: false,
      cell: (info) => (
        <XIcon
          className={clsx(
            'w-4 h-4 translate-y-1 ml-2  delete-btn outline-none',
            'text-red-600',
          )}
          data-tooltip-content="Xoá khỏi lớp"
          onClick={() => {
            setStudents(
              students.filter(
                (e: any) => e.studentId !== info.row.original.studentId,
              ),
            );
          }}
        />
      ),
      size: 80,
    }),
  ];

  const ClassSchema = yup.object().shape({
    courseTitle: yup.string().required('Bạn chưa nhập tên lớp học'),
    office: yup.string().required('Bạn chưa chọn cơ sở'),
    state: yup.string().required('Bạn chưa chọn trạng thái lớp học'),
    teacherId: yup.object().required('Bạn chưa chọn giáo viên'),
    courseId: yup.object().required('Bạn chưa chọn khoá học'),
    level: yup.string(),
    startDate: yup.date().required('Bạn chưa nhập ngày bắt đầu'),
    endDate: yup.date().required('Bạn chưa nhập ngày kết thúc'),
  });

  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ClassSchema),
    defaultValues: {
      teacherId: { key: '', value: '' },
      courseId: { key: '', value: '' },
      office: '',
      level: '',
      state: '',
    },
  });
  const [listOffice, setListOffice] = useState([]);
  const [listTeacher, setListTeacher] = useState([]);
  const [listCourse, setListCourse] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  const getData = async () => {
    if (loaded || id === 'add-class') return 0;
    try {
      const id = pathname.split('/')[3];
      const res = await api.functional.$class.getClass(connection, id);
      if (res.data) {
        setData(res.data);
        setBfData(res.data);
        if (res.data.students && res.data.students.length > 0)
          setStudents(res.data.students);
      } else toast.error('Lớp học không tồn tại');
    } catch (err) {
      toast.error('Tải thông tin lớp học thất bại');
      console.log(err);
    }
    setLoaded(true);
    return 1;
  };

  const saveFormValue = () => {
    const form: any = getValues();
    setData({
      ...form,
      teacher: {
        id: form.teacherId?.key || '',
        fullname: form.teacherId?.value || '',
      },
      course: {
        id: form.courseId?.key || '',
        courseTitle: form.courseId?.value || '',
        level: listLevel,
      },
    });
  };

  useEffect(() => {
    setValue('courseTitle', data.courseTitle || '');
    setValue('office', data.office || '');
    setValue('state', data.state || '');
    setValue(
      'teacherId',
      !!data.teacher
        ? {
            key: data.teacher.id,
            value: data.teacher.fullname,
          }
        : { key: '', value: '' },
    );
    setValue(
      'courseId',
      !!data.course
        ? {
            key: data.course.id,
            value: data.course.courseTitle,
            level: data.course.level,
          }
        : { key: '', value: '' },
    );
    setValue('level', data.level || '');
    setValue(
      'startDate',
      data.startDate ? new Date(data.startDate) : new Date(),
    );
    setValue('endDate', data.endDate ? new Date(data.endDate) : new Date());

    if (data.course) setListLevel(data.course.level);
  }, [data]);

  useQuery({
    queryKey: ['listOffice'],
    queryFn: async () => {
      try {
        const res = await api.functional.setting.office.findAll(connection);
        if (res.data) setListOffice(res.data.map((t: any) => t.title));
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách cơ sở thất bại');
      }
      return 1;
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
          setListTeacher(res.data);
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

  useQuery({
    queryKey: ['detailClass'],
    queryFn: getData,
  });

  const updateMutation = useMutation({
    mutationFn: (params: any) =>
      api.functional.$class.updateClass(connection, id, params),
    onSuccess: () => {
      toast.success('Cập nhật lớp học thành công');
    },
    onError: () => {
      toast.error('Cập nhật lớp học thất bại');
    },
  });

  const addMutation = useMutation({
    mutationFn: (params: any) =>
      api.functional.$class.create(connection, params),
    onSuccess: (data: any) => {
      router.replace(data.data.id);
      toast.success('Thêm lớp học thành công');
    },
    onError: () => {
      toast.error('Thêm lớp học thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.functional.$class.deleteClass(connection, id),
    onSuccess: () => {
      setOpenDelete(false);
      toast.success('Xoá lớp học thành công');
      router.back();
    },
    onError: () => {
      setOpenDelete(false);
      toast.error('Xoá lớp học thất bại');
    },
  });

  const update = async (studentId: string) => {
    await api.functional.student.payment(connection, {
      studentId: studentId,
      paymentType: '',
      classId: id,
    });
  };

  const paymentMutation = useMutation({
    mutationFn: async (studentIds: any) => {
      const tmp = students.map((s: any) =>
        studentIds.includes(s.studentId) ? { ...s, payment: true } : s,
      );
      setStudents(tmp);
      for (let i of studentIds) await update(i);
    },
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thanh toán thành công');
      getData();
    },
    onError: () => {
      toast.error('Cập nhật trạng thái thanh toán thất bại');
      getData();
    },
  });

  const onSave = () => {
    const form: any = getValues();
    let params = {
      ...form,
      students: students,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      courseId: form.courseId.key,
      teacherId: form.teacherId.key,
    };
    if (data.level && !listLevel.includes(data.level)) {
      toast.error('Trình độ không hợp lệ');
      return;
    }
    if (new Date(data.startDate) > new Date(data.endDate)) {
      toast.error('Lịch học không hợp lệ');
      return;
    }
    console.log(params);
    if (id === 'add-class') addMutation.mutate(params);
    else updateMutation.mutate(params);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px]">
          <span className=" font-semibold">Chi tiết lớp học</span>
        </div>
        <WhiteBlueButton
          className="px-4 py-2 w-auto mb-5"
          onClick={() => router.back()}
        >
          Quay lại
        </WhiteBlueButton>
      </div>
      <div className="bg-white w-full rounded-lg px-8 py-6 mt-2">
        <div className="items-center leading-8 text-[18px] pb-2 font-semibold">
          Thông tin chung
        </div>
        <div className="pb-5">
          <div className="gap-y-4 grid large:grid-cols-2 gap-x-8">
            <div>
              <TextField
                register={{ ...register('courseTitle') }}
                helperText={errors?.courseTitle?.message}
                label={'Tên'}
                required={true}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="office"
                render={({ field }) => (
                  <SelectBox
                    items={listOffice}
                    selected={field.value}
                    setSelected={(e: string) => field.onChange(e)}
                    title={'Cơ sở'}
                    required={true}
                    helperText={errors?.office?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <SelectBox
                    items={ListClassState}
                    selected={field.value}
                    setSelected={(e: string) => field.onChange(e)}
                    title={'Trạng thái'}
                    required={true}
                    helperText={errors?.state?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="teacherId"
                render={({ field }) => (
                  <SelectBoxKeyValue
                    items={listTeacher?.map((t: any) => ({
                      key: t.id,
                      value: t.fullname,
                    }))}
                    selected={field.value}
                    setSelected={(e: string) => field.onChange(e)}
                    title={'Giáo viên'}
                    required={true}
                    helperText={errors?.teacherId?.message}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="courseId"
              render={({ field }) => (
                <SelectBoxKeyValue
                  items={listCourse?.map((t: any) => ({
                    key: t.id,
                    value: t.courseTitle,
                    level: t.level,
                  }))}
                  selected={field.value}
                  setSelected={(e: any) => {
                    setListLevel(e.level);
                    field.onChange(e);
                  }}
                  required={true}
                  helperText={errors?.courseId?.message}
                  title={'Khoá học'}
                />
              )}
            />
            <Controller
              control={control}
              name="level"
              render={({ field }) => (
                <SelectBox
                  items={listLevel}
                  selected={field.value}
                  setSelected={(e: any) => field.onChange(e)}
                  title={'Trình độ'}
                  helperText={errors?.level?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePickerField
                  selected={field.value}
                  onChange={(date: any) => field.onChange(date)}
                  label={'Ngày bắt đầu'}
                  hasTimeInput={false}
                  helperText={errors?.startDate?.message}
                  required={true}
                />
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePickerField
                  selected={field.value}
                  onChange={(date: any) => field.onChange(date)}
                  label={'Ngày kết thúc'}
                  hasTimeInput={false}
                  helperText={errors?.endDate?.message}
                  required={true}
                  minDate={getValues('startDate')}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-start gap-2">
          {(!listSelected || listSelected.length) == 0 && (
            <>
              <div className="items-center leading-8 text-[18px] py-2 font-semibold">
                Danh sách học sinh
              </div>
              <PlusIcon
                className={clsx(
                  'w-5 h-5 my-auto font-bold stroke-width-[4px] outline-none',
                  'text-blue-800 cursor-pointer',
                )}
                onClick={() => {
                  saveFormValue();
                  router.push(`/home/class/${id}/add-student`);
                }}
                data-tooltip-content="Thêm"
                data-tooltip-id="right-tooltip"
              />
            </>
          )}
          {listSelected && listSelected.length > 0 && (
            <>
              <div className="items-center leading-8 text-[18px] p-2">
                Đã chọn <b>{listSelected.length}</b> học sinh
              </div>
              <div className="flex gap-2">
                <WhiteBlueButton
                  className="px-4 py-2 w-auto mb-5"
                  onClick={() => setListSelected([])}
                >
                  Huỷ chọn
                </WhiteBlueButton>

                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button as={DarkBlueButton} className="px-4 py-2 w-auto">
                    Hành động
                  </Menu.Button>

                  <Menu.Items className="bg-white w-[200px] right-0 absolute mt-2 divide-y divide-gray-300 rounded-lg shadow-lg ring-2 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-1">
                      <Menu.Item>
                        <div
                          onClick={() => {
                            paymentMutation.mutate(listSelected);
                            setListSelected([]);
                          }}
                          className={clsx(
                            'cursor-pointer',
                            'hover:bg-gray-200',
                            'px-4 py-2',
                            'rounded-md',
                          )}
                        >
                          Thanh toán
                        </div>
                      </Menu.Item>
                      {/* <Menu.Item>
                        <div
                          onClick={() => mutation.mutate(listSelected)}
                          className={clsx(
                            'cursor-pointer',
                            'hover:bg-gray-200',
                            'px-4 py-2',
                            'rounded-md',
                          )}
                        >
                          Xoá khỏi lớp
                        </div>
                      </Menu.Item> */}
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </>
          )}
        </div>
        <Table data={students} columns={tableColumns} />
        <div className="flex justify-end gap-2 my-5 bg-white py-5 sticky bottom-0">
          <>
            <WhiteBlueButton
              onClick={() => {
                setData({ ...bfData });
                if (bfData.students && bfData.students.length > 0)
                  setStudents(bfData.students);
              }}
            >
              Huỷ
            </WhiteBlueButton>
            <DarkBlueButton onClick={handleSubmit(onSave)}>Lưu</DarkBlueButton>
          </>
          <ConfirmDialog
            open={openDelete}
            title={'Bạn muốn xoá lớp học này?'}
            onClickNo={() => {
              setOpenDelete(false);
            }}
            onClickYes={() => {
              deleteMutation.mutate();
              setOpenDelete(false);
            }}
          />
        </div>
      </div>
    </>
  );
}
