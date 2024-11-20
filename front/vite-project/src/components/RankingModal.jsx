import React, { useState } from "react";
import { useUpdateCandidateRatingsMutation } from "../slices/userApiSlice";
import { useNavigate } from "react-router-dom";

const RankModal = ({ userId, onClose, hasInterviewed = true }) => {
  const [ratings, setRatings] = useState({ resume: 1, interview: 1, tests: 1 });
  const [notes, setNotes] = useState("");
  const [updateRatings] = useUpdateCandidateRatingsMutation();
  const navigate = useNavigate();

  // Handle changes to rating fields
  const handleChange = (field, value) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  // Handle submitting the new ratings
  const handleSubmit = async () => {
    const payload = {
      userId,
      ratings: {
        // Construct the ratings object as per the new schema
        resume: ratings.resume,
        interview: ratings.interview,
        tests: ratings.tests,
      },
      notes,
    };

    await updateRatings(payload);
    onClose(); // Optionally close the modal after saving
  };

  const handleViewRatings = () => {
    navigate(`/employer-profile/ratings/${userId}`); // Navigate to the ratings page
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-80 p-4 rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-lg font-bold"
        >
          &#x2715; {/* Unicode for X symbol */}
        </button>

        <div className="text-right space-y-4 pt-8">
          <h3 className="font-bold text-lg">דירוג המועמד</h3>
          {/* Rating for קורות חיים */}
          <div>
            <label className="block font-medium">דירוג קורות חיים:</label>
            <select
              value={ratings.resume}
              onChange={(e) => handleChange("resume", parseInt(e.target.value))}
              className="border p-1 rounded"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Rating for ראיון */}
          <div>
            <label className="block font-medium">דירוג ראיון:</label>
            {hasInterviewed ? (
              <select
                value={ratings.interview}
                onChange={(e) =>
                  handleChange("interview", parseInt(e.target.value))
                }
                className="border p-1 rounded"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => handleChange("interview", 0)}
                className="bg-red-500 text-white p-1 rounded"
              >
                לא הגיע לשלב זה
              </button>
            )}
          </div>

          {/* Rating for מבחני קבלה */}
          <div>
            <label className="block font-medium">דירוג מבחני קבלה:</label>
            <select
              value={ratings.tests}
              onChange={(e) => handleChange("tests", parseInt(e.target.value))}
              className="border p-1 rounded"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium">הערות:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-1 w-full rounded"
              rows="4"
            ></textarea>
          </div>

          {/* Save and View Ratings Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded"
            >
              שמור
            </button>
            <button
              onClick={handleViewRatings}
              className="bg-green-500 text-white p-2 rounded"
            >
              ראה דירוגים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankModal;
