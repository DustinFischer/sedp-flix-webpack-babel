import Search from '../common/Search';
import { useContext } from 'react';
import { GridContext } from '../../providers/MovieProvider';
import Container from '../common/Container';

const HeaderLayout = ({ title }) => {
  const { searchQuery, setQueryCallback } = useContext(GridContext);
  return (
    <Container className="nav-bar">
      <header>
        <div className="header-content">
          <h3 className="header-title">{title}</h3>
          <Search query={searchQuery} onSearch={setQueryCallback} />
        </div>
      </header>
    </Container>
  );
};

export default HeaderLayout;
