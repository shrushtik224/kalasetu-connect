import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ArtisanLogin from "./pages/artisan/ArtisanLogin";
import ArtisanDashboard from "./pages/artisan/ArtisanDashboard";
import ArtisanProfile from "./pages/artisan/ArtisanProfile";
import ArtisanMySales from "./pages/artisan/ArtisanMySales";
import RecordingScreen from "./pages/artisan/RecordingScreen";
import ProcessingScreen from "./pages/artisan/ProcessingScreen";
import ManualListing from "./pages/artisan/ManualListing";
import ListingReview from "./pages/artisan/ListingReview";
import PriceEstimator from "./pages/artisan/PriceEstimator";
import BuyerFeed from "./pages/buyer/BuyerFeed";
import ProductDetail from "./pages/buyer/ProductDetail";
import NotFound from "./pages/NotFound";
import ArtisanLayout from "./components/ArtisanLayout";
import LanguageSelector from "./components/LanguageSelector";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Navigate to="/artisan" replace />} />

              {/* Artisan Flow */}
              <Route path="/artisan" element={<ArtisanLogin />} />
              {/* Full-screen routes (no layout wrapper) */}
              <Route path="/artisan/record" element={<RecordingScreen />} />
              <Route path="/artisan/processing" element={<ProcessingScreen />} />

              {/* Layout-wrapped routes */}
              <Route element={<ArtisanLayout />}>
                <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
                <Route path="/artisan/profile" element={<ArtisanProfile />} />
                <Route path="/artisan/my-sales" element={<ArtisanMySales />} />
                <Route path="/artisan/manual" element={<ManualListing />} />
                <Route path="/artisan/review" element={<ListingReview />} />
                <Route path="/artisan/price-estimator" element={<PriceEstimator />} />
              </Route>

              {/* Buyer Flow */}
              <Route path="/buyer" element={<BuyerFeed />} />
              <Route path="/buyer/product/:id" element={<ProductDetail />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <LanguageSelector />
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
