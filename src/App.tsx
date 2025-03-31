
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                {/* Freelancer routes */}
                <Route path="/dashboard" element={<FreelancerDashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/add-project" element={<AddProject />} />

                {/* Provider routes */}
                <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/my-jobs" element={<MyJobs />} />
                <Route path="/jobs/:id/applicants" element={<JobApplicants />} />
                <Route path="/applicants/:id" element={<ApplicantProfile />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
