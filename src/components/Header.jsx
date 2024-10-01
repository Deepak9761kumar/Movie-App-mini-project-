import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import '../styles/header.css'; // Import custom CSS

const Header = () => {

  const handleLogout = () => {
    localStorage.removeItem('login');
    window.location.href = '/login'; // Redirecting to login page after logout
  };

  return (
    <header className="header-custom text-white">
      <div className="container d-flex justify-content-between align-items-center flex-column flex-md-row">
        <h1 className="h4">Dashboard</h1>
        <nav>
          <ul className="nav flex-column flex-md-row">
            <li className="nav-item">
              <a className="nav-link text-white" href="/movies">Movies</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/tv-shows">TV Shows</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/contact">Contact</a>
            </li>
            <li className="nav-item">
              <button 
                className="btn btn-outline-light mt-3 mt-md-0" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
