// Protected.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({ Component }) => {
  const isAuthenticated = true; // Replace with your actual authentication logic

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default Protected;
