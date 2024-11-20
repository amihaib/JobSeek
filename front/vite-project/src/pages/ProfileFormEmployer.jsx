import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaUserCircle,
  FaLock,
  FaFileAlt,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetUserDataQuery } from "../slices/userApiSlice";
import { storage } from "../../firebase-config"; // Adjust import based on your Firebase setup
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import PageContext from "../context/pagesContext";
import { useUpdateProfilePictureMutation } from "../slices/employerApiSlice";

const ProfilePageEmployer = () => {
  const { islogin } = useContext(PageContext);
  const [companyName, setCompanyName] = useState("Guest");
  const [companyLogo, setCompanyLogo] = useState("");
  const location = useLocation();
  const isMainRoute = location.pathname === "/employer-profile";
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetUserDataQuery();
  const [updateProfilePicture] = useUpdateProfilePictureMutation();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setCompanyName(data.data.companyName);
      if (data.data.companyLogo) {
        setCompanyLogo(data.data.companyLogo);
      } else {
        setCompanyLogo(""); // Ensure this is set to an empty string if no logo is available
      }
      // if (data.data.newAccount) {
      //   const employerData = data?.data ? data?.data : null;
      //   navigate("editEmployerProfile", {
      //     state: { employer: employerData },
      //   });
      // }
    }
  }, [data]);

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const storageRef = ref(
        storage,
        `profilePictures/${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading file:", error);
          alert("Error uploading file.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL:", downloadURL);

          // Save the URL in the database via a backend API call
          await updateProfilePicture(downloadURL).unwrap();

          // Show success alert
          alert("Profile picture uploaded successfully!");

          // Update the local state with the new profile picture URL
          setCompanyLogo(downloadURL); // Ensure this updates the displayed logo
        }
      );
    } else {
      alert("Please upload a valid image file (JPG, JPEG, PNG).");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-b from-gray-700 to-gray-900 py-8">
        <div className="relative flex flex-col items-center">
          <div
            className="relative w-32 h-32"
            onClick={handleProfilePictureClick}
          >
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-full h-full rounded-full object-cover cursor-pointer"
              />
            ) : (
              <FaUserCircle className="text-white cursor-pointer" size={128} />
            )}
          </div>
          <h2 className="text-white text-2xl font-semibold mt-2">
            {companyName}
          </h2>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleProfilePictureChange}
            ref={fileInputRef}
            className="hidden" // Hide the input
          />
        </div>
      </div>
      <Outlet />

      {isMainRoute && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-4xl mx-auto">
          <ProfileCard
            icon={<FaUserCircle size={30} />}
            label="פרטי חברה"
            onClick={() => {
              const employerData = data?.data ? data?.data : null;
              navigate("editEmployerProfile", {
                state: { employer: employerData },
              });
            }}
          />
          <ProfileCard
            icon={<FaLock size={30} />}
            label="הגדרות חשבון ופרטיות"
            onClick={() => {
              navigate("account-settings");
            }}
          />
          <ProfileCard
            icon={<FaFileAlt size={30} />}
            label="פרסם משרה"
            onClick={() => navigate("add-job")}
          />
          <ProfileCard
            icon={<FaFileAlt size={30} />}
            label="משרות שפורסמו"
            onClick={() => navigate("manage-jobs")}
          />
          <ProfileCard
            icon={<FaSearch size={30} />}
            label="חיפוש עובדים"
            onClick={() => navigate("searchUserByEmployer")}
          />
          <ProfileCard
            icon={<FaStar size={30} />}
            label="הדירוגים שלי"
            onClick={() => navigate(`employer-reviews/${data?.data._id}`)}
          />
        </div>
      )}
    </div>
  );
};

const ProfileCard = ({ icon, label, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="text-cyan-500">{icon}</div>
      <span className="mt-4 text-lg font-semibold">{label}</span>
    </div>
  );
};

export default ProfilePageEmployer;
