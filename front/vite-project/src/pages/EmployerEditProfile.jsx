import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateEmployerMutation } from "../slices/employerApiSlice";
import BackArrow from "../components/BackArrow";
import PageContext from "../context/pagesContext";

const EditEmployerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { successMessage } = useContext(PageContext);
  const { employer } = location.state || {};

  const [companyName, setCompanyName] = useState(employer?.companyName || "");
  const [companyDescription, setCompanyDescription] = useState(
    employer?.companyDescription || ""
  );
  const [companySize, setCompanySize] = useState(employer?.companySize || "");
  const [companyContact, setCompanyContact] = useState(
    employer?.companyContact || ""
  );
  const [companyJobsAvailable, setCompanyJobsAvailable] = useState(
    employer?.companyJobsAvailable || ""
  );

  const [updateEmployer] = useUpdateEmployerMutation();

  // Save the updated employer details
  const handleSave = async () => {
    try {
      const data = await updateEmployer({
        companyName,
        companyDescription,
        companyContact,
        companyJobsAvailable,
        companySize,
        newAccount: false,
      }).unwrap(); // Unwrap the promise

      successMessage("Account information has been updated");
      // Navigate back with updated data
      navigate(-1, {
        state: {
          employer: {
            ...data,
            companyName,
            companyDescription,
            companyContact,
            companyJobsAvailable,
            companySize,
          },
        },
      });
    } catch (error) {
      console.error("Error updating employer:", error);
    }
  };

  useEffect(() => {
    if (!employer) {
      alert("Employer data not available.");
      navigate("/profile");
    }
  }, [employer, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center">
        <BackArrow color={"black"} url={-1} />
        <h2 className="text-center text-2xl font-bold">הפרטים שלך</h2>
        <div></div> {/* Empty div for layout symmetry */}
      </div>

      <div className="max-w-xl mx-auto mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>שם החברה </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>תיאור החברה </label>
            <input
              type="text"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>גודל החברה</label>
            <input
              type="number"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>מספר הטלפון של החברה</label>
            <input
              type="number"
              value={companyContact}
              onChange={(e) => setCompanyContact(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>משרות פתוחות</label>
            <input
              type="number"
              value={companyJobsAvailable}
              onChange={(e) => setCompanyJobsAvailable(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Save button */}
        <button
          className="mt-4 w-full bg-orange-500 text-white py-2 rounded"
          onClick={handleSave}
        >
          שמור פרטים
        </button>
      </div>
    </div>
  );
};

export default EditEmployerProfile;
