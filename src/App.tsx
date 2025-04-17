import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import PostJob from "./pages/PostJob";
import NotFound from "./pages/NotFound";
import FreelancerDashboard from "./pages/freelancer/Dashboard";
import Profile from "./pages/Profile";
import Applications from "./pages/freelancer/Applications";
import AddProject from "./pages/freelancer/AddProject";
import ProviderDashboard from "./pages/provider/Dashboard";
import MyJobs from "./pages/provider/MyJobs";
import JobApplicants from "./pages/provider/JobApplicants";
import ApplicantProfile from "./pages/provider/ApplicantProfile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Notifications from "./pages/Notifications";
import PrivateRoute from "./components/auth/PrivateRoute";
import RoleRoute from "./components/auth/RoleRoute";
import Messages from "./pages/Messages";
import Conversation from "./pages/Conversation";
import WorkingFreelancers from "./pages/provider/WorkingFreelancers";
import ProjectChecklist from "./pages/ProjectChecklist";
import ProjectWhiteboard from "./pages/ProjectWhiteboard";
import ProjectChat from "./pages/ProjectChat";
import NewContract from "./pages/contract/NewContract";
import ProfileView from "./pages/ProfileView";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        {(user, profile) => 
                          profile.role === 'freelancer' 
                            ? <Navigate to="/freelancer/dashboard" replace /> 
                            : <Navigate to="/provider/dashboard" replace />
                        }
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/freelancer/dashboard" 
                    element={
                      <RoleRoute role="freelancer">
                        <FreelancerDashboard />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/applications" 
                    element={
                      <RoleRoute role="freelancer">
                        <Applications />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/add-project" 
                    element={
                      <RoleRoute role="freelancer">
                        <AddProject />
                      </RoleRoute>
                    } 
                  />
                  
                  <Route 
                    path="/provider/dashboard" 
                    element={
                      <RoleRoute role="provider">
                        <ProviderDashboard />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/post-job" 
                    element={
                      <RoleRoute role="provider">
                        <PostJob />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/my-jobs" 
                    element={
                      <RoleRoute role="provider">
                        <MyJobs />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/working-freelancers" 
                    element={
                      <RoleRoute role="provider">
                        <WorkingFreelancers />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/jobs/:id/applicants" 
                    element={
                      <RoleRoute role="provider">
                        <JobApplicants />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/applicants/:id" 
                    element={
                      <RoleRoute role="provider">
                        <ApplicantProfile />
                      </RoleRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile/:id" 
                    element={<ProfileView />} 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/notifications" 
                    element={
                      <PrivateRoute>
                        <Notifications />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/messages" 
                    element={
                      <PrivateRoute>
                        <Messages />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/messages/:id" 
                    element={
                      <PrivateRoute>
                        <Conversation />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/contract/new/:applicationId" 
                    element={
                      <RoleRoute role="provider">
                        <NewContract />
                      </RoleRoute>
                    } 
                  />
                  
                  <Route path="/project/:id/checklist" element={<ProjectChecklist />} />
                  <Route path="/project/:id/whiteboard" element={<ProjectWhiteboard />} />
                  <Route path="/project/:id/chat" element={<ProjectChat />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
