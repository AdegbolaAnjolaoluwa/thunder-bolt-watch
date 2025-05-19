
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RequestProvider } from "./contexts/RequestContext";
import LoginPage from "./pages/LoginPage";
import StaffDashboard from "./pages/StaffDashboard";
import CEODashboard from "./pages/CEODashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === 'staff') {
      return <Navigate to="/staff" replace />;
    } else if (currentUser.role === 'ceo') {
      return <Navigate to="/ceo" replace />;
    } else if (currentUser.role === 'accountant') {
      return <Navigate to="/accountant" replace />;
    }
  }

  return (
    <RequestProvider currentUser={currentUser}>
      {element}
    </RequestProvider>
  );
};

const AppRoutes = () => {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" />} />
      
      <Route path="/staff" element={
        <ProtectedRoute element={<StaffDashboard />} allowedRoles={['staff']} />
      } />
      
      <Route path="/ceo" element={
        <ProtectedRoute element={<CEODashboard />} allowedRoles={['ceo']} />
      } />
      
      <Route path="/accountant" element={
        <ProtectedRoute element={<AccountantDashboard />} allowedRoles={['accountant']} />
      } />
      
      <Route path="/" element={
        currentUser ? (
          currentUser.role === 'staff' ? <Navigate to="/staff" replace /> :
          currentUser.role === 'ceo' ? <Navigate to="/ceo" replace /> :
          currentUser.role === 'accountant' ? <Navigate to="/accountant" replace /> :
          <Navigate to="/login" replace />
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
