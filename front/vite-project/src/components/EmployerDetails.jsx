import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation, useNavigate } from 'react-router-dom';

const EmployerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { employer } = location.state;

  const {
    companyName,
    companyLogo,
    numberOfEmployees,
    companyDetails,
    companyLocation,
    companyJobPosts = [], // Default to empty array if undefined
    averageRating,
    userComments = [], // Default to empty array if undefined
  } = employer;

  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedComment, setExpandedComment] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resume, setResume] = useState(null);

  const jobsPerPage = 3;
  const commentsPerPage = 5;

  const indexOfLastJob = currentJobPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = companyJobPosts.slice(indexOfFirstJob, indexOfLastJob);

  const indexOfLastComment = currentCommentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = userComments.slice(indexOfFirstComment, indexOfLastComment);

  const totalJobPages = Math.ceil(companyJobPosts.length / jobsPerPage);
  const totalCommentPages = Math.ceil(userComments.length / commentsPerPage);

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    // Add logic to handle resume submission, such as making an API call
    setIsApplyModalOpen(false);
    setSelectedJob(null);
    alert("Application submitted!");
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => navigate(-1)}>Back</button>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            src={companyLogo}
            alt={companyName}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto md:mx-0"
          />
          <div className="md:ml-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-orange-600">{companyName}</h2>
            <p className="text-gray-700">{numberOfEmployees} Employees</p>
            <p className="text-gray-700">{companyDetails}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Location</h3>
          <div className="h-64">
            <MapContainer
              center={[companyLocation.lat, companyLocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[companyLocation.lat, companyLocation.lng]}>
                <Popup>{companyName}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Job Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentJobs.map((job) => (
              <div key={job.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-bold">{job.title}</h4>
                <button
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </button>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => handleApply(job)}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {currentJobPage > 1 && (
              <button onClick={() => setCurrentJobPage(currentJobPage - 1)}>
                &lt; Prev
              </button>
            )}
            {currentJobPage < totalJobPages && (
              <button onClick={() => setCurrentJobPage(currentJobPage + 1)}>
                Next &gt;
              </button>
            )}
          </div>
        </div>
        {selectedJob && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
              <h3 className="text-2xl font-bold mb-2">{selectedJob.title}</h3>
              <p className="text-gray-700">{selectedJob.description}</p>
              <button
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {isApplyModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
              <h3 className="text-2xl font-bold mb-4">Apply for {selectedJob.title}</h3>
              <input type="file" onChange={handleResumeChange} />
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleSubmitApplication}
              >
                Submit Application
              </button>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Average Rating</h3>
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, index) => (
              <svg
                key={index}
                className={`w-6 h-6 ${index < averageRating ? 'text-orange-500' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.568L24 9.432l-6 5.849 1.413 8.223L12 18.9l-7.413 4.604L6 15.281 0 9.432l8.332-1.277L12 .587z" />
              </svg>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">User Comments</h3>
            <ul className="space-y-4">
              {currentComments.map((comment, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <p className="font-bold">{comment.username}</p>
                  <p className="text-gray-500 text-sm">{new Date(comment.date).toLocaleDateString()}</p>
                  <p className="text-gray-700">
                    {expandedComment === index
                      ? comment.text
                      : `${comment.text.slice(0, 100)}...`}
                  </p>
                  {comment.text.length > 100 && (
                    <button
                      className="text-orange-500"
                      onClick={() =>
                        setExpandedComment(expandedComment === index ? null : index)
                      }
                    >
                      {expandedComment === index ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-4">
              {currentCommentPage > 1 && (
                <button onClick={() => setCurrentCommentPage(currentCommentPage - 1)}>
                  &lt; Prev
                </button>
              )}
              {currentCommentPage < totalCommentPages && (
                <button onClick={() => setCurrentCommentPage(currentCommentPage + 1)}>
                  Next &gt;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDetails;
