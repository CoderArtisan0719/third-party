const ChartCardLoading = () => (
  <div className="mx-auto w-full max-w-sm rounded-md p-4">
    <div className="flex animate-pulse space-x-4">
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 w-3/4 rounded bg-slate-200"></div>
        <div className="h-2 w-1/4 rounded bg-slate-200"></div>
        <div className="h-2 w-1/2 rounded bg-slate-200"></div>
      </div>
    </div>
  </div>
);

export default ChartCardLoading;
