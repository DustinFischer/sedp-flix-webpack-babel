import { NoResults } from '../providers/MovieProvider';
import MovieCard from './MovieCard';
import Container from './common/Container';
import Paginator from './common/Paginator';

function MovieGrid({ data, page, setPageIndex, pageSize, totalCount }) {
  const movies = data.map((movie) => {
    return <MovieCard key={movie.id.toString()} movie={movie} />;
  });

  return data.length > 0 ? (
    <>
      <Container className="movie-cards">{movies}</Container>
      <Paginator page={page} onPage={setPageIndex} pageSize={pageSize} totalCount={totalCount} />
    </>
  ) : (
    <NoResults />
  );
}

export default MovieGrid;
