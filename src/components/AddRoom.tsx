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
import { ListRoomCategory, ListRoomState } from '@/model/dictionary';
import { useState } from 'react';

const RoomSchema = yup.object().shape({
  office: yup.string().required('Bạn chưa nhập cơ sở'),
  title: yup.string().required('Bạn chưa chọn tên phòng'),
  code: yup.string(),
  category: yup.string(),
  state: yup.string(),
  min: yup.string().matches(/^\d*$/, 'Phải là số nguyên'),
  max: yup.string().matches(/^\d*$/, 'Phải là số nguyên'),
  area: yup.string().matches(/^\d*(\.\d+)?$/, 'Phải là số'),
});

const AddRoom = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RoomSchema),
    defaultValues: {
      office: defaultData.office || '',
      title: defaultData.title || '',
      code: defaultData.code || '',
      category: defaultData.category || '',
      state: defaultData.state || '',
      min: defaultData.min || '',
      max: defaultData.max || '',
      area: defaultData.area || '',
    },
  });
  const [listOffice, setListOffice] = useState([]);

  const addMutation = useMutation({
    mutationKey: ['addRoom'],
    mutationFn: (data: any) => api.functional.room.create(connection, data),
    onSuccess: (data) => {
      getData();
      toast.success('Thêm phòng học thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm phòng học thất bại');
      closeModal();
      getData();
    },
  });

  useQuery({
    queryKey: ['listResult'],
    queryFn: async () => {
      try {
        const res = await api.functional.setting.office.findAll(connection);

        if (res.data) setListOffice(res.data.map((t: any) => t.title));
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách lựa chọn thất bại');
      }
      return 1;
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateRoom'],
    mutationFn: (data: any) =>
      api.functional.room.updateRoom(connection, defaultData.id, data),
    onSuccess: (data) => {
      getData();
      toast.success('Cập nhật phòng học thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Cập nhật phòng học thất bại');
      closeModal();
      getData();
    },
  });
  const onSubmit = (data: any) => {
    let params = {};
    for (const key in data) {
      if (!!data[key] && data[key] !== '---') {
        if (key === 'min' || key === 'max' || key === 'area')
          params = { ...params, [key]: Number(data[key]) };
        else params = { ...params, [key]: data[key] };
      }
    }

    if (JSON.stringify(defaultData) === JSON.stringify({})) {
      addMutation.mutate(params);
    } else {
      updateMutation.mutate(params);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6 gap-3 grid w-[700px]">
        <TextField
          register={{ ...register('title') }}
          helperText={errors?.title?.message}
          label={'Tên phòng'}
          required={true}
        />
        <Controller
          control={control}
          name="office"
          render={({ field }) => (
            <SelectBox
              items={listOffice}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Cơ sở'}
              helperText={errors?.office?.message}
              required={true}
            />
          )}
        />
        <TextField register={{ ...register('code') }} label={'Mã phòng'} />
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <SelectBox
              items={ListRoomCategory}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Loại phòng'}
            />
          )}
        />
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <SelectBox
              items={ListRoomState}
              selected={field.value}
              setSelected={(e: string) => field.onChange(e)}
              title={'Trạng thái'}
            />
          )}
        />
        <TextField
          register={{ ...register('min') }}
          label={'Tối thiểu'}
          helperText={errors?.min?.message}
        />
        <TextField
          register={{ ...register('max') }}
          label={'Tối đa'}
          helperText={errors?.max?.message}
        />
        <TextField
          register={{ ...register('area') }}
          label={'Diện tích'}
          helperText={errors?.max?.message}
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

export default AddRoom;
