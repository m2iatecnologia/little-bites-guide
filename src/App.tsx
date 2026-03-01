import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useBaby } from "./hooks/useBaby";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CadastroBebe from "./pages/CadastroBebe";
import Alimentos from "./pages/Alimentos";
import Receitas from "./pages/Receitas";
import Guias from "./pages/Guias";
import Cardapio from "./pages/Cardapio";
import Checklist from "./pages/Checklist";
import Perfil from "./pages/Perfil";
import ListaCompras from "./pages/ListaCompras";
import EmDesenvolvimento from "./pages/EmDesenvolvimento";
import Dicas from "./pages/Dicas";
import Planos from "./pages/Planos";
import AssinaturaConfirmada from "./pages/AssinaturaConfirmada";
import Cancelamento from "./pages/Cancelamento";
import TesteExpirando from "./pages/TesteExpirando";
import NotFound from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--app-cream))" }}>
    <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "hsl(var(--app-gold))", borderTopColor: "transparent" }} />
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { hasBaby, loading: babyLoading } = useBaby();

  if (loading || babyLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!hasBaby) return <Navigate to="/cadastro-bebe" replace />;
  return <>{children}</>;
}

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { hasBaby, loading: babyLoading } = useBaby();

  if (loading || (user && babyLoading)) return <LoadingSpinner />;

  return (
    <div className="app-container">
      <Routes>
        <Route path="/auth" element={user ? (hasBaby ? <Navigate to="/" replace /> : <Navigate to="/cadastro-bebe" replace />) : <Auth />} />
        <Route path="/cadastro-bebe" element={user ? (hasBaby ? <Navigate to="/" replace /> : <CadastroBebe />) : <Navigate to="/auth" replace />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/alimentos" element={<ProtectedRoute><Alimentos /></ProtectedRoute>} />
        <Route path="/receitas" element={<ProtectedRoute><Receitas /></ProtectedRoute>} />
        <Route path="/guias" element={<ProtectedRoute><Guias /></ProtectedRoute>} />
        <Route path="/cardapio" element={<ProtectedRoute><Cardapio /></ProtectedRoute>} />
        <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/lista-compras" element={<ProtectedRoute><ListaCompras /></ProtectedRoute>} />
        <Route path="/em-desenvolvimento" element={<ProtectedRoute><EmDesenvolvimento /></ProtectedRoute>} />
        <Route path="/dicas" element={<ProtectedRoute><Dicas /></ProtectedRoute>} />
        <Route path="/dicas/:id" element={<ProtectedRoute><Dicas /></ProtectedRoute>} />
        <Route path="/planos" element={<ProtectedRoute><Planos /></ProtectedRoute>} />
        <Route path="/assinatura-confirmada" element={<ProtectedRoute><AssinaturaConfirmada /></ProtectedRoute>} />
        <Route path="/cancelamento" element={<ProtectedRoute><Cancelamento /></ProtectedRoute>} />
        <Route path="/teste-expirando" element={<ProtectedRoute><TesteExpirando /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {user && hasBaby && <BottomNav />}
    </div>
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
