import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetEmployerReviewsQuery } from "../slices/employerApiSlice"; // Import the Redux hook
import BackArrow from "../components/BackArrow";

const ReviewPage = () => {
  const { employerId, jobId } = useParams(); // Ensure you're getting jobId as well if needed for the query
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Use the Redux query hook to fetch reviews
  const { data, error, isLoading } = useGetEmployerReviewsQuery({
    employerId,
    jobId,
  });

  // Pagination controls
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = data?.data.reviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div>Error fetching reviews: {error.message}</div>;
  }

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-8">
      <BackArrow url={-1} />
      <h1 className="text-2xl font-bold">חוות דעת</h1>
      {currentReviews && currentReviews.length > 0 ? (
        <ul>
          {currentReviews.map((review) => (
            <li
              key={review._id}
              className="mb-4 p-4 border border-gray-300 rounded shadow"
            >
              <p>
                <strong>Process Rating:</strong> {review.ratings.process}
              </p>
              <p>
                <strong>Response Time Rating:</strong>{" "}
                {review.ratings.responseTime}
              </p>
              <p>
                <strong>Attitude Rating:</strong> {review.ratings.attitude}
              </p>
              <p>
                <strong>Notes:</strong> {review.notes || "No notes provided."}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews found for this job.</p>
      )}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 border rounded"
        >
          Previous
        </button>
        {Array.from(
          { length: Math.ceil(data?.data.reviews.length / reviewsPerPage) },
          (_, i) => i + 1
        ).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 ${
              number === currentPage ? "bg-blue-500 text-white" : "border"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage ===
            Math.ceil(data?.data.reviews.length / reviewsPerPage)
          }
          className="ml-2 px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
