import React, { useContext, useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";
import { FaUserCircle, FaLock, FaFileAlt, FaStar } from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  useGetUserDataQuery,
  useUpdateUserMutation,
} from "../slices/userApiSlice";
import BackArrow from "./BackArrow";
import PageContext from "../context/pagesContext";

const ProfilePage = () => {
  const [firstName, setFirstName] = useState("Guest");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMainRoute = location.pathname === "/profile";
  const { isLogin } = useContext(PageContext);

  let { data, error, isLoading, refetch } = useGetUserDataQuery();
  const [updateUser] = useUpdateUserMutation(); // Mutation to update user data

  useEffect(() => {
    if (data) {
      setFirstName(data.data.firstName);
      setLastName(data.data.lastName);
      setProfilePicture(data.data.profilePicture); // Set profile picture from user data
      // if (data.data.newAccount) {
      //   const user = data.data;
      //   navigate("edit-profile", { state: { user } });
      // }
    }
  }, [data]);

  useEffect(() => {
    if (isLogin) {
      // This will trigger the query when isLogin changes to true
      refetch(); // Call refetch if using RTK Query's refetch function
    }
  }, [isLogin]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      ["image/png", "image/jpeg", "image/jpg"].includes(selectedFile.type)
    ) {
      setFile(selectedFile);
      await handleUpload(selectedFile);
    } else {
      alert("Please upload a valid PNG, JPG, or JPEG file.");
      setFile(null);
    }
  };

  const handleUpload = async (selectedFile) => {
    const storageRef = ref(
      storage,
      `profile-pictures/${Date.now()}_${selectedFile.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProfilePicture(downloadURL);

        // Update the user profile picture URL in MongoDB
        try {
          await updateUser({ profilePicture: downloadURL }).unwrap();
          alert("Profile picture updated successfully.");
        } catch (error) {
          console.error("Failed to save profile picture:", error);
          alert("Failed to save profile picture.");
        }
      }
    );
  };

  const handleNavigateToRatings = () => {
    if (data && data.data && data.data._id) {
      navigate(`/profile/reviews/${data.data._id}`);
    } else {
      alert("User ID not found, unable to navigate.");
    }
  };

  const handleNavigateToJobApplied = () => {
    if (data && data.data && data.data._id) {
      navigate(`/profile/job-applied/${data.data._id}`);
    } else {
      alert("User ID not found, unable to navigate.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-b from-gray-700 to-gray-900 py-8">
        <div className="px-6">
          <BackArrow color={"white"} url={"/"} />
        </div>
        <div className="relative flex flex-col items-center">
          <div className="relative w-32 h-32">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-white" size={128} />
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <h2 className="text-white text-2xl font-semibold mt-2">
            {firstName} {lastName}
          </h2>
        </div>
      </div>
      <Outlet />
      {isMainRoute && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-4xl mx-auto">
          <ProfileCard
            icon={<FaUserCircle size={30} />}
            label="הפרופיל שלי"
            onClick={() => {
              const user = data.data;
              navigate("edit-profile", { state: { user } });
            }}
          />
          <ProfileCard
            icon={<FaLock size={30} />}
            label="הגדרות חשבון ופרטיות"
            onClick={() => navigate("account-settings")}
          />
          <ProfileCard
            icon={<FaFileAlt size={30} />}
            label="קורות החיים שלי"
            onClick={() => navigate("upload-cv")}
          />
          <ProfileCard
            icon={<FaFileAlt size={30} />}
            label="משרות שהגשתי אליהן"
            onClick={handleNavigateToJobApplied}
          />
          <ProfileCard
            icon={<FaStar size={30} />}
            label="הדירוגים שלי"
            onClick={handleNavigateToRatings}
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

export default ProfilePage;
