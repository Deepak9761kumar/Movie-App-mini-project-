import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../styles/movieList.css';
import { FaSearch } from 'react-icons/fa';

const MovieList = () => {
  const [movies, setMovies] = useState([]); // To store movie data
  const [currentPage, setCurrentPage] = useState(1); // To handle pagination
  const [loading, setLoading] = useState(true); // To show loading state
  const [searchTerm, setSearchTerm] = useState(''); // To store input text
  const [searchQuery, setSearchQuery] = useState('Inception'); // To store the actual search term for the API
  const [error, setError] = useState(null); // To handle error messages

  const moviesPerPage = 4;
  const navigate = useNavigate();

  // Fetch movies from OMDB API
  useEffect(() => {
    setLoading(true); // Show loading when fetching data
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=${searchQuery}&apikey=1ce657b3`
        );
        const data = await response.json();
        if (data.Response === "True") {
          setMovies(data.Search); // Update movies with the Search array
        } else {
          setError(data.Error); // Handle any error response
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError('Failed to fetch movies.');
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    
    fetchMovies();
  }, [searchQuery]); // Trigger API call when searchQuery changes

  // Handle the search button click
  const handleSearch = () => {
    setSearchQuery(searchTerm); // Trigger new search with input value
  };

  // Handle "Enter" key press in the search bar
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search when Enter is pressed
    }
  };

  // Pagination calculation
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  // Display loading message when fetching
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
          onKeyDown={handleKeyDown} // Detect "Enter" key press
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
                onClick={() => navigate(`/movie/${movie.imdbID}`)} // Navigate to movie details on card click
                style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickable
              >
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'} 
                  className="card-img-top" 
                  alt={movie.Title} 
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
