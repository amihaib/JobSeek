import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import Spinner from "./Spinner";
import { useGetRandomJobsQuery } from "../slices/jobApiSlice"; // Import the hook

const JobCards = ({ isHome }) => {
  const { data: jobs, isLoading } = useGetRandomJobsQuery(); // Fetch random jobs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div
      className={`w-screen items-center flex flex-col mt-10 mx-auto ${
        isHome ? "flex-wrap justify-evenly md:flex lg:flex-row" : ""
      }`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {jobs?.data.map((job) =>
            isHome ? (
              <JobCard key={job._id} job={job} />
            ) : (
              <Alljobs key={job._id} job={job} />
            )
          )}
        </>
      )}
    </div>
  );
};

export default JobCards;
