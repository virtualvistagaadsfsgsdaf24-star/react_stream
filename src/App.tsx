import { Routes, Route, Navigate } from 'react-router-dom';
import CompanyCode from './pages/auth/CompanyCode';
import Login from './pages/auth/Login';
import Home from './pages/dashboard/Home';
import ProtectedRoute from './components/guards/ProtectedRoute';
import PublicRoute from './components/guards/PublicRoute';
import './i18n/config';

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<CompanyCode />} />
        <Route path="/login" element={<Login />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;