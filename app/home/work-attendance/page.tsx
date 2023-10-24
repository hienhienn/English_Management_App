'use client';

import { PencilIcon, PlusSmIcon, XIcon } from '@heroicons/react/outline';
import { DarkBlueButton, WhiteBlueButton } from '@/components/base/Button';
import { Popup } from 'reactjs-popup';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { connection } from '@/helper/connection';
import api from '@/api';
import EmployeeAttendance from '@/components/EmployeeAttendance';
import DatePicker, { registerLocale } from 'react-datepicker';
import '../../../src/components/base/DatePicker/DatePicker.css';
import vi from 'date-fns/locale/vi';
import Table from '@/components/table/table';
// import AttendanceTable from '@/components/AttendanceTable';

let _ = require('lodash');
registerLocale('vi', vi);

const CourseTab = () => {
  const columnHelper = createColumnHelper<any>();
  const dateColumns: ColumnDef<any, any>[] = _.range(1, 30).map((e: any) =>
    columnHelper.accessor(`attendance.${e}`, {
      header: () => <span>{e}</span>,
      cell: (info) => {
        const tmp =
          info.row.original.attendance[
            `${e.toString().length == 2 ? e : `0${e}`}`
          ];
        return (
          <span
            className="delete-btn cursor-pointer"
            data-tooltip-content={`${tmp?.checkIn} - ${tmp?.checkOut}`}
            data-tooltip-hidden={!tmp?.checkIn}
          >
            {tmp?.convert || 0}
          </span>
        );
      },
    }),
  );
  const tableColumns: ColumnDef<any, any>[] = [
    columnHelper.accessor('fullname', {
      header: () => <span>Nhân sự</span>,
      size: 400,
    }),
    columnHelper.accessor('phoneNumber', {
      header: () => <span>Số điện thoại</span>,
      size: 400,
    }),
    ...dateColumns,
    columnHelper.accessor('action', {
      header: () => <span>Hành động</span>,
      enableSorting: false,
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <WhiteBlueButton
            className="w-auto p-2 edit-btn"
            onClick={() => {
              setOpenUpdate((o) => !o);
              setSelected(info.row.original);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </WhiteBlueButton>
        </div>
      ),
      size: 110,
      maxSize: 110,
    }),
  ];

  const [openAdd, setOpenAdd] = useState(false);
  const closeModal = () => setOpenAdd(false);
  const [tableData, setTableData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selected, setSelected] = useState<any>({});

  const getData = async () => {
    const query = {
      startDate: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-1`,
      endDate: `${startDate.getFullYear()}-${startDate.getMonth() + 2}-1`,
    };
    try {
      const res = await api.functional.work_attendance.query.getQuery(
        connection,
        query,
      );
      if (res.data) {
        setTableData(
          res.data.map((e: any) => {
            let x: any = {};
            e.element.forEach((el: any) => {
              x[el.date.substring(8, 10)] = {
                convert: el.convert,
                checkIn: el.checkIn,
                checkOut: el.checkOut,
                date: el.date,
              };
            });
            return {
              id: e.employeeDetail[0]._id.$oid,
              fullname: e.employeeDetail[0].fullname,
              phoneNumber: e.employeeDetail[0].phoneNumber,
              attendance: x,
            };
          }),
        );
      }
    } catch (err) {
      console.log(err);
      toast.error('Tải danh sách khoá học thất bại');
    }
    return 1;
  };

  console.log(tableData);

  useQuery({
    queryKey: ['attendance', startDate],
    queryFn: getData,
  });

  return (
    <>
      <div className="flex justify-between">
        <div className="items-center leading-10 text-[20px] font-semibold">
          Bảng chấm công
        </div>
        <div className="gap-2 flex mb-5">
          <div className="w-fit">
            <p className="text-[12px] mb-1 text-gray-700">Chọn tháng năm:</p>
            <DatePicker
              dateFormat="MM/yyyy"
              showMonthYearPicker
              locale={'vi'}
              selected={startDate}
              onChange={(date) => setStartDate(date || new Date())}
            />
          </div>
          <DarkBlueButton
            className="px-4 py-2 w-auto mt-[22px]"
            onClick={() => setOpenAdd((o) => !o)}
          >
            <div className="flex">
              <PlusSmIcon className="text-white w-6 h-6" />
              Chấm công
            </div>
          </DarkBlueButton>
        </div>
        <Popup open={openAdd} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Chấm công
            <XIcon className="w-6 h-6 text-gray-700" onClick={closeModal} />
          </div>
          <EmployeeAttendance closeModal={closeModal} getData={getData} />
        </Popup>
        <Popup open={openUpdate} closeOnDocumentClick={false}>
          <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
            Cập nhật chấm công
            <XIcon
              className="w-6 h-6 text-gray-700"
              onClick={() => setOpenUpdate(false)}
            />
          </div>
          <EmployeeAttendance
            closeModal={() => setOpenUpdate(false)}
            getData={getData}
            data={{
              id: selected.id,
              fullname: selected.fullname,
              type: 'UPDATE',
            }}
          />
        </Popup>
      </div>
      <div className="bg-white rounded-lg p-5">
        <Table
          data={tableData}
          columns={tableColumns}
          className="inline-block overflow-x-auto"
        />
        {/* <AttendanceTable data={tableData} columns={tableColumns} /> */}
      </div>
    </>
  );
};

export default CourseTab;
