import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageJob = ({ job, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Accordion state
  const [jobTitle, setJobTitle] = useState(job.jobTitle);
  const [jobDescription, setJobDescription] = useState(job.jobDescription);
  const [jobCity, setJobCity] = useState(job.jobCity);
  const [jobSalary, setJobSalary] = useState(job.jobSalary);
  const [jobField, setJobField] = useState(job.jobField);
  const [jobType, setJobType] = useState(job.jobType);
  const navigate = useNavigate();

  const handleSaveEdit = () => {
    const updatedJob = {
      jobTitle,
      jobDescription,
      jobCity,
      jobSalary,
      jobField,
      jobType,
    };
    onUpdate(updatedJob); // Pass the updated job data to the parent component
    setIsEditing(false); // Exit edit mode
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleUserJobStatus = (jobId) => {
    // Correct the navigation path without repeating "/employer-profile/manage-jobs"
    navigate(`/employer-profile/manage-jobs/${jobId}/UserJobStatus`);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow mb-2">
      {/* Accordion Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleAccordion}
      >
        {/* Buttons on the left */}
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                className="p-2 bg-green-500 text-white rounded"
                onClick={handleSaveEdit}
              >
                <FaCheck />
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={onDelete}
              >
                <FaTrash />
              </button>
              <button
                className="p-2 bg-green-500 text-white rounded"
                onClick={() => handleUserJobStatus(job._id)}
              >
                <FaUsers />
              </button>
            </>
          )}
        </div>

        {/* Job Title on the right */}
        <h3 className="text-lg font-semibold text-right flex-grow">
          {jobTitle}
        </h3>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="mt-2 text-sm text-gray-700">
          {isEditing ? (
            <div>
              {/* Edit Form for All Fields */}
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
              />
              <textarea
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Job Description"
              />
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={jobCity}
                onChange={(e) => setJobCity(e.target.value)}
                placeholder="City"
              />
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={jobSalary}
                onChange={(e) => setJobSalary(e.target.value)}
                placeholder="Salary"
              />
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={jobField}
                onChange={(e) => setJobField(e.target.value)}
                placeholder="Field"
              />
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                placeholder="Job Type"
              />
            </div>
          ) : (
            // Display job details when not editing
            <>
              <p className="mt-1">תיאור המשרה: {jobDescription}</p>
              <p className="mt-1">מיקום המשרה: {jobCity}</p>
              <p className="mt-1">שכר המשרה: {jobSalary}</p>
              <p className="mt-1">מקצוע: {jobField}</p>
              <p className="mt-1">היקף משרה: {jobType}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageJob;
