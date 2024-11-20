import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ManageJob from "../components/ManageJob";
import AddJobModal from "../components/AddJobModal";
import {
  useGetEmployerJobsQuery,
  useDeleteJobMutation,
  useEditJobMutation,
} from "../slices/jobApiSlice";
import PageContext from "../context/pagesContext";
import BackArrow from "../components/BackArrow";

const ManageJobsPage = () => {
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false); // State for controlling the Add Job modal
  const [publishedJobs, setPublishedJobs] = useState([]); // Store published jobs
  const { setActiveJob, setEditingJob } = useContext(PageContext); // Get the active job from the context
  const navigate = useNavigate(); // Initialize the navigate hook

  const { data, error, isLoading } = useGetEmployerJobsQuery(); // Fetch jobs via Redux
  const [deleteJob] = useDeleteJobMutation(); // For job deletion
  const [editJob] = useEditJobMutation(); // For job editing

  // Update the publishedJobs state when data is fetched
  useEffect(() => {
    if (data) {
      setPublishedJobs(data.data.jobs);
    }
  }, [data]);

  // Function to open the Add Job Modal
  const handleOpenAddJobModal = () => {
    setIsAddJobModalOpen(true);
  };

  // Function to close the Add Job Modal
  const handleCloseAddJobModal = () => {
    setIsAddJobModalOpen(false);
  };

  // Function to handle adding a new job
  const handleJobAdded = (newJob) => {
    setPublishedJobs([newJob, ...publishedJobs]); // Add the new job to the top of the list
  };

  // Function to handle job deletion
  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId).unwrap();
    } catch (error) {
      console.error("Failed to delete job: ", error);
    }
  };

  // Function to handle job editing
  const handleEditJob = async (id, updatedJob) => {
    try {
      await editJob({ id, updatedJob }).unwrap();
    } catch (error) {
      console.error("Failed to edit job: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Arrow */}
      <div className="flex justify-start mb-6">
        <BackArrow color={"black"} url={-1} />
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">ניהול משרות</h1>

        {/* Button to open Add Job Modal */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              navigate("/employer-profile/add-job");
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            פרסם משרה
          </button>
        </div>

        {/* Add Job Modal */}
        {/* <AddJobModal
          isOpen={isAddJobModalOpen}
          onRequestClose={handleCloseAddJobModal}
          onJobAdded={handleJobAdded} // Pass the callback to update the job list
        /> */}

        {/* Existing Jobs Section */}
        <h2 className="text-2xl font-semibold mb-4">משרות קיימות</h2>

        {/* List of Published Jobs */}
        <div className="space-y-4">
          {publishedJobs.length > 0 ? (
            publishedJobs.map((job) => (
              <ManageJob
                key={job._id}
                job={job}
                onDelete={() => handleDeleteJob(job._id)} // Pass the job ID to delete
                onUpdate={(updatedJob) => handleEditJob(job._id, updatedJob)} // Pass the job ID and updated data to edit
              />
            ))
          ) : (
            <p>אין משרות זמינות.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobsPage;
