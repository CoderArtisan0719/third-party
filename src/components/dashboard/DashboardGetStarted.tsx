const DashboardGetStarted = () => (
  <div className="mt-4 grid rounded-lg bg-primary-azureBlue p-8 lg:grid-cols-6">
    <div className="flex items-center lg:col-span-5">
      <div className="rounded-full bg-black">
        <img src="/img/trumpet.png" width="60" alt="trumpet.png" />
      </div>

      <div className="flex flex-col justify-center pl-8 text-white">
        <p>The easiest way to increase sales up to 22 times.</p>

        <p className="mt-4">
          Unleash the power of this sales tactic and increase your revenue by 22
          times
        </p>
      </div>
    </div>

    <div className="flex items-center justify-center lg:justify-end">
      <button className="mt-4 rounded-xl bg-white px-4 py-2 lg:mt-0">
        New Request
      </button>
    </div>
  </div>
);

export default DashboardGetStarted;
