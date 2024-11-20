import React from "react";
import CountUp from "react-countup";

const Statistics = () => {
  return (
    <div className="mt-5 flex-auto content-center h-44 w-screen shadow bg-gray-800">
      <div>
        <dl className="flex items-center justify-evenly p-4 text-gray-900 dark:text-white">
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-5xl font-extrabold">
              <CountUp end={3301} />
            </dt>
            <dd className="text-2xl text-gray-500 dark:text-gray-400">
              חברות מגייסות עכשיו
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-5xl font-extrabold">
              <CountUp end={31989} />
            </dt>
            <dd className="text-2xl text-gray-500 dark:text-gray-400">
              משרות באתר
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-5xl font-extrabold">
              <CountUp end={8409} />
            </dt>
            <dd className="text-2xl text-gray-500 dark:text-gray-400">
              משרות חדשות מהשבוע האחרון
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Statistics;
