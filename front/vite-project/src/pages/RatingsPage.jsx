import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCandidateRatingsQuery } from "../slices/userApiSlice";

const RatingsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetCandidateRatingsQuery(userId);
  const [currentPage, setCurrentPage] = useState(1);
  const ratingsPerPage = 3;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching ratings.</div>;

  // Pagination controls
  const lastRatingIndex = currentPage * ratingsPerPage;
  const firstRatingIndex = lastRatingIndex - ratingsPerPage;
  const currentRatings = data?.data.slice(firstRatingIndex, lastRatingIndex);

  // Calculate total pages
  const totalPages = data ? Math.ceil(data.data.length / ratingsPerPage) : 0;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  if (data && data.data.length > 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Ratings Overview</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-700"
          >
            &#x2190; Back
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {currentRatings.map((res) => (
            <div key={res._id} className="p-4 shadow-lg rounded-lg bg-white">
              <div className="font-bold text-lg mb-2">Ratings-</div>
              <div>
                <strong>Resume Rating:</strong> {res.ratings.resume}
              </div>
              <div>
                <strong>Interview Rating:</strong> {res.ratings.interview}
              </div>
              <div>
                <strong>Tests Rating:</strong> {res.ratings.tests}
              </div>
              <div>
                <strong>Notes:</strong> {res.notes}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md hover:bg-blue-500 hover:text-white disabled:opacity-50"
          >
            &#x2190;
          </button>
          {currentPage > 1 && (
            <button
              onClick={() => paginate(1)}
              className="px-4 py-2 border rounded-md hover:bg-blue-500 hover:text-white"
            >
              1
            </button>
          )}
          <span>{currentPage}</span>
          {currentPage < totalPages && (
            <button
              onClick={() => paginate(totalPages)}
              className="px-4 py-2 border rounded-md hover:bg-blue-500 hover:text-white"
            >
              {totalPages}
            </button>
          )}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md hover:bg-blue-500 hover:text-white disabled:opacity-50"
          >
            &#x2192;
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">No Ratings Found</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-700"
          >
            &#x2190; Back
          </button>
        </div>
      </div>
    );
  }
};

export default RatingsPage;
