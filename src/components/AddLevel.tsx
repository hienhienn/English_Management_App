import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from './base/TextField';
import api from '@/api';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { connection } from '@/helper/connection';

const CourseSchema = yup.object().shape({
  title: yup.string().required('Bạn chưa nhập tên khoá học'),
});

const AddLevel = ({ closeModal, getData, defaultData = {} }: any) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CourseSchema),
    defaultValues: {
      title: defaultData.title || '',
    },
  });

  const addMutation = useMutation({
    mutationKey: ['AddLevel'],
    mutationFn: (data: any) => api.functional.level.create(connection, data),
    onSuccess: () => {
      getData();
      toast.success('Thêm trình độ thành công');
      closeModal();
    },
    onError: (data) => {
      toast.error('Thêm trình độ thất bại');
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateCourse'],
    mutationFn: (data: any) =>
      api.functional.level.updateLevel(connection, defaultData.id, data),
    onSuccess: () => {
      getData();
      toast.success('Cập nhật trình độ thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật trình độ thất bại');
    },
  });

  const onSubmit = (data: any) => {
    if (JSON.stringify(defaultData) === JSON.stringify({})) {
      addMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6 gap-3 grid w-[700px]">
        <TextField
          register={{ ...register('title') }}
          helperText={errors?.title?.message}
          label={'Tên'}
          required={true}
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

export default AddLevel;
