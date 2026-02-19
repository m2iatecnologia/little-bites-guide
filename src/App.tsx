import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Alimentos from "./pages/Alimentos";
import Receitas from "./pages/Receitas";
import Guias from "./pages/Guias";
import Cardapio from "./pages/Cardapio";
import Checklist from "./pages/Checklist";
import NotFound from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/alimentos" element={<Alimentos />} />
            <Route path="/receitas" element={<Receitas />} />
            <Route path="/guias" element={<Guias />} />
            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
