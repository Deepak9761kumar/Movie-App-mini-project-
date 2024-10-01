import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import MovieList from './components/MovieList';
import Home from './components/Home';
import Protected from './components/Protected';
import MovieDetails from './components/MovieDetails';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Protected Component={Home} />} />
        <Route path="/movielist" element={<MovieList />} /> {/* Route for MovieList */}
        <Route path="/protected" element={<Protected Component={Home} />} />
        <Route path="/movie/:id" element={<MovieDetails />} /> {/* Route for MovieDetails */}
      </Routes>
    </div>
  );
}

export default App;
