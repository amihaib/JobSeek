import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { Range, getTrackBackground } from "react-range";

const JobFilters = ({ onFilterChange }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [experienceLevels] = useState([
    { value: "Entry", label: "חסרי נסיון" },
    { value: "Mid", label: "בעלי נסיון" },
    { value: "Senior", label: "בכירים" },
  ]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [jobTypes] = useState([
    { value: "Full-Time", label: "משרה-מלאה" },
    { value: "Part-Time", label: "משרה-חלקית" },
    { value: "Freelance", label: "פרילנס" },
  ]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [salaryRange, setSalaryRange] = useState([0, 0]);

  useEffect(() => {
    const fetchLocations = async () => {
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
        const locationList = response.data.result.records.map((city) => ({
          value: city["שם_ישוב"],
          label: city["שם_ישוב"],
        }));
        setLocations(locationList);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      locations: selectedLocations.map((loc) => loc.value),
      experiences: selectedExperiences.map((exp) => exp.value),
      jobTypes: selectedJobTypes.map((type) => type.value),
      salaryRange,
    });
  };

  const handleSliderChange = (values) => {
    setSalaryRange(values);
  };

  const handleMinSalaryChange = (event) => {
    const minSalary = Math.max(0, Number(event.target.value));
    setSalaryRange([minSalary, Math.max(minSalary, salaryRange[1])]);
  };

  const handleMaxSalaryChange = (event) => {
    const maxSalary = Math.max(Number(event.target.value), salaryRange[0]);
    setSalaryRange([salaryRange[0], maxSalary]);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md flex flex-col items-center">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full max-w-4xl space-y-4 lg:space-y-0 text-center">
        <div className="flex flex-col lg:mr-4 text-center">
          <span className="text-gray-600 text-sm mb-1">מיקום משרה</span>
          <Select
            options={locations}
            isMulti
            value={selectedLocations}
            onChange={setSelectedLocations}
            onBlur={handleFilterChange}
            placeholder="איפה תרצו לעבוד?"
            className="w-48 text-sm"
            styles={{ container: (base) => ({ ...base, border: "none" }) }}
          />
        </div>
        <div className="flex flex-col lg:mr-4 text-center">
          <span className="text-gray-600 text-sm mb-1">רמת נסיון</span>
          <Select
            options={experienceLevels}
            isMulti
            value={selectedExperiences}
            onChange={setSelectedExperiences}
            onBlur={handleFilterChange}
            placeholder="בחרו רמת ניסיון"
            className="w-48 text-sm"
            styles={{ container: (base) => ({ ...base, border: "none" }) }}
          />
        </div>
        <div className="flex flex-col lg:mr-4 text-center">
          <span className="text-gray-600 text-sm mb-1">סוג משרה</span>
          <Select
            options={jobTypes}
            isMulti
            value={selectedJobTypes}
            onChange={setSelectedJobTypes}
            onBlur={handleFilterChange}
            placeholder="בחרו סוג היקף משרה"
            className="w-48 text-sm"
            styles={{ container: (base) => ({ ...base, border: "none" }) }}
          />
        </div>
        <div className="flex flex-col lg:mr-4 text-center">
          <span className="text-gray-600 text-sm mb-1">טווח שכר</span>
          <Range
            values={salaryRange}
            step={500}
            min={0}
            max={50000}
            onChange={handleSliderChange}
            rtl={true}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="w-48 h-2 bg-gray-300 rounded"
                style={{
                  background: getTrackBackground({
                    values: salaryRange,
                    colors: ["#ccc", "#007bff", "#ccc"],
                    min: 0,
                    max: 50000,
                    rtl: true,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="h-4 w-4 bg-orange-400 rounded-full shadow"
              />
            )}
          />
          <div className="flex justify-between mt-4">
            <input
              type="number"
              value={salaryRange[0]}
              min="0"
              max={salaryRange[1]}
              onChange={handleMinSalaryChange}
              className="w-20 border rounded text-center"
            />
            <input
              type="number"
              value={salaryRange[1]}
              min={salaryRange[0]}
              max="50000"
              onChange={handleMaxSalaryChange}
              className="w-20 border rounded text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
