import { useRef } from 'react';

const Search = ({ query, onSearch }) => {
  const inputRef = useRef();

  const handleSearch = (e) => onSearch(inputRef.current.value);

  return (
    <input
      type="text"
      id="searchInput"
      name="searchInput"
      onChange={handleSearch}
      ref={inputRef}
      defaultValue={query}
      placeholder="Search..."
    />
  );
};

export default Search;
