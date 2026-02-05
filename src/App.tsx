import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ArtisanLogin from "./pages/artisan/ArtisanLogin";
import ArtisanDashboard from "./pages/artisan/ArtisanDashboard";
import ArtisanProfile from "./pages/artisan/ArtisanProfile";
import ArtisanMySales from "./pages/artisan/ArtisanMySales";
import RecordingScreen from "./pages/artisan/RecordingScreen";
import ProcessingScreen from "./pages/artisan/ProcessingScreen";
import ListingReview from "./pages/artisan/ListingReview";
import BuyerAuth from "./pages/buyer/BuyerAuth";
import BuyerFeed from "./pages/buyer/BuyerFeed";
import ProductDetail from "./pages/buyer/ProductDetail";
 import OrderHistory from "./pages/buyer/OrderHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Artisan Flow */}
            <Route path="/artisan" element={<ArtisanLogin />} />
            <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
            <Route path="/artisan/profile" element={<ArtisanProfile />} />
            <Route path="/artisan/my-sales" element={<ArtisanMySales />} />
            <Route path="/artisan/record" element={<RecordingScreen />} />
            <Route path="/artisan/processing" element={<ProcessingScreen />} />
            <Route path="/artisan/review" element={<ListingReview />} />
            
            {/* Buyer Flow */}
            <Route path="/buyer/auth" element={<BuyerAuth />} />
            <Route path="/buyer" element={
              <ProtectedRoute>
                <BuyerFeed />
              </ProtectedRoute>
            } />
            <Route path="/buyer/product/:id" element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } />
             <Route path="/buyer/orders" element={
               <ProtectedRoute>
                 <OrderHistory />
               </ProtectedRoute>
             } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
