import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetJobsAppliedByUserQuery } from "../slices/jobApiSlice";
import { useGetUserCvMutation } from "../slices/userApiSlice";
import { useAddEmployerReviewMutation } from "../slices/employerApiSlice";

const JobApplied = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: jobs, error, isLoading } = useGetJobsAppliedByUserQuery(userId);
  const [openJobId, setOpenJobId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [employerIdForReview, setEmployerIdForReview] = useState(null);
  const [getUserCv] = useGetUserCvMutation();
  const [addEmployerReview] = useAddEmployerReviewMutation();
  const [modalContent, setModalContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reviewContent, setReviewContent] = useState({
    process: "1",
    responseTime: "1",
    attitude: "1",
    notes: "",
  });

  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error.message}</div>;

  const toggleJob = (id) => {
    setOpenJobId(openJobId === id ? null : id);
  };

  const handleReviewClick = (employerId) => {
    setEmployerIdForReview(employerId);
    setShowReviewModal(true);
  };

  const handleInputChange = (e) => {
    setReviewContent({ ...reviewContent, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async () => {
    try {
      const { process, responseTime, attitude, notes } = reviewContent;
      const reviewData = {
        ratings: {
          process,
          responseTime,
          attitude,
        },
        notes,
      };

      await addEmployerReview({
        employerId: employerIdForReview,
        review: reviewData,
      }).unwrap();

      setShowReviewModal(false);
      console.log("Review submitted successfully");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleViewRatings = (employerId) => {
    navigate(`/employerReviews/${employerId}`); // Navigate to the ratings page
  };

  const handleViewCoverLetter = (coverLetter) => {
    setModalContent(coverLetter);
    setShowModal(true);
  };

  const handleViewCv = async (userId) => {
    getUserCv({ userId }).then((result) => {
      if (result?.data?.cvUrl) {
        window.open(result.data.cvUrl, "_blank");
      } else {
        alert("No CV found for this user");
      }
    });
  };

  return (
    <div className="space-y-4 p-4">
      <button onClick={() => navigate(-1)} className="text-2xl mb-4">
        &#10229; Back
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <p>{modalContent || "No cover letter available."}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h2 className="font-bold text-lg">השאר חוות דעת</h2>
            {["process", "responseTime", "attitude"].map((field) => (
              <div key={field}>
                <label>
                  {field === "process"
                    ? "מהלך המיון:"
                    : field === "responseTime"
                    ? "זמן היענות:"
                    : "יחס המעסיק:"}
                </label>
                <select
                  name={field}
                  value={reviewContent[field]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <textarea
              name="notes"
              value={reviewContent.notes}
              onChange={handleInputChange}
              placeholder="תגובה חופשית..."
              className="w-full p-2 border rounded mt-2"
            />
            <div className="flex justify-between space-x-2 mt-4">
              <button
                onClick={handleSubmitReview}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                שלח חוות דעת
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {jobs &&
        jobs.map((job) => (
          <div key={job._id} className="shadow rounded bg-white">
            <button
              onClick={() => toggleJob(job._id)}
              className="w-full text-left p-4 text-lg font-bold"
            >
              {job.jobTitle}, {job.companyName}
            </button>
            {openJobId === job._id && (
              <div className="p-4 border-t">
                <p>{job.jobDescription}</p>
                <p>
                  סטטוס:{" "}
                  {(() => {
                    const status =
                      job.candidates.find((c) => c.user === userId)?.status ||
                      "אין סטטוס להצגה";

                    switch (status) {
                      case "fit":
                        return "התקבל";
                      case "pending":
                        return "בהמתנה";
                      case "unfit":
                        return "בראיון";
                      default:
                        return "No status available";
                    }
                  })()}
                </p>
                <button
                  onClick={() => handleViewCv(userId)}
                  className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  הצגת קורות חיים
                </button>
                <button
                  onClick={() =>
                    handleViewCoverLetter(
                      job.candidates.find((c) => c.user === userId)?.coverLetter
                    )
                  }
                  className="mt-2 ml-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  מכתב אישי
                </button>
                {(job.candidates.find((c) => c.user === userId)?.status ===
                  "fit" ||
                  job.candidates.find((c) => c.user === userId)?.status ===
                    "unfit") && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleReviewClick(job.author)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    >
                      השאר חוות דעת
                    </button>
                    <button
                      onClick={() => handleViewRatings(job.author, job._id)} // Navigate to ratings page
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      הצג חוות דעת
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default JobApplied;
