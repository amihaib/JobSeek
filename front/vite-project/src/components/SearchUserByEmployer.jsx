import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useGetUserCvMutation, useGetUsersQuery } from "../slices/userApiSlice";
import { useNavigate } from "react-router-dom";
import BackArrow from "./BackArrow";

const SearchUserByEmployer = () => {
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [query, setQuery] = useState({}); // Initialize query as an empty object

  const {
    data: users,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useGetUsersQuery(query, {
    skip: !query.profession && !query.city && !query.experience, // Only skip if no query parameters are set
  });

  const [getUserCv] = useGetUserCvMutation();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect is no longer necessary since refetching will be handled by the query itself
  }, [query, refetch]);

  const handleSearch = () => {
    if (profession || city || experience) {
      // Only update the query if there are actual parameters
      setQuery({
        profession: profession || undefined,
        city: city || undefined,
        experience: experience ? parseInt(experience, 10) : undefined,
      });
    }
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
    <div className="relative">
      <div className="absolute top-4 left-4">
        <BackArrow color={"black"} url={"/employer-profile"} />
      </div>
      <div className="flex items-center justify-center bg-orange-500 py-4 px-6 rounded-full shadow-lg w-full md:w-3/4 lg:w-2/3 mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-4 w-full">
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Search by Profession"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search by City"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
          />
          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Search by Experience"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={handleSearch}
            className="bg-white p-3 rounded-full flex items-center justify-center text-orange-500 text-xl"
          >
            <FaSearch />
          </button>
        </div>
      </div>
      {/* Render Search Results in a Table */}
      <div className="mt-8 mx-auto max-w-4xl">
        {isLoading || isFetching ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : users && users.length > 0 ? (
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">CV</th>
                <th className="py-2 px-4 border-b">Experience</th>
                <th className="py-2 px-4 border-b">Profession</th>
                <th className="py-2 px-4 border-b">Employee Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleViewCv(user._id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      View CV
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {user.experience} years
                  </td>
                  <td className="py-2 px-4 border-b">{user.profession}</td>
                  <td className="py-2 px-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No search results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchUserByEmployer;
