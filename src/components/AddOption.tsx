import { WhiteBlueButton, DarkBlueButton } from './base/Button';
import { XIcon, SaveIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from './base/TextField';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import RadioGroup from './base/RadioGroup';

const CourseSchema = yup.object().shape({
  title: yup.string().required('Bạn chưa nhập tên'),
  isActive: yup.boolean(),
});

const AddOption = ({
  closeModal,
  getData,
  defaultData = {},
  updateFunction,
  addFunction,
}: any) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CourseSchema),
    defaultValues: {
      title: defaultData.title || '',
      isActive:
        JSON.stringify(defaultData) !== JSON.stringify({})
          ? defaultData.isActive
          : true,
    },
  });

  const addMutation = useMutation({
    mutationKey: ['addOption'],
    mutationFn: addFunction,
    onSuccess: () => {
      getData();
      toast.success('Thêm lựa chọn thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Thêm lựa chọn thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationKey: ['updateOption'],
    mutationFn: updateFunction,
    onSuccess: () => {
      getData();
      toast.success('Cập nhật lựa chọn thành công');
      closeModal();
    },
    onError: () => {
      toast.error('Cập nhật lựa chọn thất bại');
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
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <RadioGroup
              name="isActive"
              options={[
                { value: true, label: 'Có' },
                { value: false, label: 'Không' },
              ]}
              value={field.value}
              setValue={(e: any) => field.onChange(e)}
              label="Kích hoạt"
              required={true}
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

export default AddOption;
