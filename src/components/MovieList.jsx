import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../styles/movieList.css';
import { FaSearch } from 'react-icons/fa';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null); 

  const moviesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null); 

      try {
        const response = await fetch(
          `https://thingproxy.freeboard.io/fetch/http://www.omdbapi.com/?s=${searchTerm || 'Avengers'}&apikey=1ce657b3`,
          {
            method: 'GET',
            headers: {
              "Access-Control-Allow-Origin": "*",
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Search) {
          setMovies(data.Search);
        } else {
          setMovies([]);
          setError("No movies found matching your search.");
        }
      } catch (error) {
        console.error("Error fetching the movie data: ", error);
        setError("Error fetching movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm]);

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
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        <span className="input-group-text">
          <FaSearch />
        </span>
      </div>

      {error && <p className="text-center text-danger">{error}</p>} {/* Display error if present */}
      
      <div className="row">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div className="col-6 col-md-3 mb-4" key={movie.imdbID}>
              <div
                className="card h-100"
                onClick={() => navigate(`/movie/${movie.imdbID}`)} // Navigate to movie details on card click
                style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickable
              >
                <img src={movie.Poster} className="card-img-top" alt={movie.Title} />
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
