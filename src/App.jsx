import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Insights from './pages/Insights/Insights';
import Passport from './pages/Passport/Passport';
import BusinessView from './pages/BusinessView/BusinessView';
import './index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="insights" element={<Insights />} />
            <Route path="passport" element={<Passport />} />
            <Route path="business" element={<BusinessView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
