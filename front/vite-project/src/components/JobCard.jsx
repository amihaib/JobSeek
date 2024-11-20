import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileUpload, FaArrowLeft, FaTrash } from "react-icons/fa";
import Modal from "./ModalForJobApply";
import {
  useApplyToJobMutation,
  useGetUserCVsQuery,
  useDeleteCVMutation,
  useGetUserDetailsQuery,
} from "../slices/jobApiSlice"; // Import hooks
import { useGetEmployerDetailsByJobIdQuery } from "../slices/employerApiSlice";
import PageContext from "../context/pagesContext";

const JobCard = ({ job }) => {
  const { isLogin, whosLogin, errorToast } = useContext(PageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedCV, setSelectedCV] = useState(null);
  const navigate = useNavigate();

  // Use Redux mutations and queries
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();
  const { data: cvListData, isLoading: isCVsLoading } = useGetUserCVsQuery(
    undefined,
    {
      skip: !isModalOpen,
    }
  );
  const { data: userDetails, isLoading: isUserLoading } =
    useGetUserDetailsQuery(undefined, {
      skip: !isModalOpen,
    });
  const [deleteCV] = useDeleteCVMutation();
  const {
    data: employerDetails,
    error: employerDetailsError,
    isLoading: isEmployerDetailsLoading,
  } = useGetEmployerDetailsByJobIdQuery({ employerId: job.author });

  const showCv = (cvUrl) => {
    window.open(cvUrl, "_blank");
  };

  const handleDeleteCV = async (cvId) => {
    try {
      await deleteCV(cvId);
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  const openModal = () => {
    if (!isLogin) {
      errorToast("Must Login to Apply!");
    } else if (whosLogin === "employer") {
      errorToast("Employer Cannot Apply for a Job!");
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    if (!selectedCV) {
      alert("Please select a CV before applying.");
      return;
    }
    try {
      const data = await applyToJob({
        jobId: job._id,
        coverLetter, // Send the cover letter
      });
      console.log(data);
      alert("Application submitted successfully!");
      closeModal();
    } catch (err) {
      console.error("Error submitting application:", err);
    }
  };

  const handleEditProfile = () => {
    if (userDetails) {
      console.log("Navigating with user details:", userDetails);
      navigate("/profile/edit-profile", { state: { user: userDetails.data } }); // Pass user details
      console.log(userDetails.data);
    } else {
      console.error("User data not found or incomplete:", userDetails);
      errorToast("User data not found or incomplete. Please try again.");
    }
  };

  return (
    <>
      <div
        id={job._id}
        className="flex flex-col h-screen justify-between max-w-sm p-6 shadow bg-gray-800 border-gray-700 text-right mb-5 rounded-xl"
      >
        <img
          src={employerDetails?.companyLogo || job.picture}
          alt={employerDetails?.companyName || job.author}
          className="w-full"
        />
        <a href="#" className="text-2xl text-slate-200">
          {employerDetails?.companyName || "Company Name"}
        </a>
        <h5 className="text-2xl text-slate-50 my-4">{job.jobTitle}</h5>
        <p className="mb-5 font-normal text-gray-400">{job.jobDescription}</p>

        <button
          onClick={openModal}
          className="min-w-36 justify-between inline-flex px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          הגש מועמדות
        </button>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="bg-white p-6 rounded-lg text-right">
            <h2 className="text-xl font-bold mb-4">
              הגשת מועמדות לחברה{" "}
              {employerDetails?.companyName || job.companyName}
            </h2>

            {/* Show the CV list */}
            {isCVsLoading ? (
              <p>Loading CVs...</p>
            ) : (
              <div className="mb-4">
                <h4 className="font-bold">בחר קובץ קו"ח:</h4>
                {cvListData?.data?.cvs?.map((cv) => (
                  <div
                    key={cv._id}
                    className={`justify-between items-center p-3 bg-gray-200 rounded-lg mb-2 ${
                      selectedCV === cv._id ? "bg-green-200" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm text-gray-800">{cv.fileName}</p>
                      <p className="text-xs text-gray-500">
                        עודכן: {new Date(cv.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-around space-x-4 pt-2">
                      <button
                        onClick={() => showCv(cv.cvUrl)}
                        className=" text-blue-500 underline mr-5 text-nowrap"
                      >
                        צפייה בקובץ
                      </button>
                      <button
                        onClick={() => handleDeleteCV(cv._id)}
                        className=" flex items-center text-red-500 underline"
                      >
                        <FaTrash className="inline mr-1" /> מחיקה
                      </button>
                      <button
                        onClick={() => setSelectedCV(cv._id)}
                        className="text-green-500 underline text-nowrap"
                      >
                        בחירת קובץ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation for managing CVs */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => navigate("/profile/upload-cv")}
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                לניהול קבצי קו"ח באזור האישי
                <FaArrowLeft className="ml-2" />
              </button>
            </div>

            {/* Display user details */}
            {isUserLoading ? (
              <p>Loading user details...</p>
            ) : (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={handleEditProfile} // Use the new function
                    className="text-blue-500 underline"
                  >
                    עריכה
                  </button>
                  <h3 className="font-bold">:מועמדותך תוגש עם הפרטים הבאים</h3>
                </div>
                <ShowMyDetails userDetails={userDetails} />
              </div>
            )}

            {/* Cover Letter Accordion */}
            <div className="mb-4">
              <button
                onClick={() => setCoverLetter((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 rounded-lg"
              >
                הוספת מכתב מקדים
                <FaArrowLeft className="ml-2" />
              </button>
              {coverLetter && (
                <textarea
                  className="mt-4 w-full p-2 border rounded-lg"
                  placeholder="הקלד את מכתב המקדים שלך כאן"
                  rows="4"
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              הגש מועמדות
            </button>
            {isApplying && <p>Submitting application...</p>}
          </div>
        </Modal>
      )}
    </>
  );
};

export default JobCard;

function ShowMyDetails({ userDetails }) {
  return (
    <div className="flex justify-center border-t-2 pt-4">
      <p className="text-right">
        <strong>:ניסיון</strong> {userDetails?.data?.experience}
      </p>
      <span className="border-r border-orange-500 mx-3"></span>
      <p className="text-right">
        <strong>:מקצוע</strong> {userDetails?.data?.profession}
      </p>
      <span className="border-r border-orange-500 mx-3"></span>
      <p className="text-right">
        <strong>:עיר</strong> {userDetails?.data?.city}
      </p>
      <span className="border-r border-orange-500 mx-3"></span>
      <p className="text-right">
        <strong>טלפון נייד:</strong> {userDetails?.data?.phoneNumber}
      </p>
      <span className="border-r border-orange-500 mx-3"></span>
      <p className="text-right">
        <strong>:דואר אלקטרוני</strong> {userDetails?.data?.email}
      </p>
    </div>
  );
}
