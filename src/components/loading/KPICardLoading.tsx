type KPICardLoadingProps = {
  loading: boolean;
};

const KPICardLoading = (props: KPICardLoadingProps) => {
  if (!props.loading) return null;

  return (
    <div className="animate-pulse rounded-xl bg-gray-100">
      <div className="mt-4 flex items-center border-b pb-4 pl-4">
        <div className="rounded-xl bg-gray-200 p-2">
          <div className="size-8 bg-gray-200"></div>
        </div>

        <div className="ml-8 h-3 w-2/4 bg-gray-200 text-xl"></div>
      </div>

      <div className="grid grid-cols-2 py-4 text-center">
        <div className="flex flex-col items-center border-r-2 py-4">
          <div className="m-2 h-3 w-2/4 bg-gray-200"></div>
          <div className="m-2 h-3 w-1/4 bg-gray-200"></div>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="m-2 h-3 w-2/4 bg-gray-200"></div>
          <div className="m-2 h-3 w-1/4 bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default KPICardLoading;
