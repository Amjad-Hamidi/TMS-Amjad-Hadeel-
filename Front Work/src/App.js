import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import TraineeDashboard from "./pages/TraineeDashboard";
import UserManagement from "./pages/UserManagement";
import AdminCategories from "./pages/AdminCategories";
import PendingTrainingPro from "./pages/PendingTrainingPro";
import TraineeApplications from "./pages/TraineeApplications";
import TraineeFeedback from "./pages/TraineeFeedback";
import TraineePrograms from "./pages/TraineePrograms";
import ApplyModal from "./pages/ApplyModal";
import TraineeProfile from "./pages/TraineeProfile";
import CompanyApplications from './pages/CompanyApplications';



import CCompanyProfiles from "./pages/CCompanyProfiles";
import CSupervisorProfiles from "./pages/CSupervisorProfiles";
import CTraineeProfiles from "./pages/CTraineeProfiles";

import SSupervisorProfiles from "./pages/SSupervisorProfiles"; 
import STraineeProfiles from "./pages/STraineeProfiles"; 
import SCompanyProfiles from "./pages/SCompanyProfiles"; 

import TTraineeProfiles from "./pages/TTraineeProfiles"; 
import TSupervisorProfiles from "./pages/TSupervisorProfiles"; 
import TCompanyProfiles from "./pages/TCompanyProfiles"; 



import SupervisorPrograms from './pages/SupervisorPrograms';
import CompanyTrainingPrograms from './pages/CompanyTrainingPrograms';
import Login from "./pages/Login";
import Register from "./pages/Register";
import SupervisorProfile from "./pages/SupervisorProfile";
import CompanySupervisors from "./pages/CompanySupervisors";
import CompanyProfile from "./pages/CompanyProfile";
import SupervisorFeedback from "./pages/SupervisorFeedback";
import CompanyFeedback from "./pages/CompanyFeedback";
import CompanyFeedbacks from "./pages/CompanyFeedbacks";
import SupervisorFeedbacks from "./pages/SupervisorFeedbacks";

import CategoryTPrograms from "./pages/CategoryTPrograms";
import AddTrainingProgram from "./pages/AddTrainingProgram";
import TraineesList from "./pages/TraineesList";
import SupervisorTraineesList from "./pages/SupervisorTraineesList";
import TraineeLayout from "./layouts/TraineeLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import SupervisorLayout from "./layouts/SupervisorLayout";
import AdminLayout from "./layouts/AdminLayout";
import CategoryTProgramsW from "./pages/CategoryTProgramsW";
import Guest from "./pages/Guest";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import TMyFeedbacks from "./pages/TMyFeedbacks";
import "./styles/Dashboard.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Guest />} />


        {/* Company */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="CompanyProfile" element={<CompanyProfile />} />
          <Route path="CompanySupervisors" element={<CompanySupervisors />} />
          <Route path="TraineesList" element={<TraineesList />} />
          <Route path="AddTrainingProgram" element={<AddTrainingProgram />} />
          <Route path="CompanyTrainingPrograms" element={<CompanyTrainingPrograms />} />
          <Route path="CompanyApplications" element={<CompanyApplications />} />

          <Route path="CompanyProfiles" element={<CCompanyProfiles />} />
          <Route path="SupervisorProfiles" element={<CSupervisorProfiles />} />
          <Route path="TraineeProfiles" element={<CTraineeProfiles />} />

          <Route path="CompanyFeedback" element={<CompanyFeedback />} />
          <Route path="CompanyFeedbacks" element={<CompanyFeedbacks />} />
        </Route>

        <Route path="/CategoryTProgramsW/:categoryId" element={<CategoryTProgramsW />} />
        <Route path="/CategoryTPrograms/:categoryId" element={<CategoryTPrograms />} />

        {/* Supervisor */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="SupervisorProfile" element={<SupervisorProfile />} />
          <Route path="SupervisorPrograms" element={<SupervisorPrograms />} />
          <Route path="SupervisorTraineesList" element={<SupervisorTraineesList />} />
          <Route path="CompanyProfiles" element={<SCompanyProfiles />} />
          <Route path="SupervisorProfiles" element={<SSupervisorProfiles />} />
          <Route path="TraineeProfiles" element={<STraineeProfiles />} />
          <Route path="SupervisorFeedback" element={<SupervisorFeedback />} />
          <Route path="SupervisorFeedbacks" element={<SupervisorFeedbacks />} />
        </Route>

        {/* Trainee Layout with nested routes */}
        <Route path="/trainee" element={<TraineeLayout />}>
          <Route index element={<TraineeDashboard />} />
          <Route path="CategoryTPrograms/:categoryId" element={<CategoryTPrograms />} />
          <Route path="ApplyModal" element={<ApplyModal />} />
          <Route path="TraineeProfile" element={<TraineeProfile />} />
          <Route path="TraineePrograms" element={<TraineePrograms />} />
          <Route path="TraineeApplications" element={<TraineeApplications />} />
          <Route path="CompanyProfiles" element={<TCompanyProfiles />} />
          <Route path="SupervisorProfiles" element={<TSupervisorProfiles />} />
          <Route path="TraineeProfiles" element={<TTraineeProfiles />} />
          <Route path="TraineeFeedback" element={<TraineeFeedback />} />
          <Route path="TMyFeedbacks" element={<TMyFeedbacks />} />
        </Route>

        <Route path="CategoryTPrograms" element={<CategoryTPrograms />} />


        {/* Profile Edit */}
        <Route path="/profile/edit" element={<EditProfile />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="pendingTrainingPro" element={<PendingTrainingPro />} />
        </Route>

        {/* Auth */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
