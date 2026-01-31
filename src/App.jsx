import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth/Auth';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Passport from './pages/Passport/Passport';
import Verification from './pages/Verification/Verification';
import Investments from './pages/Investments/Investments';
import Loans from './pages/Loans/Loans';
import StudentPlan from './pages/StudentPlan/StudentPlan';
import Subscriptions from './pages/Subscriptions/Subscriptions';
import Cards from './pages/Cards/Cards';
import Documents from './pages/Documents/Documents';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="cards" element={<Cards />} />
              <Route path="investments" element={<Investments />} />
              <Route path="loans" element={<Loans />} />
              <Route path="student-plan" element={<StudentPlan />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="passport" element={<Passport />} />
              <Route path="verify" element={<Verification />} />
              <Route path="documents" element={<Documents />} />
              <Route path="settings" element={<Dashboard />} />
              <Route path="help" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
