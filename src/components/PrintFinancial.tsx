import React from 'react';

export const PrintFinancial = React.forwardRef<HTMLDivElement, any>(
  function PrintFinancialComponent({ data }, ref) {
    return (
      <div className="bg-white font-mono p-[80px] h-[100vh]" ref={ref}>
        <div className="flex justify-between">
          <div>
            <p className="font-bold">Trung tâm English Learning</p>
            <p>Địa chỉ trụ sở chính</p>
          </div>
          <div className="text-right">
            <p>Hotline: 0123456789</p>
            <p>(Mã PT: {data?.code})</p>
          </div>
        </div>
        <br />
        <div className="text-[18px] font-bold text-center uppercase">
          Phiếu thu
        </div>
        <br />
        <div>
          <p>Người nộp tiền: {data?.student?.fullname}</p>
          <p>Số điện thoại: {data?.student?.phoneNumber}</p>
          <p>Nội dung thu: {data?.description}</p>
          <p>
            Số tiền:{' '}
            {data?.amountOfMoney?.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </p>
          <p>Thanh toán: {data?.paymentType}</p>
        </div>
        <br />
        <br />
        <div className="text-right">Ngày 30 tháng 8 năm 2023</div>
        <br />
        <div className="justify-between flex">
          <div>
            <p>Người lập phiếu</p>
            <p>(Ký, họ tên)</p>
          </div>
          <div>
            <p>Người nộp tiền</p>
            <p>(Ký, họ tên)</p>
          </div>
          <div>
            <p>Người thủ quỹ</p>
            <p>(Ký, họ tên)</p>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  },
);
