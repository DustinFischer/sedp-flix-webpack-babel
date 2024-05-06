import ImageCard from './common/ImageCard';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

function MovieCard({ movie }) {
  const formatFloat = (val) => Number.parseFloat(val).toFixed(1);

  return (
    <div className="movie-card">
      <ImageCard src={`${IMG_PATH}${movie.poster_path}`} alt={movie.title}>
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          <span className="movie-card-rating">{formatFloat(movie.vote_average)}</span>
        </div>
        <div className="movie-card-overview">
          <h3>Overview</h3>
          {movie.overview}
        </div>
      </ImageCard>
    </div>
  );
}
export default MovieCard;
