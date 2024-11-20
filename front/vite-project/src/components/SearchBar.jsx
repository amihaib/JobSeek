import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function JobSearchBar() {
  const navigate = useNavigate();
  const [jobField, setJobField] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [generalSearch, setGeneralSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://data.gov.il/api/3/action/datastore_search",
          {
            params: {
              resource_id: "b7cf8f14-64a2-4b33-8d4b-edb286fdbd37",
              limit: 1000,
            },
          }
        );
        const cityList = response.data.result.records.map(
          (city) => city["שם_ישוב"]
        );
        setCities(cityList);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleJobFieldChange = (e) => setJobField(e.target.value);
  const handleJobTitleChange = (e) => setJobTitle(e.target.value);
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    if (e.target.value.length > 1) {
      setFilteredCities(
        cities.filter((city) =>
          city.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setFilteredCities([]);
    }
  };
  const handleJobTypeChange = (e) => setJobType(e.target.value);
  const handleGeneralSearchChange = (e) => setGeneralSearch(e.target.value);

  const handleSearch = () => {
    if (activeTab === "general" && generalSearch) {
      const terms = generalSearch.split(",").map((term) => term.trim());
      const filters = {};

      // Build filters based on provided terms
      if (terms.length > 0) {
        filters.$or = []; // Create an array to hold multiple conditions
        terms.forEach((term) => {
          filters.$or.push(
            { jobCity: { $regex: term, $options: "i" } }, // Filter by jobCity
            { jobField: { $regex: term, $options: "i" } }, // Filter by jobField
            { jobTitle: { $regex: term, $options: "i" } } // Filter by jobTitle
          );
        });
      }

      const searchParams = new URLSearchParams({
        generalSearch: true,
        filters: JSON.stringify(filters), // Send filters as a JSON string
      }).toString();

      navigate(`/all-jobs?${searchParams}`);
    } else {
      // Standard field-based search
      const params = new URLSearchParams({
        ...(jobField && { jobField }),
        ...(jobTitle && { jobTitle }),
        ...(location && { jobCity: location }), // Updated to jobCity
        ...(jobType && { jobType }),
      });
      navigate(`/all-jobs?${params}`);
    }
  };

  return (
    <div className="bg-orange rounded-3xl p-5 shadow-sm flex flex-col items-center w-full md:max-w-md md:max-w-lg lg:max-w-4xl mx-auto">
      <div className="flex justify-center mb-5 w-full">
        <span
          className={`mx-4 text-gray-600 cursor-pointer ${
            activeTab === "byField"
              ? "font-semibold border-b-2 border-orange-500"
              : ""
          } text-center`}
          onClick={() => setActiveTab("byField")}
        >
          חיפוש לפי תחום
        </span>
        <span
          className={`mx-4 text-gray-600 cursor-pointer ${
            activeTab === "general"
              ? "font-semibold border-b-2 border-orange-500"
              : ""
          } text-center`}
          onClick={() => setActiveTab("general")}
        >
          חיפוש חופשי
        </span>
      </div>

      {activeTab === "byField" ? (
        <div className="flex flex-col md:flex-row justify-between w-full">
          <div className="flex flex-col mb-4 md:mb-0 md:mr-4 text-center w-full">
            <span className="text-gray-600 text-md mb-1 text-center">תחום</span>
            <input
              type="text"
              placeholder="בחרו תחום"
              className="w-full md:w-48 p-2 rounded-full border border-gray-300 text-md text-center"
              value={jobField}
              onChange={handleJobFieldChange}
            />
          </div>

          <div className="flex flex-col mb-4 md:mb-0 md:mr-4 text-center w-full">
            <span className="text-gray-600 text-md mb-1 text-center">
              תפקידים
            </span>
            <input
              type="text"
              placeholder="בחרו תפקידים"
              className="w-full md:w-48 p-2 rounded-full border border-gray-300 text-md text-center"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col mb-4 md:mb-0 md:mr-4 text-center w-full relative">
            <span className="text-gray-600 text-md mb-1 text-center">
              מיקום
            </span>
            <input
              type="text"
              placeholder="בחרו עיר"
              className="w-full md:w-48 p-2 rounded-full border border-gray-300 text-md text-center"
              value={location}
              onChange={handleLocationChange}
              onBlur={() => setFilteredCities([])}
            />
            {filteredCities.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 mt-14 rounded-lg max-h-40 overflow-y-auto z-20 w-full md:w-48">
                {filteredCities.map((city, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setLocation(city);
                      setFilteredCities([]);
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col mb-4 md:mb-0 text-center w-full">
            <span className="text-gray-600 text-md mb-1 text-center">
              סוג משרה
            </span>
            <select
              className="w-full md:w-48 p-2 rounded-full border border-gray-300 text-md text-center"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">בחרו סוג משרה</option>
              <option value="Full-Time">משרה מלאה</option>
              <option value="Part-Time">משרה חלקית</option>
              <option value="Freelance">פרילנס</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <input
            type="text"
            placeholder="השתמש בפסיק כדי לחפש יותר ממילת מפתח אחת, לדוגמא: פיתוח, ירושלים"
            className="w-full p-2 rounded-full border border-gray-300 text-md text-center placeholder:font-bold placeholder:text-gray-500" // Adding placeholder:text-black to make text black
            value={generalSearch}
            onChange={(e) => setGeneralSearch(e.target.value)}
          />
        </div>
      )}

      <button
        className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mt-5"
        onClick={handleSearch}
      >
        <i className="fa fa-search"></i>
      </button>
    </div>
  );
}

export default JobSearchBar;
