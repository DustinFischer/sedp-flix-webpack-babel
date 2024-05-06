import { GridContext } from '../providers/MovieProvider';
import Container from '../components/common/Container';
import HeaderLayout from '../components/layout/HeaderLayout';
import BodyLayout from '../components/layout/BodyLayout';
import FooterLayout from '../components/layout/FooterLayout';
import MovieGrid from '../components/MovieGrid';
import Loader from '../components/common/Loader';
import { useContext } from 'react';

function Home() {
  const { data, pageIndex, setPageIndex, pageSize, loading } = useContext(GridContext);

  return (
    <Container className="app-container">
      <HeaderLayout title="edpFlix" />
      <BodyLayout>
        {!loading ? (
          <MovieGrid
            data={data?.results || []}
            totalCount={data?.total_results || 0}
            page={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            loading={loading}
          />
        ) : (
          <Loader />
        )}
      </BodyLayout>
      <FooterLayout />
    </Container>
  );
}

export default Home;
