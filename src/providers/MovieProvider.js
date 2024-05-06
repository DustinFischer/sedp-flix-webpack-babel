import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetcher } from '../api/client';

export const GridContext = createContext({});

const parseUrl = (url) => {
  const [cleanUrl, qs] = url.split('?');
  const queryParams = new URLSearchParams(qs);

  if (queryParams.has('page')) {
    queryParams.delete('page');
  }

  return { cleanUrl: cleanUrl, qp: queryParams };
};

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MovieProvider = (props) => {
  const { url, searchUrl, queryParams } = props;

  const pageSize = 20;

  const [data, setData] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const searchQueryRef = useRef('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const getUrl = searchQuery.length > 0 ? searchUrl : url;
  const { cleanUrl, qp } = parseUrl(getUrl);

  const setQueryCallback = useCallback(
    async (query = searchQuery) => {
      searchQueryRef.current = query;
      await delay(500);
      if (query === searchQueryRef.current) {
        setPageIndex(0);
        setSearchQuery(query);
      }
    },
    [searchQuery]
  );

  const paginatedUrl = useMemo(() => {
    const queryObj = {
      page: pageIndex + 1,
      ...(searchQuery.length > 0 && { query: searchQuery }),
      ...queryParams
    };
    Object.entries(queryObj).map((param) => qp.set(param[0], param[1]));
    return `${cleanUrl}?${qp.toString()}`;
  }, [qp, queryParams, cleanUrl, pageIndex, searchQuery]);

  useEffect(() => {
    setLoading(true);
    fetcher(paginatedUrl)
      .then((resp) => {
        setData(resp);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  }, [paginatedUrl]);

  return (
    <GridContext.Provider
      value={{ data, pageIndex, setPageIndex, pageSize, searchQuery, setQueryCallback, loading }}
    >
      {props.children}
    </GridContext.Provider>
  );
};

export default MovieProvider;

const Error = ({ error }) => (error ? <div className="error">Failed to load</div> : null);
const NoResults = () => <div className="error">❌ No results</div>;
export { Error, NoResults };
