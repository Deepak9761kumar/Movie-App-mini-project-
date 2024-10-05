import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../styles/movieList.css';
import { FaSearch } from 'react-icons/fa';
import posterDummy from "../assets/no-poster-img.webp"

const MovieList = () => {
  const [movies, setMovies] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('Inception'); 
  const [error, setError] = useState(null); 

  const moviesPerPage = 4;
  const navigate = useNavigate();

  
  useEffect(() => {
    setLoading(true); 
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=${searchQuery}&apikey=1ce657b3`
        );
        const data = await response.json();
        if (data.Response === "True") {
          setMovies(data.Search); 
        } else {
          setError(data.Error);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError('Failed to fetch movies.');
      } finally {
        setLoading(false); 
      }
    };
    
    fetchMovies();
  }, [searchQuery]); 

  
  const handleSearch = () => {
    setSearchQuery(searchTerm); 
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  
  if (loading) {
    return <p className="text-center">Loading movies...</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Movie List</h1>

      {/* Search Bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          onKeyDown={handleKeyDown}
        />
        <button className="input-group-text" onClick={handleSearch}> {/* Trigger search on button click */}
          <FaSearch />
        </button>
      </div>

      {error && <p className="text-center text-danger">{error}</p>} {/* Display error if present */}
      
      {/* Movie Grid */}
      <div className="row">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div className="col-6 col-md-3 mb-4" key={movie.imdbID}>
              <div
                className="card h-100"
                onClick={() => navigate(`/movie/${movie.imdbID}`)} 
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : posterDummy} 
                  className="card-img-top" 
                  alt={movie.Title} 
                  onError={(e) => e.target.src = posterDummy}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.Title}</h5>
                  <p className="card-text">Year: {movie.Year}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No movies found matching your search.</p>
        )}
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index + 1}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MovieList;
