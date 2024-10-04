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
  const [searchQuery, setSearchQuery] = useState('Avengers'); 
  const [error, setError] = useState(null); 

  const moviesPerPage = 4;
  const navigate = useNavigate();

  console.log("movies", movies)

  useEffect(() => {
    setLoading(true)
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=1ce657b3`,
          {
            method: 'GET',
          }
        );
        
        const data = await response.json();
        setMovies([...movies, data])
        console.log(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }finally{
      setLoading(false)
    }
    }    

    fetchMovies();
  }, []); // Trigger API call when searchQuery changes

  const handleSearch = () => {
    setSearchQuery(searchTerm); // Trigger search when the button is clicked
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search when Enter is pressed
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
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          onKeyDown={handleKeyDown} // Detect "Enter" key press
        />
        <button className="input-group-text" onClick={handleSearch}> {/* Trigger search on button click */}
          <FaSearch />
        </button>
      </div>

      {error && <p className="text-center text-danger">{error}</p>} {/* Display error if present */}
      
      <div className="row">
        {movies.length > 0 ? (
          movies.map((movie) => (
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
