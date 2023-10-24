'use client';

import api from '@/api';
import {
  DarkBlueButton,
  WhiteBlueButton,
  WhiteRedButton,
} from '@/components/base/Button';
import DatePickerField from '@/components/base/DatePicker/DatePicker';
import MultiSelect from '@/components/base/MultiSelect';
import NumberInput from '@/components/base/NumberInput';
import SelectBox from '@/components/base/SelectBox';
import TextField from '@/components/base/TextField';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { connection } from '@/helper/connection';
import { ListPaymentState } from '@/model/dictionary';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const addCommas = (num: string) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const removeNonNumeric = (num: string) => {
  return num?.toString().replace(/[^0-9]/g, '');
};

const Tuition = () => {
  const pathname = usePathname();
  const id = pathname.split('/')[3];
  const router = useRouter();

  const TuitionSchema = yup.object().shape({
    student: yup.object().required('Bạn chưa chọn học viên'),
    class: yup.string(),
    classId: yup.string(),
    priceCourse: yup.string(),
    totalTuition: yup.string().matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
    paymentType: yup.string().required('Bạn chưa chọn trạng thái thanh toán'),
    promotionalCode: yup.string(),
    promotionalCodeId: yup.string(),
    paidMoney: yup.string().matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
    debtMoney: yup.string().matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
    paymentRecords: yup.array().of(
      yup.object().shape({
        paymentDate: yup.date().required('Bạn chưa chọn ngày'),
        paidMoney: yup
          .string()
          .required('Bạn chưa nhập số tiền thanh toán')
          .matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
        isPaid: yup.string(),
      }),
    ),
  });

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    setError,
    getValues,
  } = useForm({
    resolver: yupResolver(TuitionSchema),
    defaultValues: {
      paidMoney: '0',
      priceCourse: '0',
      totalTuition: '0',
      debtMoney: '0',
    },
  });
  const recordForm = useFieldArray({ control, name: 'paymentRecords' });
  const [listStudent, setListStudent] = useState<any>([]);
  const [listPromotion, setListPromotion] = useState<any>([]);
  const [openDelete, setOpenDelete] = useState(false);

  const getData = async () => {
    if (id === 'add-tuition') return 0;
    try {
      const res = await api.functional.tuition_management.getTuitionManagement(
        connection,
        id,
      );
      if (res.data) {
        setDataValue(res.data);
      }
      return 1;
    } catch (err) {
      console.log(err);
      toast.error('Tải thông tin thanh toán thất bại');
      return 0;
    }
  };

  useQuery({
    queryKey: ['getStudent'],
    queryFn: getData,
  });

  useQuery({
    queryKey: ['listStudent'],
    queryFn: async () => {
      try {
        const res = await api.functional.student.all.getAll(connection);
        if (res.data)
          setListStudent(
            res.data.map((t: any) => ({
              label: `${t.fullname} - ${t.phoneNumber}`,
              value: t.id,
            })),
          );
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách học viên thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['listPromotion'],
    queryFn: async () => {
      try {
        const res = await api.functional.promotional_code.findAll(connection);
        if (res.data) setListPromotion(res.data);
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách mã khuyến mãi thất bại');
      }
      return 1;
    },
  });

  const getInfoMutation = useMutation({
    mutationFn: (id: string) => api.functional.student.getOne(connection, id),
    onSuccess: (data) => {
      if (!data.data.class) {
        setError('class', {
          message: 'Học viên chưa có lớp học',
        });
        setNewValue();
        return;
      }
      setValue('class', data.data.class?.courseTitle);
      setValue('classId', data.data.class?.id);
      setValue('paymentType', data.data.paymentState);
      setValue('priceCourse', addCommas(data.data.class?.course.price));
      setValue('totalTuition', addCommas(data.data.class?.course.price));
      setValue('debtMoney', addCommas(data.data.class?.course.price));
      setValue('paidMoney', '0');
    },
    onError: (err) => {
      console.log(err);
      toast.error('Tải thông tin học viên thất bại');
    },
  });

  const onPromotion = (code: string) => {
    const promotion = listPromotion.find((e: any) => e.code === code);
    setValue('promotionalCodeId', promotion.id);
    const discount = Number(removeNonNumeric(promotion.value));
    const price = Number(removeNonNumeric(getValues('priceCourse') || '0'));
    const paidMoney = Number(removeNonNumeric(getValues('paidMoney') || '0'));
    if (promotion.type === '%') {
      setValue(
        'totalTuition',
        addCommas(((price * (100 - discount)) / 100).toString()),
      );
      setValue(
        'debtMoney',
        addCommas(((price * (100 - discount)) / 100 - paidMoney).toString()),
      );
    } else {
      setValue('totalTuition', addCommas((price - discount).toString()));
      setValue(
        'debtMoney',
        addCommas((price - discount - paidMoney).toString()),
      );
    }
  };

  const onPayment = () => {
    let totalTuition = Number(
      removeNonNumeric(getValues('totalTuition') || '0'),
    );
    let sum = 0;
    const records = getValues('paymentRecords');
    console.log(records);
    records?.forEach((e: any) => {
      if (e.isPaid === 'Đã thanh toán') {
        totalTuition -= Number(removeNonNumeric(e.paidMoney) || '0');
        sum += Number(removeNonNumeric(e.paidMoney) || '0');
      }
    });
    setValue('debtMoney', addCommas(totalTuition.toString()));
    setValue('paidMoney', addCommas(sum.toString()));
  };

  const setNewValue = () => {
    setValue('class', '');
    setValue('paymentType', '');
    setValue('promotionalCodeId', '');
    setValue('promotionalCode', '');
    setValue('priceCourse', '0');
    setValue('totalTuition', '0');
    setValue('paidMoney', '0');
    setValue('debtMoney', '0');
    setValue('paymentRecords', []);
  };

  const setDataValue = (value: any) => {
    setValue('student', {
      label: `${value.student?.fullname} - ${value.student?.phoneNumber}`,
      value: value.student.id,
    });
    setValue('class', value.class?.courseTitle);
    setValue('classId', value.classId);
    setValue('paymentType', value.paymentType);
    setValue('promotionalCodeId', value.promotionalCodeId || '');
    setValue('promotionalCode', value.promotionalCode?.code || '');
    setValue('priceCourse', addCommas(value.class?.course.price));
    setValue('totalTuition', addCommas(value.totalTuition));
    setValue('paidMoney', addCommas(value.paidMoney));
    setValue('debtMoney', addCommas(value.debtMoney));
    setValue(
      'paymentRecords',
      value.paymentRecords.map((e: any) => ({
        paidMoney: addCommas(e.paidMoney),
        isPaid: e.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán',
        paymentDate: new Date(e.paymentDate),
      })),
    );
  };

  const onSubmit = (data: any) => {
    // console.log(data);
    let params: any = {};
    params.studentId = data.student.value;
    params.classId = data.classId;
    params.creatorId = localStorage.getItem('userId');
    params.totalTuition = Number(removeNonNumeric(data.totalTuition));
    params.paidMoney = Number(removeNonNumeric(data.paidMoney));
    params.debtMoney = Number(removeNonNumeric(data.debtMoney));
    params.paymentType = data.paymentType;
    params.promotionalCodeId = data.promotionalCodeId;
    params.paymentRecords = data.paymentRecords
      .filter((e: any) => Number(removeNonNumeric(e.paidMoney)) !== 0)
      .map((e: any) => ({
        paymentDate: new Date(e.paymentDate).toISOString(),
        paidMoney: Number(removeNonNumeric(e.paidMoney)),
        isPaid: e.isPaid === 'Đã thanh toán' ? true : false,
      }));
    console.log(params);
    if (id === 'add-tuition') addMutation.mutate(params);
    else updateMutation.mutate(params);
  };

  const addMutation = useMutation({
    mutationFn: (data: any) =>
      api.functional.tuition_management.create(connection, data),
    onSuccess: (data: any) => {
      toast.success('Thanh toán học phí thành công');
      router.replace(data.data.id);
    },
    onError: () => {
      toast.error('Thanh toán học phí thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      api.functional.tuition_management.updateTuitionManagement(
        connection,
        id,
        data,
      ),
    onSuccess: () => {
      toast.success('Thanh toán học phí thành công');
    },
    onError: () => {
      toast.error('Thanh toán học phí thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      api.functional.tuition_management.deleteTuitionManagement(connection, id),
    onSuccess: () => {
      toast.success('Xoá thanh toán thành công');
      router.back();
    },
    onError: () => {
      toast.error('Xoá thanh toán thất bại');
    },
  });

  return (
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Chi tiết thanh toán học phí
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
            Xoá thanh toán
          </WhiteRedButton>
        </div>
      </div>

      <div
        className={clsx('bg-white w-full rounded-lg px-8 py-6 mt-2 gap-4 grid')}
      >
        <div className="grid large:grid-cols-10 gap-x-8 gap-y-4">
          <div className="grid gap-4 large:col-span-6">
            <Controller
              control={control}
              name="student"
              render={({ field }) => (
                <MultiSelect
                  title={'Học viên'}
                  options={listStudent}
                  placeholder=""
                  value={field.value}
                  onChange={(newValue: any) => {
                    field.onChange(newValue);
                    getInfoMutation.mutate(newValue.value);
                  }}
                  helperText={errors?.student?.message}
                  required={true}
                  isCreatable={false}
                  isMulti={false}
                />
              )}
            />

            <TextField
              register={{ ...register('class') }}
              helperText={errors?.class?.message}
              label={'Lớp học'}
              width="150px"
              required={true}
              disabled
            />
            <Controller
              control={control}
              name="paymentType"
              render={({ field }) => (
                <SelectBox
                  items={ListPaymentState}
                  selected={field.value}
                  setSelected={(e: string) => field.onChange(e)}
                  title={'TT thanh toán'}
                  width="150px"
                  helperText={errors?.paymentType?.message}
                  required={true}
                  disabled={!getValues('class')}
                />
              )}
            />
            <Controller
              control={control}
              name="promotionalCode"
              render={({ field }) => (
                <SelectBox
                  items={listPromotion.map((t: any) => t.code)}
                  selected={field.value}
                  setSelected={(e: string) => {
                    field.onChange(e);
                    onPromotion(e);
                  }}
                  title={'Mã khuyến mãi'}
                  helperText={errors?.promotionalCodeId?.message}
                  width="150px"
                  disabled={!getValues('class')}
                />
              )}
            />
          </div>
          <div className="grid gap-4 large:col-span-4">
            <Controller
              control={control}
              name="priceCourse"
              render={({ field }) => (
                <NumberInput
                  // helperText={errors?.paidMoney?.message}
                  label={'Tổng khoá học'}
                  required={true}
                  value={field.value}
                  setValue={(e: any) => field.onChange(e)}
                  disabled
                />
              )}
            />

            <Controller
              control={control}
              name="totalTuition"
              render={({ field }) => (
                <NumberInput
                  helperText={errors?.totalTuition?.message}
                  label={'Số tiền phải đóng'}
                  required={true}
                  value={field.value}
                  setValue={(e: any) => field.onChange(e)}
                  disabled
                />
              )}
            />

            <Controller
              control={control}
              name="paidMoney"
              render={({ field }) => (
                <NumberInput
                  helperText={errors?.paidMoney?.message}
                  label={'Số tiền đã đóng'}
                  required={true}
                  value={field.value}
                  setValue={(e: any) => field.onChange(e)}
                  disabled
                />
              )}
            />
            <Controller
              control={control}
              name="debtMoney"
              render={({ field }) => (
                <NumberInput
                  helperText={errors?.debtMoney?.message}
                  label={'Số tiền còn nợ'}
                  required={true}
                  value={field.value}
                  setValue={(e: any) => field.onChange(e)}
                  disabled
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-start gap-2 my-5">
          <div className="items-center leading-8 text-[18px] font-semibold">
            Đợt thu phí
          </div>
          <PlusIcon
            className={clsx(
              'w-5 h-5 my-auto font-bold stroke-width-[4px] text-blue-800 cursor-pointer outline-none',
              getValues('class') ? 'text-blue-800' : 'text-gray-500',
            )}
            onClick={() => {
              if (!getValues('class')) return;
              recordForm.append({
                paymentDate: new Date(),
                paidMoney: '0',
                isPaid: 'Chờ thanh toán',
              });
            }}
            data-tooltip-content="Thêm"
            data-tooltip-id="right-tooltip"
          />
        </div>
        {recordForm.fields.map((item, index) => {
          return (
            <div
              key={item.id}
              className="grid w-full border border-gray-300 rounded-md p-4 gap-3"
            >
              <div className="flex w-full gap-4">
                <Controller
                  control={control}
                  name={`paymentRecords.${index}.paymentDate`}
                  render={({ field }) => (
                    <DatePickerField
                      selected={field.value}
                      onChange={(date: any) => field.onChange(date)}
                      label={'Ngày thu'}
                      hasTimeInput={false}
                      helperText={
                        errors?.paymentRecords?.[`${index}`]?.paymentDate
                          ?.message
                      }
                      required={true}
                    />
                  )}
                />
                <WhiteRedButton
                  className="w-10 h-10 my-auto p-2 delete-btn"
                  onClick={() => {
                    recordForm.remove(index);
                    onPayment();
                  }}
                >
                  <TrashIcon className="text-red-600 h-4 w-4 m-auto" />
                </WhiteRedButton>
              </div>
              <div className="grid large:grid-cols-10 w-full gap-x-4 gap-y-8">
                <div className="large:col-span-6">
                  <Controller
                    control={control}
                    name={`paymentRecords.${index}.paidMoney`}
                    render={({ field }) => (
                      <NumberInput
                        helperText={
                          errors?.paymentRecords?.[`${index}`]?.paidMoney
                            ?.message
                        }
                        label={'Số tiền đã thu'}
                        required={true}
                        value={field.value}
                        setValue={(e: any) => {
                          field.onChange(e);
                          onPayment();
                        }}
                      />
                    )}
                  />
                </div>
                <div className="large:col-span-4">
                  <Controller
                    control={control}
                    name={`paymentRecords.${index}.isPaid`}
                    render={({ field }) => (
                      <SelectBox
                        helperText={
                          errors?.paymentRecords?.[`${index}`]?.isPaid?.message
                        }
                        title={'Trạng thái'}
                        required={true}
                        selected={field.value}
                        setSelected={(e: any) => {
                          field.onChange(e);
                          onPayment();
                        }}
                        items={['Chờ thanh toán', 'Đã thanh toán']}
                        width="100px"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex justify-end gap-2 my-5">
          <DarkBlueButton onClick={handleSubmit(onSubmit)}>Lưu</DarkBlueButton>
        </div>
      </div>
      <ConfirmDialog
        open={openDelete}
        title={'Bạn muốn xoá thanh toán này?'}
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

export default Tuition;
