import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * PrivateRoute component to protect routes that require authentication
 * 
 * @param {Object} props
 * @param {boolean} props.isAuthenticated - Whether the user is authenticated
 * @param {React.ReactNode} props.children - The child components to render if authenticated
 * @returns {React.ReactElement} The protected route
 */
const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default PrivateRoute; 