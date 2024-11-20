// Mine 9.8
import React, { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "./context/pagesContext";
import UploadCV from "./components/UploadCV";
import Footer from "./components/Footer";
import ResetPassword from "./pages/resetPasswordPage";
import ProfilePage from "./components/ProfileFormUser";
import EditProfile from "./components/editProfile";
import AccountSettings from "./components/AccountSettings";
import ProfilePageEmployer from "./pages/ProfileFormEmployer";
import EditEmployerProfile from "./pages/EmployerEditProfile";

import NewMainMenu from "./components/NewMainMenu";
import LoginRegisterModal from "./components/LoginRegisterModal";
import Home from "./pages/Home";
import ResumeBuilder from "./components/ResumeBuilder";
import SearchUserByEmployer from "./components/SearchUserByEmployer";
import ManageJobsPage from "./pages/ManageJobs";
import UserJobStatus from "./pages/UserJobStatus";
import RatingsPage from "./pages/RatingsPage";
import JobApplied from "./pages/jobApplied";
import JobCards from "./components/JobCards";
import JobSearchBar from "./components/SearchBar";
import Statistics from "./components/Statistics";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alljobs from "./components/Alljobs";
import ReviewsPage from "./pages/ReviewPageForUser";
import EmployerReviewsPage from "./pages/ReviewPageEmployer";
import AddJobModal from "./components/AddJobModal";

import EmployerList from "./components/EmployerList";
import EmployerDetails from "./components/EmployerDetails";

function App() {
  return (
    <Provider>
      <Router>
        <div className="App overflow-x-hidden">
          <ToastContainer />

          <NewMainMenu />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="employer-page" element={<EmployerList />}>
              <Route path=":id" element={<EmployerDetails />} />
            </Route>

            <Route path="/all-jobs" element={<Alljobs />} />
            <Route path="/resetPassword" element={<ResetPassword />} />

            <Route path="/profile" element={<ProfilePage />}>
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="account-settings" element={<AccountSettings />} />
              <Route path="upload-cv" element={<UploadCV />} />
              <Route
                path="/profile/reviews/:userId"
                element={<ReviewsPage />}
              />
              <Route
                path="/profile/job-applied/:userId"
                element={<JobApplied />}
              />
            </Route>

            <Route path="/employer-profile" element={<ProfilePageEmployer />}>
              <Route
                path="EditEmployerProfile"
                element={<EditEmployerProfile />}
              />
              <Route
                path="searchUserByEmployer"
                element={<SearchUserByEmployer />}
              />
              <Route
                path="/employer-profile/employer-reviews/:employerId"
                element={<EmployerReviewsPage />}
              />
              <Route path="account-settings" element={<AccountSettings />} />
              <Route path="manage-jobs" element={<ManageJobsPage />} />
              <Route path="add-job" element={<AddJobModal />} />

              <Route
                path="/employer-profile/manage-jobs/:jobId/UserJobStatus"
                element={<UserJobStatus />}
              />
              <Route
                path="/employer-profile/ratings/:userId"
                element={<RatingsPage />}
              />
            </Route>

            {/* <Route path="/" element={<JobCards isHome={true} />} />
            <Route path="/search" element={<Alljobs isHome={false} />} /> */}
          </Routes>
        </div>
      </Router>
      <Footer />
    </Provider>
  );
}

export default App;
