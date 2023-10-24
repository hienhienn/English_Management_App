'use client';

import api from '@/api';
import {
  DarkBlueButton,
  WhiteBlueButton,
  WhiteRedButton,
} from '@/components/base/Button';
import DatePickerField from '@/components/base/DatePicker/DatePicker';
import SelectBox from '@/components/base/SelectBox';
import SelectBoxKeyValue from '@/components/base/SelectBoxKeyValue';
import TextField from '@/components/base/TextField';
import { connection } from '@/helper/connection';
import {
  ListLearningState,
  ListLearningType,
  ListPaymentState,
  Tab,
} from '@/model/dictionary';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import '../../../../src/components/base/DatePicker/DatePicker.css';
import { FaAngleDown } from 'react-icons/fa';
import clsx from 'clsx';
import ReactToPrint from 'react-to-print';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const Student = () => {
  const pathname = usePathname();
  const id = pathname.split('/')[3];
  const router = useRouter();
  const studentType = [
    { key: Tab.POTENTIAL, value: 'Học viên tiềm năng' },
    { key: Tab.OFFICIAL, value: 'Học viên chính thức' },
    { key: Tab.OLD, value: 'Học viên cũ' },
  ];
  const dict = {
    [Tab.POTENTIAL]: 'Học viên tiềm năng',
    [Tab.OFFICIAL]: 'Học viên chính thức',
    [Tab.OLD]: 'Học viên cũ',
  };

  const [listState, setListState] = useState([]);
  const [listStudyGoal, setListStudyGoal] = useState([]);
  const [listResult, setListResult] = useState([]);
  const [studentInfo, setStudentInfo] = useState<any>({});
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState<any>({});
  const [openInfo, setOpenInfo] = useState(true);
  const [openReport, setOpenReport] = useState(true);
  const [dayArray, setDayArray] = useState<Array<string>>([]);
  const [attendanceArray, setAttendanceArray] = useState<any>([[]]);
  const componentRef = useRef(null);
  const [openDelete, setOpenDelete] = useState(false);

  const StudentSchema = yup.object().shape({
    fullname: yup.string().required('Bạn chưa nhập họ tên'),
    phoneNumber: yup
      .string()
      .min(10, 'Độ dài 10 số')
      .max(10, 'Độ dài 10 số')
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Sai định dạng số điện thoại'),
    paymentState: yup.string(),
    learningType: yup.string(),
    learningState: yup.string(),
    state: yup.string().required('Bạn chưa chọn trạng thái'),
    studyGoal: yup.string(),
    note: yup.string(),
    type: yup.object().required('Bạn chưa chọn loại'),
    result: yup.string(),
    reCallTime: yup.date(),
    parents: yup.array().of(
      yup.object().shape({
        fullName: yup.string().required('Bạn chưa nhập tên'),
        email: yup.string().email('Email không hợp lệ'),
        phoneNumber: yup
          .string()
          .min(10, 'Độ dài 10 số')
          .max(10, 'Độ dài 10 số')
          .matches(
            /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
            'Sai định dạng số điện thoại',
          ),
        relation: yup.string(),
      }),
    ),
  });

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(StudentSchema) });
  const parentsForm = useFieldArray({ control, name: 'parents' });

  useQuery({
    queryKey: ['listStudyGoal'],
    queryFn: async () => {
      try {
        const res = await api.functional.study_goal.active.findAllActive(
          connection,
        );
        if (res.data) setListStudyGoal(res.data.map((t: any) => t.title));
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách lựa chọn thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['listState'],
    queryFn: async () => {
      try {
        const res = await api.functional.student_state.active.findAllActive(
          connection,
        );

        if (res.data) setListState(res.data.map((t: any) => t.title));
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách lựa chọn thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['listResult'],
    queryFn: async () => {
      try {
        const res = await api.functional.advisement_result.active.findAllActive(
          connection,
        );

        if (res.data) setListResult(res.data.map((t: any) => t.title));
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách lựa chọn thất bại');
      }
      return 1;
    },
  });

  const getData = async () => {
    if (id === 'add-student') return 0;
    try {
      const res = await api.functional.student.getOne(connection, id);
      if (res.data) {
        setStudentInfo(res.data);
      } else toast.error('Học sinh không tồn tại');
    } catch (err) {
      toast.error('Học sinh không tồn tại');
      console.log(err);
    }
    return 1;
  };

  useQuery({
    queryKey: ['getStudent'],
    queryFn: getData,
  });

  const setDefaultData = () => {
    reset({
      fullname: studentInfo.fullname || '',
      type:
        JSON.stringify(studentInfo) !== JSON.stringify({})
          ? { key: studentInfo.type, value: dict[studentInfo.type] }
          : { key: '', value: '' },
      learningState: studentInfo.learningState || '',
      learningType: studentInfo.learningType || '',
      note: studentInfo.note || '',
      paymentState: studentInfo.paymentState || '',
      phoneNumber: studentInfo.phoneNumber || '',
      reCallTime: studentInfo.reCallTime
        ? new Date(studentInfo.reCallTime)
        : undefined,
      result: studentInfo.result || '',
      state: studentInfo.state || '',
      studyGoal: studentInfo.studyGoal || '',
      parents: studentInfo.parents || [],
    });
  };

  useQuery({
    queryKey: ['getAttendance', startDate, endDate],
    queryFn: async () => {
      try {
        const query = {
          studentId: id,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        };
        const res =
          await api.functional.schedule.getAttendanceForStudent.getAttendance(
            connection,
            query,
          );
        if (res.data) {
          setReportData(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải thông tin báo cáo thất bại');
      }
      return 0;
    },
  });

  useEffect(() => {
    if (!reportData || reportData.length == 0) {
      setAttendanceArray([[]]);
      setDayArray([]);
      return;
    }
    let startEndArray = [];

    const x = new Date(startDate).getTime() + 7 * 60 * 60 * 1000;
    const startStr = `${new Date(x).toISOString().split('T')[0]}T00:00:00.000Z`;
    const start = new Date(startStr);

    const y = new Date(endDate).getTime() + 7 * 60 * 60 * 1000;
    const endStr = `${new Date(y).toISOString().split('T')[0]}T00:00:00.000Z`;
    const end = new Date(endStr);

    for (
      let i = start.getTime();
      i <= end.getTime();
      i = i + 24 * 60 * 60 * 1000
    ) {
      startEndArray.push(new Date(i).toISOString());
    }

    for (let j = 1; j <= start.getDay(); j++) {
      startEndArray = [
        new Date(start.getTime() - j * 24 * 60 * 60 * 1000).toISOString(),
        ...startEndArray,
      ];
    }
    let a: any = [];
    let b: any = [];
    let reportIndex = 0;
    for (let i = 0; i < startEndArray.length; ) {
      let m = Math.ceil(i / 7);
      a.push([]);
      if (i + 6 <= startEndArray.length) {
        b.push(
          `${new Date(startEndArray[i]).toLocaleDateString()} - ${new Date(
            startEndArray[i + 6],
          ).toLocaleDateString()}`,
        );
      } else
        b.push(
          `${new Date(
            startEndArray[i],
          ).toLocaleDateString()} - ${end.toLocaleDateString()}`,
        );
      for (let j = 0; j < 7; j++) {
        if (startEndArray[i] === reportData[reportIndex]?.date) {
          if (reportData[reportIndex]?.attendance) a[m].push('H');
          else a[m].push('N');
          reportIndex++;
        } else {
          if (i >= start.getDay()) a[m].push('');
          else a[m].push('x');
        }
        i++;
      }
    }
    setAttendanceArray(a);
    setDayArray(b);
  }, [reportData]);

  useEffect(() => setDefaultData(), [studentInfo]);

  const addMutation = useMutation({
    mutationFn: (data: any) => api.functional.student.create(connection, data),
    onSuccess: (data: any) => {
      toast.success('Thêm học viên thành công');
      router.replace(data.data.id);
    },
    onError: () => {
      toast.error('Thêm học viên thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      api.functional.student.updateStudent(connection, id, data),
    onSuccess: () => {
      toast.success('Cập nhật học viên thành công');
    },
    onError: () => {
      toast.error('Cập nhật học viên thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.functional.student.deleteStudent(connection, id),
    onSuccess: () => {
      setOpenDelete(false);
      toast.success('Xoá học viên thành công');
      router.back();
    },
    onError: () => {
      setOpenDelete(false);
      toast.error('Xoá học viên thất bại');
    },
  });

  const onSubmitInfo = (data: any) => {
    let params = {};

    for (const key in data) {
      if (!!data[key] && data[key] !== '---') {
        if (key === 'reCallTime') {
          params = { ...params, reCallTime: data.reCallTime.toISOString() };
          // continue;
        } else if (key === 'type') {
          params = { ...params, type: data.type.key };
          // continue;
        } else params = { ...params, [key]: data[key] };
      }
    }
    if (id === 'add-student') addMutation.mutate(params);
    else updateMutation.mutate(params);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Chi tiết học sinh
        </div>
        <div className="flex gap-2">
          <WhiteBlueButton
            className="px-4 py-2 w-auto mb-5"
            onClick={() => router.back()}
          >
            Quay lại
          </WhiteBlueButton>
          <WhiteRedButton
            className="px-4 py-2 w-auto mb-5"
            onClick={() => setOpenDelete(true)}
          >
            Xoá học viên
          </WhiteRedButton>
        </div>
      </div>

      <div
        className={clsx('bg-white w-full rounded-lg px-8 py-6 mt-2 gap-4 grid')}
      >
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setOpenInfo((o) => !o)}
        >
          <div className="items-center leading-8 text-[18px] font-semibold">
            Thông tin cá nhân
          </div>
          <FaAngleDown
            className={clsx(
              openInfo
                ? '-rotate-180 transform duration-300 '
                : 'duration-300 transform',
              'h-5',
              'w-5',
            )}
          />
        </div>
        <div className={clsx(openInfo ? 'grid' : 'hidden')}>
          <div className="grid large:grid-cols-2 gap-x-8 gap-y-4">
            <TextField
              register={{ ...register('fullname') }}
              helperText={errors?.fullname?.message}
              label={'Họ tên'}
              width="150px"
              required={true}
            />
            <div>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <SelectBoxKeyValue
                    items={studentType}
                    selected={field.value}
                    setSelected={(e: any) => field.onChange(e)}
                    title={'Loại'}
                    required={true}
                    width="150px"
                    helperText={errors?.type?.message}
                  />
                )}
              />
            </div>
            <TextField
              register={{ ...register('phoneNumber') }}
              helperText={errors?.phoneNumber?.message}
              label={'Số điện thoại'}
              required={true}
              width="150px"
            />
            <div>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <SelectBox
                    items={listState}
                    selected={field.value}
                    setSelected={(e: string) => field.onChange(e)}
                    title={'Trạng thái'}
                    width="150px"
                    required={true}
                    helperText={errors?.state?.message}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="paymentState"
              render={({ field }) => (
                <SelectBox
                  items={ListPaymentState}
                  selected={field.value}
                  setSelected={(e: string) => field.onChange(e)}
                  title={'TT thanh toán'}
                  width="150px"
                  helperText={errors?.paymentState?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="learningType"
              render={({ field }) => (
                <SelectBox
                  items={ListLearningType}
                  selected={field.value}
                  setSelected={(e: string) => field.onChange(e)}
                  title={'Hình thức học'}
                  helperText={errors?.learningType?.message}
                  width="150px"
                />
              )}
            />
            <Controller
              control={control}
              name="learningState"
              render={({ field }) => (
                <SelectBox
                  items={ListLearningState}
                  selected={field.value}
                  setSelected={(e: string) => field.onChange(e)}
                  title={'TT khoá học'}
                  helperText={errors?.learningState?.message}
                  width="150px"
                />
              )}
            />
            <Controller
              control={control}
              name="studyGoal"
              render={({ field }) => (
                <SelectBox
                  items={listStudyGoal}
                  selected={field.value}
                  setSelected={(e: string) => field.onChange(e)}
                  title={'Mục đích học'}
                  helperText={errors?.studyGoal?.message}
                  width="150px"
                />
              )}
            />
            <Controller
              control={control}
              name="result"
              render={({ field }) => (
                <SelectBox
                  items={listResult}
                  selected={field.value}
                  setSelected={(e: string) => field.onChange(e)}
                  title={'Kết quả'}
                  width="150px"
                />
              )}
            />
            <Controller
              control={control}
              name="reCallTime"
              render={({ field }) => (
                <DatePickerField
                  selected={field.value}
                  onChange={(date: any) => field.onChange(date)}
                  label={'Thời gian gọi lại'}
                  width="150px"
                />
              )}
            />
            <TextField
              register={{ ...register('note') }}
              multiline
              label={'Ghi chú'}
              width="150px"
              className="col-span-2"
            />
          </div>

          <div className="flex justify-start gap-2 my-5">
            <div className="items-center leading-8 text-[18px] font-semibold">
              Thông tin người liên hệ
            </div>
            <PlusIcon
              className="w-5 h-5 my-auto font-bold stroke-width-[4px] text-blue-800 cursor-pointer "
              onClick={() => {
                parentsForm.append({ fullName: '' });
              }}
              data-tooltip-content="Thêm"
              data-tooltip-id="right-tooltip"
            />
          </div>
          {parentsForm.fields.map((item, index) => {
            return (
              <div key={item.id} className="flex w-full gap-6">
                <TextField
                  width={'auto'}
                  register={{ ...register(`parents.${index}.fullName`) }}
                  label={'Họ tên'}
                  helperText={errors?.parents?.[`${index}`]?.fullName?.message}
                  required
                />
                <TextField
                  width={'auto'}
                  register={{ ...register(`parents.${index}.phoneNumber`) }}
                  label={'Số điện thoại'}
                  helperText={
                    errors?.parents?.[`${index}`]?.phoneNumber?.message
                  }
                  required
                />
                <TextField
                  width={'auto'}
                  register={{ ...register(`parents.${index}.relation`) }}
                  label={'Mối quan hệ'}
                />
                <TextField
                  width={'auto'}
                  register={{ ...register(`parents.${index}.email`) }}
                  label={'Email'}
                  helperText={errors?.parents?.[`${index}`]?.email?.message}
                />
                <WhiteRedButton
                  className="w-10 h-10 my-auto p-2 delete-btn"
                  onClick={() => parentsForm.remove(index)}
                >
                  <TrashIcon className="text-red-600 h-4 w-4 m-auto" />
                </WhiteRedButton>
              </div>
            );
          })}
          <div className="flex justify-end gap-2 my-5">
            <WhiteBlueButton onClick={setDefaultData}>Huỷ</WhiteBlueButton>
            <DarkBlueButton onClick={handleSubmit(onSubmitInfo)}>
              Lưu
            </DarkBlueButton>
          </div>
        </div>
      </div>
      {!(id === 'add-student') && (
        <div className="bg-white w-full rounded-lg px-8 py-6 gap-4 grid mt-5">
          <div
            className="flex justify-between cursor-pointer"
            onClick={() => setOpenReport((o) => !o)}
          >
            <div className="items-center leading-8 text-[18px] font-semibold">
              Báo cáo học tập
            </div>
            <FaAngleDown
              className={clsx(
                openReport
                  ? '-rotate-180 transform duration-300 '
                  : 'duration-300 transform',
                'h-5',
                'w-5',
              )}
            />
          </div>
          <div className={clsx(openReport ? 'grid gap-4' : 'hidden')}>
            <div className="gap-10 flex mb-5 w-full">
              <div className="w-full">
                <DatePickerField
                  label="Ngày bắt đầu"
                  hasTimeInput={false}
                  width="auto"
                  selected={startDate}
                  onChange={(date: any) => setStartDate(date || new Date())}
                  maxDate={endDate}
                />
              </div>
              <div className="w-full">
                <DatePickerField
                  label="Ngày kết thúc"
                  hasTimeInput={false}
                  width="auto"
                  selected={endDate}
                  onChange={(date: any) => setEndDate(date || new Date())}
                  minDate={startDate}
                  maxDate={new Date()}
                />
              </div>
            </div>
            {reportData && reportData.length > 0 ? (
              <table>
                <tr>
                  <td className="border border-1 border-gray-500"></td>
                  <th className="border border-1 border-gray-500">CN</th>
                  <th className="border border-1 border-gray-500">T2</th>
                  <th className="border border-1 border-gray-500">T3</th>
                  <th className="border border-1 border-gray-500">T4</th>
                  <th className="border border-1 border-gray-500">T5</th>
                  <th className="border border-1 border-gray-500">T6</th>
                  <th className="border border-1 border-gray-500">T7</th>
                </tr>
                {dayArray?.map((e, i) => (
                  <tr key={i}>
                    <th
                      scope="row"
                      className="border border-1 border-gray-500 w-[200px]"
                    >
                      {e}
                    </th>
                    {attendanceArray[i].map((it: string, id: number) => (
                      <td
                        key={id}
                        className={clsx(
                          'border border-1 border-gray-500 text-center',
                          it === 'H' ? 'bg-green-300' : '',
                          it === 'N' ? 'bg-red-300' : '',
                          it === 'x' ? 'bg-gray-300' : '',
                        )}
                      >
                        {it === 'x' ? '' : it}
                      </td>
                    ))}
                  </tr>
                ))}
              </table>
            ) : (
              <i>Không có dữ liệu để hiển thị </i>
            )}
            <div className="hidden">
              <div
                className="h-[100vh] w-full  bg-white p-10"
                ref={componentRef}
              >
                <div className="w-full h-fit gap-2 grid">
                  <p className="text-center font-bold text-[20px]">
                    BÁO CÁO HỌC TẬP
                  </p>
                  <p>
                    <span className="font-semibold">Họ tên: </span>
                    {studentInfo.fullname}
                  </p>
                  <p>
                    <span className="font-semibold">Lớp: </span>
                    {reportData[0]?.class}
                  </p>
                  <p>
                    <span className="font-semibold">Từ ngày: </span>
                    {new Date(startDate).toLocaleDateString()} -{' '}
                    <span className="font-semibold">Đến ngày: </span>
                    {new Date(endDate).toLocaleDateString()}
                  </p>

                  <table className="w-full">
                    <tr>
                      <td className="border border-1 border-gray-500"></td>
                      <th className="border border-1 border-gray-500">CN</th>
                      <th className="border border-1 border-gray-500">T2</th>
                      <th className="border border-1 border-gray-500">T3</th>
                      <th className="border border-1 border-gray-500">T4</th>
                      <th className="border border-1 border-gray-500">T5</th>
                      <th className="border border-1 border-gray-500">T6</th>
                      <th className="border border-1 border-gray-500">T7</th>
                    </tr>
                    {/* {dayArray.map(e)} */}
                    {dayArray?.map((e, i) => (
                      <tr key={i}>
                        <th
                          scope="row"
                          className="border border-1 border-gray-500 w-[100px]"
                        >
                          {e}
                        </th>
                        {attendanceArray[i].map((it: string, id: number) => (
                          <td
                            key={id}
                            className={clsx(
                              'border border-1 border-gray-500 text-center',
                              it === 'H' ? 'bg-green-300' : '',
                              it === 'N' ? 'bg-red-300' : '',
                              it === 'x' ? 'bg-gray-300' : '',
                            )}
                          >
                            {it === 'x' ? '' : it}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>

            {reportData && reportData.length > 0 && (
              <div className="flex justify-end gap-2 my-5">
                <ReactToPrint
                  content={() => componentRef.current}
                  trigger={() => <DarkBlueButton>In</DarkBlueButton>}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={openDelete}
        title={'Bạn muốn xoá học viên này?'}
        onClickNo={() => {
          setOpenDelete(false);
        }}
        onClickYes={() => {
          deleteMutation.mutate();
          setOpenDelete(false);
        }}
      />
    </div>
  );
};

export default Student;
