import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Insights from './pages/Insights/Insights';
import Passport from './pages/Passport/Passport';
import BusinessView from './pages/BusinessView/BusinessView';
import Simulator from './pages/Simulator/Simulator';
import StudentHub from './pages/StudentHub/StudentHub';
import Investments from './pages/Investments/Investments';
import Wallet from './pages/Wallet/Wallet';
import './index.css';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// App Routes (inside provider)
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="student" element={<StudentHub />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="investments" element={<Investments />} />
        <Route path="insights" element={<Insights />} />
        <Route path="passport" element={<Passport />} />
        <Route path="business" element={<BusinessView />} />
        <Route path="simulator" element={<Simulator />} />
      </Route>
      {/* Catch-all: redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
