import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import SelectBox from '../base/SelectBox';

type Props = {
  setPageNumber: any;
  pageNumber: number;
  totalPage: number;
  pageSize: number;
  setPageSize?: any;
  total: number;
  size: number;
};

const Pagination = ({
  setPageNumber,
  pageNumber,
  totalPage,
  pageSize = 10,
  setPageSize,
  total,
  size,
}: Props) => {
  return (
    <div className="flex w-full justify-between gap-2 items-center">
      <div className="flex gap-2">
        <SelectBox
          width="70px"
          items={[5, 10, 20, 50, 100]}
          selected={pageSize}
          setSelected={setPageSize}
          position="bottom"
        />
        <span className="leading-10">bản ghi mỗi trang</span>
        <div className="h-6 w-[1px] my-auto bg-gray-500"></div>
        <span className="leading-10">
          <b>
            {size}/{total}
          </b>{' '}
          bản ghi
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="border rounded w-8 h-8 text-gray-700 hover:bg-gray-200 flex justify-center items-center disabled:cursor-not-allowed"
          onClick={() => setPageNumber(1)}
          disabled={pageNumber === 1}
        >
          <ChevronDoubleLeftIcon className="h-4" />
        </button>
        <button
          className="border rounded w-8 h-8  text-gray-700 hover:bg-gray-200  flex justify-center items-center disabled:cursor-not-allowed"
          onClick={() => setPageNumber((p: number) => p - 1)}
          disabled={pageNumber === 1}
        >
          <ChevronLeftIcon className="h-4" />
        </button>
        <span className="flex items-center gap-1">
          <div>Trang</div>
          <strong>
            {pageNumber}/{totalPage}
          </strong>
        </span>
        <button
          className="border rounded w-8 h-8 text-gray-700 hover:bg-gray-200  flex justify-center items-center disabled:cursor-not-allowed"
          onClick={() => setPageNumber((p: number) => p + 1)}
          disabled={pageNumber === totalPage}
        >
          <ChevronRightIcon className="h-4" />
        </button>
        <button
          className="border rounded w-8 h-8  text-gray-700 hover:bg-gray-200  flex justify-center items-center disabled:cursor-not-allowed"
          onClick={() => setPageNumber(totalPage)}
          disabled={pageNumber === totalPage}
        >
          <ChevronDoubleRightIcon className="h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
