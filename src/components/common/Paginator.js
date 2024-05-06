const Paginator = ({ page, onPage, pageSize, totalCount, offset = 0 }) => {
  function gotoPage(val) {
    onPage(val < offset ? offset : val);
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  function setPage(val) {
    let incr = 1;
    switch (val) {
      case 'next':
        break;
      case 'prev':
        incr = -1;
        break;
      default:
        incr = parseInt(val) - (page + 1);
    }
    return () => gotoPage(page + incr);
  }

  const handleKeyDown = (event) => event.key === 'Enter' && setPage(event.target.value)();

  return (
    <div className="paginator">
      <button onClick={setPage('prev')}>&lt;</button>
      <input
        type="numeric"
        name="set-page"
        onKeyDown={handleKeyDown}
        defaultValue={page + 1}
      /> of {totalPages}
      <button onClick={setPage('next')}>&gt;</button>
    </div>
  );
};

export default Paginator;
