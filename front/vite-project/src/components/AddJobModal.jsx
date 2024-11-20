import React, { useContext, useState } from "react";
import { useCreateJobMutation } from "../slices/jobApiSlice";
import { useNavigate } from "react-router-dom";
import BackArrow from "./BackArrow";
import PageContext from "../context/pagesContext";

const AddJobModal = () => {
  const { successToast } = useContext(PageContext);
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [jobCity, setJobCity] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobField, setJobField] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [jobSalary, setJobSalary] = useState("");
  const [message, setMessage] = useState("");
  const [createJob] = useCreateJobMutation();

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    createJob({
      jobTitle,
      jobDescription,
      dueDate,
      jobCity,
      jobRequirements,
      jobField,
      jobType,
      jobSalary,
    }).then((result) => {
      successToast("Job created successfully!");
      setJobTitle("");
      setJobDescription("");
      setDueDate("");
      setJobCity("");
      setJobRequirements("");
      setJobField("");
      setJobType("");
      setJobSalary("");
      navigate(-1);
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {/* Back Arrow to navigate back to profile */}
      <div className="flex justify-start mb-4">
        <BackArrow color={"black"} url={-1} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-4/5 overflow-scroll max-w-md md:max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">פרסם משרה</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
              placeholder="jobs title"
            />
          </div>

          <div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              rows="4"
              required
              placeholder="תיאור משרה"
            ></textarea>
          </div>

          <div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
              placeholder="תאריך יצירת המשרה"
            />
          </div>

          <div>
            <input
              type="text"
              value={jobCity}
              onChange={(e) => setJobCity(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
              placeholder="באיזה עיר המשרה"
            />
          </div>

          <div>
            <textarea
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              rows="3"
              required
              placeholder="דרישות המשרה"
            ></textarea>
          </div>

          <div>
            <input
              type="text"
              value={jobField}
              onChange={(e) => setJobField(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
              placeholder="איזה תפקיד המשרה?"
            />
          </div>

          <div>
            <select
              onChange={(e) => {
                setJobType(e.target.value);
              }}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            >
              <option value="Full-Time" selected>
                משרה מלאה
              </option>
              <option value="Part-Time">משרה חלקית</option>
              <option value="Freelance">פרילנס</option>
            </select>
          </div>

          <div>
            <input
              type="number"
              value={jobSalary}
              onChange={(e) => setJobSalary(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              required
              placeholder="שכר למשרה"
            />
          </div>

          {/* Save and Publish Button */}
          <div className="flex justify-end space-x-4">
            {/* <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onRequestClose}
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Save and Publish Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
