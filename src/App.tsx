import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import CareerScorePage from "./pages/dashboard/CareerScorePage";
import RoadmapPage from "./pages/dashboard/RoadmapPage";
import InterviewsPage from "./pages/dashboard/InterviewsPage";
import JobsPage from "./pages/dashboard/JobsPage";
import StudyPlannerPage from "./pages/dashboard/StudyPlannerPage";
import ScholarshipsPage from "./pages/dashboard/ScholarshipsPage";
import MentorsPage from "./pages/dashboard/MentorsPage";
import ProofLayerPage from "./pages/dashboard/ProofLayerPage";
import WellnessPage from "./pages/dashboard/WellnessPage";
import GamificationPage from "./pages/dashboard/GamificationPage";
import RecruiterPage from "./pages/dashboard/RecruiterPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="career-score" element={<CareerScorePage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="study" element={<StudyPlannerPage />} />
              <Route path="scholarships" element={<ScholarshipsPage />} />
              <Route path="mentors" element={<MentorsPage />} />
              <Route path="proof" element={<ProofLayerPage />} />
              <Route path="wellness" element={<WellnessPage />} />
              <Route path="gamification" element={<GamificationPage />} />
              <Route path="recruiter" element={<RecruiterPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
