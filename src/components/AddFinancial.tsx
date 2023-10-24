import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from './base/TextField';
import api from '@/api';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { connection } from '@/helper/connection';
import SelectBox from './base/SelectBox';
import RadioGroup from './base/RadioGroup';
import SelectBoxKeyValue from './base/SelectBoxKeyValue';
import { useState } from 'react';
import NumberInput from './base/NumberInput';

const addCommas = (num: string) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const removeNonNumeric = (num: string) => {
  return num?.toString().replace(/[^0-9]/g, '');
};

const AddFinancial = ({ closeModal, getData, defaultData = {} }: any) => {
  const RoomSchema = yup.object().shape({
    type: yup.string().required('Bạn chưa chọn loại'),
    paymentType: yup.string().required('Bạn chưa chọn hình thức thanh toán'),
    studentId: yup.object().required('Bạn chưa nhập họ tên'),
    description: yup.string(),
    amountOfMoney: yup.string().matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
    isPaid: yup.boolean(),
    userId: yup.object().required('Bạn chưa chọn người thu/chi'),
  });
  const [listStudent, setListStudent] = useState([]);
  const [listUser, setListUser] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RoomSchema),
    defaultValues: {
      type: defaultData.type || 'Thu',
      paymentType: defaultData.paymentType || '',
      studentId: defaultData.student
        ? { key: defaultData.student.id, value: defaultData.student.fullname }
        : { key: '', value: '' },
      description: defaultData.description || '',
      amountOfMoney: addCommas(defaultData.amountOfMoney) || '',
      isPaid: defaultData.isPaid || false,
      userId: defaultData.user
        ? { key: defaultData.user.id, value: defaultData.user.username }
        : { key: '', value: '' },
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addFinancial'],
    mutationFn: (data: any) =>
      api.functional.financial_management.create(connection, data),
    onSuccess: (data) => {
      getData();
      toast.success('Tạo phiếu thu/chi thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Tạo phiếu thu/chi thất bại');
      closeModal();
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

  useQuery({
    queryKey: ['getUserAll'],
    queryFn: async () => {
      try {
        const res = await api.functional.users.all.getAllUser(connection);
        if (res.data) {
          setListUser(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách tài khoản thất bại');
      }
      return 1;
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updatèinancial'],
    mutationFn: (data: any) =>
      api.functional.financial_management.update(
        connection,
        defaultData.id,
        data,
      ),
    onSuccess: (data) => {
      getData();
      toast.success('Cập nhật phiếu thu/chi thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Cập nhật phiếu thu/chi thất bại');
      closeModal();
      // getData();
    },
  });
  const onSubmit = (data: any) => {
    let params: any = {};
    params.type = data.type;
    params.paymentType = data.paymentType;
    params.amountOfMoney = Number(removeNonNumeric(data.amountOfMoney));
    params.studentId = data.studentId.key;
    params.userId = data.userId.key;
    params.isPaid = data.isPaid;
    params.description = data.description;
    if (JSON.stringify(defaultData) === JSON.stringify({})) {
      addMutation.mutate(params);
    } else {
      updateMutation.mutate(params);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6 gap-3 grid w-[700px]">
        <Controller
          control={control}
          name="studentId"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listStudent.map((t: any) => ({
                key: t.id,
                value: t.fullname,
              }))}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Họ tên'}
              required={true}
              helperText={errors?.studentId?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <RadioGroup
              name="type"
              options={[
                { value: 'Thu', label: 'Thu' },
                { value: 'Chi', label: 'Chi' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              label="Loại"
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="paymentType"
          render={({ field }) => (
            <SelectBox
              items={['Tiền mặt', 'Chuyển khoản']}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'HT thanh toán'}
              helperText={errors?.paymentType?.message}
              required={true}
            />
          )}
        />
        <TextField
          register={{ ...register('description') }}
          helperText={errors?.type?.message}
          label={'Nội dung'}
          multiline={true}
        />
        <Controller
          control={control}
          name="amountOfMoney"
          render={({ field }) => (
            <NumberInput
              helperText={errors?.amountOfMoney?.message}
              label={'Số tiền'}
              required={true}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
            />
          )}
        />
        <Controller
          control={control}
          name="isPaid"
          render={({ field }) => (
            <RadioGroup
              name="isPaid"
              options={[
                { value: true, label: 'Đã thanh toán' },
                { value: false, label: 'Chưa thanh toán' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              label="Đã thanh toán"
              required={true}
            />
          )}
        />
        <Controller
          control={control}
          name="userId"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listUser.map((t: any) => ({
                key: t.id,
                value: t.username,
              }))}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Người thu/chi'}
              required={true}
              helperText={errors?.userId?.message}
            />
          )}
        />
      </div>
      <div className="flex gap-2 p-6 pt-0 justify-end">
        <WhiteBlueButton className="w-[100px]" onClick={closeModal}>
          <div className="flex items-center w-full justify-center">
            <XIcon className="w-4 h-4 text-blue-900 mr-1" />
            Huỷ
          </div>
        </WhiteBlueButton>
        <DarkBlueButton className="w-[100px] " onClick={handleSubmit(onSubmit)}>
          <div className="flex items-center w-full justify-center">
            <SaveIcon className="w-4 h-4 text-white mr-1" />
            Lưu
          </div>
        </DarkBlueButton>
      </div>
    </div>
  );
};

export default AddFinancial;
