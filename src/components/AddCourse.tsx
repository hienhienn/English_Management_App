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
import MultiSelect from './base/MultiSelect';
import { useState } from 'react';
import NumberInput from './base/NumberInput';

const addCommas = (num: string) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const removeNonNumeric = (num: string) => {
  return num?.toString().replace(/[^0-9]/g, '');
};

const CourseSchema = yup.object().shape({
  courseTitle: yup.string().required('Bạn chưa nhập tên khoá học'),
  price: yup
    .string()
    .required('Bạn chưa nhập học phí')
    .matches(/^\d*(\.\d+)*?$/, 'Phải là số'),
  level: yup.array().required('Bạn chưa chọn trình độ'),
});

const AddCourse = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CourseSchema),
    defaultValues: {
      courseTitle: defaultData.courseTitle,
      price: addCommas(defaultData.price) || '',
      level: defaultData.level?.map((t: any) => ({ value: t, label: t })),
    },
  });
  const [listLevel, setListLevel] = useState([]);

  const addMutation = useMutation({
    mutationKey: ['addCourse'],
    mutationFn: (data: any) => api.functional.course.create(connection, data),
    onSuccess: () => {
      getData();
      toast.success('Thêm khoá học thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm khoá học thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateCourse'],
    mutationFn: (data: any) =>
      api.functional.course.updateCourse(connection, defaultData.id, data),
    onSuccess: () => {
      getData();
      toast.success('Cập nhật khoá học thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật khoá học thất bại');
    },
  });

  useQuery({
    queryKey: ['listLevel'],
    queryFn: async () => {
      try {
        const res = await api.functional.level.all.getAll(connection);
        if (res.data)
          setListLevel(
            res.data.map((t: any) => ({ value: t.title, label: t.title })),
          );
      } catch (err) {
        console.log(err);
        toast.error('Tải danh sách trình độ thất bại');
      }
      return 1;
    },
  });

  const onSubmit = (data: any) => {
    let params: any = {};
    params.courseTitle = data.courseTitle;
    if (!!data.price) params.price = Number(removeNonNumeric(data.price));
    if (JSON.stringify(data.level) !== JSON.stringify([])) {
      params.level = data.level.map((t: any) => t.value);
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
          register={{ ...register('courseTitle') }}
          helperText={errors?.courseTitle?.message}
          label={'Tên khoá học'}
          required={true}
        />
        <Controller
          control={control}
          name="level"
          render={({ field }) => (
            <MultiSelect
              title={'Trình độ'}
              options={listLevel}
              placeholder=""
              value={field.value}
              onChange={(newValue: any) => field.onChange(newValue)}
              helperText={errors?.level?.message}
              required={true}
              isCreatable={false}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <NumberInput
              helperText={errors?.price?.message}
              label={'Học phí'}
              required={true}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
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

export default AddCourse;
