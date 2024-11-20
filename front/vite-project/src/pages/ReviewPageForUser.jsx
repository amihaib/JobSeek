import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCandidateRatingsQuery } from "../slices/userApiSlice"; // Import the Redux query
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import arrow icons
import BackArrow from "../components/BackArrow";

const ReviewsPage = () => {
  const { userId } = useParams(); // Get userId from the URL
  const navigate = useNavigate(); // For navigating back

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // Number of reviews per page

  const {
    data: reviewsData,
    error,
    isLoading,
  } = useGetCandidateRatingsQuery(userId); // Use the Redux query
  //   console.log(reviewsData?.data[0].ratings.resume);

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <BackArrow color={"black"} url={-1} />{" "}
        <p>Failed to fetch reviews: {error.message}</p>
      </div>
    );

  // Calculate the reviews for the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewsData.data.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Determine the total number of pages
  const totalPages = Math.ceil(reviewsData.data.length / reviewsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next and previous buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-4">
      {/* Back arrow */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">הדירוגים שלי</h1>
        <BackArrow color={"black"} url={-1} />
      </div>

      {/* Reviews */}
      {currentReviews && currentReviews.length > 0 ? (
        <div className="space-y-4">
          {currentReviews.map((review, index) => (
            <div key={index} className="p-4 bg-white shadow rounded">
              <p className="text-lg font-bold">Ratings:</p>
              <p className="text-gray-600">Resume: {review.ratings.resume}</p>
              <p className="text-gray-600">
                Interview: {review.ratings.interview}
              </p>
              <p className="text-gray-600">Tests: {review.ratings.tests}</p>
              <p className="text-gray-600 mt-2">Notes: {review.notes}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews found.</p>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center space-x-4">
        {/* Previous Page Arrow */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1} // Disable if on first page
          className={`px-4 py-2 border rounded ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowLeft />
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === i + 1 ? "bg-gray-300" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Page Arrow */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages} // Disable if on last page
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ReviewsPage;
