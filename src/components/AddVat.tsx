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
import { useState } from 'react';
import SelectBoxKeyValue from './base/SelectBoxKeyValue';
import RadioGroup from './base/RadioGroup';
import SelectBox from './base/SelectBox';
import NumberInput from './base/NumberInput';
import SwitchField from './base/SwitchField';

const addCommas = (num: string) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const removeNonNumeric = (num: string) => {
  return num?.toString().replace(/[^0-9]/g, '');
};

const CourseSchema = yup.object().shape({
  office: yup.object().required('Bạn chưa chọn cơ sở'),
  type: yup.string().required('Bạn chưa chọn loại'),
  name: yup.string().required('Bạn chưa nhập tên'),
  address: yup.string(),
  exportType: yup.string().required('Bạn chưa chọn hình thức xuất'),
  phoneNumber: yup.string(),
  description: yup.string(),
  note: yup.string(),
  money: yup
    .string()
    .required('Bạn chưa nhập số tiền')
    .matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
  isValidated: yup.boolean().required(),
  isRelease: yup.boolean().required(),
  financialManagement: yup.object(),
});

const AddVat = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CourseSchema),
    defaultValues: {
      office: defaultData.office
        ? { key: defaultData.office.id, value: defaultData.office.title }
        : { key: '', value: '' },
      type: defaultData.type || 'Cá nhân',
      name: defaultData.name || '',
      address: defaultData.address || '',
      exportType: defaultData.exportType || 'Tiền mặt',
      phoneNumber: defaultData.phoneNumber || '',
      description: defaultData.description || '',
      note: defaultData.note || '',
      money: addCommas(defaultData.money) || '',
      isValidated: defaultData.isValidated || false,
      isRelease: defaultData.isRelease || false,
    },
  });
  const [listOffice, setListOffice] = useState([]);
  const [listFinancial, setListFinancial] = useState([]);

  const addMutation = useMutation({
    mutationKey: ['addVat'],
    mutationFn: (data: any) =>
      api.functional.vat_management.create(connection, data),
    onSuccess: () => {
      getData();
      toast.success('Thêm VAT thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm VAT thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateVat'],
    mutationFn: (data: any) =>
      api.functional.vat_management.update(connection, defaultData.id, data),
    onSuccess: () => {
      getData();
      toast.success('Cập nhật VAT thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật VAT thất bại');
    },
  });

  useQuery({
    queryKey: ['listOffice'],
    queryFn: async () => {
      try {
        const res = await api.functional.setting.office.findAll(connection);
        if (res.data)
          setListOffice(
            res.data.map((t: any) => ({ key: t.id, value: t.title })),
          );
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách cơ sở thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['listFinancial'],
    queryFn: async () => {
      try {
        const res = await api.functional.financial_management.findAll(
          connection,
        );
        if (res.data)
          setListFinancial(
            res.data.map((t: any) => ({
              key: t.id,
              value: `[${t.code}] ${t.student.fullname}`,
            })),
          );
      } catch (err) {
        console.log(err);
        toast.error('Lấy danh sách phiếu thu chi thất bại');
      }
      return 1;
    },
  });
  const onSubmit = (data: any) => {
    let params: any = {};
    for (const key in data) {
      if (
        key === 'office' ||
        (key === 'financialManagement' && data.financialManagement)
      )
        params[`${key}Id`] = data[key].key;
      else if (key === 'money')
        params.money = Number(removeNonNumeric(data.money));
      else if (data[key] !== '') params[key] = data[key];
    }
    params.userId = localStorage.getItem('userId');
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
          name="office"
          render={({ field }) => (
            <SelectBoxKeyValue
              items={listOffice}
              selected={field.value}
              setSelected={(e: any) => field.onChange(e)}
              title={'Cơ sở'}
              required={true}
              helperText={errors?.office?.message}
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
                { value: 'Cá nhân', label: 'Cá nhân' },
                { value: 'Công ty', label: 'Công ty' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              label="Loại"
              required={true}
            />
          )}
        />
        <TextField
          register={{ ...register('name') }}
          helperText={errors?.name?.message}
          label={'Tên'}
          required={true}
        />
        <TextField
          register={{ ...register('address') }}
          helperText={errors?.address?.message}
          label={'Địa chỉ'}
        />
        <Controller
          control={control}
          name="exportType"
          render={({ field }) => (
            <SelectBox
              items={['Tiền mặt', 'Chuyển khoản']}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Hình thức xuất'}
              required={true}
              helperText={errors?.exportType?.message}
            />
          )}
        />
        <TextField
          register={{ ...register('phoneNumber') }}
          helperText={errors?.phoneNumber?.message}
          label={'Số điện thoại'}
        />
        <TextField
          register={{ ...register('description') }}
          helperText={errors?.description?.message}
          label={'Nội dung'}
          multiline={true}
        />
        <TextField
          register={{ ...register('note') }}
          helperText={errors?.note?.message}
          label={'Ghi chú'}
          multiline={true}
        />
        <Controller
          control={control}
          name="financialManagement"
          render={({ field }) => (
            <SelectBoxKeyValue
              title={'Hoá đơn'}
              items={listFinancial}
              selected={field.value}
              setSelected={(newValue: any) => field.onChange(newValue)}
              helperText={errors?.financialManagement?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="money"
          render={({ field }) => (
            <NumberInput
              helperText={errors?.money?.message}
              label={'Số tiền'}
              required={true}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
            />
          )}
        />
        <Controller
          control={control}
          name="isValidated"
          render={({ field }) => (
            <SwitchField
              name="a"
              checked={field.value}
              onChange={(e: any) => {
                field.onChange(e);
                if (!e) {
                  setValue('isRelease', false);
                }
              }}
              label="Xác nhận khách hàng"
            />
          )}
        />
        <Controller
          control={control}
          name="isRelease"
          render={({ field }) => (
            <SwitchField
              name="a"
              checked={field.value}
              onChange={(e: any) => {
                if (getValues('isValidated')) field.onChange(e);
              }}
              label="Phát hành"
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

export default AddVat;
