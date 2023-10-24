'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import { Subject, Subscription } from 'rxjs';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import { PlusSmIcon, XIcon } from '@heroicons/react/outline';
import AddSchedule from '@/components/AddSchedule';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api';
import { connection } from '@/helper/connection';
import { DarkBlueButton } from '@/components/base/Button';
import AddDefaultSchedule from '@/components/AddDefaultSchedule';
import { useRouter } from 'next/navigation';

let confirmSubject = new Subject<boolean>();
let subscription: Subscription;
let Chance = require('chance');

const ScheduleTab = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdateTime, setOpenUpdateTime] = useState(false);
  const [queryDate, setQueryDate] = useState({ startDate: '', endDate: '' });
  const [selected, setSelected] = useState({});
  const [openAddDefault, setOpenAddDefault] = useState(false);
  const router = useRouter();

  const getData = async () => {
    if (!queryDate.startDate || !queryDate.endDate) return 0;
    try {
      const res = await api.functional.schedule.list.getWithQuery(
        connection,
        queryDate,
      );
      if (res.data) {
        setCurrentEvents(res.data);
      }
    } catch (err) {
      console.log(err);
      toast.error('Tải danh sách lịch học thất bại');
    }
    return 1;
  };

  useQuery({
    queryKey: ['getSchedule', queryDate],
    queryFn: getData,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, params }: any) =>
      api.functional.schedule.updateSchedule(connection, id, params),
    onSuccess: () => {
      getData();
      setOpenUpdateTime(false);
      toast.success('Cập nhật lịch học thành công');
    },
    onError: () => {
      setOpenUpdateTime(false);
      toast.error('Cập nhật lịch học thất bại');
    },
  });

  const handleDateSelect = (selectInfo: any) => {
    if (selectInfo.allDay) {
      if (
        selectInfo.end.getTime() - selectInfo.start.getTime() >
        24 * 60 * 60 * 1000
      ) {
        setSelected({
          startDate: new Date(selectInfo.startStr),
          endDate: new Date(selectInfo.end.getTime() - 24 * 60 * 60 * 1000),
        });
        setOpenAddDefault(true);
      } else {
        setSelected({
          date: new Date(selectInfo.startStr),
          type: 'ADD',
        });
        setOpenAdd(true);
      }
    } else {
      if (
        selectInfo.startStr.split('T')[0] !== selectInfo.endStr.split('T')[0]
      ) {
        toast.error('Thời gian học quá dài');
        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
      } else {
        setSelected({
          date: new Date(selectInfo.startStr),
          startTime: selectInfo.startStr.split('T')[1].substring(0, 5),
          endTime: selectInfo.endStr.split('T')[1].substring(0, 5),
          type: 'ADD',
        });
        setOpenAdd(true);
      }
    }
  };

  const handleEventClick = (clickInfo: any) => {
    router.push(`schedule/${clickInfo.event.title}`);
  };

  const handleDates = (e: any) => {
    setQueryDate({
      startDate: e.startStr,
      endDate: e.endStr,
    });
  };

  const handleEventChange = (e: any) => {
    setOpenUpdateTime(true);
    subscription = confirmSubject.subscribe({
      next: (v: boolean) => {
        if (v) {
          const date = e.event._instance.range;
          const params = {
            startTime: new Date(date.start)
              .toISOString()
              .split('T')[1]
              .substring(0, 5),
            endTime: new Date(date.end)
              .toISOString()
              .split('T')[1]
              .substring(0, 5),
            date: new Date(date.start).toISOString(),
          };
          updateMutation.mutate({ id: e.event.title, params: params });
        }
      },
    });
  };

  const getBgColor = (title: string) => {
    return new Chance(title).color({ format: 'hex' });
  };

  return (
    <div className="bg-white p-8">
      <div className="w-full justify-end flex gap-2">
        <DarkBlueButton
          className="px-4 py-2 w-auto mb-5"
          onClick={() => {
            setSelected({ type: 'ADD' });
            setOpenAdd(true);
          }}
        >
          <div className="flex">
            <PlusSmIcon className="text-white w-6 h-6" />
            Thêm lịch học
          </div>
        </DarkBlueButton>
        <DarkBlueButton
          className="px-4 py-2 w-auto mb-5"
          onClick={() => {
            setSelected({});
            setOpenAddDefault(true);
          }}
        >
          <div className="flex">
            <PlusSmIcon className="text-white w-6 h-6" />
            Thêm lịch học cố định
          </div>
        </DarkBlueButton>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        selectMirror={true}
        datesSet={handleDates}
        eventContent={(eventInfo) => {
          if (eventInfo.view.type === 'dayGridMonth')
            return (
              <>
                <b>{eventInfo.timeText}</b>
                <i className="ml-2">
                  {eventInfo.event.extendedProps.classTitle}
                </i>
              </>
            );
          return (
            <>
              <b>{eventInfo.timeText}</b>
              <br />
              <i>
                {eventInfo.event.extendedProps.classTitle} {' - '}
                {eventInfo.event.extendedProps.roomTitle}
              </i>
            </>
          );
        }}
        locale={'vi'}
        allDaySlot={false}
        events={currentEvents.map((t: any) => ({
          title: t.id,
          classTitle: t.class.courseTitle,
          roomTitle: t.roomTitle,
          start: `${t.date.split('T')[0]}T${t.startTime}+07:00`,
          end: `${t.date.split('T')[0]}T${t.endTime}+07:00`,
          backgroundColor: getBgColor(t.class.courseTitle),
          borderColor: getBgColor(t.class.courseTitle),
        }))}
        eventChange={handleEventChange}
      />
      <Popup open={openAdd} closeOnDocumentClick={false}>
        <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
          Thêm lịch học
          <XIcon
            className="w-6 h-6 text-gray-700"
            onClick={() => setOpenAdd(false)}
          />
        </div>
        <AddSchedule
          getData={getData}
          defaultData={selected}
          closeModal={() => setOpenAdd(false)}
          className={'max-h-[80vh] overflow-y-auto w-[700px] p-6'}
          isEdit={true}
          type={'ADD'}
        />
      </Popup>
      <Popup open={openAddDefault} closeOnDocumentClick={false}>
        <div className="border-b border-gray-300 px-8 py-4 font-semibold flex justify-between">
          Thêm lịch học cố định
          <XIcon
            className="w-6 h-6 text-gray-700"
            onClick={() => setOpenAddDefault(false)}
          />
        </div>
        <AddDefaultSchedule
          getData={getData}
          defaultData={selected}
          closeModal={() => setOpenAddDefault(false)}
        />
      </Popup>
      {/* <ConfirmDialog
        open={openDelete}
        title={'Bạn muốn xoá lịch học này?'}
        onClickNo={() => {
          subscription.unsubscribe();
          setOpenDelete(false);
        }}
        onClickYes={() => {
          confirmSubject.next(true);
          subscription.unsubscribe();
          setOpenDelete(false);
        }}
      /> */}
      <ConfirmDialog
        open={openUpdateTime}
        title={'Bạn muốn thay đổi giờ lịch học này?'}
        onClickNo={() => {
          subscription.unsubscribe();
          setOpenUpdateTime(false);
        }}
        onClickYes={() => {
          confirmSubject.next(true);
          subscription.unsubscribe();
          setOpenUpdateTime(false);
        }}
        clickYes={'Đồng ý'}
      />
    </div>
  );
};

export default ScheduleTab;
