
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// This is a placeholder for the Goals page that we'll create
const Goals = () => <div className="pt-16 pb-24 md:pb-6 px-4">Goals page coming soon</div>;
// This is a placeholder for the Profile page that we'll create
const Profile = () => <div className="pt-16 pb-24 md:pb-6 px-4">Profile page coming soon</div>;
// This is a placeholder for the Register page
const Register = () => <div className="pt-16 pb-24 md:pb-6 px-4">Register page coming soon</div>;
// This is a placeholder for the Forgot Password page
const ForgotPassword = () => <div className="pt-16 pb-24 md:pb-6 px-4">Forgot Password page coming soon</div>;

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
