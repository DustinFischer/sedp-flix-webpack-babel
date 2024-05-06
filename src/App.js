import './styles/app.css';
import MovieProvider from './providers/MovieProvider';
import Home from './pages/Home';

const API_URL = process.env.MOVIE_API_URL;
const SEARCH_API = process.env.MOVIE_SEARCH_API;

export default function App() {
  console.log('Hello from [App]');
  console.log(process.env.NODE_ENV);

  return (
    <MovieProvider url={API_URL} searchUrl={SEARCH_API}>
      <Home />
    </MovieProvider>
  );
}
