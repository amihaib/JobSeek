import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUpdateUserMutation } from "../slices/userApiSlice";
import BackArrow from "./BackArrow";
import PageContext from "../context/pagesContext";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { successToast, errorToast } = useContext(PageContext);
  const { user } = location.state || {};

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [experience, setExperience] = useState(user?.experience || 0);
  const [profession, setProfession] = useState(user?.profession || "");
  const [visibleToEmployers, setVisibleToEmployers] = useState(
    user?.visibleToEmployers || false
  );

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (!user) {
      alert("User data not available.");
      navigate("/profile");
    } else {
      window.scrollTo(0, 0); // Scroll to top when component mounts
    }
  }, [user, navigate]);

  const handleSave = async () => {
    if (!firstName || !lastName || !phoneNumber || !profession) {
      errorToast("Please fill all required fields.");
      return;
    }

    try {
      await updateUser({
        firstName,
        lastName,
        phoneNumber,
        experience,
        profession,
        visibleToEmployers,
        newAccount: false,
      }).unwrap();
      successToast("Your information has been updated");
      navigate(-1);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center">
        <BackArrow color={"black"} url={"/profile"} />
        <h2 className="text-center text-2xl font-bold">הפרטים שלך</h2>
        <div></div>
      </div>

      <div className="max-w-xl mx-auto mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>שם פרטי</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>שם משפחה</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>טלפון</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>שנות ניסיון</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>מקצוע</label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={visibleToEmployers}
              onChange={(e) => setVisibleToEmployers(e.target.checked)}
              className="mr-2"
            />
            עשה אותי נראה למעסיקים
          </label>
        </div>

        <button
          className="mt-4 w-full bg-red-500 text-white py-2 rounded"
          onClick={handleSave}
        >
          שמור פרטים
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
