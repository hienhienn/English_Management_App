'use client';

import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
} from 'chart.js';
import { CurrencyDollarIcon, UserAddIcon } from '@heroicons/react/outline';
import DatePicker, { registerLocale } from 'react-datepicker';
import '../../src/components/base/DatePicker/DatePicker.css';
import SelectBoxKeyValue from '@/components/base/SelectBoxKeyValue';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { connection } from '@/helper/connection';
import vi from 'date-fns/locale/vi';
import { toast } from 'react-toastify';

registerLocale('vi', vi);

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
);

const options = {
  responsive: true,
  plugins: {
    tooltip: {
      // mode: 1,
      intersect: false,
    },
  },
  scales: {
    y: {
      min: 0,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

const OverViewTab = () => {
  const [studentData, setStudentData] = useState<any>({
    total: 0,
    graph: {
      labels: [],
      datasets: [{}],
    },
  });
  const [teacherData, setTeacherData] = useState<any>({
    total: 0,
    graph: {
      labels: [],
      datasets: [{}],
    },
  });

  const [revenueData, setRevenueData] = useState<any>({
    labels: [],
    datasets: [{}],
  });

  const [classData, setClassData] = useState<any>({
    total: 0,
    graph: {
      labels: [],
      datasets: [{}],
    },
  });
  const [topCourse, setTopCourse] = useState<any>({
    labels: [],
    datasets: [{}],
  });
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [selected, setSelected] = useState({ key: 'DAY', value: 'Ngày' });
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayStudent, setTodayStudent] = useState(0);

  const getLabel = (time: string) => {
    const date = new Date(time);
    if (selected.key === 'MONTH')
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    else return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  useQuery({
    queryKey: ['dashboard-student', startDate, endDate, selected],
    queryFn: async () => {
      const query = {
        startDate: new Date(startDate).toISOString().split('T')[0],
        endDate: new Date(endDate).toISOString().split('T')[0],
        type: selected.key,
      };
      try {
        const res = await api.functional.dashboard.student.getNewStudent(
          connection,
          query,
        );
        if (res.data) {
          setStudentData({
            total: res.data
              .map((t: any) => t.number)
              .reduce((partialSum: number, a: number) => partialSum + a, 0),
            graph: {
              labels: res.data.map((t: any) => getLabel(t.time)),
              datasets: [
                {
                  label: 'Số học viên',
                  data: res.data.map((t: any) => t.number),
                  borderColor: '#fecdd3',
                  backgroundColor: '#fb7185',
                  pointStyle: 'circle',
                  pointRadius: 5,
                  pointHoverRadius: 8,
                },
              ],
            },
          });
        }
      } catch (err) {
        console.log(err);
        toast.error('Thống kê sinh viên thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['dashboard-teacher', startDate, endDate, selected],
    queryFn: async () => {
      const query = {
        startDate: new Date(startDate).toISOString().split('T')[0],
        endDate: new Date(endDate).toISOString().split('T')[0],
        type: selected.key,
      };
      try {
        const res = await api.functional.dashboard.teacher.getNewTeacher(
          connection,
          query,
        );
        if (res.data) {
          setTeacherData({
            total: res.data
              .map((t: any) => t.number)
              .reduce((partialSum: number, a: number) => partialSum + a, 0),
            graph: {
              labels: res.data.map((t: any) => getLabel(t.time)),
              datasets: [
                {
                  label: 'Số giáo viên',
                  data: res.data.map((t: any) => t.number),
                  borderColor: '#bbf7d0',
                  backgroundColor: '#4ade80',
                  pointStyle: 'circle',
                  pointRadius: 5,
                  pointHoverRadius: 8,
                },
              ],
            },
          });
        }
      } catch (err) {
        console.log(err);
        toast.error('Thống kê giáo viên thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['dashboard-class', startDate, endDate, selected],
    queryFn: async () => {
      const query = {
        startDate: new Date(startDate).toISOString().split('T')[0],
        endDate: new Date(endDate).toISOString().split('T')[0],
        type: selected.key,
      };
      try {
        const res = await api.functional.dashboard.$class.getNewClass(
          connection,
          query,
        );
        if (res.data) {
          setClassData({
            total: res.data
              .map((t: any) => t.number)
              .reduce((partialSum: number, a: number) => partialSum + a, 0),
            graph: {
              labels: res.data.map((t: any) => getLabel(t.time)),
              datasets: [
                {
                  data: res.data.map((t: any) => t.number),
                  borderColor: '#fef08a',
                  backgroundColor: '#facc15',
                  pointStyle: 'circle',
                  pointRadius: 5,
                  pointHoverRadius: 8,
                  label: 'Số lớp học',
                },
              ],
            },
          });
        }
      } catch (err) {
        console.log(err);
        toast.error('Thống kê lớp học thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['dashboard-revenue', startDate, endDate, selected],
    queryFn: async () => {
      const query = {
        startDate: new Date(startDate).toISOString().split('T')[0],
        endDate: new Date(endDate).toISOString().split('T')[0],
        type: selected.key,
      };
      try {
        const res = await api.functional.dashboard.revenue.getRevenue(
          connection,
          query,
        );
        if (res.data) {
          setRevenueData({
            labels: res.data.map((t: any) => getLabel(t.time)),
            datasets: [
              {
                label: 'Doanh thu',
                data: res.data.map((t: any) => t.revenue),
                backgroundColor: '#e9d5ff',
                borderColor: '#c084fc',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              },
            ],
          });
        }
      } catch (err) {
        console.log(err);
        toast.error('Thống kê doanh thu thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['today'],
    queryFn: async () => {
      const query = {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        type: 'DAY',
      };
      try {
        const res = await api.functional.dashboard.revenue.getRevenue(
          connection,
          query,
        );
        if (res.data) {
          setTodayRevenue(res.data[0].revenue);
        }
      } catch (err) {
        console.log(err);
        toast.error('Thống kê doanh thu trong ngày thất bại');
      }
      try {
        const res = await api.functional.dashboard.student.getNewStudent(
          connection,
          query,
        );
        if (res.data) {
          setTodayStudent(res.data[0].number);
        }
      } catch (err) {
        console.log(err);
        toast.error('Thống kê học viên trong ngày thất bại');
      }
      return 1;
    },
  });

  useQuery({
    queryKey: ['course'],
    queryFn: async () => {
      try {
        const res = await api.functional.dashboard.course.getCourse(
          connection,
          { top: 5 },
        );
        if (res.data) {
          setTopCourse({
            labels: res.data.map((t: any) => t.courseTitle),
            datasets: [
              {
                label: 'Số học viên đăng ký',
                data: res.data.map((t: any) => t.totalStudent),
                backgroundColor: '#fecaca',
                borderColor: '#f87171',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              },
            ],
          });
        }
      } catch (err) {
        console.log(err);
        toast.error('Thống kê khoá học thất bại');
      }
      return 1;
    },
  });

  return (
    <div>
      <div className="flex justify-between">
        <div className="items-center leading-[64px] text-[20px] font-semibold align-middle">
          Tổng quan
        </div>
        <div className="gap-2 flex mb-5">
          <div className="w-fit">
            <p className="text-[12px] mb-1 text-gray-700">Ngày bắt đầu:</p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date || new Date())}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate}
              locale={'vi'}
              dateFormat={'dd/MM/yyyy'}
            />
          </div>
          <div className="w-fit">
            <p className="text-[12px] mb-1 text-gray-700">Ngày kết thúc:</p>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date || new Date())}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              locale={'vi'}
              dateFormat={'dd/MM/yyyy'}
            />
          </div>
          <div className="w-[150px]">
            <p className="text-[12px] mb-1 text-gray-700">Thống kê theo:</p>
            <SelectBoxKeyValue
              items={[
                { key: 'DAY', value: 'Ngày' },
                { key: 'WEEK', value: 'Tuần' },
                { key: 'MONTH', value: 'Tháng' },
              ]}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </div>
      </div>

      <div className="grid-cols-4 grid gap-5">
        <div className="bg-white p-5 rounded-lg col-span-2">
          <p className="font-semibold mb-2">
            Tổng số học viên: {studentData.total}
          </p>
          <Line data={studentData.graph} options={options} />
        </div>

        <div className="bg-white p-5 rounded-lg col-span-2">
          <p className="font-semibold mb-2">
            Tổng số giáo viên: {teacherData.total}
          </p>
          <Line data={teacherData.graph} options={options} />
        </div>

        <div className="bg-white p-5 rounded-lg col-span-3">
          <p className="font-semibold mb-2">Thống kê doanh thu</p>
          <Bar data={revenueData} />
        </div>

        <div className="bg-white p-5 rounded-lg col-span-1">
          <p className="font-semibold mb-2">Thông tin hôm nay</p>

          <div className="flex gap-4 py-4">
            <div className="rounded-full bg-blue-200 p-2 w-fit">
              <CurrencyDollarIcon className="h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-blue-600 font-bold">
                {todayRevenue.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </p>
              <p>Số tiền đã thu</p>
            </div>
          </div>
          <div className="flex gap-4 py-4">
            <div className="rounded-full bg-blue-200 p-2 w-fit">
              <UserAddIcon className="h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-blue-600 font-bold">{todayStudent}</p>
              <p>học viên mới</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg col-span-2">
          <p className="font-semibold mb-2">
            Tổng số lớp học: {classData.total}
          </p>
          <Line data={classData.graph} options={options} />
        </div>

        <div className="bg-white p-5 rounded-lg col-span-2">
          <p className="font-semibold mb-2">Top khoá học được đăng ký</p>
          <Bar data={topCourse} />
        </div>
      </div>
    </div>
  );
};

export default OverViewTab;
