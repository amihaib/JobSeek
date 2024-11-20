import React, { useState, useEffect } from "react";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import BackArrow from "./BackArrow";

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cvList, setCvList] = useState([]); // Array of uploaded CVs
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserCVs(); // Fetch uploaded CVs when the component mounts
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Only PDF and DOCX files are allowed.");
      return;
    }

    const storageRef = ref(storage, `cvs/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file to Firebase:", error);
        setMessage("Failed to upload CV.");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          try {
            // Ensure both `cvUrl` and `fileName` are passed in the request body
            await axios.post(
              "http://localhost:8000/api/cv/uploadCv",
              {
                cvUrl: downloadURL, // The Firebase download URL
                fileName: file.name, // The original file name
              },
              { withCredentials: true }
            );
            setMessage("CV uploaded successfully.");
            fetchUserCVs(); // Refresh the list after successful upload
          } catch (error) {
            console.error(
              "Error saving CV in the backend:",
              error.response || error
            );
            setMessage("Failed to save CV.");
          }
        } catch (err) {
          console.error("Error getting download URL:", err);
          setMessage("Error getting download URL.");
        }
      }
    );
  };

  const fetchUserCVs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/cv/getUserCvs",
        { withCredentials: true }
      );

      console.log("Full response from backend:", response); // Log the full response

      const cvs = response.data.data.cvs;

      if (!Array.isArray(cvs)) {
        throw new Error("Expected an array of CVs");
      }

      setCvList(cvs); // Update the CV list in the state
      console.log("CV List:", cvs);
    } catch (error) {
      console.error("Error fetching uploaded CVs:", error);
      setMessage("Failed to fetch uploaded CVs.");
    }
  };

  const handleDeleteCV = async (cvId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cv/deleteCv/${cvId}`, {
        withCredentials: true,
      });
      setMessage("CV deleted successfully.");
      fetchUserCVs(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting CV:", error);
      setMessage("Failed to delete CV.");
    }
  };

  // Frontend function to trigger the download
  const handleDownload = async (fileName) => {
    try {
      const response = await axios({
        url: `http://localhost:8000/api/cv/downloadCv/${fileName}`, // Use the backend route to download
        method: "GET",
        responseType: "blob", // Important to handle the file as a binary stream
        withCredentials: true,
      });

      // Create a download link manually and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Use the file name for downloading
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading the CV:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {/* Back Arrow */}
      <div className="flex justify-start pb-6">
        <BackArrow color={"black"} url={-1} />
      </div>

      <h3 className="text-lg font-semibold mb-4">Upload Your CV</h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
        />
        <button
          type="submit"
          className="mt-4 bg-orange-500 text-white py-2 px-4 rounded"
          disabled={cvList.length >= 4} // Disable if 4 CVs are uploaded
        >
          Upload CV
        </button>
      </form>
      {uploadProgress > 0 && (
        <p className="mt-2">Upload Progress: {Math.round(uploadProgress)}%</p>
      )}
      {message && <p className="mt-4 text-red-500">{message}</p>}

      {/* Displaying uploaded CVs */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Your Uploaded CVs</h3>
        {cvList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-4 border">File Name</th>
                  <th className="py-2 px-4 border">Uploaded Date</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cvList.map((cv, index) => (
                  <tr key={cv._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">CV {index + 1}</td>
                    <td className="py-2 px-4 border">
                      {new Date(cv.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">
                      <a
                        href={cv.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline mr-5"
                      >
                        הצגה
                      </a>
                      <button
                        onClick={() => handleDownload(cv.fileName)}
                        className="text-green-500 underline mr-5"
                      >
                        הורדה
                      </button>

                      <button
                        onClick={() => handleDeleteCV(cv._id)}
                        className="text-red-500 underline mr-5"
                      >
                        מחיקה
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No CVs uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UploadCV;
