import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { supabase, supabaseClient } from './lib/supabase';
import LandingPage from './pages/LandingPage';
import LegalPage from './pages/LegalPage';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CoachApp from './CoachApp';
import ClientApp from './ClientApp';
import ClientLogin from './pages/client-mobile/ClientLogin';
import ClientSetup from './pages/client-mobile/ClientSetup';

function ForgotPasswordWrapper() {
  const navigate = useNavigate();
  return <ForgotPassword onBack={() => navigate('/login')} />;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'coach' | 'client' | null>(null);
  const [loading, setLoading] = useState(true);
  // Session client mobile isolée (storageKey distinct)
  const [clientUser, setClientUser] = useState<User | null>(null);
  const [clientLoading, setClientLoading] = useState(true);

  useEffect(() => {
    // Listener session coach (/app/*)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkUserType(currentUser);
      } else {
        setUserType(null);
        setLoading(false);
      }
    });

    // Listener session client mobile (/client/*)
    const { data: { subscription: clientSubscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setClientUser(session?.user ?? null);
      setClientLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clientSubscription.unsubscribe();
    };
  }, []);

  async function checkUserType(user: User) {
    // Priorité : user_metadata.role (défini lors de l'invitation client)
    if (user.user_metadata?.role === 'client') {
      setUserType('client');
      setLoading(false);
      return;
    }

    // Fallback : vérification en base de données
    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', user.email ?? '')
        .maybeSingle();

      if (clientData && !clientError) {
        setUserType('client');
        setLoading(false);
        return;
      }

      setUserType('coach');
    } catch (error) {
      console.error('Erreur checkUserType:', error);
      setUserType('coach');
    } finally {
      setLoading(false);
    }
  }

  if (loading || clientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth initialMode="register" />} />
      <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/cgu" element={<LegalPage type="cgu" />} />
      <Route path="/confidentialite" element={<LegalPage type="confidentialite" />} />
      <Route path="/mentions-legales" element={<LegalPage type="mentions-legales" />} />
      <Route path="/cookies" element={<LegalPage type="cookies" />} />

      {/* Application protégée — guard inline pour éviter le remontage */}
      <Route
        path="/app/*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : userType === 'client'
              ? <Navigate to="/client" replace />
              : <CoachApp />
        }
      />

      {/* Pages client publiques — redirige si déjà connecté (session client isolée) */}
      <Route
        path="/client/login"
        element={
          clientUser
            ? <Navigate to="/client" replace />
            : <ClientLogin />
        }
      />
      <Route path="/client/setup" element={<ClientSetup />} />

      {/* Interface client mobile-first PWA — session isolée via supabaseClient */}
      <Route
        path="/client/*"
        element={
          !clientUser
            ? <Navigate to="/client/login" replace />
            : <ClientApp />
        }
      />

      {/* Redirections legacy */}
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/app" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
