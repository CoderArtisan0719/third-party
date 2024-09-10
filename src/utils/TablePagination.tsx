import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TablePaginationProps = {
  page: number;
  setPage: (value: number) => void;
  perpage: number;
  setPerpage: (value: number) => void;
  total: number;
};

const TablePagination = (props: TablePaginationProps) => {
  const handlePaginate = (gotoPage: number) => props.setPage(gotoPage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-8 border-t p-4 lg:gap-16 xl:flex-nowrap">
      <div className="flex w-full justify-center xl:w-auto">
        {!props.total ? 0 : (props.page - 1) * props.perpage + 1} ~{' '}
        {props.page * props.perpage > props.total
          ? props.total
          : props.page * props.perpage}{' '}
        of {props.total}
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-8 xl:w-auto xl:flex-nowrap">
        <div className="flex items-center gap-4">
          <div className="whitespace-nowrap">Rows per page</div>

          <Select
            value={String(props.perpage)}
            onValueChange={(v) => props.setPerpage(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {[10, 20, 30, 40, 50].map((item) => (
                <SelectItem
                  className="cursor-pointer hover:bg-slate-100"
                  value={String(item)}
                  key={item}
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="whitespace-nowrap">go to</div>

          <Input
            type="number"
            value={props.page}
            onChange={(e) =>
              Number(e.target.value) >= 1 &&
              Number(e.target.value) <=
                Math.ceil(props.total / props.perpage) &&
              props.setPage(Number(e.target.value))
            }
            className="w-20 text-center"
          />

          <div className="whitespace-nowrap">
            {' '}
            / {Math.ceil(props.total / props.perpage)}
          </div>
        </div>

        <Pagination className="select-none">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer border shadow"
                onClick={() =>
                  props.page !== 1 ? handlePaginate(props.page - 1) : null
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className={`cursor-pointer border shadow ${
                  props.page === 1 ? ' border-slate-900 bg-slate-100' : ''
                }`}
                onClick={() => handlePaginate(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {props.page >= 4 &&
              props.page <= Math.ceil(props.total / props.perpage) && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

            {props.page >= 3 &&
              props.page <= Math.ceil(props.total / props.perpage) && (
                <PaginationItem>
                  <PaginationLink
                    className="cursor-pointer border shadow"
                    onClick={() => handlePaginate(props.page - 1)}
                  >
                    {props.page - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

            {props.page >= 2 &&
              props.page <= Math.ceil(props.total / props.perpage) && (
                <PaginationItem>
                  <PaginationLink className="border border-slate-900 bg-slate-100 shadow">
                    {props.page}
                  </PaginationLink>
                </PaginationItem>
              )}

            {props.page <= Math.ceil(props.total / props.perpage) - 2 && (
              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer border shadow"
                  onClick={() => handlePaginate(props.page + 1)}
                >
                  {props.page + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {props.page <= Math.ceil(props.total / props.perpage) - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {props.page <= Math.ceil(props.total / props.perpage) - 1 && (
              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer border shadow"
                  onClick={() =>
                    handlePaginate(Math.ceil(props.total / props.perpage))
                  }
                >
                  {Math.ceil(props.total / props.perpage)}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                className="cursor-pointer border shadow"
                onClick={() =>
                  props.page !== Math.ceil(props.total / props.perpage)
                    ? handlePaginate(props.page + 1)
                    : null
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TablePagination;
