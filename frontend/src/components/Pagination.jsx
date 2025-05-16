import { usePagination } from '../hooks/usePagination';


const Pagination = ({
    totalNumOfPages,
    currentPage,
    setCurrentPage,
    limit,
    siblingCount = 1,
  }) => {


  const paginationRange = usePagination({
    totalNumOfPages,
    currentPage,
    limit,
    siblingCount,
  });

  
  if (paginationRange.length === 0) {
    return null;
  }

  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];


  return (
    <ul className="pagination-list">
      <li
        className={`navigation-arrow ${currentPage === 1 && "disabled"}`}
        onClick={onPrevious}
      >
        {"<"}
      </li>


      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === "...") {
          return <li key={index} className="pagination-num none">...</li>;
        }

        return (
          <li
            key={index}
            className={`pagination-num ${pageNumber === currentPage && "active"}`}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}


      <li
        className={`navigation-arrow ${currentPage === lastPage && "disabled"}`}
        onClick={onNext}
      >
        {">"}
      </li>
    </ul>
  );
};

export default Pagination;
