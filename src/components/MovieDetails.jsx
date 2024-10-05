import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/moviedetails.css'
import posterDummy from "../assets/no-poster-img.webp"


function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=c11c542`);
        if (response.data) {
          setMovie(response.data);
        } else {
          setError('Movie not found');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Error fetching movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="movie-details-container">
      <h1 className="movie-title">{movie.Title}</h1>
      {/* <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
       */}
                       <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : posterDummy} 
                  className="movie-poster" 
                  alt={movie.Title} 
                  onError={(e) => e.target.src = posterDummy}

                />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Year</td>
              <td>{movie.Year}</td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>{movie.Genre}</td>
            </tr>
            <tr>
              <td>Director</td>
              <td>{movie.Director}</td>
            </tr>
            <tr>
              <td>Actors</td>
              <td>{movie.Actors}</td>
            </tr>
            <tr>
              <td>Plot</td>
              <td>{movie.Plot}</td>
            </tr>
            {/* Add more rows for other movie details as needed */}
          </tbody>
        </table>
      </div>

      <Link to="/protected">
        <button className="button-back">Back</button>
      </Link>
    </div>
  );
}

export default MovieDetails;
