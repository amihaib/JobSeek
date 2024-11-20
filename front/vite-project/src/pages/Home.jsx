// Mine 9.8
import React from "react";
import JobSearchBar from "../components/SearchBar";
import JobCards from "../components/JobCards";
import Statistics from "../components/Statistics";

const Home = () => {
  return (
    <div>
      <JobSearchBar />
      <JobCards isHome={true} />
      <Statistics />
    </div>
  );
};

export default Home;
