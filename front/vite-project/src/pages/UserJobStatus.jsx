import React, { useState, useEffect } from "react";
import { FaArrowDown, FaTrash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteJobApplicationMutation,
  useGetEmployerJobByIdQuery,
  useUpdateJobCandidateStatusMutation,
} from "../slices/jobApiSlice";
import { useGetUserCvMutation } from "../slices/userApiSlice";
import RankModal from "../components/RankingModal";
import BackArrow from "../components/BackArrow";

const UserJobStatus = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: jobData, isLoading } = useGetEmployerJobByIdQuery(jobId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 5;
  const [candidates, setCandidates] = useState([]);
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [deleteJobApplication] = useDeleteJobApplicationMutation();
  const [getUserCv] = useGetUserCvMutation();
  const [updateJobCandidateStatus] = useUpdateJobCandidateStatusMutation();
  const [coverLetterModalOpen, setCoverLetterModalOpen] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("");

  useEffect(() => {
    if (jobData?.data?.job?.candidates) {
      setCandidates(jobData.data.job.candidates);
    }
  }, [jobData]);

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );

  const handleViewCv = async (userId) => {
    const result = await getUserCv({ userId, notifaction: true }).unwrap();
    if (result?.cvUrl) {
      window.open(result.cvUrl, "_blank");
    } else {
      alert("No CV found for this user.");
    }
  };

  const toggleDropdown = (candidateId) => {
    setIsDropdownOpen(isDropdownOpen === candidateId ? null : candidateId);
  };

  const handleStatusChange = async (userId, status) => {
    await updateJobCandidateStatus({ jobId, userId, status }).unwrap();
    toggleDropdown(userId);
  };

  const handleDeleteApplication = async (candidate) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${candidate.user.firstName}'s application?`
    );
    if (!confirmDelete) return;
    await deleteJobApplication({ jobId, userId: candidate.user._id }).unwrap();
    refetch();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setCandidates(
      jobData?.data.job.candidates.filter(
        (candidate) => candidate.status === selectedStatus
      )
    );
  };

  const handleRankModalOpen = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setRankModalOpen(true);
  };

  const handleViewCoverLetter = (coverLetter) => {
    setSelectedCoverLetter(coverLetter);
    setCoverLetterModalOpen(true);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-end mb-4">
        <BackArrow color={"black"} url={-1} />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-right">סטטוס מועמד</h2>
      <div className="mb-4">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          onChange={handleFilterChange}
          className="ml-2 p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="fit">התקבל</option>
          <option value="pending">בהמתנה</option>
          <option value="unfit">בראיון</option>
        </select>
      </div>

      <table className="table-auto w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">אופציות</th>
            <th className="px-4 py-2 text-right">מכתב מקדים</th>
            <th className="px-4 py-2 text-right">קורות חיים</th>
            <th className="px-4 py-2 text-right">מספר טלפון</th>
            <th className="px-4 py-2 text-right">שם משפחה</th>
            <th className="px-4 py-2 text-right">שם פרטי</th>
            <th className="px-4 py-2 text-right">סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.user._id} className="border-b">
              <td className="relative px-4 py-2 text-left">
                <button
                  onClick={() => toggleDropdown(candidate.user._id)}
                  className="text-blue-500"
                >
                  <FaArrowDown />
                </button>
                <button
                  onClick={() => handleRankModalOpen(candidate.user._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Rank
                </button>
                <button
                  onClick={() => handleDeleteApplication(candidate)}
                  className="text-red-500 ml-2"
                >
                  <FaTrash />
                </button>
                {isDropdownOpen === candidate.user._id && (
                  <div className="absolute mt-2 bg-white border rounded shadow-lg z-50">
                    <ul>
                      <li
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          handleStatusChange(candidate.user._id, "fit")
                        }
                      >
                        התקבל
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          handleStatusChange(candidate.user._id, "pending")
                        }
                      >
                        בהמתנה
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          handleStatusChange(candidate.user._id, "unfit")
                        }
                      >
                        בראיון
                      </li>
                    </ul>
                  </div>
                )}
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() =>
                    handleViewCoverLetter(
                      candidate.coverLetter || "No Cover Letter"
                    )
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  הצגת מכתב מקדים
                </button>
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => handleViewCv(candidate.user._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  הצגת קורות חיים
                </button>
              </td>
              <td className="px-4 py-2 text-right">
                {candidate.user.phoneNumber}
              </td>
              <td className="px-4 py-2 text-right">
                {candidate.user.lastName}
              </td>
              <td className="px-4 py-2 text-right">
                {candidate.user.firstName}
              </td>
              <td className="px-4 py-2 text-right">
                <span
                  className={`px-4 py-2 rounded-full text-white ${
                    candidate.status === "fit"
                      ? "bg-green-500"
                      : candidate.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                >
                  {candidate.status === "fit"
                    ? "התקבל"
                    : candidate.status === "pending"
                    ? "בהמתנה"
                    : "בראיון"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastCandidate >= candidates.length}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {rankModalOpen && (
        <RankModal
          userId={selectedCandidateId}
          onClose={() => setRankModalOpen(false)}
        />
      )}

      {coverLetterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="text-lg font-bold mb-4">מכתב מקדים</h2>
            <p className="text-gray-800">{selectedCoverLetter}</p>
            <button
              onClick={() => setCoverLetterModalOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserJobStatus;
