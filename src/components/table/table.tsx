import {
  Table,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import clsx from 'clsx';

type Props = {
  data: Array<any>;
  columns: ColumnDef<any>[];
  className?: string;
};

export default function Table({ data, columns, className }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <>
      <table
        className={clsx('w-full border-collapse my-5 table-auto', className)}
      >
        <thead>
          {table.getFlatHeaders().map((header) => {
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                style={{
                  width: header.getSize(),
                  minWidth: header.id === 'action' ? header.getSize() : 'none',
                }}
              >
                {header.isPlaceholder ? null : (
                  <div className="text-left p-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </div>
                )}
              </th>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr
                key={row.id}
                className={clsx(
                  index % 2 ? 'bg-white' : 'bg-blue-50',
                  'hover:bg-gray-200',
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className="p-2 border-y border-gray-300">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {(!data || data.length == 0) && (
        <div className="italic text-center">Không có dữ liệu để hiển thị</div>
      )}
    </>
  );
}
