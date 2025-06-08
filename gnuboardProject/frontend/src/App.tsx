import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PortfolioDetail from './components/Portfolio/PortfolioView';
import PortfolioForm from './components/Portfolio/PortfolioForm';
import Profile from './components/Profile/Profile';
import { useAuth } from './contexts/AuthContext';
import PortfolioCreate from './components/Portfolio/PortfolioCreate';
import Main from './components/Portfolio/Main';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Main />} />
        <Route path="/portfolios/:id" element={<PortfolioDetail />} />
        <Route path="/portfolio/create" element={<PortfolioCreate />} />
        <Route path="/portfolios/:id/edit" element={<PortfolioForm />} />
        <Route path="/mypage" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App; 