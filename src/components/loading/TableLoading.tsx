import { TableCell, TableRow } from '@/components/ui/table';

type TableLoadingProps = {
  loading: boolean;
};

const TableLoading = (props: TableLoadingProps) => {
  if (!props.loading) return null;
  return (
    <TableRow className="animate-pulse border-y">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <TableCell key={index}>
          <div className="my-4 h-2 w-full rounded-full bg-slate-200"></div>

          <div className="flex gap-4">
            <div className="my-4 h-2 w-3/6 rounded-full bg-slate-200"></div>
            <div className="my-4 h-2 w-2/6 rounded-full bg-slate-200"></div>
          </div>
        </TableCell>
      ))}

      <TableCell>
        <div className="my-4 h-2 w-full rounded-full bg-slate-200"></div>
      </TableCell>

      <TableCell>
        <div className="my-4 h-2 w-full rounded-full bg-slate-200"></div>
      </TableCell>

      <TableCell>
        <div className="my-4 h-8 w-24 rounded-lg bg-slate-200"></div>
      </TableCell>
    </TableRow>
  );
};

export default TableLoading;
