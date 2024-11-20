import React from "react";

const EmployerDash = () => {
  return (
    <div className="w-screen flex mx-auto justify-center">
      <div class="w-8/12 grid grid-cols-6 gap-4 text-center *:flex *:justify-center *:items-center *:shadow-lg *:rounded-lg">
        <div class="col-span-6 bg-gray-800 text-white">
          <h2 className="font-bold">נתנאל מליני</h2>
          <i class="bx bx-lg bx-user-pin"></i>
        </div>
        <div class="col-start-2 col-span-2">company name</div>
        <div class="col-start-4 col-span-2">company description</div>
        <div class="col-start-2 col-span-2">company logo</div>
        <div class="col-start-4 col-span-2">company size</div>
      </div>
    </div>
  );
};

export default EmployerDash;
